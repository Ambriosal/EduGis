package com.example.cis4900.spring.template.facilities;

import com.example.cis4900.spring.template.facilities.models.Facility;


public interface FacilitiesService {
    public Iterable<Facility> allFacilities();

    public Integer count();
}