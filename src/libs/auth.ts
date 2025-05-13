// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import type { NextAuthOptions } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import Axios from './axios/axios'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,

  // ** Configure one or more authentication providers
  // ** Please refer to https://next-auth.js.org/configuration/options#providers for more `providers` options
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter email" },
        password: { label: "Password", type: "password", placeholder: "Enter password" }
      },
      // async authorize(credentials) {
      //   try {
      //     console.log("hello");

      //     const { email, password } = credentials as { email: string; password: string }
      //     // Send request to your backend login API
      //     const response = await Axios.post(`https://api-dev.arawanglobal.com/backend-api-gateway-test/login`, {
      //       email,
      //       password,
      //     });

      //     const user = response.data; // Assuming the API returns user data

      //     if (user && user.token) {
      //       return {
      //         id: user.id,
      //         name: user.name,
      //         email: user.email,
      //         token: user.token, // Store token for session
      //       };
      //     } else {
      //       return null;
      //     }
      //   } catch (error) {
      //     throw new Error("Invalid credentials"); // Will be caught in `signIn`
      //   }
      // },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }

        // 🔹 Replace this with actual authentication logic
        if (email === "admin@oneplaybet.com" && password === "admin") {
          return { id: "1", name: "Admin", email }
        }

        throw new Error("Invalid credentials")
      }
    })
  ],

  // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
  session: {
    /*
     * Choose how you want to save the user session.
     * The default is `jwt`, an encrypted JWT (JWE) stored in the session cookie.
     * If you use an `adapter` however, NextAuth default it to `database` instead.
     * You can still force a JWT session by explicitly defining `jwt`.
     * When using `database`, the session cookie will only contain a `sessionToken` value,
     * which is used to look up the session in the database.
     * If you use a custom credentials provider, user accounts will not be persisted in a database by NextAuth.js (even if one is configured).
     * The option to use JSON Web Tokens for session tokens must be enabled to use a custom credentials provider.
     */
    strategy: 'jwt',

    // ** Seconds - How long until an idle session expires and is no longer valid
    maxAge: 30 * 24 * 60 * 60 // ** 30 days
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#pages for more `pages` options
  pages: {
    signIn: '/login'
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#callbacks for more `callbacks` options
  callbacks: {
    /*
     * While using `jwt` as a strategy, `jwt()` callback will be called before
     * the `session()` callback. So we have to add custom parameters in `token`
     * via `jwt()` callback to make them accessible in the `session()` callback
     */
    async jwt({ token, user }) {
      if (user) {
        /*
         * For adding custom parameters to user in session, we first need to add those parameters
         * in token which then will be available in the `session()` callback
         */
        token.name = user.name
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // ** Add custom params to user in session which are added in `jwt()` callback via `token` parameter
        session.user.name = token.name
      }

      return session
    }
  }
}
