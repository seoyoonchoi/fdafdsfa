package com.example.bookhub_back.controller.auth;

import com.example.bookhub_back.common.constants.ApiMappingPattern;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.auth.request.*;
import com.example.bookhub_back.dto.auth.response.SignInResponseDto;
import com.example.bookhub_back.dto.employee.request.EmployeeSignUpUpdateRequestDto;
import com.example.bookhub_back.service.auth.AuthService;
import com.example.bookhub_back.service.mail.MailService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping(ApiMappingPattern.AUTH_API)
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final MailService mailService;

    @PostMapping("/signup")
    public ResponseEntity<ResponseDto<Void>> signUp(@Valid @RequestBody SignUpRequestDto dto) {
        ResponseDto<Void> responseDto = authService.signUp(dto);
        return ResponseDto.toResponseEntity(HttpStatus.CREATED, responseDto);
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDto<SignInResponseDto>> login(@Valid @RequestBody SignInRequestDto dto) {
        ResponseDto<SignInResponseDto> responseDto = authService.login(dto);
        return ResponseDto.toResponseEntity(HttpStatus.OK, responseDto);
    }

    @GetMapping("/login-id-exists")
    public ResponseEntity<ResponseDto<Void>> checkLoginIdDuplicate(@RequestParam String loginId) {
        ResponseDto<Void> responseDto = authService.checkLoginIdDuplicate(loginId);
        return ResponseDto.toResponseEntity(HttpStatus.OK, responseDto);
    }

    @GetMapping("/email-exists")
    public ResponseEntity<ResponseDto<Void>> checkEmailDuplicate(@RequestParam String email) {
        ResponseDto<Void> responseDto = authService.checkEmailDuplicate(email);
        return ResponseDto.toResponseEntity(HttpStatus.OK, responseDto);
    }

    @GetMapping("/phone-number-exists")
    public ResponseEntity<ResponseDto<Void>> checkPhoneNumberDuplicate(@RequestParam String phoneNumber) {
        ResponseDto<Void> responseDto = authService.checkPhoneNumberDuplicate(phoneNumber);
        return ResponseDto.toResponseEntity(HttpStatus.OK, responseDto);
    }

    @PostMapping("/logout")
    public ResponseEntity<ResponseDto<Void>> logout (HttpServletResponse response) {
        ResponseDto<Void> responseDto = authService.logout(response);
        return ResponseDto.toResponseEntity(HttpStatus.OK, responseDto);
    }

    @PostMapping("/login-id-find/email")
    public Mono<ResponseEntity<ResponseDto<String>>> SendEmailFindId(@Valid @RequestBody LoginIdFindSendEmailRequestDto dto) {
        return mailService.sendEmailFindId(dto);
    }

    @GetMapping("/login-id-find")
    public Mono<ResponseEntity<ResponseDto<String>>> verifyEmailId(@RequestParam String token) {
        return mailService.verifyEmailId(token);
    }

    @PostMapping("/password-change/email")
    public Mono<ResponseEntity<ResponseDto<String>>> sendEmailResetPassword (@Valid @RequestBody PasswordFindSendEmailRequestDto dto) {
        return mailService.sendEmailResetPassword(dto);
    }

    @GetMapping("/password-change")
    public Mono<ResponseEntity<ResponseDto<String>>> verifyLoginIdPassword(@RequestParam String token) {
        return mailService.verifyLoginIdPassword(token);
    }

    @PutMapping("/password-change")
    public Mono<ResponseEntity<ResponseDto<String>>> passwordChange(@RequestParam String token, @Valid @RequestBody PasswordResetRequestDto dto) {
        return mailService.passwordChange(token, dto);
    }

    @PostMapping("/employees/{approvalId}/approve")
    public Mono<ResponseEntity<ResponseDto<String>>> sendEmailSignUpResult(@PathVariable Long approvalId){
        return mailService.sendEmailSignUpResult(approvalId);
    }

    @GetMapping("/employees/approve")
    public Mono<ResponseEntity<ResponseDto<String>>> verifyEmployeeUpdate(@RequestParam String token){
        return mailService.verifyEmployeeUpdate(token);
    }

    @PutMapping("/employees/approve")
    public Mono<ResponseEntity<ResponseDto<String>>> employeeUpdate(@RequestParam String token, @RequestBody EmployeeSignUpUpdateRequestDto dto) {
        return mailService.employeeUpdate(token, dto);
    }
}
