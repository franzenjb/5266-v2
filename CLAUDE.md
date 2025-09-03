# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is the Red Cross Form 5266 v2 Digital Transformation project - a web application replacing the Excel-based Disaster Operations Control Form. The system tracks disaster response operations across multiple Red Cross regions, counties, and chapters nationwide.

## Development Commands

### Running the Application
```bash
# Start local development server (static site)
python3 -m http.server 8000
# Access at http://localhost:8000

# For prototype Next.js app (if working in prototype folder)
cd prototype
npm install
npm run dev
# Access at http://localhost:3000
```

### GitHub Pages Deployment
```bash
git add -A
git commit -m "Your commit message"
git push origin main
# Site deploys automatically to https://franzenjb.github.io/5266-v2/
```

## Architecture Overview

### Current Implementation (Static Site)
The application is currently a static HTML/JavaScript site with localStorage persistence:

- **Main Entry**: `index.html` - Contains all tabs and core functionality
- **IAP Builder**: `iap-enhanced.html` - Rich text editing with Quill.js and image upload
- **Data Storage**: localStorage (client-side only, no backend database yet)
- **Maps**: Leaflet.js with OpenStreetMap tiles (no API key required)

### Key Data Flows

1. **Region → County → Chapter Selection**:
   - Data source: `redcross_data.js` (50 regions, 3,152 county-chapter mappings)
   - Selection in Start Here Statistics populates counties and chapters
   - Selected counties display on maps with choropleth visualization

2. **Service Lines → IAP Generation**:
   - Feeding, Sheltering, and other service data stored in localStorage
   - IAP Builder pulls data from service lines automatically
   - Rich text editors allow formatting of Director's Message, Safety, etc.

3. **Map System Architecture**:
   - `enhanced_maps.js`: Core mapping utilities
   - `national-map-system.js`: Handles all 50 US regions + territories
   - `florida_counties.js` & `az_nm_counties.js`: GeoJSON boundary data
   - Other regions use markers as fallback (full boundaries needed)

### JavaScript Module Loading Order
Critical for proper functionality:
1. `redcross_data.js` - Regional/county data
2. `florida_counties.js`, `az_nm_counties.js` - GeoJSON data  
3. `enhanced_maps.js` - Map utilities
4. `national-map-system.js` - Regional map support
5. `fixes.js` - Tab switching and Live IAP fixes
6. `start-here-map-fix.js` - Start Here map functionality
7. `map-fixes.js` - OpenStreetMap tile fixes

## Critical Implementation Details

### Red Cross Organizational Structure
- 50 regions across the US + territories (Guam, Puerto Rico, USVI)
- Each region contains multiple counties
- Each county is associated with one chapter
- Data structure in `redcross_data.js`:
  ```javascript
  redCrossRegionsData = {
    "Region Name": {
      countyCount: number,
      chapters: ["chapter1", "chapter2"],
      counties: { "County Name": "Chapter Name" }
    }
  }
  ```

### IAP (Incident Action Plan) Structure
The IAP Builder has 13 sections with specific data requirements:
1. Basic Information (pulls DR number from Start Here)
2. Director's Message (rich text editor)
3-9. Command Staff, Geography, Service Lines (forms + auto-population)
10. Safety & Security (rich text editors)
11. External Coordination (rich text editors)
12. Ancillary Notes (rich text editors)
13. Preview & Export

### Map Display Issues & Solutions
- Maps use OpenStreetMap tiles (free, reliable)
- CartoDB as fallback if OSM fails
- DO NOT use Stamen tiles (deprecated)
- Maps auto-center on selected counties
- Use `refreshMaps()` in console if maps don't display

### Form 5266 Line References
Key metrics tracked (Line numbers from original Excel form):
- Line 9: Meals Served
- Line 10: Snacks Served
- Line 26: EOCs Active
- Line 38: Shelters Opened
- Line 44: Total Clients Served

## Known Issues & Solutions

### Maps Not Displaying
- OpenStreetMap tiles should work without API keys
- Check browser console for errors
- Run `refreshMaps()` in console to force refresh
- Maps need proper initialization when tabs switch

### Tab Navigation
- External links (IAP Builder) must not have `data-tab` attribute
- Internal tabs use `data-tab` for client-side switching
- Fixed in `fixes.js` to prevent null reference errors

### Data Persistence
- All data stored in localStorage (browser-specific)
- No backend database implemented yet
- Keys: `form5266_operation`, `form5266_feeding`, `form5266_iap_current`, etc.

## Future Enhancements (from NOTES.md)

### Priority Features
1. **Dark Mode** (Brad's favorite) - Toggle light/dark themes
2. **County Boundaries** - Need GeoJSON for all 3,143 US counties
3. **Weather Integration** - Auto-pull NWS forecasts for selected counties
4. **Database Backend** - PostgreSQL to replace localStorage

### Planned Integrations
- National Weather Service API (api.weather.gov)
- Real-time collaboration via WebSockets
- Export to Word/PDF for official IAPs
- Mobile-responsive improvements

## User Preferences

### Brad's Preferences
- Loves dark mode (high priority)
- Clean, professional interface
- Fast, responsive interactions
- Data visualization emphasis

## Testing & Validation

### Manual Testing Checklist
1. Select region → Verify counties populate
2. Select counties → Check map updates
3. Enter feeding data → Verify persistence
4. Switch tabs → Ensure maps render
5. Create IAP → Check data auto-population
6. Upload cover photo → Test cropping functionality

### Browser Compatibility
- Primary: Chrome, Edge (Chromium-based)
- Secondary: Firefox, Safari
- Mobile: Responsive but not fully optimized

## Deployment Notes

- Static site on GitHub Pages
- No build process required for main site
- Prototype folder has separate Next.js app (not primary)
- All changes auto-deploy on push to main branch
- Check Actions tab for deployment status