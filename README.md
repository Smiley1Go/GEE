# Interactive Satellite Data Explorer

An interactive Google Earth Engine application for comparing Landsat 9, Sentinel-2, and MODIS vegetation data over the Mula-Mutha River Basin, Pune — built to support thesis analysis of land surface conditions relevant to urban flood hazard assessment.

## Purpose

This tool allows a visitor to switch between three satellite data products over the thesis study area, adjust the date range and cloud-cover threshold, and view the resulting composite alongside a MODIS NDVI time series — helping communicate how sensor choice and spatial/temporal scale affect what can be observed for flood-hazard-relevant land surface monitoring.

## Study area

Mula-Mutha River Basin, Pune, Maharashtra, India.

## Datasets

| Dataset | Collection | Resolution |
|---|---|---|
| Landsat 9 Surface Reflectance | `LANDSAT/LC09/C02/T1_L2` | 30 m |
| Sentinel-2 Surface Reflectance (Harmonized) | `COPERNICUS/S2_SR_HARMONIZED` | 10–20 m |
| MODIS Terra Vegetation Indices | `MODIS/061/MOD13Q1` | 250 m, 16-day |

Default date range: 1 June 2024 – 31 May 2025 (adjustable within the app). Cloud-cover threshold is adjustable via slider (default 20%).

## Links

- **Earth Engine App:** https://degrasskob.projects.earthengine.app/view/datasets
- **Repository (this branch):** https://github.com/Smiley1Go/Works_GEE/tree/Exercise_2
- **GitHub Pages:** https://smiley1go.github.io/Works_GEE/

## Author

Joshby Joshy · M.Sc. Geoinformatics, Semester III

## Last updated

Update this line with the date of your most recent commit/test.

## Public acceptance test results

| # | Test | Result |
|---|---|---|
| 1 | GitHub Pages URL loads (no 404/permission/blank page) | ☐ |
| 2 | Earth Engine map appears (embedded + fallback both work) | ☐ |
| 3 | Dataset selector works (all three products display) | ☐ |
| 4 | Controls change the result (dates/cloud threshold update layers/chart) | ☐ |
| 5 | Mobile layout remains usable | ☐ |
| 6 | Sources are inspectable (repo + App links present) | ☐ |

*Tested in a private/incognito browser window on: (add date)*

## Repository contents

- `index.html` — project webpage embedding the published Earth Engine App
- `script.js` — Earth Engine script source (backup reference; the read-only Code Editor link is the primary reference for evaluation)

## Data attribution

- Landsat 9 Collection 2 Level 2 — USGS / NASA
- Sentinel-2 Surface Reflectance Harmonized — ESA / Copernicus
- MOD13Q1.061 Vegetation Indices — NASA LP DAAC
- Processing and visualization via Google Earth Engine
