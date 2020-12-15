declare const PubSubMessageTypes: {
    AUTH: {
        USER_SIGNED_UP: string;
        USER_SIGNED_IN: string;
        USER_SIGN_OUT: string;
        USER_SIGN_OUT_ALL: string;
        ACCESS_TOKEN: string;
        USER_CONFIRMED: string;
    };
    POST: {
        CREATED: string;
        READ: string;
        UPDATED: string;
        DELETED: string;
        TAG_CHANGED: string;
    };
    COMMENT: {
        CREATED: string;
        READ: string;
        UPDATED: string;
        DELETED: string;
        CONTEXT_CHANGED: string;
    };
    OPINION: {
        CREATED: string;
        DELETED: string;
    };
};
export { PubSubMessageTypes };
