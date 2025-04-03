# Constituent Circle - Product Requirements Document (PRD): Representative District Management

**Version:** 1.0  
**Date:** 2025-03-30  

## 1. Introduction

This PRD focuses on the Representative District Management feature of Constituent Circle, a critical component for connecting constituents to their elected representatives. Initially, this feature will leverage the best available public data sources and APIs to define and manage districts and representative data across federal, state, and local levels in the U.S. However, with key APIs like the Google Civic Information API retiring (April 30, 2025), a sustainable long-term solution is needed. This PRD outlines a phased approach: starting with public APIs and datasets, then transitioning to an in-house database updated via a Wikipedia-style crowdsourced model with hierarchical permissions, ensuring high accuracy and fast updates over time.

## 2. Goals

- **Short-Term Accuracy and Coverage**: Utilize the most reliable public sources and APIs to define representative districts and populate representative data until April 30, 2025.
- **Long-Term Sustainability**: Transition to an in-house database with a crowdsourced update mechanism, moderated by hierarchical permissions, to maintain high accuracy and rapid updates post-API retirements.
- **User Empowerment**: Enable constituents to identify their representatives accurately based on address or geolocation.
- **Scalability**: Support all U.S. jurisdictions (federal, state, local) with a system that scales as new data emerges (e.g., post-election changes, redistricting).
- **Resilience**: Mitigate risks from retiring APIs (e.g., Google Civic) by building a self-sufficient data ecosystem.

## 3. User Roles & Personas

- **Constituent**: Needs accurate district and representative info based on their address.
- **Representative**: Requires up-to-date district assignments and contact details in their profile.
- **Administrator**: Manages system settings, oversees data integrity, and assigns permissions.
- **Moderator (Company Personnel)**: Reviews and approves crowdsourced updates, with tiered permissions.
- **Community Contributor**: Submits updates or corrections to district/representative data (public user with basic access).

## 4. Features

### 4.1 Phase 1: Public Sources & APIs (Through April 30, 2025)

#### Known Public Sources and APIs
The following are identified public sources and APIs for district and representative data, with notes on availability and sunset dates where applicable:

1. **Google Civic Information API**  
   - **Description**: Provides representative info and district mappings by address (federal, state, local).  
   - **Status**: Retiring April 30, 2025 (per Google announcement).  
   - **Coverage**: Near 100% for federal/state/county; 90%+ for state legislative; best-effort local.  
   - **Use**: Primary source until retirement; leverage `representativeInfoByAddress` endpoint.

2. **Open States API**  
   - **Description**: Aggregates state legislative data (districts, representatives) across 50 states.  
   - **Status**: Active, free, open-source (Sunlight Foundation).  
   - **Coverage**: State-level only; no federal or comprehensive local data.  
   - **Use**: Secondary source for state data; supplement Google Civic.

3. **USgeocoder API**  
   - **Description**: Real-time district and official data by address (federal, state, local).  
   - **Status**: Active, subscription-based post-trial.  
   - **Coverage**: Comprehensive across levels; includes GIS-based boundaries.  
   - **Use**: Backup for Google Civic; test during Phase 1.

4. **Ballotpedia**  
   - **Description**: Crowd-edited wiki with district and elected official data (all levels).  
   - **Status**: Active, public, no API (scraping or manual export needed).  
   - **Coverage**: Broad but not real-time; community-driven updates.  
   - **Use**: Initial data dump and validation source.

5. **GovTrack API**  
   - **Description**: Federal legislative data (districts, members, votes).  
   - **Status**: Active, free, replaces parts of Sunlight Congress API.  
   - **Coverage**: Federal only; no state or local.  
   - **Use**: Federal data source post-Google Civic.

6. **ProPublica Congress API**  
   - **Description**: Detailed federal legislative data (members, votes).  
   - **Status**: Active, free for non-commercial use.  
   - **Coverage**: Federal only.  
   - **Use**: Federal representative details.

7. **Voting Information Project (VIP)**  
   - **Description**: Election and district data via partnership with states (used by Google Civic).  
   - **Status**: Active, no direct public API (feeds Google Civic).  
   - **Coverage**: Varies by state participation.  
   - **Use**: Indirect via Google Civic until April 2025.

8. **Census Bureau (TIGER/Line Shapefiles)**  
   - **Description**: Geospatial district boundaries (federal, state, local).  
   - **Status**: Active, free, updated post-Census (e.g., 2020 redistricting).  
   - **Coverage**: Structural data, no real-time officials.  
   - **Use**: Static boundary data for in-house mapping.

9. **DNC Elected Officials Roster (GitHub)**  
   - **Description**: CSV files with federal/state officials.  
   - **Status**: Active, manually updated, public.  
   - **Coverage**: Federal and state; no local.  
   - **Use**: Initial population or validation.

