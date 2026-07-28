// ============================================================
// THESIS SATELLITE EXPLORER
// Landsat 9 | Sentinel-2 | MODIS NDVI — Interactive Comparison
// Study Area: Mula-Mutha River Basin (bounding box)
// ============================================================

// ---- Step 1: Study area ----
var aoi = /* color: #d63000 */ee.Geometry.Polygon(
        [[[73.38508860997929, 19.050383223329682],
          [73.38508860997929, 18.311454502934083],
          [74.24476878576054, 18.311454502934083],
          [74.24476878576054, 19.050383223329682]]], null, false);

// ---- Fresh map instance used throughout ----
var appMap = ui.Map();
appMap.centerObject(aoi, 8);
appMap.addLayer(aoi, {color: 'red'}, 'Study Area Boundary', true, 0.4);

// ---- Step 2: Preprocessing functions ----

// Landsat 9 cloud mask (QA_PIXEL bit-based)
function maskLandsat(image) {
  var qa = image.select('QA_PIXEL');
  var cloudBit = 1 << 3;
  var shadowBit = 1 << 4;
  var mask = qa.bitwiseAnd(cloudBit).eq(0).and(qa.bitwiseAnd(shadowBit).eq(0));
  var optical = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  return image.addBands(optical, null, true).updateMask(mask);
}

// Sentinel-2 cloud mask (SCL-based)
function maskS2(image) {
  var scl = image.select('SCL');
  var mask = scl.neq(3).and(scl.neq(8)).and(scl.neq(9))
               .and(scl.neq(10)).and(scl.neq(11));
  return image.updateMask(mask).multiply(0.0001)
    .copyProperties(image, ['system:time_start']);
}

// MODIS NDVI scaling + quality mask
function maskModis(image) {
  var ndvi = image.select('NDVI').multiply(0.0001);
  var qa = image.select('SummaryQA');
  var mask = qa.lte(1); // good + marginal quality
  return ndvi.updateMask(mask).copyProperties(image, ['system:time_start']);
}

// ---- Step 3: Dataset builder functions ----

function getLandsat(start, end, cloudLimit) {
  var col = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
    .filterBounds(aoi)
    .filterDate(start, end)
    .filter(ee.Filter.lt('CLOUD_COVER', cloudLimit))
    .map(maskLandsat);
  var composite = col.median().clip(aoi);
  return {image: composite, count: col.size()};
}

function getSentinel(start, end, cloudLimit) {
  var col = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(aoi)
    .filterDate(start, end)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', cloudLimit))
    .map(maskS2);
  var composite = col.median().clip(aoi);
  return {image: composite, count: col.size()};
}

function getModis(start, end) {
  var col = ee.ImageCollection('MODIS/061/MOD13Q1')
    .filterBounds(aoi)
    .filterDate(start, end)
    .map(maskModis);
  var composite = col.median().clip(aoi);
  return {image: composite, count: col.size(), collection: col};
}

// ---- Step 4: UI Panel ----

var titleLabel = ui.Label('Thesis Satellite Data Explorer', {fontWeight: 'bold', fontSize: '18px'});
var subtitleLabel = ui.Label('Mula-Mutha River Basin | M.Sc. Geoinformatics Thesis Area', {fontSize: '12px', color: '555555'});
var instructionLabel = ui.Label('Select a dataset, adjust dates and cloud threshold, then click Update map.',
  {fontSize: '11px', fontStyle: 'italic', color: '777777', margin: '4px 0 12px 0'});

var datasetSelect = ui.Select({
  items: ['Landsat 9', 'Sentinel-2', 'MODIS NDVI'],
  value: 'Sentinel-2',
  style: {stretch: 'horizontal'}
});

var startBox = ui.Textbox({value: '2024-06-01', style: {stretch: 'horizontal'}});
var endBox = ui.Textbox({value: '2025-05-31', style: {stretch: 'horizontal'}});

var cloudSlider = ui.Slider({min: 0, max: 80, value: 20, step: 5, style: {stretch: 'horizontal'}});

var statusLabel = ui.Label('Status: waiting for update...', {fontSize: '12px', color: '333333'});

var legendPanel = ui.Panel({style: {margin: '8px 0'}});

var chartPanel = ui.Panel({style: {margin: '8px 0'}});

var updateButton = ui.Button({
  label: 'Update map',
  style: {stretch: 'horizontal'}
});

