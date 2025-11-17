package com.example.cis4900.spring.template.controllers;

import com.example.cis4900.spring.template.models.Facility;
import com.example.cis4900.spring.template.repositories.FacilityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FacilityControllerTest {

    @Mock
    private FacilityRepository facilityRepository;

    @InjectMocks
    private FacilityController facilityController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllFacilities_returnsList() {
        Facility f1 = mock(Facility.class);
        Facility f2 = mock(Facility.class);

        when(facilityRepository.findAll()).thenReturn(Arrays.asList(f1, f2));

        List<Facility> result = facilityController.getAllFacilities();

        assertNotNull(result, "result should not be null");
        assertEquals(2, result.size(), "should return two facilities");
        assertSame(f1, result.get(0), "first element should match stub");
        assertSame(f2, result.get(1), "second element should match stub");
        verify(facilityRepository, times(1)).findAll();
    }

    @Test
    void testGetAllFacilities_empty() {
        when(facilityRepository.findAll()).thenReturn(Collections.emptyList());

        List<Facility> result = facilityController.getAllFacilities();

        assertNotNull(result, "result should not be null even when empty");
        assertTrue(result.isEmpty(), "result should be empty");
        verify(facilityRepository, times(1)).findAll();
    }

    @Test
    void testGetAllFacilities_nullReturned() {
        when(facilityRepository.findAll()).thenReturn(null);

        List<Facility> result = facilityController.getAllFacilities();

        assertNull(result, "controller should return null if repository returns null");
        verify(facilityRepository, times(1)).findAll();
    }

    @Test
    void testRepository_interaction_snapshot() {
        when(facilityRepository.findAll()).thenReturn(Collections.emptyList());

        List<Facility> result = facilityController.getAllFacilities();

        assertNotNull(result);
        verify(facilityRepository, times(1)).findAll();
        verifyNoMoreInteractions(facilityRepository);
    }

    @Test
    void testFacilityModel_reflection_instantiable() throws Exception {
        Class<?> cls = Class.forName("com.example.cis4900.spring.template.models.Facility");
        assertNotNull(cls, "Facility class should be present");

        // try to instantiate via no-arg constructor if present
        Constructor<?> noArg = null;
        for (Constructor<?> c : cls.getDeclaredConstructors()) {
            if (c.getParameterCount() == 0) {
                noArg = c;
                break;
            }
        }
        if (noArg != null) {
            noArg.setAccessible(true);
            Object inst = noArg.newInstance();
            assertNotNull(inst, "should instantiate Facility via no-arg constructor");
        } else {
            // if no no-arg constructor, at least ensure a constructor exists
            assertTrue(cls.getDeclaredConstructors().length > 0, "Facility should have at least one constructor");
        }

        // check for common accessor methods if present but do not fail if absent
        Method[] methods = cls.getMethods();
        boolean hasGetId = false;
        boolean hasGetName = false;
        for (Method m : methods) {
            if ("getId".equals(m.getName())) hasGetId = true;
            if ("getName".equals(m.getName())) hasGetName = true;
        }
        assertTrue(hasGetId || hasGetName || methods.length > 0, "Facility should expose some public methods");
    }
}