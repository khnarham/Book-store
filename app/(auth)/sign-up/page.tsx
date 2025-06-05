"use client";

import AuthForm from "@/components/AuthForm";
import { signUpSchema } from "@/lib/validation";


const Page = () => (
  <AuthForm
    type="SIGN_UP"
    schema={signUpSchema}
    defaultValues={{
      email: "",
      password: "",
      fullName: "",
      universityId: 0,
      universityCard: "",
    }}

  />
);

export default Page;