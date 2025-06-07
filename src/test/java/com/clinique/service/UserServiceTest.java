package com.clinique.service;

import com.clinique.dto.UserDTO;
import com.clinique.model.Role;
import com.clinique.model.User;
import com.clinique.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private UserDTO testUserDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setPassword("hashedPassword");
        testUser.setRole(Role.ROLE_DOCTOR);
        testUser.setSpecialization("Cardiology");
        testUser.setLicenseNumber("12345");

        testUserDTO = new UserDTO();
        testUserDTO.setEmail("test@example.com");
        testUserDTO.setFirstName("Test");
        testUserDTO.setLastName("User");
        testUserDTO.setRole(Role.ROLE_DOCTOR);
        testUserDTO.setSpecialization("Cardiology");
        testUserDTO.setLicenseNumber("12345");
    }

    @Test
    void whenCreateUser_thenReturnUserDTO() {
        when(passwordEncoder.encode(any())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        UserDTO result = userService.createUser(testUserDTO, "password");

        assertNotNull(result);
        assertEquals(testUserDTO.getEmail(), result.getEmail());
        assertEquals(testUserDTO.getRole(), result.getRole());
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode("password");
    }

    @Test
    void whenGetUserById_thenReturnUserDTO() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        UserDTO result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals(testUser.getEmail(), result.getEmail());
        assertEquals(testUser.getRole(), result.getRole());
    }

    @Test
    void whenGetAllUsers_thenReturnListOfUserDTOs() {
        when(userRepository.findAll()).thenReturn(Arrays.asList(testUser));

        List<UserDTO> result = userService.getAllUsers();

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(testUser.getEmail(), result.get(0).getEmail());
    }

    @Test
    void whenUpdateUser_thenReturnUpdatedUserDTO() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        UserDTO updatedDTO = new UserDTO();
        updatedDTO.setEmail("updated@example.com");
        updatedDTO.setFirstName("Updated");
        updatedDTO.setLastName("User");
        updatedDTO.setRole(Role.ROLE_DOCTOR);

        UserDTO result = userService.updateUser(1L, updatedDTO);

        assertNotNull(result);
        assertEquals(updatedDTO.getEmail(), result.getEmail());
        assertEquals(updatedDTO.getFirstName(), result.getFirstName());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void whenDeleteUser_thenVerifyRepositoryCall() {
        doNothing().when(userRepository).deleteById(1L);

        userService.deleteUser(1L);

        verify(userRepository).deleteById(1L);
    }

    @Test
    void whenFindByEmail_thenReturnUser() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        Optional<User> result = userService.findByEmail("test@example.com");

        assertTrue(result.isPresent());
        assertEquals(testUser.getEmail(), result.get().getEmail());
    }
}
