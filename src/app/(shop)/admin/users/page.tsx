export const revalidate = 0;

import { redirect } from "next/navigation";

import { auth } from "@/auth.config";
import { Pagination, Title } from "@/components";
import { getAllUsers } from "@/actions/users/users";
import { Filters } from "./ui/filters/Filters";
import { UsersTable } from "./ui/UsersTable";
import { User } from "@/interfaces";

interface Props {
  searchParams: {
    page?: string;
    query?: string;
  };
}

export default async function ListUserPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const query = searchParams.query || undefined;

  const session = await auth();

  if (!session) redirect("/");

  const {
    ok,
    users = [],
    totalPages,
  } = await getAllUsers({ page, query });

  if (!ok) redirect("/");

  return (
    <>
     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Title title="Users" />

      <div className="mb-10 overflow-x-auto">
        <Filters placeholder="Buscar por nombre o email..." />
        <div className="mt-4 mb-4">
          <UsersTable users={users as User[]} />{" "}
        </div>
        <Pagination totalPages={totalPages} />
      </div>
      </div>
    </>
  );
}
