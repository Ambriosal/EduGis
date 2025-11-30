package com.example.cis4900.spring.template.models;

public class FacilityInfo{

    private String region;
    private Long[] facilities;

    public FacilityInfo(String region, Long type1, Long type2, Long type3, Long type4){
        this.region = region;
        this.facilities = new Long[]{type1, type2, type3, type4};
    }

    public String getRegion(){
        return this.region;
    }

    public void setRegion(String region){
        this.region = region;
    }

    public Long[] getFacilities(){
        return this.facilities;
    }

    public void setFacilities(Long[] facilities){
        this.facilities = facilities;
    }

}