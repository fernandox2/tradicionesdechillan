import { avenir_black } from "@/config/fonts";
import { RegisterForm } from "./ui/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pt-52">
      <h1 className={`${avenir_black.className} text-3xl mb-5`}>NUEVA CUENTA</h1>

      <RegisterForm />
    </div>
  );
}
