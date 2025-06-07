package com.clinique.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PatientDTO {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private LocalDate dateOfBirth;
    private String bloodGroup;
    private String allergies;
    private String medicalHistory;
    private String emergencyContact;
    private String emergencyPhone;
    private String insuranceProvider;
    private String insuranceNumber;
    private LocalDate createdAt;
}
