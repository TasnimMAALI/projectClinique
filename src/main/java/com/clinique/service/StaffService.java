package com.clinique.service;

import com.clinique.dto.StaffCreateRequest;
import com.clinique.dto.StaffDTO;
import com.clinique.model.Role;
import com.clinique.model.User;
import com.clinique.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<StaffDTO> getAllStaff() {
        return userRepository.findByRoleIn(List.of(Role.ROLE_DOCTOR, Role.ROLE_SECRETARY))
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StaffDTO> getAllDoctors() {
        return userRepository.findByRole(Role.ROLE_DOCTOR)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StaffDTO> getAllSecretaries() {
        return userRepository.findByRole(Role.ROLE_SECRETARY)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StaffDTO getStaffById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Staff member not found"));
    }

    @Transactional
    public StaffDTO createStaffMember(StaffCreateRequest request) {
        validateStaffRequest(request);

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setRole(request.getRole());
        user.setSpecialization(request.getSpecialization());
        user.setLicenseNumber(request.getLicenseNumber());
        user.setDepartment(request.getDepartment());
        user.setPosition(request.getPosition());

        return convertToDTO(userRepository.save(user));
    }

    @Transactional
    public StaffDTO updateStaffMember(Long id, StaffCreateRequest request) {
        validateStaffRequest(request);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Staff member not found"));

        // Check if email is being changed and if it's already taken
        if (!user.getEmail().equals(request.getEmail()) && 
            userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setRole(request.getRole());
        user.setSpecialization(request.getSpecialization());
        user.setLicenseNumber(request.getLicenseNumber());
        user.setDepartment(request.getDepartment());
        user.setPosition(request.getPosition());

        return convertToDTO(userRepository.save(user));
    }

    @Transactional
    public void deleteStaffMember(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("Staff member not found");
        }
        userRepository.deleteById(id);
    }

    private void validateStaffRequest(StaffCreateRequest request) {
        if (request.getRole() == Role.ROLE_DOCTOR) {
            if (request.getSpecialization() == null || request.getSpecialization().trim().isEmpty()) {
                throw new IllegalArgumentException("Specialization is required for doctors");
            }
            if (request.getLicenseNumber() == null || request.getLicenseNumber().trim().isEmpty()) {
                throw new IllegalArgumentException("License number is required for doctors");
            }
        } else if (request.getRole() == Role.ROLE_SECRETARY) {
            if (request.getDepartment() == null || request.getDepartment().trim().isEmpty()) {
                throw new IllegalArgumentException("Department is required for secretaries");
            }
            if (request.getPosition() == null || request.getPosition().trim().isEmpty()) {
                throw new IllegalArgumentException("Position is required for secretaries");
            }
        }
    }

    private StaffDTO convertToDTO(User user) {
        return StaffDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .role(user.getRole())
                .specialization(user.getSpecialization())
                .licenseNumber(user.getLicenseNumber())
                .department(user.getDepartment())
                .position(user.getPosition())
                .build();
    }
}
