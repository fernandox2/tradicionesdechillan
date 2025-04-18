import { avenir_black } from "@/config/fonts";
import { LoginForm } from "./ui/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pt-52">
      <h1 className={`${avenir_black.className} text-4xl mb-5`}>INGRESAR</h1>

      <LoginForm />
    </div>
  );
}
