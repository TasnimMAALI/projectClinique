package com.clinique.dto;

import com.clinique.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private Role role;
    private String specialization;  // Pour les médecins
    private String licenseNumber;   // Pour les médecins
    private String department;      // Pour les secrétaires/infirmières
    private String position;        // Pour les secrétaires/infirmières
}
