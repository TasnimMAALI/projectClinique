package com.clinique.controller;

import com.clinique.dto.StaffCreateRequest;
import com.clinique.dto.StaffDTO;
import com.clinique.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StaffDTO>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @GetMapping("/doctors")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY')")
    public ResponseEntity<List<StaffDTO>> getAllDoctors() {
        return ResponseEntity.ok(staffService.getAllDoctors());
    }

    @GetMapping("/secretaries")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StaffDTO>> getAllSecretaries() {
        return ResponseEntity.ok(staffService.getAllSecretaries());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StaffDTO> getStaffById(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.getStaffById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StaffDTO> createStaffMember(@Valid @RequestBody StaffCreateRequest request) {
        return ResponseEntity.ok(staffService.createStaffMember(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StaffDTO> updateStaffMember(
            @PathVariable Long id,
            @Valid @RequestBody StaffCreateRequest request) {
        return ResponseEntity.ok(staffService.updateStaffMember(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStaffMember(@PathVariable Long id) {
        staffService.deleteStaffMember(id);
        return ResponseEntity.ok().build();
    }
}
