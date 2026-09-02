package com.fieldops.assetreq;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Field Ops Asset Requisition application.
 * Scans all components under com.fieldops.assetreq package.
 */
@SpringBootApplication
public class AssetReqApplication {

    public static void main(String[] args) {
        SpringApplication.run(AssetReqApplication.class, args);
    }
}
