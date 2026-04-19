"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

type VideoState = "loading" | "playing" | "paused";

const VIDEOS = [
  {
    src: "/videos/reel-1.mp4",
    title: "Reel KO Boxing",
    subtitle: "Velada 2024",
  },
  {
    src: "/videos/reel-2.mp4",
    title: "Técnica de ring",
    subtitle: "Entrenamiento",
  },
  {
    src: "/videos/reel-3.mp4",
    title: "Sparring",
    subtitle: "Preparación",
  },
  {
    src: "/videos/reel-4.mp4",
    title: "KO Boxing Club",
    subtitle: "El gimnasio",
  },
];

function VideoCard({
  video,
  index,
}: {
  video: (typeof VIDEOS)[0];
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<VideoState>("loading");
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const startedRef = useRef(false);
  const manuallyPausedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    const card = cardRef.current;
    if (!video || !card) return;

    const onTimeUpdate = () => {
      if (video.duration > 0) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };
    video.addEventListener("timeupdate", onTimeUpdate);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!startedRef.current) {
            // First time visible → load and autoplay
            startedRef.current = true;
            video.load();
            const onCanPlay = async () => {
              video.removeEventListener("canplay", onCanPlay);
              try {
                await video.play();
                setState("playing");
              } catch {
                // autoplay blocked — stay on loading skeleton
              }
            };
            video.addEventListener("canplay", onCanPlay);
          } else if (!manuallyPausedRef.current && video.paused) {
            // Re-entering viewport after auto-pause → resume
            video
              .play()
              .then(() => setState("playing"))
              .catch(() => {});
          }
        } else if (!video.paused) {
          // Scrolled away while playing → auto-pause
          video.pause();
          manuallyPausedRef.current = false;
          setState("paused");
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(card);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      observer.disconnect();
    };
  }, []);

  const handleClick = useCallback(async () => {
    const video = videoRef.current;
    if (!video || state === "loading") return;

    if (state === "playing") {
      video.pause();
      manuallyPausedRef.current = true;
      setState("paused");
    } else {
      manuallyPausedRef.current = false;
      await video.play();
      setState("playing");
    }
  }, [state]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
  };

  return (
    <div
      ref={cardRef}
      className="vc-card relative aspect-9/16 rounded-2xl overflow-hidden bg-neutral-800 select-none group"
      onClick={handleClick}
      style={{ cursor: state === "loading" ? "default" : "pointer" }}
    >
      {/* Loading skeleton */}
      {state === "loading" && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 animate-pulse bg-linear-to-b from-neutral-700 via-neutral-800 to-neutral-900" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={video.src}
        preload="none"
        muted={muted}
        playsInline
        loop
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />

      {/* Pause icon on hover when playing */}
      {state === "playing" && (
        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <FiPause size={18} className="text-white" />
          </div>
        </div>
      )}

      {/* Play icon when paused */}
      {state === "paused" && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-ko-red/80 group-hover:border-ko-red transition-all duration-200">
            <FiPlay size={18} className="text-white ml-0.5" />
          </div>
        </div>
      )}

      {/* Bottom bar — only when video has started */}
      {state !== "loading" && (
        <div className="absolute bottom-0 inset-x-0 p-4 z-20">
          <div className="mb-3 h-0.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-ko-red rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="font-bold text-white text-sm leading-tight">
                {video.title}
              </p>
              <p className="text-[11px] text-white/50 mt-0.5">
                {video.subtitle}
              </p>
            </div>
            <button
              onClick={toggleMute}
              className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm border border-white/15 flex items-center justify-center hover:bg-black/60 transition-colors"
              aria-label={muted ? "Activar sonido" : "Silenciar"}
            >
              {muted ? (
                <FiVolumeX size={13} className="text-white/70" />
              ) : (
                <FiVolume2 size={13} className="text-white" />
              )}
            </button>
          </div>

          <span className="mt-1.5 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
            {index + 1} / {VIDEOS.length}
          </span>
        </div>
      )}
    </div>
  );
}

export default function VideoSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const header = gsap.utils.toArray<HTMLElement>(
        ".vs-header > *",
        ref.current,
      );
      if (header.length) {
        gsap.fromTo(
          header,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              once: true,
            },
          },
        );
      }

      const cards = gsap.utils.toArray<HTMLElement>(".vc-card", ref.current);
      if (!cards.length) return;
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            once: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-neutral-950 py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-20">
        <div className="vs-header mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-ko-red shrink-0" aria-hidden />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
              Reels
            </span>
          </div>
          <h2
            className="font-bold tracking-tight text-white"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
          >
            El boxeo en
            <br />
            <span className="text-ko-red">movimiento.</span>
          </h2>
          <p className="mt-4 text-white/50 text-[1.0625rem] max-w-md">
            Momentos reales del gimnasio, las veladas y el trabajo diario que
            construye boxeadores.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {VIDEOS.map((video, i) => (
            <VideoCard key={video.src} video={video} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
