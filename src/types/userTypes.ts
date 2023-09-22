export interface IUserReturnTypes {
    user: {
        id: number;
        email: string;
        passord: string;
    },
    tokens: {
        accessToken: string;
        refreshToken: string;
    }
}
export interface IUserServices {
    createUser(email: string, password: string): Promise<IUserReturnTypes>
}