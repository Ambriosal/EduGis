package com.example.cis4900.spring.template.models;

public class FacilityType {
    private final String value;
    
    public FacilityType(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("Facility type cannot be empty");
        }
        this.value = value.trim();
    }
    
    public String getValue() {
        return value;
    }
}
