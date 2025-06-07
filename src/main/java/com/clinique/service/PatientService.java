package com.clinique.service;

import com.clinique.dto.PatientDTO;
import com.clinique.model.Patient;
import com.clinique.model.User;
import com.clinique.repository.PatientRepository;
import com.clinique.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PatientDTO> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PatientDTO getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return convertToDTO(patient);
    }

    public PatientDTO getPatientByUserId(Long userId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return convertToDTO(patient);
    }

    @Transactional
    public PatientDTO createPatient(PatientDTO patientDTO) {
        User user = userRepository.findById(patientDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Patient patient = new Patient();
        patient.setUser(user);
        updatePatientFromDTO(patient, patientDTO);

        Patient savedPatient = patientRepository.save(patient);
        return convertToDTO(savedPatient);
    }

    @Transactional
    public PatientDTO updatePatient(Long id, PatientDTO patientDTO) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        updatePatientFromDTO(patient, patientDTO);
        Patient updatedPatient = patientRepository.save(patient);
        return convertToDTO(updatedPatient);
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }

    private void updatePatientFromDTO(Patient patient, PatientDTO dto) {
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setBloodGroup(dto.getBloodGroup());
        patient.setAllergies(dto.getAllergies());
        patient.setMedicalHistory(dto.getMedicalHistory());
        patient.setEmergencyContact(dto.getEmergencyContact());
        patient.setEmergencyPhone(dto.getEmergencyPhone());
        patient.setInsuranceProvider(dto.getInsuranceProvider());
        patient.setInsuranceNumber(dto.getInsuranceNumber());
    }

    private PatientDTO convertToDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setUserId(patient.getUser().getId());
        dto.setFirstName(patient.getUser().getFirstName());
        dto.setLastName(patient.getUser().getLastName());
        dto.setEmail(patient.getUser().getEmail());
        dto.setPhoneNumber(patient.getUser().getPhoneNumber());
        dto.setAddress(patient.getUser().getAddress());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setBloodGroup(patient.getBloodGroup());
        dto.setAllergies(patient.getAllergies());
        dto.setMedicalHistory(patient.getMedicalHistory());
        dto.setEmergencyContact(patient.getEmergencyContact());
        dto.setEmergencyPhone(patient.getEmergencyPhone());
        dto.setInsuranceProvider(patient.getInsuranceProvider());
        dto.setInsuranceNumber(patient.getInsuranceNumber());
        dto.setCreatedAt(patient.getCreatedAt());
        return dto;
    }
}
