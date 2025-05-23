import { redirect } from "next/navigation";

import { auth } from "@/auth.config";
import { Title } from "@/components";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    //redirect("/auth/login?returnTo=/profile");
    redirect("/");
  }
  return (
    <div>
      <Title title="Profile" />

      {

        <div>
          <pre>{JSON.stringify(session?.user, null, 2)}</pre>
        </div>

      }
    </div>
  );
}
