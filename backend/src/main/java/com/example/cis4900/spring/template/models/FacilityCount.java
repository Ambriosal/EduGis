package com.example.cis4900.spring.template.models;

public class FacilityCount {
    private String province;
    private Long count;

    public FacilityCount(String province, Long count) {
        this.province = province;
        this.count = count;
    }

    public String getProvince() { return province; }
    public Long getCount() { return count; }
}
