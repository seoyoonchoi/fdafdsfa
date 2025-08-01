package com.example.bookhub_back.filter;

import com.example.bookhub_back.provider.JwtTokenProvider;
import com.example.bookhub_back.security.auth.CustomEmployeeDetailsService;
import com.example.bookhub_back.security.auth.EmployeePrincipal;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomEmployeeDetailsService customEmployeeDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String authorizationHeader = request.getHeader("Authorization");
            String token = (authorizationHeader != null && authorizationHeader.startsWith("Bearer "))
                ? jwtTokenProvider.removeBearer(authorizationHeader) : null;

            if (token != null && jwtTokenProvider.validateToken(token)) {
                String userId = jwtTokenProvider.getLoginId(token);
                EmployeePrincipal employeeDetails = customEmployeeDetailsService.loadUserByUsername(userId);

                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(employeeDetails, null, employeeDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
