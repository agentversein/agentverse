import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  events: {
    async signIn({ user, account }) {
      await connectDB();

      await User.findOneAndUpdate(
        { email: user.email },
        {
          name: user.name,
          email: user.email,
          image: user.image,
          provider: account.provider,
          lastLogin: new Date(),
        },
        {
          upsert: true,
          new: true,
        }
      );
    },
  },

  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
};