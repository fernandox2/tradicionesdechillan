

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
    emailVerified?: boolean;
}