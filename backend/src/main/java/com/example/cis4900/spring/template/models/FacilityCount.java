package com.example.cis4900.spring.template.models;

public class FacilityCount {
    private String region;
    private Long count;

    public FacilityCount(String region, Long count) {
        this.region = region;
        this.count = count;
    }

    public String getRegion() {
        return region;
    }

    public Long getCount() {
        return count;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
