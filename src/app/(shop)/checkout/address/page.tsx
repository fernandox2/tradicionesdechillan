import { redirect } from "next/navigation";

import { auth } from "@/auth.config";
import { getCountries, getUserAddress } from "@/actions";
import { Title } from "@/components";
import { AddressForm } from "./ui/AddressForm";

export default async function AddressPage() {
  const session = await auth();

  if (!session) redirect("auth/login");

  const countries = await getCountries();

  const address = await getUserAddress(session.user.id);

  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0 py-20">
      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">
        <Title title="Dirección" subtitle="Dirección de entrega" />

        <AddressForm
          countries={countries}
          session={session}
          userStoreAddress={address}
        />
      </div>
    </div>
  );
}
