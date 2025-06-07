package com.clinique.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MedicalRecordDTO {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private String diagnosis;
    private String prescription;
    private String treatmentPlan;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
