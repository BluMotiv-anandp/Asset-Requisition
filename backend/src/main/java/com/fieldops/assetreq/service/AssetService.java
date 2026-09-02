package com.fieldops.assetreq.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fieldops.assetreq.entity.Asset;
import com.fieldops.assetreq.repository.AssetRepository;

/**
 * Service layer for Asset operations.
 * Uses constructor injection to obtain the repository dependency.
 */
@Service
public class AssetService {

    private final AssetRepository assetRepository;

    /** Constructor injection — the preferred approach in modern Spring */
    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    /** Returns all assets from the database */
    public List<Asset> getAll() {
        return assetRepository.findAll();
    }

    /** Searches assets by name using a case-insensitive partial match */
    public List<Asset> searchByName(String name) {
        return assetRepository.findByNameContainingIgnoreCase(name);
    }

    /** Finds a single asset by its ID; returns null if not found */
    public Asset getById(Long id) {
        return assetRepository.findById(id).orElse(null);
    }
}
