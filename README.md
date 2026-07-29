# Datasets — Interactive Satellite Data Explorer

An interactive web app comparing three satellite sensors — **Landsat 9**, **Sentinel-2**, and **MODIS** — over the Mula-Mutha river basin, Pune. The app lets users toggle between true-colour composites and a MODIS NDVI time series to compare surface conditions across different resolutions and revisit frequencies.

## Links

- **GEE App**: [Datasets](https://degrasskob.projects.earthengine.app/view/datasets)
- **GitHub Repository**: [Smiley1Go/GEE at Exercise_2](https://github.com/Smiley1Go/GEE/tree/Exercise_2)
- **GitHub Pages**: [Datasets.html](https://smiley1go.github.io/Works_GEE/Datasets.html)

## Overview

This app overlays satellite imagery on the Mula-Mutha basin so that surface conditions can be compared across sensors with different spatial resolutions and revisit intervals. Layer toggles inside the embedded map switch between true-colour composites and the MODIS NDVI time series, while the side panel provides project info and per-sensor details through a tabbed interface.

### Area of Interest

| Field | Value |
|---|---|
| River basin | Mula-Mutha |
| City | Pune, Maharashtra |
| Centroid | 18.52° N, 73.86° E |
| Time window | Jun 2024 – May 2025 |

## Datasets & Processing

| Dataset | Collection ID | Resolution | Processing |
|---|---|---|---|
| Landsat 9 SR | `LANDSAT/LC09/C02/T1_L2` | 30 m | QA_PIXEL cloud/shadow mask · scale 0.0000275, offset −0.2 · SR_B4/B3/B2, true colour, 0–0.3 |
| Sentinel-2 SR | `COPERNICUS/S2_SR_HARMONIZED` | 10–20 m | SCL cloud/shadow mask · scale 0.0001 · B4/B3/B2, true colour, 0–0.3 |
| MODIS Vegetation Indices | `MODIS/061/MOD13Q1` | 250 m, 16-day | SummaryQA mask (good/marginal only) · NDVI scale 0.0001, 0–1 |

## Interpretation

- **Sentinel-2** (10–20 m) resolves field boundaries, riverbanks, and built-up patches within Pune city — the most useful layer for spotting localized surface conditions relevant to flood-prone zones.
- **Landsat 9** (30 m) offers a coarser but historically consistent cross-check against Sentinel-2.
- **MODIS NDVI** (250 m, 16-day) is too coarse for parcel-level detail but well suited to tracking basin-wide vegetation response across the monsoon cycle, showing a clear seasonal rise and fall through pre-monsoon, monsoon, and post-monsoon periods.

Together, these products illustrate how scale choice shapes what can and cannot be observed in flood hazard analysis.

## App Features

- Embedded, full-height Earth Engine app iframe (70% width) alongside a tabbed info panel (30% width)
- Four tabs: **Project Info**, **Landsat 9**, **Sentinel-2**, **MODIS**
- Layer toggles inside the map for switching between sensors and the NDVI time series
- Per-sensor band details, processing notes, and dataset catalogue links

## Data Sources & Credits

- Landsat 9 Collection 2 Level 2 — USGS / NASA ([catalogue](https://developers.google.com/earth-engine/datasets/catalog/LANDSAT_LC09_C02_T1_L2))
- Sentinel-2 SR Harmonized — ESA / Copernicus ([catalogue](https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED))
- MOD13Q1.061 Vegetation Indices — NASA LP DAAC / MODIS Terra ([catalogue](https://developers.google.com/earth-engine/datasets/catalog/MODIS_061_MOD13Q1))
- Processing and visualization: Google Earth Engine

## Author

Designed & developed by **Joshby Joshy**, for the Geospatial Big Data Analysis coursework.
