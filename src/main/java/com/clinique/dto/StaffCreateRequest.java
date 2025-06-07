package com.clinique.dto;

import com.clinique.model.Role;
import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class StaffCreateRequest {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    private String address;

    @NotNull(message = "Role is required")
    private Role role;

    private String specialization;  // Required for doctors
    private String licenseNumber;   // Required for doctors
    private String department;      // Required for secretary/nurse
    private String position;        // Required for secretary/nurse
}
