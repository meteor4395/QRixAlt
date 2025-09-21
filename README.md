# QRixAlt

# PROBLEM STATEMENT
## Background

Indian Railways procures about 10 crore Elastic Rail Clips, 5 crore liners, and 8.5 crore rail pads annually. There is currently no system for identification of these track fittings—i.e., elastic rail clips, rail pads, liners—and sleepers, with integration to the UDM portal enabling mobile-based scanning for vendor lot number, date of supply, warranty period, inspection dates, etc. This gap is critical for quality assessment and performance management of fittings.

## Description

This problem statement envisages a unified system for laser-based QR code marking on track fittings to enable mobile scanning and identification of elastic rail clips, rail pads, liners, and sleepers, along with integration to the UDM (User Depot Module) on www.ireps.gov.in and the TMS (Track Management System) on www.irecept.gov.in. With the use of AI, the system should extract all essential details of each fitting item, including inspections at all stages—from manufacturing and supply to in-service performance—and pinpoint exceptions for quality monitoring. Laser-based QR codes are already prevalent in other industries.

## Expected Solution

Innovative solutions are invited through Smart India Hackathon 2025 to develop and implement a system addressing identification of bulk supply materials, their performance issues, and effective inventory management and quality monitoring actions for safety performance of fittings.

• Hardware Solution: Design and implement laser-based QR code imprints on bulk supply items of track fittings and sleepers.
• Software Solution: Develop QR code linkage and integrate with the UDM and TMS portals; enable mobile scans to generate AI-based reports related to vendor, supply, warranty, inspections, and support inventory management, etc.

# WORKING

1. QR Marking

Each fitting (ERCs, pads, liners, sleepers, etc.) is laser-engraved with a unique, durable QR code.

Deep laser engraving, protective coatings, or ceramic tag inserts ensure readability in harsh railway environments.

Each QR code encodes a unique ID linked to the fitting’s batch and vendor.

2. Registration & Data Link

At the time of production, each QR is registered in the system and linked to a digital asset profile.

The profile contains vendor details, batch information, inspection records, warranty period, and quality certifications.

This establishes a digital twin of each physical fitting.

3. Scanning in Field Operations

During inspections, installation, or maintenance, staff use rugged mobile or handheld scanners to read the QR code.

Scans update the fitting’s status (installed, replaced, under warranty claim, etc.) in real time.

Mobile apps can work in offline mode and sync data once connected.

4. Data Flow & Middleware

Scanned data first syncs with a local database or depot-level middleware.

Middleware enables smooth rollout even in locations with limited connectivity.

Later, the system connects to central UDM (Unified Data Management) and TMS (Track Management System) portals via APIs for seamless integration.

5. Analytics & Monitoring

Dashboards display defect patterns, vendor performance, and warranty claims.

Predictive analytics highlight recurring issues (e.g., vendor defects, premature wear).

Decision-makers get insights for procurement, vendor evaluation, and preventive maintenance.

6. Security & Validation

QR payloads are encrypted to prevent tampering or duplication.

Each scan is validated against the central database to ensure authenticity.

Audit logs are maintained for traceability of all fitting movements and lifecycle events.

# TECH STACK
1. Frontend

Web UI: HTML, CSS, JavaScript (lightweight, mobile-friendly).

QR Scanning: jsQR / Zxing JS for camera-based scanning.

Styling: TailwindCSS / Bootstrap for responsive layouts.

Visualization: Chart.js / Recharts for reports and dashboards.

2. Backend

Framework: Python Flask / FastAPI for REST APIs.

Database: SQLite / PostgreSQL for item & scan records.

ORM: SQLAlchemy for data models.

AI Engine: Rule-based analysis (expandable to ML with scikit-learn).

Integration: API stubs for UDM and TMS systems.

Deployment: Docker for portability, scalable to cloud.

3. Hardware

Laser Engraving: Fiber laser (metal parts), CO₂ laser (polymer/sleeper).

QR Specs: Vector QR (SVG, 8–12 mm, high-contrast, durable).

Devices: Android/iOS smartphones or rugged handheld scanners.