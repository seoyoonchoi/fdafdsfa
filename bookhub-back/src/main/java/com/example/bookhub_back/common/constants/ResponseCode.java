package com.example.bookhub_back.common.constants;

public interface ResponseCode {
    String SUCCESS = "SU";
    String FAIL = "FA";
    String DATABASE_ERROR = "DBE";

    String SIGN_IN_FAIL = "SF";
    String AUTHENTICATION_FAIL = "AF";
    String AUTHORIZATION_FAIL = "AUF";
    String NO_PERMISSION = "NP";
    String TOKEN_CREATE_FAIL = "TCF";
    String TOKEN_EXPIRED = "TE";
    String INVALID_TOKEN = "IT";
    String NOT_MATCH_USER_INFO = "NMUI";

    String VALIDATION_FAIL = "VF";
    String INVALID_INPUT = "IV";
    String INVALID_INPUT_BRANCH = "IVB";
    String INVALID_INPUT_POSITION = "IVP";
    String INVALID_INPUT_AUTHORITY = "IVA";
    String REQUIRED_FIELD_MISSING = "RM";
    String FORMAT_ERROR = "FE";

    String DUPLICATED_USER_ID = "DI";
    String DUPLICATED_EMAIL = "DE";
    String DUPLICATED_TEL_NUMBER = "DT";
    String NO_EXIST_USER_ID = "NI";
    String USER_NOT_FOUND = "UNF";
    String USER_ALREADY_EXISTS = "UAE";
    String NOT_MATCH_PASSWORD = "NMPW";
    String NO_EXIST_USER_EMAIL = "NEUE";
    String NO_EXIST_USER_TEL = "NEUT";
    String NOT_MATCH_USER_TEL = "NMUT";
    String NOT_MATCH_USER_EMAIL = "NMUE";

    String NO_EXIST_TOOL = "NT";
    String NO_EXIST_CUSTOMER = "NC";
    String TOOL_INSUFFICIENT = "TI";
    String RESOURCE_NOT_FOUND = "RNF";

    String TEL_AUTH_FAIL = "TAF";
    String MESSAGE_SEND_FAIL = "TF";
    String VERIFICATION_CODE_INVALID = "VCI";
    String VERIFICATION_CODE_EXPIRED = "VCE";

    String FILE_UPLOAD_FAIL = "FUF";
    String FILE_NOT_FOUND = "FNF";

    String INTERNAL_SERVER_ERROR = "ISE";
    String SERVICE_UNAVAILABLE = "SUA";
    String REQUEST_TIMEOUT = "RT";
  
    String DATA_INTEGRITY_VIOLATION = "DIV";
    String CONSTRAINT_VIOLATION = "CV";
    String DUPLICATE_ENTRY = "DUP";
  
    String NO_EXIST_ID = "NEI";
    String NO_EXIST_BRANCH = "NEB";
    String DUPLICATED_BRANCH = "DB";
    String NO_EXIST_CONTENT = "NEC";
}