10. **Local Government Websites (.gov)**  
    - **Description**: Individual county/city sites with official data.  
    - **Status**: Active, fragmented, no API.  
    - **Coverage**: Local only, varies by jurisdiction.  
    - **Use**: Manual aggregation for gaps.

#### Core Features (Phase 1)
- **District Lookup**: Use Google Civic API (`representativeInfoByAddress`) to match user addresses to districts and representatives (until April 30, 2025).  
- **Data Caching**: Store API responses in Convex for speed and redundancy.  
- **Fallback Sources**: Integrate Open States and USgeocoder APIs for state/local data as Google Civic winds down.  
- **Initial Population**: Import static data from Ballotpedia, Census TIGER files, and DNC Roster for baseline coverage.

### 4.2 Phase 2: Long-Term Crowdsourced Solution (Post-April 30, 2025)

#### Core Features (Phase 2)
- **In-House Database**:  
  - Store district boundaries (e.g., ZIP lists, simplified polygons) and representative data (name, contact, term) in Convex.  
  - Seed with Phase 1 cached data and public exports (e.g., Census, Ballotpedia).  
- **Crowdsourced Updates**:  
  - Public users (Community Contributors) submit changes (e.g., new election results, contact updates) via a web form.  
  - Submissions enter a review queue visible to Moderators.  
- **Hierarchical Permissions**:  
  - **Level 1 - Community Contributor**: Submit updates; no approval power.  
  - **Level 2 - Junior Moderator**: Company personnel; approve minor updates (e.g., contact info).  
  - **Level 3 - Senior Moderator**: Company personnel; approve major updates (e.g., district boundaries post-redistricting).  
  - **Level 4 - Administrator**: Full control; assign permissions, override decisions.  
- **Validation Workflow**:  
  - Cross-check submissions against multiple sources (e.g., .gov sites, USgeocoder).  
  - Require 2+ Moderator approvals for major changes (e.g., boundary shifts).  
  - Log all changes with timestamps and user IDs for auditability.  
- **Real-Time Updates**: Push approved changes to Convex for instant availability.  
- **Accuracy Metrics**: Track update accuracy (e.g., % verified against official sources) and update speed (time from submission to approval).  

#### Technical Features
- **API Replacement**: Build a custom endpoint (e.g., `/districts/byAddress`) using the in-house database, mimicking Google Civic’s functionality.  
- **Geospatial Support**: Integrate Census TIGER shapefiles for boundary precision, updated via crowdsourcing.  
- **Notification System**: Alert Moderators of pending reviews; notify Contributors of approval/rejection.

## 5. Design & UX

- **Phase 1**: Simple address input field returns district/representative info (leverages existing dashboard UI).  
- **Phase 2**: Add a “Suggest Update” button on representative profiles, linking to a submission form. Moderator dashboard shows review queue with status filters (Pending, Approved, Rejected).  
- **Accuracy Indicators**: Display a “Last Updated” timestamp and “Verified By” tag on data.

## 6. Technical Stack

- **Phase 1**: Next.js (frontend), Convex (backend/database), Google Civic/Open States/USgeocoder APIs.  
- **Phase 2**: Add custom Node.js scripts for data validation, PostgreSQL (optional) for geospatial queries alongside Convex, and a queue system (e.g., Redis) for review workflows.

## 7. Non-Functional Requirements

- **Accuracy**: Target 98%+ district assignment accuracy (benchmarked against Google Civic pre-retirement).  
- **Update Speed**: Process crowdsourced updates within 24 hours for minor changes, 72 hours for major ones.  
- **Scalability**: Handle 10,000+ daily lookups and 1,000+ monthly submissions.  
- **Security**: Encrypt user-submitted data; restrict Moderator access via RBAC.

## 8. Timeline

- **Phase 1 (Now - April 30, 2025)**:  
  - Q2 2025: Integrate Google Civic, Open States, USgeocoder; cache data in Convex.  
  - Q3 2025: Test fallbacks and seed database with public exports.  
- **Phase 2 (May 2025 Onward)**:  
  - Q2 2025: Design crowdsourcing UI and permission system.  
  - Q3 2025: Launch beta with limited Contributors; refine based on feedback.  
  - Q4 2025: Scale to full public access, optimize update speed.

## 9. Success Metrics

- **Phase 1**: 100% coverage of federal/state districts; 90%+ local coverage by April 2025.  
- **Phase 2**: 95%+ update approval accuracy; average update latency <48 hours within 6 months of launch.

## 10. Open Questions

- Which additional APIs (e.g., Cicero) should be tested as Google Civic alternatives?  
- How will we incentivize Community Contributors (e.g., badges, recognition)?  
- What geospatial tools will best support boundary management long-term?

---

This PRD provides a clear roadmap: maximizing existing APIs like Google Civic until their sunset, then pivoting to a robust, community-driven system that ensures Constituent Circle remains accurate and up-to-date indefinitely. Let me know if you'd like to dive deeper into any section!