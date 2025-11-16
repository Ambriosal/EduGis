package com.example.cis4900.spring.template.facilities.dao;

import com.example.cis4900.spring.template.facilities.models.Facility;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface FacilitiesDao extends CrudRepository<Facility, Integer> {

    @Query("SELECT COUNT(*) FROM Note")
    Integer getCount();
}