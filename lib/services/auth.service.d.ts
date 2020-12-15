import { Helpers, Services } from 'nk-node-library';
declare class AuthService extends Services.BaseService {
    private static instance;
    static getInstance(): AuthService;
    private constructor();
    createJwt: (request: Helpers.Request, auth: Helpers.JWT.Auth, buildRefresh: boolean) => {
        accessToken: {
            value: string;
            expiryTime: number;
        };
        refreshToken: {
            value: string;
            expiryTime: number;
        };
    } | {
        accessToken: {
            value: string;
            expiryTime: number;
        };
        refreshToken?: undefined;
    };
    signUp: (request: Helpers.Request, user: any) => Promise<{
        accessToken: {
            value: string;
            expiryTime: number;
        };
        refreshToken: {
            value: string;
            expiryTime: number;
        };
        isConfirmed: boolean;
        userId: any;
    }>;
    signIn: (request: Helpers.Request, user: any) => Promise<{
        accessToken: {
            value: string;
            expiryTime: number;
        };
        refreshToken: {
            value: string;
            expiryTime: number;
        };
        isConfirmed: boolean;
        userId: any;
    }>;
    signInRaw: (request: Helpers.Request, entity: any, password: string, alternate?: boolean) => Promise<{
        accessToken: {
            value: string;
            expiryTime: number;
        };
        refreshToken: {
            value: string;
            expiryTime: number;
        };
        isConfirmed: boolean;
        userId: any;
    }>;
    getMe: (request: Helpers.Request) => Promise<any>;
    sendConfirmationToken: (request: Helpers.Request) => Promise<boolean>;
    confirmationToken: (request: Helpers.Request, data: any) => Promise<false | {
        accessToken: {
            value: string;
            expiryTime: number;
        };
        refreshToken: {
            value: string;
            expiryTime: number;
        };
        isConfirmed: boolean;
        userId: string;
    }>;
    getAccessToken: (request: Helpers.Request) => Promise<{
        isConfirmed: boolean;
        userId: string;
        accessToken: {
            value: string;
            expiryTime: number;
        };
        refreshToken: {
            value: string;
            expiryTime: number;
        };
    } | {
        isConfirmed: boolean;
        userId: string;
        accessToken: {
            value: string;
            expiryTime: number;
        };
        refreshToken?: undefined;
    }>;
    signOut: (request: Helpers.Request) => Promise<void>;
    signOutAll: (request: Helpers.Request) => Promise<void>;
}
declare const _default: AuthService;
export default _default;
