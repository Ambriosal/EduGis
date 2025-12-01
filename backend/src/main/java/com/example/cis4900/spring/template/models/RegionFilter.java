package com.example.cis4900.spring.template.models;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class RegionFilter {
    private final List<String> regions;
    
    public RegionFilter(String commaSeparatedRegions) {
        if (commaSeparatedRegions == null || commaSeparatedRegions.trim().isEmpty()) {
            this.regions = Collections.emptyList();
        } else {
            this.regions = Arrays.asList(commaSeparatedRegions.split(","));
        }
    }
    
    public boolean isEmpty() {
        return regions.isEmpty();
    }
    
    public List<String> getRegions() {
        return regions;
    }
}
