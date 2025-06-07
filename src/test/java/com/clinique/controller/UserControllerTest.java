package com.clinique.controller;

import com.clinique.dto.UserDTO;
import com.clinique.model.Role;
import com.clinique.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    private UserDTO testUserDTO;

    @BeforeEach
    void setUp() {
        testUserDTO = new UserDTO();
        testUserDTO.setEmail("test@example.com");
        testUserDTO.setFirstName("Test");
        testUserDTO.setLastName("User");
        testUserDTO.setRole(Role.ROLE_DOCTOR);
        testUserDTO.setSpecialization("Cardiology");
        testUserDTO.setLicenseNumber("12345");
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void whenGetAllUsers_thenReturnJsonArray() throws Exception {
        when(userService.getAllUsers()).thenReturn(Arrays.asList(testUserDTO));

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].email").value(testUserDTO.getEmail()))
                .andExpect(jsonPath("$[0].firstName").value(testUserDTO.getFirstName()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void whenGetUserById_thenReturnJson() throws Exception {
        when(userService.getUserById(1L)).thenReturn(testUserDTO);

        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.email").value(testUserDTO.getEmail()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void whenCreateUser_thenReturnCreatedUser() throws Exception {
        when(userService.createUser(any(UserDTO.class), any())).thenReturn(testUserDTO);

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUserDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value(testUserDTO.getEmail()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void whenUpdateUser_thenReturnUpdatedUser() throws Exception {
        when(userService.updateUser(eq(1L), any(UserDTO.class))).thenReturn(testUserDTO);

        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUserDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(testUserDTO.getEmail()));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void whenDeleteUser_thenReturn204() throws Exception {
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void whenUnauthorizedAccess_thenReturn401() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "PATIENT")
    void whenInsufficientPrivileges_thenReturn403() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isForbidden());
    }
}
