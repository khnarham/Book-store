import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; 
import { redirect } from "next/navigation";
import dbConnect from "@/database/dbConnect";
import { UserModel } from "@/database/schemas/UserSchema";
import Header from "@/components/Header";

const layout = async ({ children }: { children: ReactNode }) => {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user?.id) {
    const user = await UserModel.findById(session.user.id);
    const today = new Date().toISOString().slice(0, 10);

    if (user && user.lastActivityDate !== today) {
      await UserModel.findByIdAndUpdate(
        session.user.id,
        { $set: { lastActivityDate: today } },
        { new: true }
      );
    }
  }

  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header/>
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default layout;
