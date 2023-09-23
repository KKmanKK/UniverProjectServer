export interface IUserReturnTypes {
    user: IUser
    tokens: {
        accessToken: string;
        refreshToken: string;
    }
}
export interface IUser {
    id: number;
    email: string;
    passord: string;

}
export interface IUserServices {
    createUser(email: string, password: string): Promise<IUserReturnTypes>
}