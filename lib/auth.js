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

  callbacks: {
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

    return true;
  },

  async session({ session, token }) {
    session.user.id = token.sub;
    return session;
  },
},

  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
};