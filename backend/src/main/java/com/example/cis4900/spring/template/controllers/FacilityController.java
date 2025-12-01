package com.example.cis4900.spring.template.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Arrays;
import java.util.Collections;

import com.example.cis4900.spring.template.models.Facility;
import com.example.cis4900.spring.template.models.FacilityCount;
import com.example.cis4900.spring.template.models.FacilityInfo;
import com.example.cis4900.spring.template.repositories.FacilityRepository;

import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/")
public class FacilityController {

    @Autowired
    private FacilityRepository facilityRepository;

    @GetMapping("facilities")
    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    @GetMapping("regions")
    public List<String> getRegions(){
        return facilityRepository.getRegions();
    }

    @GetMapping("facilities/compare")
    public List<FacilityCount> getComparison(@RequestParam String type, @RequestParam(required = false) String provinces){
        
        FacilityType facilityType = new FacilityType(type);
        RegionFilter regionFilter = new RegionFilter(provinces);

        if (regionFilter.isEmpty()){
            return facilityRepository.getComparisonAll(facilityType.getValue());
        }

        return facilityRepository.getComparisonFiltered(facilityType.getValue(), regionFilter.getRegions());

    }

    @GetMapping("facilities/info")
    public List<FacilityInfo> getRegionInfo(@RequestParam List<String> regions){
        if(regions == null || regions.isEmpty()){
            return Collections.emptyList();
        }

        return facilityRepository.getRegionInfo(regions);
    }

}