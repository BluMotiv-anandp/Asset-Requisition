package com.fieldops.assetreq.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fieldops.assetreq.entity.RequisitionRequest;

/**
 * Spring Data JPA repository for RequisitionRequest entities.
 * Provides standard CRUD operations for requisition requests.
 */
public interface RequisitionRequestRepository extends JpaRepository<RequisitionRequest, Long> {
}