// ---- NDVI legend builder ----
function buildNdviLegend() {
  legendPanel.clear();
  legendPanel.add(ui.Label('NDVI Legend', {fontWeight: 'bold', fontSize: '12px'}));
  var palette = ['d73027', 'fee08b', 'a6d96a', '1a9850'];
  var labels = ['Low / Bare (0)', 'Sparse', 'Moderate', 'Dense Vegetation (1)'];
  for (var i = 0; i < palette.length; i++) {
    var colorBox = ui.Label('', {backgroundColor: palette[i], padding: '8px', margin: '2px 6px 2px 0'});
    var label = ui.Label(labels[i], {fontSize: '11px', margin: '2px 0'});
    legendPanel.add(ui.Panel([colorBox, label], ui.Panel.Layout.Flow('horizontal')));
  }
}

// ---- Main update logic ----
function updateMap() {
  appMap.layers().reset();
  appMap.addLayer(aoi, {color: 'red'}, 'Study Area Boundary', true, 0.4);
  legendPanel.clear();
  chartPanel.clear();
  statusLabel.setValue('Status: processing...');

  var start = startBox.getValue();
  var end = endBox.getValue();
  var cloudLimit = cloudSlider.getValue();
  var dataset = datasetSelect.getValue();

  if (dataset === 'Landsat 9') {
    var result = getLandsat(start, end, cloudLimit);
    appMap.addLayer(result.image, {bands: ['SR_B4','SR_B3','SR_B2'], min: 0, max: 0.3}, 'Landsat 9 True Colour');
    result.count.evaluate(function(n) {
      statusLabel.setValue('Landsat 9 | ' + start + ' to ' + end + ' | Images used: ' + n);
    });

  } else if (dataset === 'Sentinel-2') {
    var result = getSentinel(start, end, cloudLimit);
    appMap.addLayer(result.image, {bands: ['B4','B3','B2'], min: 0, max: 0.3}, 'Sentinel-2 True Colour');
    result.count.evaluate(function(n) {
      statusLabel.setValue('Sentinel-2 | ' + start + ' to ' + end + ' | Images used: ' + n);
    });

  } else if (dataset === 'MODIS NDVI') {
    var result = getModis(start, end);
    var ndviVis = {min: 0, max: 1, palette: ['d73027','fee08b','a6d96a','1a9850']};
    appMap.addLayer(result.image, ndviVis, 'MODIS NDVI');
    buildNdviLegend();

    result.count.evaluate(function(n) {
      statusLabel.setValue('MODIS NDVI | ' + start + ' to ' + end + ' | Composites used: ' + n);
    });

    // Time series chart
   var ndviChart = ui.Chart.image.series({
      imageCollection: result.collection.select('NDVI'),
      region: aoi,
      reducer: ee.Reducer.mean(),
      scale: 250
    }).setOptions({
      title: 'Mean MODIS NDVI Time Series',
      hAxis: {title: 'Date'},
      vAxis: {title: 'NDVI', minValue: 0, maxValue: 1},
      lineWidth: 2,
      colors: ['1a9850'],
      interpolateNulls: true
    });
    chartPanel.add(ndviChart);
  }

  appMap.centerObject(aoi, 8);
}

updateButton.onClick(updateMap);

// ---- Assemble control panel ----
var controlPanel = ui.Panel({
  widgets: [
    titleLabel,
    subtitleLabel,
    instructionLabel,
    ui.Label('Dataset', {fontWeight: 'bold', fontSize: '12px', margin: '8px 0 2px 0'}),
    datasetSelect,
    ui.Label('Start date (YYYY-MM-DD)', {fontWeight: 'bold', fontSize: '12px', margin: '8px 0 2px 0'}),
    startBox,
    ui.Label('End date (YYYY-MM-DD)', {fontWeight: 'bold', fontSize: '12px', margin: '8px 0 2px 0'}),
    endBox,
    ui.Label('Cloud limit (%)', {fontWeight: 'bold', fontSize: '12px', margin: '8px 0 2px 0'}),
    cloudSlider,
    updateButton,
    statusLabel,
    legendPanel,
    chartPanel,
    ui.Label('Data: USGS Landsat 9, ESA Copernicus Sentinel-2, NASA MODIS (via Google Earth Engine)',
      {fontSize: '10px', color: '999999', margin: '16px 0 0 0'}),
    ui.Label('Your Full Name | M.Sc. Geoinformatics | BVIEER', {fontSize: '10px', color: '999999'})
  ],
  style: {width: '320px'},
  layout: ui.Panel.Layout.flow('vertical')
});

ui.root.clear();
ui.root.add(ui.SplitPanel({
  firstPanel: controlPanel,
  secondPanel: appMap,
  orientation: 'horizontal',
  wipe: false,
  style: {stretch: 'both'}
}));

// Initial load
updateMap();