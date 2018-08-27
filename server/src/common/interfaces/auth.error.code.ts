export enum AuthErrorCode {
    FAILED = 'request_failed',
    DATA_PARAMS_MISSING = 'data/params_missing',
    AUTH_FAILED = 'auth/failed',
    AUTH_REQUIRED = 'auth/required',
    USER_MAIL_EXIST = 'user/mail_exist',
    USER_NOT_EXIST = 'user/not_exist',
    INVALID_TOKEN = "auth/invalid_token"
}