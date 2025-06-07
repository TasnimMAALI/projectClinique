package com.clinique.service;

import com.clinique.dto.MedicalRecordDTO;
import com.clinique.model.MedicalRecord;
import com.clinique.model.Patient;
import com.clinique.model.User;
import com.clinique.repository.MedicalRecordRepository;
import com.clinique.repository.PatientRepository;
import com.clinique.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    public List<MedicalRecordDTO> getAllMedicalRecords() {
        return medicalRecordRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MedicalRecordDTO getMedicalRecordById(Long id) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));
        return convertToDTO(record);
    }

    public MedicalRecordDTO getMedicalRecordByPatientId(Long patientId) {
        MedicalRecord record = medicalRecordRepository.findByPatientId(patientId)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));
        return convertToDTO(record);
    }

    @Transactional
    public MedicalRecordDTO createMedicalRecord(MedicalRecordDTO recordDTO) {
        Patient patient = patientRepository.findById(recordDTO.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        User doctor = userRepository.findById(recordDTO.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setDoctor(doctor);
        updateMedicalRecordFromDTO(record, recordDTO);

        MedicalRecord savedRecord = medicalRecordRepository.save(record);
        return convertToDTO(savedRecord);
    }

    @Transactional
    public MedicalRecordDTO updateMedicalRecord(Long id, MedicalRecordDTO recordDTO) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));
        
        updateMedicalRecordFromDTO(record, recordDTO);
        MedicalRecord updatedRecord = medicalRecordRepository.save(record);
        return convertToDTO(updatedRecord);
    }

    private void updateMedicalRecordFromDTO(MedicalRecord record, MedicalRecordDTO dto) {
        record.setDiagnosis(dto.getDiagnosis());
        record.setPrescription(dto.getPrescription());
        record.setTreatmentPlan(dto.getTreatmentPlan());
        record.setNotes(dto.getNotes());
    }

    private MedicalRecordDTO convertToDTO(MedicalRecord record) {
        MedicalRecordDTO dto = new MedicalRecordDTO();
        dto.setId(record.getId());
        dto.setPatientId(record.getPatient().getId());
        dto.setPatientName(record.getPatient().getUser().getFirstName() + " " + 
                          record.getPatient().getUser().getLastName());
        dto.setDoctorId(record.getDoctor().getId());
        dto.setDoctorName(record.getDoctor().getFirstName() + " " + 
                         record.getDoctor().getLastName());
        dto.setDiagnosis(record.getDiagnosis());
        dto.setPrescription(record.getPrescription());
        dto.setTreatmentPlan(record.getTreatmentPlan());
        dto.setNotes(record.getNotes());
        dto.setCreatedAt(record.getCreatedAt());
        dto.setUpdatedAt(record.getUpdatedAt());
        return dto;
    }
}
