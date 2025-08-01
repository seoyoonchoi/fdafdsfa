package com.example.bookhub_back.security.auth;

import com.example.bookhub_back.common.enums.IsApproved;
import com.example.bookhub_back.entity.Employee;
import lombok.Getter;
import net.minidev.json.annotate.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
public class EmployeePrincipal implements UserDetails {
    private final Long employeeId;
    private final String loginId;
    private final String name;
    private final Long employeeNumber;
    private final Long branchId;
    private final String branchName;
    private final String positionName;
    private final IsApproved isApproved;


    @JsonIgnore
    private final String password;
    private final Collection<? extends GrantedAuthority> authorities;

    public EmployeePrincipal(Employee employee) {
        this.employeeId = employee.getEmployeeId();
        this.loginId = employee.getLoginId();
        this.name = employee.getName();
        this.employeeNumber = employee.getEmployeeNumber();
        this.branchId = employee.getBranchId().getBranchId();
        this.branchName = employee.getBranchId().getBranchName();
        this.positionName = employee.getPositionId().getPositionName();
        this.password = employee.getPassword();
        this.authorities = Collections.singleton(() -> "ROLE_" + employee.getAuthorityId().getAuthorityName());
        this.isApproved = employee.getIsApproved();

    }

    @Override
    public String getUsername() {
        return loginId;
    }

    @Override
    public boolean isAccountNonExpired() {
        
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isApproved.equals(IsApproved.APPROVED);
    }
}
