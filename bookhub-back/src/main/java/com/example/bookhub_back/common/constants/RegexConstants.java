package com.example.bookhub_back.common.constants;

public interface RegexConstants {
    public static final String LOING_ID_REGEX = "^[A-Za-z][A-Za-z\\d]{3,12}$";

    public static final String PASSWORD_REGEX =
        "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%*?])[A-Za-z\\d!@#$%*?]{8,16}$";

    public static final String EMAIL_REGEX = "^[A-Za-z][A-Za-z\\d]+@[A-Za-z\\d.-]+\\.[A-Za-z]{2,}$";

    public static final String PHONE_REGEX = "^010\\d{8}$";
}
