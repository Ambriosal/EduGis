package com.example.cis4900.spring.template.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.cis4900.spring.template.facilities.models.Facility;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {}
