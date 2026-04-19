import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadToR2 } from "@/lib/storage/r2";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "uploads";

  if (!file) {
    return NextResponse.json(
      { error: "No se recibió archivo" },
      { status: 400 },
    );
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Solo se permiten imágenes" },
      { status: 400 },
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "La imagen no puede superar 5MB" },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop() || "jpg";
  const key = `${folder}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const url = await uploadToR2(buffer, key, file.type);
  return NextResponse.json({ key, url });
}
