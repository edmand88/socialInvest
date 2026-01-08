export interface UserPublic {
    id: number;
    username: string;
    email: string;
    full_name: string | null;
    points: number;
}

export interface Token {
    access_token: string;
    token_type: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    full_name: string | null;
    disabled: boolean;
    points: number;
}