package com.example.cis4900.spring.template.models;

import jakarta.persistence.*;

@Entity
@Table(name = "facilities")
public class Facility {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double latitude;
    private Double longitude;
    private String type;
    private String region;

    public Facility() {}

    public Facility(String name, Double latitude, Double longitude, String type, String region) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.type = type;
        this.region = region;
    }

    // Getters + setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public String getType() { return type; }
    public String getRegion() { return region; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public void setType(String type) { this.type = type; }
    public void setRegion(String region) { this.region = region; }
}
