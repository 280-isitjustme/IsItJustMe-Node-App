interface SignUpPacket {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    registrationType?: string;
    responseStatus?: number;
}
declare function signUp(data: SignUpPacket): Promise<any>;
interface SignInPacket {
    email: string;
    password: string;
    responseStatus?: number;
}
declare function signIn(data: SignInPacket): Promise<any>;
interface RefreshPacket {
    refreshToken: string;
    responseStatus?: number;
}
declare function signOut(data: RefreshPacket): Promise<any>;
declare function signOutAll(data: RefreshPacket): Promise<any>;
declare function getAccessToken(data: RefreshPacket): Promise<any>;
export { getAccessToken, signIn, signOut, signOutAll, signUp };
