import NextAuth , {AuthOptions , SessionStrategy} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserModel } from "@/database/schemas/UserSchema";
import dbConnect from "@/database/dbConnect";
import { compare } from "bcryptjs";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await dbConnect();

        const user = await UserModel.findOne({ email: credentials.email });
        if (!user) return null;

        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.fullName,
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }:{token: any , user: any}) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: {session: any , token: any}) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};

const handlers = NextAuth(authOptions);

export const GET = handlers;
export const POST = handlers;
