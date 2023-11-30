import NextAuth, {NextAuthOptions} from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import jwt from 'jsonwebtoken';
import { dbUsers } from "../../../database";





export const authOptions: NextAuthOptions  = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: {label: 'Correo:', type: 'email', placeholder: 'correo@google.com'},
        password: {label: 'Password:', type: 'Password', placeholder: 'Contraseña'}
      },
       async authorize(credentials){
          console.log({credentials})

          return  await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password ) 

       }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      }),
    
    // ...add more providers here
  ],

  //CustomPages
  pages:{
    signIn: '/auth/login',
    newUser: '/auth/register'
  },


  jwt: {

  },

  session: {
    maxAge: 2592000, ///30d
    strategy: 'jwt',
    updateAge: 86400// cada dia
  },
  //callbacks
  callbacks:{
    async jwt({token, account, user }){
      // console.log({token, account, user})
      
      if(account){
        token.accessToken = account.acces_token

        switch(account.type){

          case 'oauth':

          token.user = await dbUsers.oAuthToDbUser(user?.email || '', user.name || '');
            
          break;

          case 'credentials':
            token.user = user;

          break;
        }
        
      }
      return token
    },
    async session({session, token, user}){

      // console.log({token, session, user})

      session.accessToken = token.accessToken as any

      session.user = token.user as any


      return session
    }
  }
  
}

export default NextAuth(authOptions)

