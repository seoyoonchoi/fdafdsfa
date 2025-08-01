package com.example.bookhub_back.service.mail;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessageKorean;
import com.example.bookhub_back.common.enums.IsApproved;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.auth.request.LoginIdFindSendEmailRequestDto;
import com.example.bookhub_back.dto.auth.request.PasswordFindSendEmailRequestDto;
import com.example.bookhub_back.dto.auth.request.PasswordResetRequestDto;
import com.example.bookhub_back.dto.employee.request.EmployeeSignUpUpdateRequestDto;
import com.example.bookhub_back.entity.Branch;
import com.example.bookhub_back.entity.Employee;
import com.example.bookhub_back.entity.EmployeeSignUpApproval;
import com.example.bookhub_back.provider.JwtTokenProvider;
import com.example.bookhub_back.repository.BranchRepository;
import com.example.bookhub_back.repository.EmployeeRepository;
import com.example.bookhub_back.repository.EmployeeSignUpApprovalRepository;
import io.jsonwebtoken.Claims;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {
    private final JavaMailSender mailSender;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmployeeRepository employeeRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final EmployeeSignUpApprovalRepository employeeSignUpApprovalRepository;
    private final BranchRepository branchRepository;

    public void sendLoginIdEmailMessage(String email, String token) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(email);
        helper.setSubject("[BookHub] 이메일 인증 요청");

        String htmlContent = """
                <h2>[이메일 인증 요청]</h2>
                <p>안녕하세요,</P>
                <br />
                <p>아이디 찾기 이메일 인증을 위해 아래 버튼을 클릭해 주세요.</p>
                <a href="http://localhost:5173/auth/login-id-find?token=%s">이메일 인증하기</a>
                <p>본 이메일은 인증 목적으로 발송되었습니다. 인증을 원하지 않으시면 무시하셔도 됩니다.</p>
            """.formatted(token);

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

    @Override
    public Mono<ResponseEntity<ResponseDto<String>>> sendEmailFindId(LoginIdFindSendEmailRequestDto dto) {
        return Mono.fromCallable(() -> {
            Employee employee = employeeRepository.findByEmail(dto.getEmail())
                .orElse(null);

            if (employee == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDto.<String>fail(ResponseCode.NO_EXIST_USER_EMAIL, ResponseMessageKorean.NO_EXIST_USER_EMAIL));
            }

            if (!employee.getPhoneNumber().equals(dto.getPhoneNumber())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDto.<String>fail(ResponseCode.NOT_MATCH_USER_TEL, ResponseMessageKorean.NOT_MATCH_USER_TEL));
            }

            String token = jwtTokenProvider.generateEmailToken(employee.getLoginId(), employee.getEmail());
            sendLoginIdEmailMessage(dto.getEmail(), token);

            return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseDto.<String>success(ResponseCode.SUCCESS, "이메일 전송 성공"));

        }).subscribeOn(Schedulers.boundedElastic());

    }

    @Override
    public Mono<ResponseEntity<ResponseDto<String>>> verifyEmailId(String token) {
        return Mono.fromCallable(() -> {
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDto.<String>fail(ResponseCode.INVALID_TOKEN, ResponseMessageKorean.INVALID_TOKEN));
            }

            Claims claims = jwtTokenProvider.getClaims(token);
            String email = claims.get("email", String.class);
            String loginId = jwtTokenProvider.getLoginId(token);

            if (email == null || loginId == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body((ResponseDto.<String>fail(ResponseCode.INVALID_TOKEN, ResponseMessageKorean.INVALID_TOKEN)));
            }

            Employee employee = employeeRepository.findByEmail(email)
                .orElse(null);

            if (employee == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDto.<String>fail(ResponseCode.NO_EXIST_USER_EMAIL, ResponseMessageKorean.NO_EXIST_USER_EMAIL));
            }

            if (!employee.getLoginId().equals(loginId)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDto.<String>fail(ResponseCode.NOT_MATCH_USER_INFO, ResponseMessageKorean.NOT_MATCH_USER_INFO));
            }

            return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseDto.<String>success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, employee.getLoginId()));

        }).subscribeOn(Schedulers.boundedElastic());
    }

    public void sendPasswordChangeEmailMessage(String email, String token) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(email);
        helper.setSubject("[BookHub] 이메일 인증 요청");

        String htmlContent = """
                <h2>[이메일 인증 요청]</h2>
                <p>안녕하세요,</P>
                <br />
                <p>비밀번호 변경 이메일 인증을 위해 아래 버튼을 클릭해 주세요.</p>
                <a href="http://localhost:5173/auth/password-change?token=%s">이메일 인증하기</a>
                <p>본 이메일은 인증 목적으로 발송되었습니다. 인증을 원하지 않으시면 무시하셔도 됩니다.</p>
            """.formatted(token);

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

    @Override
    public Mono<ResponseEntity<ResponseDto<String>>> sendEmailResetPassword(PasswordFindSendEmailRequestDto dto) {
        return Mono.fromCallable(() -> {
            Employee employee = employeeRepository.findByLoginId(dto.getLoginId())
                .orElse(null);

            if (employee == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDto.<String>fail(ResponseCode.NO_EXIST_USER_ID, ResponseMessageKorean.NO_EXIST_USER_ID));
            }

            if (!employee.getEmail().equals(dto.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDto.<String>fail(ResponseCode.NOT_MATCH_USER_EMAIL, ResponseMessageKorean.NO_EXIST_USER_EMAIL));
            }

            if (!employee.getPhoneNumber().equals(dto.getPhoneNumber())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDto.<String>fail(ResponseCode.NOT_MATCH_USER_TEL, ResponseMessageKorean.NOT_MATCH_USER_TEL));
            }

            String token = jwtTokenProvider.generateEmailToken(employee.getLoginId(), employee.getEmail());
            sendPasswordChangeEmailMessage(employee.getEmail(), token);

            return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseDto.<String>success(ResponseCode.SUCCESS, "이메일 전송 성공"));
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @Override
    public Mono<ResponseEntity<ResponseDto<String>>> verifyLoginIdPassword(String token) {
        return Mono.fromCallable(() -> {
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDto.<String>fail(ResponseCode.INVALID_TOKEN, ResponseMessageKorean.INVALID_TOKEN));
            }

            Claims claims = jwtTokenProvider.getClaims(token);
            String email = claims.get("email", String.class);
            String loginId = jwtTokenProvider.getLoginId(token);

            if (email == null || loginId == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body((ResponseDto.<String>fail(ResponseCode.INVALID_TOKEN, ResponseMessageKorean.INVALID_TOKEN)));
            }

            Employee employee = employeeRepository.findByLoginId(loginId)
                .orElse(null);

            if (employee == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDto.<String>fail(ResponseCode.NO_EXIST_USER_ID, ResponseMessageKorean.NO_EXIST_USER_ID));
            }

            if (!employee.getEmail().equals(email)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDto.<String>fail(ResponseCode.NOT_MATCH_USER_INFO, ResponseMessageKorean.NOT_MATCH_USER_INFO));
            }

            return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseDto.<String>success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, employee.getLoginId()));

        }).subscribeOn(Schedulers.boundedElastic());
    }

    @Override
    public Mono<ResponseEntity<ResponseDto<String>>> passwordChange(String token, PasswordResetRequestDto dto) {
        return Mono.fromCallable(() -> {
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDto.<String>fail(ResponseCode.INVALID_TOKEN, ResponseMessageKorean.INVALID_TOKEN));
            }

            Claims claims = jwtTokenProvider.getClaims(token);
            String email = claims.get("email", String.class);
            String loginId = jwtTokenProvider.getLoginId(token);

            if (email == null || loginId == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body((ResponseDto.<String>fail(ResponseCode.INVALID_TOKEN, ResponseMessageKorean.INVALID_TOKEN)));
            }

            Employee employee = employeeRepository.findByLoginId(loginId)
                .orElse(null);

            if (employee == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDto.<String>fail(ResponseCode.NO_EXIST_USER_ID, ResponseMessageKorean.NO_EXIST_USER_ID));
            }

            if (!employee.getEmail().equals(email)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDto.<String>fail(ResponseCode.NOT_MATCH_USER_INFO, ResponseMessageKorean.NOT_MATCH_USER_INFO));
            }

            String password = dto.getPassword();
            String confirmPassword = dto.getConfirmPassword();

            if (!password.equals(confirmPassword)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDto.fail(ResponseCode.NOT_MATCH_PASSWORD, ResponseMessageKorean.NOT_MATCH_PASSWORD));
            }

            String encodePassword = bCryptPasswordEncoder.encode(password);
            employee.setPassword(encodePassword);
            employeeRepository.save(employee);

            return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, "비밀번호가 변경되었습니다."));
        });
    }

    public void sendEmailSignUpResultApprovedMessage(String email) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(email);
        helper.setSubject("회원가입 승인 경과");
        String htmlContent = """
                <h2>[회원가입 승인 결과]</h2>
                <p>
                    안녕하세요, </br>
                    회원가입이 승인되었습니다.
            """;
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    public void sendEmailDeniedAndEmployeeUpdateMessage(String email, String token) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(email);
        helper.setSubject("회원가입 승인 경과");
        String htmlContent = """
                        <h2>[회원가입 승인 결과]</h2>
                        <p>
                            안녕하세요,<br><br>
                            회원 가입 승인이 거절되었습니다.
                            거절 사유: 사원 정보 불일치
                            정보 수정를 위해 아래 버튼을 클릭해 주세요.
                        </p>
                            <a href="http://localhost:5173/auth/sign-up/update?token=%s">이메일 인증하기</a>
                        <p>본 이메일은 인증 목적으로 발송되었습니다. 인증을 원하지 않으시면 무시하셔도 됩니다.</p>
            """.formatted(token);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    public void sendEmailSignUpResultDeniedMessage(String email, String reasonLabel) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(email);
        helper.setSubject("회원가입 승인 경과");
        String htmlContent = """
                        <h2>[회원가입 승인 결과]</h2>
                        <p>
                            안녕하세요,<br><br>
                            회원가입이 거절되었습니다.
                            거절 사유: %s
                        </p>
            """.formatted(reasonLabel);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    @Override
    public Mono<ResponseEntity<ResponseDto<String>>> sendEmailSignUpResult(Long approvalId) {
        return Mono.fromCallable(() -> {
            EmployeeSignUpApproval employeeSignUpApproval = employeeSignUpApprovalRepository.findById(approvalId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원가입 승인 신청입니다."));

            Employee employee = employeeRepository.findById(employeeSignUpApproval.getEmployeeId().getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사원입니다."));

            if (employee.getIsApproved() == IsApproved.APPROVED) {
                sendEmailSignUpResultApprovedMessage(employee.getEmail());

                return ResponseEntity.status(HttpStatus.OK)
                    .body(ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, "이메일 전송 성공"));
            } else if (employee.getIsApproved().equals(IsApproved.DENIED) && employeeSignUpApproval.getDeniedReason().equals("INVALID_EMPLOYEE_INFO")) {
                String token = jwtTokenProvider.generateEmailToken(employee.getLoginId(), employee.getEmail());

                sendEmailDeniedAndEmployeeUpdateMessage(employee.getEmail(), token);

                return ResponseEntity.status(HttpStatus.OK)
                    .body(ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, "이메일 전송 성공"));
            } else {
//                if(employeeSignUpApproval.getDeniedReason() == null){
//                    employeeSignUpApproval.setDeniedReason("기타 사유");
//                }
                String reasonLabel = switch (employeeSignUpApproval.getDeniedReason()) {
                    case "ACCOUNT_ALREADY_EXISTS" -> "이미 계정이 발급된 사원";
                    case "CONTRACT_EMPLOYEE_RESTRICTED" -> "계약직/기간제 사용 제한";
                    case "PENDING_RESIGNATION" -> "퇴사 예정자";
                    default -> "기타 사유";
                };

                sendEmailSignUpResultDeniedMessage(employee.getEmail(), reasonLabel);

                return ResponseEntity.status(HttpStatus.OK)
                    .body(ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, "이메일 전송 성공"));
            }
        });
    }

    @Override
    public Mono<ResponseEntity<ResponseDto<String>>> verifyEmployeeUpdate(String token) {
        return Mono.fromCallable(() -> {
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDto.fail(ResponseCode.TOKEN_EXPIRED, ResponseMessageKorean.TOKEN_EXPIRED));
            }

            Claims claims = jwtTokenProvider.getClaims(token);
            String email = claims.get("email", String.class);

            Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("직원이 존재하지 않습니다."));

            return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS));
        });
    }

    @Override
    public Mono<ResponseEntity<ResponseDto<String>>> employeeUpdate(String token, EmployeeSignUpUpdateRequestDto dto) {
        return Mono.fromCallable(() -> {
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ResponseDto.fail(ResponseCode.TOKEN_EXPIRED, ResponseMessageKorean.TOKEN_EXPIRED));
            }

            Claims claims = jwtTokenProvider.getClaims(token);
            String email = claims.get("email", String.class);

            Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("직원이 존재하지 않습니다."));

            String phoneNumber = dto.getPhoneNumber();
            LocalDate birthDate = dto.getBirthDate();
            Long branchId = dto.getBranchId();

            Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new IllegalArgumentException("지점이 존재하지 않습니다."));

            if (employeeRepository.existsByPhoneNumber(phoneNumber)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ResponseDto.fail(ResponseCode.DUPLICATED_TEL_NUMBER, ResponseMessageKorean.DUPLICATED_TEL_NUMBER));
            }

            employee.setPhoneNumber(phoneNumber);
            employee.setBirthDate(birthDate);
            employee.setBranchId(branch);
            employee.setIsApproved(IsApproved.PENDING);

            Employee newEmployee = employeeRepository.save(employee);

            EmployeeSignUpApproval employeeSignupApproval = EmployeeSignUpApproval.builder()
                .employeeId(newEmployee)
                .appliedAt(newEmployee.getCreatedAt())
                .isApproved(newEmployee.getIsApproved())
                .build();

            employeeSignUpApprovalRepository.save(employeeSignupApproval);


            return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, "회원가입 정보가 수정되었습니다."));
        });
    }
}
