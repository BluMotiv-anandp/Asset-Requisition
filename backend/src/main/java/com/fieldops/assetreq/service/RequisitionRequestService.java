package com.fieldops.assetreq.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fieldops.assetreq.entity.Asset;
import com.fieldops.assetreq.entity.RequisitionRequest;
import com.fieldops.assetreq.repository.AssetRepository;
import com.fieldops.assetreq.repository.RequisitionRequestRepository;

/**
 * Service layer for RequisitionRequest operations.
 * Manages the creation and status transitions of requisition requests.
 */
@Service
public class RequisitionRequestService {

    private final RequisitionRequestRepository requestRepository;
    private final AssetRepository assetRepository;

    /** Constructor injection for both repositories */
    public RequisitionRequestService(RequisitionRequestRepository requestRepository,
                                     AssetRepository assetRepository) {
        this.requestRepository = requestRepository;
        this.assetRepository = assetRepository;
    }

    /** Returns all requisition requests */
    public List<RequisitionRequest> getAll() {
        return requestRepository.findAll();
    }

    /**
     * Creates a new requisition request for the given asset ID.
     *
     * @param assetId     the ID of the asset to request
     * @param requestedBy the name of the person making the request
     * @return the newly created request
     * @throws RuntimeException if the asset is not found
     */
    public RequisitionRequest create(Long assetId, String requestedBy) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found with id: " + assetId));
        RequisitionRequest request = new RequisitionRequest(asset, requestedBy);
        return requestRepository.save(request);
    }

    /**
     * Approves a pending requisition request by setting its status to APPROVED.
     *
     * @param id the ID of the request to approve
     * @return the updated request, or null if not found
     */
    public RequisitionRequest approve(Long id) {
        RequisitionRequest request = requestRepository.findById(id).orElse(null);
        if (request == null) {
            return null;
        }
        request.setStatus("APPROVED");
        return requestRepository.save(request);
    }

    /**
     * Rejects a pending requisition request by setting its status to REJECTED.
     *
     * @param id the ID of the request to reject
     * @return the updated request, or null if not found
     */
    public RequisitionRequest reject(Long id) {
        RequisitionRequest request = requestRepository.findById(id).orElse(null);
        if (request == null) {
            return null;
        }
        request.setStatus("REJECTED");
        return requestRepository.save(request);
    }
}
