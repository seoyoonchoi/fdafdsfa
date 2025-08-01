package com.example.bookhub_back.common.constants;

public interface ApiMappingPattern {
    String BASIC_API = "/api/v2";

    String AUTH_API = BASIC_API + "/auth";
    String COMMON_API = BASIC_API + "/common";
    String MANAGER_API = BASIC_API + "/manager";
    String ADMIN_API = BASIC_API + "/admin";
}
