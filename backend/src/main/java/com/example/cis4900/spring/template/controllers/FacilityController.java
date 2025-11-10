package com.example.cis4900.spring.template.controllers;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.example.cis4900.spring.template.models.Facility;
import com.example.cis4900.spring.template.repositories.FacilityRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/facilities")
public class FacilityController {

    @Autowired
    private FacilityRepository facilityRepository;

    @GetMapping
    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }
}
