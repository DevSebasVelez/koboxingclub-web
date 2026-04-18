import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | KO Boxing Club",
  description: "Panel de administración KO Boxing Club",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-neutral-950">{children}</div>;
}
