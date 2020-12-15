declare const BinderNames: {
    USER: {
        EXTRACT: {
            USER_PROFILES: string;
        };
        CHECK: {
            ID_EXISTS: string;
        };
    };
    POST: {
        CHECK: {
            ID_EXISTS: string;
            CAN_READ: string;
        };
    };
    COMMENT: {
        CHECK: {
            ID_EXISTS: string;
            CAN_READ: string;
        };
    };
    TAG: {
        EXTRACT: {
            TAG_LIST: string;
        };
    };
};
export { BinderNames };
