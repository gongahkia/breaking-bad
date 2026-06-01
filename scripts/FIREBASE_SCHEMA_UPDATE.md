# Firebase Schema Update for Dual Graph Support

## Overview
This document outlines the Firebase schema changes required to support dual performance graphs (APR and TVL) in the vault management platform.

## Current Schema
```json
{
  "allVaults": {
    "vaultId": {
      "snapshot": [1.2, 1.3, 1.4, 1.5], // Legacy single snapshot array
      "apr": 3.5,
      "tvl": 1000000,
      // ... other vault properties
    }
  }
}
```
   
## New Schema
```json
{
  "allVaults": {
    "vaultId": {
      "snapshot": [1.2, 1.3, 1.4, 1.5], // Legacy: keep for backward compatibility
      "aprSnapshot": [3.2, 3.3, 3.4, 3.5], // NEW: APR data over time
      "tvlSnapshot": [950000, 975000, 1000000, 1025000], // NEW: TVL data over time
      "apr": 3.5, // Current APR value
      "tvl": 1000000, // Current TVL value
      // ... other vault properties
    }
  }
}
```

## Migration Strategy

### Phase 1: Schema Extension (No Breaking Changes)
1. Add new fields `aprSnapshot` and `tvlSnapshot` to existing vaults
2. Keep existing `snapshot` field for backward compatibility
3. Update frontend to use new fields when available

### Phase 2: Data Population
1. Generate historical APR and TVL data for existing vaults
2. Use existing `snapshot` data as fallback if new fields are empty
3. Implement data generation scripts for testing

### Phase 3: Legacy Cleanup (Optional)
1. Remove `snapshot` field after confirming all vaults have new data
2. Update frontend to remove fallback logic

## Data Generation Scripts

### Sample APR Data Generation
```javascript
// Generate realistic APR fluctuations
function generateAprData(days, baseApr, volatility = 0.1) {
  const data = [];
  for (let i = 0; i < days; i++) {
    const fluctuation = (Math.random() - 0.5) * 2 * volatility;
    const apr = baseApr * (1 + fluctuation);
    data.push(parseFloat(apr.toFixed(2)));
  }
  return data;
}
```

### Sample TVL Data Generation
```javascript
// Generate realistic TVL growth with volatility
function generateTvlData(days, baseTvl, growthRate = 0.001, volatility = 0.05) {
  const data = [];
  let currentTvl = baseTvl;
  
  for (let i = 0; i < days; i++) {
    const growth = (Math.random() - 0.5) * 2 * volatility + growthRate;
    currentTvl = currentTvl * (1 + growth);
    data.push(Math.round(currentTvl));
  }
  return data;
}
```

## Implementation Notes

### Frontend Changes
- Update `VaultDetails` interface to include new snapshot fields
- Implement dual chart rendering with APR and TVL
- Add timeframe selection (1W, 1M, 3M, 6M, 1Y)
- Maintain backward compatibility with legacy `snapshot` field

### Backend Considerations
- Ensure new fields are optional to prevent breaking existing functionality
- Consider data compression for large historical datasets
- Implement caching strategies for frequently accessed data

### Performance Considerations
- Limit historical data to reasonable timeframes (e.g., max 1 year)
- Implement data aggregation for longer time periods
- Use lazy loading for chart data

## Testing Strategy

### Unit Tests
- Test data generation functions
- Verify chart rendering with different data formats
- Test timeframe filtering logic

### Integration Tests
- Test with real Firebase data
- Verify backward compatibility
- Test performance with large datasets

### User Acceptance Tests
- Verify chart readability and accuracy
- Test timeframe switching performance
- Validate tooltip information display

## Rollback Plan
If issues arise during migration:
1. Frontend can fall back to legacy `snapshot` field
2. Remove new fields from Firebase if necessary
3. Revert to previous chart implementation

## Timeline
- **Week 1**: Schema extension and frontend updates
- **Week 2**: Data generation and testing
- **Week 3**: Production deployment and monitoring
- **Week 4**: Legacy cleanup (if successful)
