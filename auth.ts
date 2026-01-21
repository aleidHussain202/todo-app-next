/**
 * AUTH CONFIGURATION
 * 
 * This file is the "brain" of your login system.
 * 
 * STEP 1: Imports
 * You will need:
 * - NextAuth from "next-auth"
 * - Credentials from "next-auth/providers/credentials"
 * - your prisma instance
 * - bcrypt from "bcryptjs" (for checking passwords)
 */

// [YOUR CODE HERE: Imports]
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";

/**
 * STEP 2: Configuration
 * Use NextAuth({ ... }) to define your providers and callbacks.
 * Make sure to export { handlers, auth, signIn, signOut }.
 */





export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    /**
     * STEP 3: Credentials Provider
     * Define the fields you want in your login form (email, password).
     */
    
    Credentials({
      // Define authorize(credentials) {} logic here
      // 1. Validate input
      // 2. Look up user by email in Prisma
      // 3. Compare passwords using bcrypt.compare()
      // 4. Return user object or null
      credentials: {
        email: { label: "Email"},
        password: { label: "Secret Password", type: "password"}
      },
    
    async authorize(credentials){
        const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
        });

        if(!user) return null;

        const isMatch = await bcrypt.compare(credentials.password as string,user.password)
        
        if(!isMatch) return null;

        return{
          id: user.id,
          email: user.email,
          name: user.name
        }
    
      }

      

},)
  ],
  /**
   * STEP 4: Session Callback
   * By default, the session only contains the user's name/email.
   * Use the session callback to add the user.id from the token
   * so you can use it to filter Todos later.
   */
  callbacks: {
    // async session({ session, token }) { ... }
    async session({session, token}) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;

    }
  },
  pages: {
    signIn: '/login', // Redirect here if not logged in
  }
})
