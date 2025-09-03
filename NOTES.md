# Project Notes - Form 5266 v2

## Feature Requests

### Dark Mode Toggle (Priority: High)
**Requested by:** Brad  
**Date:** September 3, 2025  
**Description:** Add ability to toggle the entire application between light and dark themes

**Implementation Ideas:**
- Add toggle button in header (sun/moon icon)
- Store preference in localStorage
- CSS variables approach for easy theming:
  - Create dark theme variables
  - Swap CSS variable values on toggle
  - Smooth transitions between modes

**Dark Theme Color Suggestions:**
- Background: #1a1a1a (main), #2d2d2d (cards)
- Text: #e0e0e0 (primary), #b0b0b0 (secondary)
- Red Cross Red: Keep #ED1B2E for brand consistency
- Borders: #404040
- Success/Warning/Info: Slightly muted versions

**Components to Theme:**
- Main dashboard
- All cards and forms
- Navigation and header
- Maps (use dark map tiles)
- IAP Builder accordions
- Modals and alerts
- Tables and data grids
- Charts (if added)

**Technical Notes:**
- Use CSS custom properties (variables)
- Add `.dark-mode` class to body
- Transition duration: 0.3s for smooth switching
- Consider system preference detection: `prefers-color-scheme`
- Maps: Switch to dark tile providers (CartoDB Dark Matter)

## Data Requirements

### County Boundary Data Needed
**Priority: HIGH**  
**Current Status:** Only Florida and Arizona/New Mexico counties have full GeoJSON boundary data

**Need to acquire GeoJSON boundary data for:**
- All 3,143 US counties across 50 states
- District of Columbia
- US Territories:
  - Puerto Rico (78 municipalities)
  - US Virgin Islands (3 islands)
  - Guam (19 villages)
  - American Samoa (5 districts)
  - Northern Mariana Islands (4 municipalities)

**Potential Sources:**
1. US Census Bureau TIGER/Line Shapefiles
2. Natural Earth Data
3. OpenStreetMap Nominatim
4. USGS National Map
5. Data.gov datasets

**Implementation Notes:**
- Files should be in GeoJSON format
- Should include county FIPS codes for matching
- Consider CDN hosting for performance
- May need to simplify geometries for web performance
- Current fallback: Shows markers instead of boundaries

## Weather Integration (Future Enhancement)

### National Weather Service Integration
**Priority: HIGH**  
**Target Section:** IAP Builder - Safety & Security (Section 10)

**Planned Features:**
- **Automatic NWS Station Selection**
  - Based on selected region/counties from Start Here Statistics
  - Identify closest NWS forecast offices
  - Pull data from multiple stations for comprehensive coverage

- **AI-Amalgamated Forecast**
  - Combine forecasts from multiple NWS stations
  - AI synthesis for coherent, unified forecast
  - Automatic period selection (match IAP operational period)
  - Plain language summary generation

- **Watches & Warnings**
  - Featured display of active watches/warnings
  - Color-coded severity indicators
  - Auto-refresh for real-time updates
  - Historical tracking for after-action reports

**Technical Implementation:**
- NWS API integration (api.weather.gov)
- County-to-forecast zone mapping
- AI model for forecast amalgamation (GPT/Claude API)
- Caching for performance
- Fallback to manual entry if API unavailable

**Data Sources:**
- NWS Forecast API
- NWS Alerts API  
- NOAA Weather Radio stations
- Emergency Alert System (EAS) feeds

## Other Enhancement Ideas

### Future Considerations
- Real-time collaboration features
- Mobile responsive improvements
- Export to multiple formats (Excel, PDF, CSV)
- Integration with Red Cross systems
- Offline mode with service workers
- Advanced reporting dashboards
- Role-based access control
- Audit trail/history tracking

## Brad's Preferences
- **Loves dark mode** - Make it a priority feature
- Clean, professional interface
- Fast, responsive interactions
- Data visualization emphasis

---
*Last Updated: September 3, 2025*