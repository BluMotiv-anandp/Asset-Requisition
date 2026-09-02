package com.fieldops.assetreq.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fieldops.assetreq.entity.Asset;

/**
 * Spring Data JPA repository for Asset entities.
 * Provides CRUD operations and a case-insensitive search by name.
 */
public interface AssetRepository extends JpaRepository<Asset, Long> {

    /**
     * Finds assets whose name contains the given query string, case-insensitive.
     *
     * @param name the search query to match against asset names
     * @return list of matching assets
     */
    List<Asset> findByNameContainingIgnoreCase(String name);
}
