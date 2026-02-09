// Script to generate accurate world map data from Natural Earth GeoJSON
// Fetches ne_110m_land.geojson and rasterizes to a compact bitmap

const https = require('https');
const fs = require('fs');
const path = require('path');

const URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson';

// Resolution: 2° per cell
const COLS = 180; // longitude -180 to +178 (step 2°)
const ROWS = 90; // latitude +90 to -88 (step 2°)

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(JSON.parse(data)));
      })
      .on('error', reject);
  });
}

// Ray-casting point-in-polygon test
function pointInPolygon(lat, lng, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0],
      yi = ring[i][1]; // [lng, lat] in GeoJSON
    const xj = ring[j][0],
      yj = ring[j][1];

    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// Check if a point is on land given all polygon rings
function isOnLand(lat, lng, polygons) {
  for (const poly of polygons) {
    // First ring is exterior, rest are holes
    const exterior = poly[0];
    if (pointInPolygon(lat, lng, exterior)) {
      // Check holes
      let inHole = false;
      for (let h = 1; h < poly.length; h++) {
        if (pointInPolygon(lat, lng, poly[h])) {
          inHole = true;
          break;
        }
      }
      if (!inHole) return true;
    }
  }
  return false;
}

async function main() {
  console.log('Fetching Natural Earth 110m land data...');
  const geojson = await fetchJSON(URL);

  // Extract all polygon rings
  const polygons = [];
  for (const feature of geojson.features) {
    if (feature.geometry.type === 'Polygon') {
      polygons.push(feature.geometry.coordinates);
    } else if (feature.geometry.type === 'MultiPolygon') {
      for (const poly of feature.geometry.coordinates) {
        polygons.push(poly);
      }
    }
  }
  console.log(`Extracted ${polygons.length} polygons`);

  // Create bitmap
  const bitmap = new Uint8Array(ROWS * COLS);
  let landCount = 0;

  for (let row = 0; row < ROWS; row++) {
    const lat = 90 - row * 2 - 1; // center of cell
    for (let col = 0; col < COLS; col++) {
      const lng = -180 + col * 2 + 1; // center of cell
      if (isOnLand(lat, lng, polygons)) {
        bitmap[row * COLS + col] = 1;
        landCount++;
      }
    }
  }

  console.log(
    `Land cells: ${landCount}/${ROWS * COLS} (${((landCount / (ROWS * COLS)) * 100).toFixed(1)}%)`,
  );

  // Verify key locations
  const tests = [
    { name: 'Manta, Ecuador', lat: -0.95, lng: -80.73 },
    { name: 'New York', lat: 40.71, lng: -74.01 },
    { name: 'London', lat: 51.51, lng: -0.13 },
    { name: 'Tokyo', lat: 35.69, lng: 139.69 },
    { name: 'Sydney', lat: -33.87, lng: 151.21 },
    { name: 'São Paulo', lat: -23.55, lng: -46.63 },
    { name: 'Pacific Ocean', lat: 0, lng: -150 },
    { name: 'Atlantic Ocean', lat: 30, lng: -40 },
  ];

  for (const t of tests) {
    const row = Math.floor((90 - t.lat) / 2);
    const col = Math.floor((t.lng + 180) / 2);
    const val = bitmap[row * COLS + col];
    console.log(
      `  ${t.name} (${t.lat}, ${t.lng}) → row=${row}, col=${col} → ${val ? 'LAND' : 'WATER'}`,
    );
  }

  // Encode as hex string (each hex digit = 4 cells)
  // 180 cols per row / 4 = 45 hex chars per row
  const hexRows = [];
  for (let row = 0; row < ROWS; row++) {
    let hexStr = '';
    for (let i = 0; i < COLS; i += 4) {
      let nibble = 0;
      for (let b = 0; b < 4; b++) {
        if (i + b < COLS && bitmap[row * COLS + i + b]) {
          nibble |= 8 >> b;
        }
      }
      hexStr += nibble.toString(16);
    }
    hexRows.push(hexStr);
  }

  // Generate TypeScript file
  const tsContent = `// Auto-generated world map data from Natural Earth 110m
// Resolution: 2° per cell (${COLS} columns × ${ROWS} rows)
// Each hex character represents 4 cells (1 = land, 0 = water)
// Rows go from 90°N (top) to -88°S (bottom)
// Columns go from -180°W (left) to +178°E (right)

const WORLD_MAP_HEX = [
${hexRows.map((r) => `  '${r}'`).join(',\n')}
];

const COLS = ${COLS};
const ROWS = ${ROWS};

// Decoded bitmap cache
let decodedMap: Uint8Array | null = null;

function decodeMap(): Uint8Array {
  if (decodedMap) return decodedMap;
  decodedMap = new Uint8Array(ROWS * COLS);
  for (let row = 0; row < ROWS; row++) {
    const hex = WORLD_MAP_HEX[row];
    for (let i = 0; i < hex.length; i++) {
      const nibble = parseInt(hex[i], 16);
      const col = i * 4;
      if (nibble & 8) decodedMap[row * COLS + col] = 1;
      if (nibble & 4) decodedMap[row * COLS + col + 1] = 1;
      if (nibble & 2) decodedMap[row * COLS + col + 2] = 1;
      if (nibble & 1) decodedMap[row * COLS + col + 3] = 1;
    }
  }
  return decodedMap;
}

/**
 * Check if a coordinate is on land using Natural Earth 110m data.
 * @param lat Latitude in degrees (-90 to 90)
 * @param lng Longitude in degrees (-180 to 180)
 * @returns true if the coordinate is on land
 */
export function isLand(lat: number, lng: number): boolean {
  const map = decodeMap();
  const row = Math.floor((90 - lat) / 2);
  const col = Math.floor((lng + 180) / 2);
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return false;
  return map[row * COLS + col] === 1;
}
`;

  const outputPath = path.join(
    __dirname,
    '..',
    'src',
    'app',
    'shared',
    'components',
    'globe',
    'world-map-data.ts',
  );
  fs.writeFileSync(outputPath, tsContent, 'utf8');
  console.log(`\nGenerated: ${outputPath}`);
  console.log(`File size: ${(tsContent.length / 1024).toFixed(1)} KB`);
}

main().catch(console.error);
