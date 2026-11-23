import fs from 'fs'
import path from 'path'

const csvRaw = fs.readFileSync('scripts/kabupaten-coordinates.csv', 'utf8').trim().split('\n')
const csvList = []

for (let i = 1; i < csvRaw.length; i++) {
  const line = csvRaw[i].trim()
  if (!line) continue
  const parts = line.split(',')
  csvList.push({
    rawId: parts[0],
    cleanId: parts[0].replace(/\./g, ''),
    name: parts[1],
    provId: parts[2],
    lat: parseFloat(parts[3]),
    lng: parseFloat(parts[4])
  })
}

const defaultCitiesPath = path.resolve('src/lib/default-cities.ts')
const content = fs.readFileSync(defaultCitiesPath, 'utf8')
const startMarker = 'export const DEFAULT_CITIES: City[] = ['
const startIdx = content.indexOf(startMarker)
if (startIdx === -1) {
  throw new Error('Could not find start marker in default-cities.ts')
}
const prefix = content.slice(0, startIdx + startMarker.length - 1)
const jsonStr = content.slice(startIdx + startMarker.length - 1).trim().replace(/;$/, '')
const cities = JSON.parse(jsonStr)

function clean(s) {
  return s.toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/^kabupaten\s+administrasi\s+/i, '')
    .replace(/^kota\s+administrasi\s+/i, '')
    .replace(/^kabupaten\s+/i, '')
    .replace(/^kota\s+/i, '')
    .replace(/\bdan\b/g, '')
    .replace(/pahuwato/g, 'pohuwato')
    .replace(/[^a-z0-9]/g, '')
}

// Curated municipal/regency centers & missing OSM coordinates
const curatedOverrides = {
  '3517': { lat: -7.5459, lng: 112.2331 }, // Jombang Alun-alun
  '3523': { lat: -6.8967, lng: 112.0447 }, // Tuban Alun-alun
  '3516': { lat: -7.5488, lng: 112.4578 }, // Kab Mojokerto
  '35105': { lat: -7.4726, lng: 112.4385 }, // Kota Mojokerto
  '3518': { lat: -7.6047, lng: 111.9045 }, // Nganjuk
  '3522': { lat: -7.1502, lng: 111.8817 }, // Bojonegoro
  '3524': { lat: -7.1199, lng: 112.4158 }, // Lamongan
  '3525': { lat: -7.1595, lng: 112.6517 }, // Gresik
  '3515': { lat: -7.4478, lng: 112.7183 }, // Sidoarjo
  '3514': { lat: -7.6453, lng: 112.9075 }, // Pasuruan
  '7109': { lat: 2.7483, lng: 125.3958 }, // Siau Tagulandang Biaro (Ondong Siau)
  '7504': { lat: 0.7098, lng: 121.5958 }, // Pohuwato (Marisa)
  '8103': { lat: -7.9849, lng: 131.3044 }, // Kepulauan Tanimbar (Saumlaki)
}

let updatedCount = 0
const updatedCities = cities.map(c => {
  if (curatedOverrides[c.id]) {
    updatedCount++
    return {
      ...c,
      latitude: curatedOverrides[c.id].lat,
      longitude: curatedOverrides[c.id].lng
    }
  }
  if (c.tier === 1) {
    return c
  }
  const normC = clean(c.name)
  const found = csvList.find(x => clean(x.name) === normC && x.provId === c.province_id) ||
                csvList.find(x => clean(x.name) === normC)
  if (found) {
    updatedCount++
    return {
      ...c,
      latitude: Number(found.lat.toFixed(6)),
      longitude: Number(found.lng.toFixed(6))
    }
  }
  return c
})

console.log(`Matched and updated ${updatedCount} cities out of ${updatedCities.length}`)

// 1. Write updated default-cities.ts
const updatedFileContent = prefix + JSON.stringify(updatedCities, null, 2) + '\n'
fs.writeFileSync(defaultCitiesPath, updatedFileContent, 'utf8')
console.log('Updated src/lib/default-cities.ts')

// 2. Generate SQL patch file
const sqlValues = updatedCities.map(c => `  ('${c.id}', ${c.latitude.toFixed(6)}, ${c.longitude.toFixed(6)})`).join(',\n')
const sqlContent = `-- Migration 0010: Update all 514 Indonesian Cities with Authentic Geographic Coordinates
UPDATE cities AS c SET
    latitude = v.latitude,
    longitude = v.longitude,
    geom = ST_SetSRID(ST_MakePoint(v.longitude, v.latitude), 4326),
    updated_at = now()
FROM (VALUES
${sqlValues}
) AS v(id, latitude, longitude)
WHERE c.id = v.id;
`

fs.writeFileSync('scripts/update_all_coordinates.sql', sqlContent, 'utf8')
console.log('Generated scripts/update_all_coordinates.sql')

// 3. Also write to backend migrations directory if available
const backendMigrationPath = path.resolve('../nusavela-backend/migrations/0010_update_all_514_city_coordinates.sql')
try {
  fs.writeFileSync(backendMigrationPath, sqlContent, 'utf8')
  console.log(`Generated backend migration: ${backendMigrationPath}`)
} catch (err) {
  console.log('Backend migration path not directly writable, scripts/update_all_coordinates.sql is ready.')
}
