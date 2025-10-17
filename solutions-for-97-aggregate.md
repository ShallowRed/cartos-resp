# Solutions for Handling Aggregate Code "97" in Eloignement/Duree Datasets

## Problem
`eloignement.csv` and `duree.csv` use aggregate code "97" for all DOM-TOM territories, but the geographic data has individual codes (971, 972, 973, 974, 976).

## Solution 1: Replicate "97" Data to Individual DOM Codes (Recommended)

**Implementation**: Add a custom row filter in the config that duplicates "97" rows for each DOM territory.

### In `eloignement.ts`:
```typescript
export const eloignementConfig: ServiceConfig = {
  id: 'eloignement',
  title: 'Éloignements des populations',
  dataFile: `${import.meta.env.BASE_URL}data/eloignement.csv`,

  // Add a data preprocessor that expands "97" to individual DOM codes
  dataPreprocessor: (rows) => {
    const DOM_CODES = ['971', '972', '973', '974', '976']
    const expandedRows: ServiceDataRow[] = []

    for (const row of rows) {
      if (row.dep === '97') {
        // Replicate this row for each DOM territory
        for (const code of DOM_CODES) {
          expandedRows.push({ ...row, dep: code })
        }
      }
      else {
        expandedRows.push(row)
      }
    }

    return expandedRows
  },

  formControls: [
    // ... rest of config
  ],
}
```

**Pros**:
- ✅ Works seamlessly with existing rendering code
- ✅ All 5 DOM territories display the same aggregate data
- ✅ No changes needed to `render-choropleth.ts`
- ✅ Clear that data is aggregate (all territories show same values)

**Cons**:
- ⚠️ Requires adding `dataPreprocessor` support to MapService
- ⚠️ Conceptually shows aggregate data as if it's specific to each territory

---

## Solution 2: Custom rowKey Mapping

**Implementation**: Map individual DOM codes back to "97" when looking up data.

### In `eloignement.ts`:
```typescript
rendering: {
  // ... other config
  dataKeys: {
    rowKey: 'dep',
    featureKey: 'INSEE_DEP',
    // Add custom key mapper
    keyMapper: (featureKey: string) => {
      const DOM_CODES = ['971', '972', '973', '974', '976']
      // Map individual DOM codes to aggregate "97"
      return DOM_CODES.includes(featureKey) ? '97' : featureKey
    }
  },
}
```

### In `render-choropleth.ts` (modify):
```typescript
function buildDataIndex(config: ChoroplethConfig): Map<string, DataIndexEntry> {
  const filteredData = config.rowFilter
    ? config.tabularData.filter(config.rowFilter)
    : config.tabularData

  const index = new Map()

  for (const row of filteredData) {
    const key = normalizeKey(config.rowKey(row))
    const value = config.numberNormalizer(config.valueAccessor(row))
    index.set(key, { row, value })
  }

  return index
}

// Modify lookup in createChoroplethLayer:
function getFillColor(feature: Feature<Geometry>) {
  let key = normalizeKey(config.featureKey(feature))

  // Apply custom key mapper if provided
  if (config.dataKeys?.keyMapper) {
    key = config.dataKeys.keyMapper(key)
  }

  const data = dataIndex.get(key)
  return data?.value ?? null
}
```

**Pros**:
- ✅ Minimal data duplication
- ✅ Explicit that we're using aggregate data

**Cons**:
- ⚠️ Requires modifying `render-choropleth.ts`
- ⚠️ Need to add `keyMapper` to types

---

## Solution 3: Filter Out DOM Territories

**Implementation**: Simply exclude DOM territories from visualization for these datasets.

### In `eloignement.ts`:
```typescript
export const eloignementConfig: ServiceConfig = {
  id: 'eloignement',
  title: 'Éloignements des populations (France métropolitaine)',
  dataFile: `${import.meta.env.BASE_URL}data/eloignement.csv`,

  rendering: {
    // ... other config

    // Add feature filter to exclude DOM territories
    featureFilter: (feature) => {
      const code = feature.properties?.INSEE_DEP
      const DOM_CODES = ['971', '972', '973', '974', '976']
      return !DOM_CODES.includes(code)
    }
  },
}
```

### In `render-choropleth.ts` (modify):
```typescript
function createChoroplethLayer(config: ChoroplethConfig, dataIndex: Map<string, DataIndexEntry>) {
  // Filter features if filter is provided
  const features = config.featureFilter
    ? config.featureCollection.features.filter(config.featureFilter)
    : config.featureCollection.features

  const getFillColor = (feature: Feature<Geometry>) => {
    const key = normalizeKey(config.featureKey(feature))
    const data = dataIndex.get(key)
    return data?.value ?? null
  }

  return [
    Plot.geo(
      { ...config.featureCollection, features }, // Use filtered features
      {
        fill: getFillColor,
        stroke: 'white',
        strokeWidth: 0.5,
        strokeOpacity: 0.3,
      }
    ),
  ]
}
```

**Pros**:
- ✅ Clean and honest about data limitations
- ✅ No data replication or ambiguity
- ✅ Metropolitan France + Corsica still render perfectly

**Cons**:
- ❌ DOM territories show as empty on the map
- ⚠️ Inconsistent experience across different map types

---

## Solution 4: Hybrid Approach with UI Indicator

**Implementation**: Show DOM territories with aggregate data + visual indicator.

### In `eloignement.ts`:
```typescript
export const eloignementConfig: ServiceConfig = {
  id: 'eloignement',
  title: 'Éloignements des populations',
  dataFile: `${import.meta.env.BASE_URL}data/eloignement.csv`,

  dataPreprocessor: (rows) => {
    const DOM_CODES = ['971', '972', '973', '974', '976']
    const expandedRows: ServiceDataRow[] = []

    for (const row of rows) {
      if (row.dep === '97') {
        for (const code of DOM_CODES) {
          expandedRows.push({
            ...row,
            dep: code,
            _isAggregate: true // Flag for UI
          })
        }
      }
      else {
        expandedRows.push(row)
      }
    }

    return expandedRows
  },

  rendering: {
    // ... other config

    // Custom tooltip to indicate aggregate data
    tooltip: {
      template: 'custom',
      builder: (feature, value, row) => {
        const name = feature.properties?.NOM || ''
        const displayValue = value != null ? `${(value * 100).toFixed(1)}%` : '—'

        if (row?._isAggregate) {
          return `${name}\n${displayValue}\n(données agrégées DOM-TOM)`
        }

        return `${name}\n${displayValue}`
      }
    }
  },
}
```

**Pros**:
- ✅ Shows all territories
- ✅ Transparent about data source
- ✅ Good UX

**Cons**:
- ⚠️ Most complex implementation
- ⚠️ Requires custom tooltip support

---

## Recommendation: Solution 1 (with enhancement)

Implement **Solution 1** because:
1. Works immediately with existing code structure
2. Provides complete visual coverage
3. All tooltips work correctly
4. Minimal code changes

### Implementation Plan:

1. Add `dataPreprocessor` support to `MapService` class
2. Implement preprocessor in `eloignement.ts` and `duree.ts`
3. Optionally add a note in the UI: "* Données DOM-TOM agrégées"

### Quick Test:
After implementation, verify:
- [ ] Metropolitan France renders correctly
- [ ] Corsica (2A, 2B) renders correctly
- [ ] All 5 DOM territories show the same color (from "97" data)
- [ ] Tooltips show values for all territories
- [ ] No console errors about missing data
