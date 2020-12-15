const BinderNames = {
    USER:{
        EXTRACT:{
            USER_PROFILES:"USER_EXTRACT_USER_PROFILES"
        },
        CHECK:{
            ID_EXISTS:"USER_CHECK_ID_EXISTS"
        }
    },
    POST:{
        CHECK:{
            ID_EXISTS:"QUERY_CHECK_ID_EXISTS",
            CAN_READ:"QUERY_CHECK_CAN_READ"
        }
    },
    COMMENT:{
        CHECK:{
            ID_EXISTS:"COMMENT_CHECK_ID_EXISTS",
            CAN_READ:"COMMENT_CHECK_CAN_READ"
        }
    },
    TAG:{
        EXTRACT:{
            TAG_LIST:"TAG_EXTRACT_TAG_LIST"
        }
    }
}

export {
    BinderNames
}