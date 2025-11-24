package com.example.cis4900.spring.template.controllers;

import com.example.cis4900.spring.template.models.Facility;
import com.example.cis4900.spring.template.models.FacilityCount;
import com.example.cis4900.spring.template.repositories.FacilityRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FacilityControllerTest {

    @Mock
    private FacilityRepository facilityRepository;

    @InjectMocks
    private FacilityController facilityController;

    @Test
    void getAllFacilities_returnsListFromRepository() {
        Facility f1 = new Facility("Facility A", 43.0, -79.0, "Elementary", "ON");
        f1.setId(1L);
        Facility f2 = new Facility("Facility B", 44.0, -80.0, "Secondary", "QC");
        f2.setId(2L);

        when(facilityRepository.findAll()).thenReturn(Arrays.asList(f1, f2));

        List<Facility> result = facilityController.getAllFacilities();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertSame(f1, result.get(0));
        assertSame(f2, result.get(1));

        verify(facilityRepository, times(1)).findAll();
        verifyNoMoreInteractions(facilityRepository);
    }

    @Test
    void getAllFacilities_returnsEmptyList() {
        when(facilityRepository.findAll()).thenReturn(Collections.emptyList());

        List<Facility> result = facilityController.getAllFacilities();

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(facilityRepository, times(1)).findAll();
        verifyNoMoreInteractions(facilityRepository);
    }

    @Test
    void getRegions_returnsListFromRepository() {
        List<String> regions = Arrays.asList("ON", "QC", "BC");
        when(facilityRepository.getRegions()).thenReturn(regions);

        List<String> result = facilityController.getRegions();

        assertEquals(regions, result);
        verify(facilityRepository, times(1)).getRegions();
        verifyNoMoreInteractions(facilityRepository);
    }

    @Test
    void getComparison_noProvinces_callsGetComparisonAll() {
        // mock FacilityCount objects (don’t care about fields)
        FacilityCount fc1 = mock(FacilityCount.class);
        List<FacilityCount> repoResult = List.of(fc1);

        when(facilityRepository.getComparisonAll("School"))
                .thenReturn(repoResult);

        List<FacilityCount> result = facilityController.getComparison("School", null);

        assertSame(repoResult, result);
        verify(facilityRepository, times(1)).getComparisonAll("School");
        verify(facilityRepository, never()).getComparisonFiltered(anyString(), anyList());
        verifyNoMoreInteractions(facilityRepository);
    }

    @Test
    void getComparison_emptyProvinces_callsGetComparisonAll() {
        FacilityCount fc1 = mock(FacilityCount.class);
        List<FacilityCount> repoResult = List.of(fc1);

        when(facilityRepository.getComparisonAll("School"))
                .thenReturn(repoResult);

        List<FacilityCount> result = facilityController.getComparison("School", "");

        assertSame(repoResult, result);
        verify(facilityRepository, times(1)).getComparisonAll("School");
        verify(facilityRepository, never()).getComparisonFiltered(anyString(), anyList());
        verifyNoMoreInteractions(facilityRepository);
    }

    @Test
    void getComparison_withProvinces_callsGetComparisonFilteredWithSplitList() {
        FacilityCount fc1 = mock(FacilityCount.class);
        FacilityCount fc2 = mock(FacilityCount.class);
        List<FacilityCount> repoResult = Arrays.asList(fc1, fc2);

        when(facilityRepository.getComparisonFiltered(eq("School"), anyList()))
                .thenReturn(repoResult);

        List<FacilityCount> result =
                facilityController.getComparison("School", "ON,QC");

        assertSame(repoResult, result);

        // capture the list passed into the repository
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<String>> captor = ArgumentCaptor.forClass(List.class);
        verify(facilityRepository, times(1))
                .getComparisonFiltered(eq("School"), captor.capture());

        List<String> passedRegions = captor.getValue();
        assertEquals(Arrays.asList("ON", "QC"), passedRegions);

        verify(facilityRepository, never()).getComparisonAll(anyString());
        verifyNoMoreInteractions(facilityRepository);
    }

    @Test
    void facilityModel_gettersAndSetters_work() {
        Facility facility = new Facility("Original", 1.0, 2.0, "Type1", "Region1");
        facility.setId(10L);

        // initial values
        assertEquals(10L, facility.getId());
        assertEquals("Original", facility.getName());
        assertEquals(1.0, facility.getLatitude());
        assertEquals(2.0, facility.getLongitude());
        assertEquals("Type1", facility.getType());
        assertEquals("Region1", facility.getRegion());

        // mutate
        facility.setName("Updated");
        facility.setLatitude(3.0);
        facility.setLongitude(4.0);
        facility.setType("Type2");
        facility.setRegion("Region2");

        assertEquals("Updated", facility.getName());
        assertEquals(3.0, facility.getLatitude());
        assertEquals(4.0, facility.getLongitude());
        assertEquals("Type2", facility.getType());
        assertEquals("Region2", facility.getRegion());
    }
}
