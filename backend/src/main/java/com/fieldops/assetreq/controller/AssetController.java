package com.fieldops.assetreq.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fieldops.assetreq.entity.Asset;
import com.fieldops.assetreq.service.AssetService;

/**
 * REST controller for Asset-related endpoints.
 * All routes are prefixed with /api/assets.
 */
@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    /** Constructor injection */
    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    /** GET /api/assets — returns all assets */
    @GetMapping
    public List<Asset> getAllAssets() {
        return assetService.getAll();
    }

    /** GET /api/assets/search?q={query} — searches assets by name */
    @GetMapping("/search")
    public List<Asset> searchAssets(@RequestParam(name = "q") String query) {
        return assetService.searchByName(query);
    }

    /** GET /api/assets/{id} — returns a single asset by ID */
    @GetMapping("/{id}")
    public ResponseEntity<Asset> getAssetById(@PathVariable Long id) {
        Asset asset = assetService.getById(id);
        if (asset == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(asset);
    }
}
