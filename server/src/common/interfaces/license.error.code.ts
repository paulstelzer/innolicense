export enum LicenseErrorCode {
    FAILED = 'request_failed',
    DATA_PARAMS_MISSING = 'data/params_missing',
    NO_PRODUCT = 'product/not_found',
    LICENSE_WRONG_ID = 'license/wrong_id',
    LICENSE_NOT_VALID = 'license/not_valid',
    LICENSE_NOT_FOUND = 'license/not_found',
    LICENSE_NO_SUPPORT = 'license/support_date_ended',
    LICENSE_NOT_OWNER = 'license/not_owner',
    LICENSE_NOT_AVAILABLE = 'license/not_available',
    LICENSE_NO_FEATURE = 'license/no_feature',
    LICENSE_LIMIT_REACHED = 'license/limit_reached',
    ENVATO_INVALID = 'envato/license_invalid',
    ENVATO_NO_ITEM = 'envato/no_item',
    PLUGIN_NOT_FOUND = 'plugin/not_found',

    PLUGIN_SLUG_IN_USE = 'plugin/slug_already_in_use'
}