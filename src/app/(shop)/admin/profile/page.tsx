import { redirect } from "next/navigation";
import { auth } from "@/auth.config";
import { Title } from "@/components";
import ProfileForm from "./ui/ProfileForm";


export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="py-6">
      <ProfileForm user={session.user} />
    </div>
  );
}
