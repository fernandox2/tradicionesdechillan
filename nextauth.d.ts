
import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {

    interface Session {
        user: {
            id: number;
            email: string;
            name: string;
            role: string;
            image?: string;
            emailVerified?: boolean;
        } & DedfaultSession['user'];
    }   

}