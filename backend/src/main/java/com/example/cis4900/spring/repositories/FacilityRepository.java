package com.example.cis4900.spring.template.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.cis4900.spring.template.models.Facility;
import com.example.cis4900.spring.template.models.FacilityCount;

import java.util.List;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {

    @Query("SELECT DISTINCT f.region FROM Facility f")
    List<String> getRegions();

    @Query("""
        SELECT new com.example.cis4900.spring.template.models.FacilityCount(
            f.region,
            COUNT(f)
        )
        FROM Facility f
        WHERE f.type = :type
          AND (:regions IS NULL OR f.region IN :regions)
        GROUP BY f.region
        ORDER BY f.region
    """)
    List<FacilityCount> getComparison(
        @Param("type") String type,
        @Param("regions") List<String> regions
    );

}
