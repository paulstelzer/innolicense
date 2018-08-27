export interface UserLoginBody {
    email: string;
    password: string;
}

export interface UserRegisterBody {
    email: string;
    password: string;
    vendor?: boolean;
}