package com.fieldops.assetreq.entity;

import java.math.BigDecimal;
import jakarta.persistence.*;

@Entity
@Table(name = "assets")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "asset_code", nullable = false, unique = true, length = 20)
    private String assetCode;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 40)
    private String category;

    @Column(name = "health_score", nullable = false)
    private Integer healthScore;

    @Column(name = "distance_km", nullable = false, precision = 5, scale = 2)
    private BigDecimal distanceKm;

    @Column(name = "location_label", length = 120)
    private String locationLabel;

    @Column(name = "daily_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyRate;

    @Column(name = "eta_label", length = 60)
    private String etaLabel;

    @Column(nullable = false, length = 20)
    private String status;

    public Asset() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAssetCode() { return assetCode; }
    public void setAssetCode(String assetCode) { this.assetCode = assetCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getHealthScore() { return healthScore; }
    public void setHealthScore(Integer healthScore) { this.healthScore = healthScore; }

    public BigDecimal getDistanceKm() { return distanceKm; }
    public void setDistanceKm(BigDecimal distanceKm) { this.distanceKm = distanceKm; }

    public String getLocationLabel() { return locationLabel; }
    public void setLocationLabel(String locationLabel) { this.locationLabel = locationLabel; }

    public BigDecimal getDailyRate() { return dailyRate; }
    public void setDailyRate(BigDecimal dailyRate) { this.dailyRate = dailyRate; }

    public String getEtaLabel() { return etaLabel; }
    public void setEtaLabel(String etaLabel) { this.etaLabel = etaLabel; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
