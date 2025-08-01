package com.example.bookhub_back.common.constants;

public interface ResponseMessageKorean {
    String SUCCESS = "요청이 성공적으로 처리되었습니다.";
    String FAILED = "요청이 실패했습니다.";
    String DATABASE_ERROR = "데이터베이스 오류가 발생했습니다.";

    String SIGN_IN_FAIL = "로그인에 실패했습니다.";
    String AUTHENTICATION_FAIL = "인증에 실패했습니다.";
    String AUTHORIZATION_FAIL = "인가에 실패했습니다.";
    String NO_PERMISSION = "권한이 없습니다.";
    String TOKEN_CREATE_FAIL = "토큰 생성에 실패했습니다.";
    String TOKEN_EXPIRED = "토큰이 만료되었습니다.";
    String INVALID_TOKEN = "유효하지 않은 토큰입니다.";
    String NOT_MATCH_PASSWORD = "비밀번호가 일치하지 않습니다.";
    String NOT_MATCH_USER_INFO = "토큰 정보와 사용자 정보가 일치하지 않습니다.";

    String VALIDATION_FAIL = "입력값이 유효하지 않습니다.";
    String INVALID_INPUT = "잘못된 입력값입니다.";
    String INVALID_INPUT_BRANCH = "잘못된 입력값입니다.";
    String INVALID_INPUT_POSITION = "잘못된 입력값입니다.";
    String INVALID_INPUT_AUTHORITY = "잘못된 입력값입니다.";
    String REQUIRED_FIELD_MISSING = "필수 입력값이 누락되었습니다.";
    String FORMAT_ERROR = "입력 형식이 올바르지 않습니다.";

    String DUPLICATED_USER_ID = "이미 사용 중인 사용자 ID입니다.";
    String DUPLICATED_EMAIL = "이미 사용 중인 이메일입니다.";
    String DUPLICATED_TEL_NUMBER = "이미 등록된 전화번호입니다.";
    String NO_EXIST_USER_ID = "존재하지 않는 사용자 ID입니다.";
    String USER_NOT_FOUND = "사용자를 찾을 수 없습니다.";
    String USER_ALREADY_EXISTS = "이미 가입된 사용자입니다.";
    String NO_EXIST_USER_EMAIL = "존재하지 않는 이메일입니다.";
    String NO_EXIST_USER_TEL = "존재하지 않는 전화번호입니다.";
    String NOT_MATCH_USER_TEL = "사용자의 전화번호가 일치하지 않습니다.";
    String NOT_MATCH_USER_EMAIL = "사용자의 이메일이 일치하지 않습니다.";

    String NO_EXIST_TOOL = "존재하지 않는 도구입니다.";
    String NO_EXIST_CUSTOMER = "존재하지 않는 고객입니다.";
    String RESOURCE_NOT_FOUND = "요청한 리소스를 찾을 수 없습니다.";
    String TOOL_INSUFFICIENT = "도구 수량이 부족합니다.";

    String TEL_AUTH_FAIL = "전화번호 인증에 실패했습니다.";
    String MESSAGE_SEND_FAIL = "메시지 전송에 실패했습니다.";
    String VERIFICATION_CODE_INVALID = "유효하지 않은 인증 코드입니다.";
    String VERIFICATION_CODE_EXPIRED = "인증 코드가 만료되었습니다.";

    String INTERNAL_SERVER_ERROR = "서버 내부 오류가 발생했습니다.";
    String SERVICE_UNAVAILABLE = "현재 서비스 이용이 불가능합니다.";
    String REQUEST_TIMEOUT = "요청 시간이 초과되었습니다.";

    String DATA_INTEGRITY_VIOLATION = "데이터 무결성 오류가 발생했습니다.";
    String CONSTRAINT_VIOLATION = "제약 조건 위반입니다.";
    String DUPLICATE_ENTRY = "중복된 데이터가 존재합니다.";

    String FILE_UPLOAD_FAIL = "파일 업로드에 실패했습니다.";
    String FILE_NOT_FOUND = "파일을 찾을 수 없습니다.";

    String NO_EXIST_ID = "아이디가 존재하지 않습니다.";
    String NO_EXIST_BRANCH = "지점이 존재하지 않습니다.";
    String DUPLICATED_BRANCH = "이미 지점이 존재합니다.";
    String NO_EXIST_CONTENT = "컨텐츠가 존재하지 않습니다.";
}