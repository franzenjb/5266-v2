// Unified US Counties GeoJSON Data
// This file will contain boundary data for all 3,143 US counties
// Currently includes Florida and Arizona/New Mexico as examples

// Note: Full county boundary data needs to be obtained from:
// - US Census Bureau TIGER/Line Shapefiles
// - Natural Earth Data
// - OpenStreetMap Nominatim
// - USGS National Map

// For now, we're combining the existing Florida and Arizona/New Mexico data
// and adding a structure for the remaining states

const usCountiesData = {
    // Florida counties (existing data)
    florida: typeof floridaCounties !== 'undefined' ? floridaCounties : null,
    
    // Arizona and New Mexico counties (existing data)
    arizonaNewMexico: typeof arizonaNewMexicoCounties !== 'undefined' ? arizonaNewMexicoCounties : null,
    
    // Structure for remaining states
    // Each state will have GeoJSON FeatureCollection with county boundaries
    alabama: null,
    alaska: null,
    arkansas: null,
    california: null,
    colorado: null,
    connecticut: null,
    delaware: null,
    georgia: null,
    hawaii: null,
    idaho: null,
    illinois: null,
    indiana: null,
    iowa: null,
    kansas: null,
    kentucky: null,
    louisiana: null,
    maine: null,
    maryland: null,
    massachusetts: null,
    michigan: null,
    minnesota: null,
    mississippi: null,
    missouri: null,
    montana: null,
    nebraska: null,
    nevada: null,
    newHampshire: null,
    newJersey: null,
    newYork: null,
    northCarolina: null,
    northDakota: null,
    ohio: null,
    oklahoma: null,
    oregon: null,
    pennsylvania: null,
    rhodeIsland: null,
    southCarolina: null,
    southDakota: null,
    tennessee: null,
    texas: null,
    utah: null,
    vermont: null,
    virginia: null,
    washington: null,
    westVirginia: null,
    wisconsin: null,
    wyoming: null,
    
    // US Territories
    puertoRico: null,
    usVirginIslands: null,
    guam: null,
    americanSamoa: null,
    northernMarianaIslands: null,
    
    // Helper function to get county data by state name
    getStateCounties: function(stateName) {
        // Normalize state name
        const normalized = stateName.toLowerCase().replace(/[^a-z]/g, '');
        
        // Map common variations
        const stateMap = {
            'florida': 'florida',
            'arizona': 'arizonaNewMexico',
            'newmexico': 'arizonaNewMexico',
            'arizonanewmexico': 'arizonaNewMexico',
            'alabama': 'alabama',
            'alaska': 'alaska',
            // ... add more mappings
        };
        
        const stateKey = stateMap[normalized];
        return stateKey ? this[stateKey] : null;
    },
    
    // Get all available county data
    getAllAvailable: function() {
        const available = [];
        
        if (this.florida) {
            available.push({
                state: 'Florida',
                data: this.florida,
                counties: this.florida.features.length
            });
        }
        
        if (this.arizonaNewMexico) {
            available.push({
                state: 'Arizona-New Mexico',
                data: this.arizonaNewMexico,
                counties: this.arizonaNewMexico.features.length
            });
        }
        
        // Add other states as data becomes available
        
        return available;
    },
    
    // Check if county data exists for a region
    hasCountyData: function(region) {
        const stateCounties = this.getStateCounties(region);
        return stateCounties !== null;
    }
};

// Make it globally available
window.usCountiesData = usCountiesData;

// Log status
console.log('US Counties Unified Data loaded');
console.log('Available county data:', usCountiesData.getAllAvailable().map(s => s.state).join(', '));

// Note for future development:
// To add county data for a new state:
// 1. Obtain GeoJSON data from reliable source
// 2. Ensure it follows the standard GeoJSON FeatureCollection format
// 3. Add to the appropriate state property above
// 4. Update the stateMap in getStateCounties function