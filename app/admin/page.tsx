import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white">
        Bienvenido, {session.user.name}
      </h1>
      <p className="text-neutral-400 mt-2">
        Panel de administración KO Boxing Club
      </p>
    </div>
  );
}
