package com.example.bookhub_back.security.auth;

import com.example.bookhub_back.entity.Employee;
import com.example.bookhub_back.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomEmployeeDetailsService implements UserDetailsService {
    private final EmployeeRepository employeeRepository;

    @Override
    public EmployeePrincipal loadUserByUsername(String loginId) throws UsernameNotFoundException {
        Employee employee = employeeRepository.findByLoginId(loginId)
            .orElseThrow(() -> new UsernameNotFoundException("직원을 찾을 수 없습니다: " + loginId));
        return new EmployeePrincipal(employee);
    }
}
