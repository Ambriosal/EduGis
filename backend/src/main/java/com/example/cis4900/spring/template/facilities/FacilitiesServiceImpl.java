package com.example.cis4900.spring.template.facilities;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.cis4900.spring.template.facilities.dao.FacilitiesDao;
import com.example.cis4900.spring.template.models.Facility;

@Service
public class FacilitiesServiceImpl implements FacilitiesService {
    @Autowired
    private FacilitiesDao facilitiesDao;

    @Override
    public Iterable<Facility> allFacilities() {
        return facilitiesDao.findAll();
    }

    @Override
    public Integer count() {
        return facilitiesDao.getCount();
    }
}