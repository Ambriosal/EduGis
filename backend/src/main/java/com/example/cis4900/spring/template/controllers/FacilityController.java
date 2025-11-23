package com.example.cis4900.spring.template.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

import com.example.cis4900.spring.template.models.Facility;
import com.example.cis4900.spring.template.models.FacilityCount;
import com.example.cis4900.spring.template.repositories.FacilityRepository;

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
    public List<FacilityCount> getComparison(@requestParam String type, @requestParam(required = false) String provinces){
        
        List<String> provinceList = null;
        if(provinces != null && !provinces.isEmpty()){
            provinceList = Arrays.asList(provinces.split(","));
        }

        return facilityRepository.getComparison(type, provinceList);

    }

}
