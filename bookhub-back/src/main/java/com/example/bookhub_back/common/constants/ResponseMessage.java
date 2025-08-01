package com.example.bookhub_back.common.constants;

public interface ResponseMessage {
    String SUCCESS = "Success.";
    String FAILED = "Failed.";
    String DATABASE_ERROR = "Database error.";

    String SIGN_IN_FAIL = "Sign in failed.";
    String AUTHENTICATION_FAIL = "Authentication failed.";
    String AUTHORIZATION_FAIL = "Authorization failed.";
    String NO_PERMISSION = "No permission.";
    String TOKEN_CREATE_FAIL = "Token creation failed.";
    String TOKEN_EXPIRED = "Token has expired.";
    String INVALID_TOKEN = "Invalid token.";
    String NOT_MATCH_PASSWORD = "Password does not Match";

    String VALIDATION_FAIL = "Validation failed.";
    String INVALID_INPUT = "Invalid input value.";
    String REQUIRED_FIELD_MISSING = "Required field is missing.";
    String FORMAT_ERROR = "Input format is incorrect.";

    String DUPLICATED_USER_ID = "Duplicated user ID.";
    String DUPLICATED_EMAIL = "Duplicated email.";
    String DUPLICATED_TEL_NUMBER = "Duplicated user phone number.";
    String NO_EXIST_USER_ID = "User ID does not exist.";
    String USER_NOT_FOUND = "User not found.";
    String USER_ALREADY_EXISTS = "User already exists.";
    String NO_EXIST_USER_EMAIL = "Email does not exist";
    String NO_EXIST_USER_TEL = "PhoneNumber does not exist";

    String NO_EXIST_TOOL = "Tool does not exist.";
    String NO_EXIST_CUSTOMER = "Customer does not exist.";
    String RESOURCE_NOT_FOUND = "Requested resource not found.";
    String TOOL_INSUFFICIENT = "This tool is insufficient in number.";

    String TEL_AUTH_FAIL = "Phone number authentication failed.";
    String MESSAGE_SEND_FAIL = "Failed to send message.";
    String VERIFICATION_CODE_INVALID = "Invalid verification code.";
    String VERIFICATION_CODE_EXPIRED = "Verification code expired.";

    String INTERNAL_SERVER_ERROR = "Internal server error occurred.";
    String SERVICE_UNAVAILABLE = "Service is temporarily unavailable.";
    String REQUEST_TIMEOUT = "Request timeout.";

    String DATA_INTEGRITY_VIOLATION = "Data integrity violation.";
    String CONSTRAINT_VIOLATION = "Constraint violation.";
    String DUPLICATE_ENTRY = "Duplicate entry.";

    String FILE_UPLOAD_FAIL = "File upload failed.";
    String FILE_NOT_FOUND = "File not found.";

    String NO_EXIST_ID = "ID does not exist";
    String NO_EXIST_BRANCH = "Branch does not exist";
    String DUPLICATED_BRANCH = "Duplicated branch";
    String NO_EXIST_CONTENT = "No Exist Content";

}
