package com.fieldops.assetreq.controller;

import java.util.Map;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fieldops.assetreq.entity.RequisitionRequest;
import com.fieldops.assetreq.service.RequisitionRequestService;

/**
 * REST controller for Requisition Request operations.
 * All routes are prefixed with /api/requests.
 */
@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:3000")
public class RequisitionRequestController {

    private final RequisitionRequestService requestService;

    /** Constructor injection */
    public RequisitionRequestController(RequisitionRequestService requestService) {
        this.requestService = requestService;
    }

    /** GET /api/requests — returns all requisition requests */
    @GetMapping
    public List<RequisitionRequest> getAllRequests() {
        return requestService.getAll();
    }

    /**
     * POST /api/requests — creates a new requisition request.
     * Expects JSON body: { "assetId": number, "requestedBy": string }
     */
    @PostMapping
    public ResponseEntity<RequisitionRequest> createRequest(
            @RequestBody Map<String, Object> body) {
        try {
            Long assetId = Long.valueOf(body.get("assetId").toString());
            String requestedBy = body.getOrDefault("requestedBy", "anonymous").toString();
            RequisitionRequest request = requestService.create(assetId, requestedBy);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /** PUT /api/requests/{id}/approve — approves a pending request */
    @PutMapping("/{id}/approve")
    public ResponseEntity<RequisitionRequest> approveRequest(@PathVariable Long id) {
        RequisitionRequest updated = requestService.approve(id);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    /** PUT /api/requests/{id}/reject — rejects a pending request */
    @PutMapping("/{id}/reject")
    public ResponseEntity<RequisitionRequest> rejectRequest(@PathVariable Long id) {
        RequisitionRequest updated = requestService.reject(id);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
}
