package com.example.bookhub_back.service.auth;

import com.example.bookhub_back.common.constants.ResponseCode;
import com.example.bookhub_back.common.constants.ResponseMessageKorean;
import com.example.bookhub_back.common.enums.IsApproved;
import com.example.bookhub_back.common.enums.Status;
import com.example.bookhub_back.dto.ResponseDto;
import com.example.bookhub_back.dto.alert.request.AlertCreateRequestDto;
import com.example.bookhub_back.dto.auth.request.SignInRequestDto;
import com.example.bookhub_back.dto.auth.request.SignUpRequestDto;
import com.example.bookhub_back.dto.auth.response.SignInResponseDto;
import com.example.bookhub_back.dto.employee.response.EmployeeResponseDto;
import com.example.bookhub_back.entity.*;
import com.example.bookhub_back.provider.JwtTokenProvider;
import com.example.bookhub_back.repository.*;
import com.example.bookhub_back.security.auth.EmployeePrincipal;
import com.example.bookhub_back.service.alert.AlertService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final EmployeeRepository employeeRepository;
    private final BranchRepository branchRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final EmployeeSignUpApprovalRepository employeeSignUpApprovalRepository;
    private final PositionRepository positionRepository;
    private final AuthorityRepository authorityRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final AlertService alertService;

    @Override
    @Transactional
    public ResponseDto<Void> signUp(SignUpRequestDto dto) {
        Employee employee = null;

        String loginId = dto.getLoginId();
        String password = dto.getPassword();
        String confirmPassword = dto.getConfirmPassword();
        String email = dto.getEmail();
        String phoneNumber = dto.getPhoneNumber();

        if (employeeRepository.existsByLoginId(loginId)) {
            return ResponseDto.fail(ResponseCode.DUPLICATED_USER_ID, ResponseMessageKorean.DUPLICATED_USER_ID);
        }

        if (!password.equals(confirmPassword)) {
            return ResponseDto.fail(ResponseCode.NOT_MATCH_PASSWORD, ResponseMessageKorean.NOT_MATCH_PASSWORD);
        }

        if (employeeRepository.existsByEmail(email)) {
            return ResponseDto.fail(ResponseCode.DUPLICATED_EMAIL, ResponseMessageKorean.DUPLICATED_EMAIL);
        }

        if (employeeRepository.existsByPhoneNumber(phoneNumber)) {
            return ResponseDto.fail(ResponseCode.DUPLICATED_TEL_NUMBER, ResponseMessageKorean.DUPLICATED_TEL_NUMBER);
        }

        Branch branch = branchRepository.findById(dto.getBranchId())
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 지점입니다."));

        Position position = positionRepository.findByPositionName("사원")
            .orElseGet(() -> positionRepository.save(Position.builder()
                .positionName("사원")
                .build()));

        Authority authority = authorityRepository.findByAuthorityName("STAFF")
            .orElseGet(() -> authorityRepository.save(Authority.builder()
                .authorityName("STAFF")
                .build()));

        Random random = new Random();
        long employeeNumber;

        do {
            int randomSixDigits = 100000 + random.nextInt(900000);
            String result = String.format("%02d", LocalDate.now().getYear() % 100) + randomSixDigits;
            employeeNumber = Long.parseLong(result);

        } while (employeeRepository.existsByEmployeeNumber(employeeNumber));

        String encodePassword = bCryptPasswordEncoder.encode(password);

        employee = Employee.builder()
            .loginId(dto.getLoginId())
            .password(encodePassword)
            .employeeNumber(employeeNumber)
            .name(dto.getName())
            .email(email)
            .phoneNumber(phoneNumber)
            .birthDate(dto.getBirthDate())
            .branchId(branch)
            .positionId(position)
            .authorityId(authority)
            .isApproved(IsApproved.PENDING)
            .status(Status.EMPLOYED)
            .build();

        employeeRepository.save(employee);

        EmployeeSignUpApproval employeeSignUpApproval = EmployeeSignUpApproval.builder()
            .employeeId(employee)
            .appliedAt(employee.getCreatedAt())
            .isApproved(employee.getIsApproved())
            .build();

        employeeSignUpApprovalRepository.save(employeeSignUpApproval);

        Authority adminAuthority = authorityRepository.findByAuthorityName("Admin")
            .orElseThrow(() -> new IllegalArgumentException(ResponseMessageKorean.USER_NOT_FOUND));

        Employee finalEmployee = employee;

        employeeRepository.findAll().stream()
            .filter(emp -> emp.getAuthorityId().equals(adminAuthority))
            .forEach(admin -> {
                AlertCreateRequestDto alertCreateRequestDto = AlertCreateRequestDto.builder()
                    .employeeId(admin.getEmployeeId())
                    .alertType("SIGNUP_APPROVAL")
                    .alertTargetTable("EMPLOYEES")
                    .targetPk(finalEmployee.getEmployeeId())
                    .message(finalEmployee.getName() + "님의 회원가입 승인 요청이 도착했습니다.")
                    .build();

                alertService.createAlert(alertCreateRequestDto);
            });

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS);
    }

    @Override
    public ResponseDto<SignInResponseDto> login(SignInRequestDto dto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getLoginId(), dto.getPassword())
            );

            EmployeePrincipal employeePrincipal = (EmployeePrincipal) authentication.getPrincipal();

            SignInResponseDto responseDto = null;

            String token = jwtTokenProvider.generateToken(employeePrincipal.getLoginId(), employeePrincipal.getAuthorities().iterator().next().getAuthority());
            int exprTime = jwtTokenProvider.getExpiration();

            EmployeeResponseDto response = EmployeeResponseDto.builder()
                .employeeId(employeePrincipal.getEmployeeId())
                .employeeName(employeePrincipal.getName())
                .employeeNumber(employeePrincipal.getEmployeeNumber())
                .branchName(employeePrincipal.getBranchName())
                .positionName(employeePrincipal.getPositionName())
                .authorityName(employeePrincipal.getAuthorities().iterator().next().getAuthority())
                .build();

            responseDto = SignInResponseDto.builder()
                .token(token)
                .exprTime(exprTime)
                .employee(response)
                .build();

            return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS, responseDto);
        } catch (DisabledException e) {
            return ResponseDto.fail(ResponseCode.SIGN_IN_FAIL, ResponseMessageKorean.SIGN_IN_FAIL);
        } catch (BadCredentialsException e) {
            return ResponseDto.fail(ResponseCode.FAIL, "아이디 또는 비밀번호가 일치하지 않습니다.");
        } catch (Exception e) {
            return ResponseDto.fail(ResponseCode.INTERNAL_SERVER_ERROR, ResponseMessageKorean.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseDto<Void> checkLoginIdDuplicate(String loginId) {
        if (employeeRepository.existsByLoginId(loginId)) {
            return ResponseDto.fail(ResponseCode.DUPLICATED_USER_ID, ResponseMessageKorean.DUPLICATED_USER_ID);
        }

        return ResponseDto.success(ResponseCode.SUCCESS, "사용 가능한 아이디입니다.");
    }

    @Override
    public ResponseDto<Void> checkEmailDuplicate(String email) {
        if (employeeRepository.existsByEmail(email)) {
            return ResponseDto.fail(ResponseCode.DUPLICATED_EMAIL, ResponseMessageKorean.DUPLICATED_EMAIL);
        }

        return ResponseDto.success(ResponseCode.SUCCESS, "사용 가능한 이메일입니다.");
    }

    @Override
    public ResponseDto<Void> checkPhoneNumberDuplicate(String phoneNumber) {
        if (employeeRepository.existsByPhoneNumber(phoneNumber)) {
            return ResponseDto.fail(ResponseCode.DUPLICATED_TEL_NUMBER, ResponseMessageKorean.DUPLICATED_TEL_NUMBER);
        }

        return ResponseDto.success(ResponseCode.SUCCESS, "사용 가능한 전화번호입니다.");
    }

    @Override
    public ResponseDto<Void> logout(HttpServletResponse response) {
        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", "")
            .path("/")
            .maxAge(0)
            .build();

        response.addHeader("Set-Cookie", accessTokenCookie.toString());

        return ResponseDto.success(ResponseCode.SUCCESS, ResponseMessageKorean.SUCCESS);
    }
}
