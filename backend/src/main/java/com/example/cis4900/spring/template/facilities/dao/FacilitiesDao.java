package com.example.cis4900.spring.template.facilities.dao;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.example.cis4900.spring.template.models.Facility;

public interface FacilitiesDao extends CrudRepository<Facility, Integer> {

    @Query("SELECT COUNT(*) FROM Facility")
    Integer getCount();
}