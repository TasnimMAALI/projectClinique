package com.clinique.security;


import com.clinique.model.User;
import com.clinique.repository.AppointmentRepository;
import com.clinique.repository.MedicalRecordRepository;
import com.clinique.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("userSecurity")
public class UserSecurity {

    @Autowired
    private AuthService authService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    public boolean isCurrentUser(Long userId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        return currentUser != null && currentUser.getId().equals(userId);
    }

    public boolean isPatientAppointment(Long appointmentId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) return false;

        return appointmentRepository.findById(appointmentId)
            .map(appointment -> appointment.getPatient().getUser().getId().equals(currentUser.getId()))
            .orElse(false);
    }

    public boolean isPatientMedicalRecord(Long recordId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        if (currentUser == null) return false;

        return medicalRecordRepository.findById(recordId)
            .map(record -> record.getPatient().getUser().getId().equals(currentUser.getId()))
            .orElse(false);
    }
}
