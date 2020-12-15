declare const config: {
    HOST: string;
    API_BASE: string;
    PATH: {
        AUTH: {
            SIGN_UP: string;
            SIGN_IN: string;
            SIGN_OUT: string;
            SIGN_OUT_ALL: string;
            GET_ACCESS_TOKEN: string;
        };
        PROFILE: {
            ME: string;
            GET_ALL: string;
            ID: string;
        };
    };
};
export default config;
