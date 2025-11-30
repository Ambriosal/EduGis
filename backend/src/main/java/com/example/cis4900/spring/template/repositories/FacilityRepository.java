package com.example.cis4900.spring.template.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.cis4900.spring.template.models.Facility;
import com.example.cis4900.spring.template.models.FacilityCount;
import com.example.cis4900.spring.template.models.FacilityInfo;

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
        AND f.region IN :regions
        GROUP BY f.region
        ORDER BY f.region
    """)
    List<FacilityCount> getComparisonFiltered(
            @Param("type") String type,
            @Param("regions") List<String> regions
    );

    @Query("""
        SELECT new com.example.cis4900.spring.template.models.FacilityCount(
            f.region,
            COUNT(f)
        )
        FROM Facility f
        WHERE f.type = :type
        GROUP BY f.region
        ORDER BY f.region
    """)
    List<FacilityCount> getComparisonAll(@Param("type") String type);

    @Query("""
        SELECT new com.example.cis4900.spring.template.models.FacilityInfo(
            f.region,
            SUM(CASE WHEN f.type = 'Early Childhood Education' THEN 1 ELSE 0 END),
            SUM(CASE WHEN f.type = 'Elementary' THEN 1 ELSE 0 END),
            SUM(CASE WHEN f.type = 'Secondary' THEN 1 ELSE 0 END),
            SUM(CASE WHEN f.type = 'Post Secondary' THEN 1 ELSE 0 END)
        )
        FROM Facility f
        WHERE f.region IN :regions
        GROUP BY f.region
    """)
    List<FacilityInfo> getRegionInfo(@Param("regions") List<String> regions);


}
