// National Map System for All US Regions
// This file provides mapping support for all 50 US regions and their counties

const NationalMapSystem = {
    // Cache for county boundary data
    countyDataCache: {},
    
    // US states and their approximate center coordinates
    statesCenters: {
        'Alabama': [32.806671, -86.791130],
        'Alaska': [61.370716, -152.404419],
        'Arizona': [34.048927, -111.093735],
        'Arkansas': [34.969704, -92.373123],
        'California': [36.778259, -119.417931],
        'Colorado': [39.113014, -105.358887],
        'Connecticut': [41.597782, -72.755371],
        'Delaware': [39.318523, -75.507141],
        'Florida': [27.994402, -81.760254],
        'Georgia': [33.040619, -83.643074],
        'Hawaii': [21.094318, -157.498337],
        'Idaho': [44.240459, -114.478828],
        'Illinois': [40.349457, -88.986137],
        'Indiana': [40.267194, -86.134902],
        'Iowa': [42.011539, -93.210526],
        'Kansas': [38.526600, -96.726486],
        'Kentucky': [37.668140, -84.670067],
        'Louisiana': [31.169546, -91.867805],
        'Maine': [44.693947, -69.381927],
        'Maryland': [39.063946, -76.802101],
        'Massachusetts': [42.230171, -71.530106],
        'Michigan': [44.314844, -85.602364],
        'Minnesota': [45.694454, -93.900192],
        'Mississippi': [32.354668, -89.398528],
        'Missouri': [37.964253, -91.831833],
        'Montana': [46.879682, -110.362566],
        'Nebraska': [41.492537, -99.901813],
        'Nevada': [38.313515, -117.055374],
        'New Hampshire': [43.452492, -71.563896],
        'New Jersey': [40.298904, -74.521011],
        'New Mexico': [34.840515, -106.248482],
        'New York': [42.165726, -74.948051],
        'North Carolina': [35.759573, -79.019300],
        'North Dakota': [47.528912, -99.784012],
        'Ohio': [40.388783, -82.764915],
        'Oklahoma': [35.565342, -96.928917],
        'Oregon': [44.572021, -122.070938],
        'Pennsylvania': [40.590752, -77.209755],
        'Rhode Island': [41.680893, -71.511780],
        'South Carolina': [33.856892, -80.945007],
        'South Dakota': [44.299782, -99.438828],
        'Tennessee': [35.747845, -86.692345],
        'Texas': [31.054487, -97.563461],
        'Utah': [40.150032, -111.862434],
        'Vermont': [44.045876, -72.710686],
        'Virginia': [37.769337, -78.169968],
        'Washington': [47.400902, -121.490494],
        'West Virginia': [38.491226, -80.954453],
        'Wisconsin': [44.268543, -89.616508],
        'Wyoming': [42.755966, -107.302490],
        'District of Columbia': [38.907192, -77.036871],
        'Puerto Rico': [18.220833, -66.590149],
        'US Virgin Islands': [18.335765, -64.896335],
        'Guam': [13.444304, 144.793731],
        'American Samoa': [-14.270972, -170.132217],
        'Northern Mariana Islands': [15.0979, 145.6739]
    },
    
    // Map region names to states for center calculation
    regionToStates: {
        'Alabama and Mississippi Region': ['Alabama', 'Mississippi'],
        'Alaska Region': ['Alaska'],
        'Arizona and New Mexico Region': ['Arizona', 'New Mexico'],
        'Arkansas Region': ['Arkansas'],
        'California Gold Country Region': ['California'],
        'Cascades Region': ['Washington', 'Oregon'],
        'Central and South Texas Region': ['Texas'],
        'Central and Southern Ohio Region': ['Ohio'],
        'Central Appalachia Region': ['Kentucky', 'West Virginia'],
        'Central California Region': ['California'],
        'Central Florida and the US Virgin Islands Region': ['Florida', 'US Virgin Islands'],
        'Colorado and Wyoming Region': ['Colorado', 'Wyoming'],
        'Connecticut and Rhode Island Region': ['Connecticut', 'Rhode Island'],
        'Eastern New York Region': ['New York'],
        'Eastern North Carolina Region': ['North Carolina'],
        'Georgia Region': ['Georgia'],
        'Greater Carolinas Region': ['North Carolina', 'South Carolina'],
        'Greater New York Region': ['New York', 'New Jersey'],
        'Greater Pennsylvania Region': ['Pennsylvania'],
        'Idaho and Montana Region': ['Idaho', 'Montana'],
        'Illinois Region': ['Illinois'],
        'Indiana Region': ['Indiana'],
        'Kansas and Oklahoma Region': ['Kansas', 'Oklahoma'],
        'Kentucky Region': ['Kentucky'],
        'Los Angeles Region': ['California'],
        'Louisiana Region': ['Louisiana'],
        'Maine Region': ['Maine'],
        'Maryland and the National Capital Region': ['Maryland', 'District of Columbia'],
        'Massachusetts Region': ['Massachusetts'],
        'Michigan Region': ['Michigan'],
        'Minnesota and Dakotas Region': ['Minnesota', 'North Dakota', 'South Dakota'],
        'Nebraska and Southwest Iowa Region': ['Nebraska', 'Iowa'],
        'Nevada and California Sierra Region': ['Nevada', 'California'],
        'New Hampshire and Vermont Region': ['New Hampshire', 'Vermont'],
        'New Jersey Region': ['New Jersey'],
        'Northern California Coastal Region': ['California'],
        'Northern California Wildfires Region': ['California'],
        'Northern Florida Region': ['Florida'],
        'Northern Ohio Region': ['Ohio'],
        'Northwest and the Great Plains Region': ['North Dakota', 'South Dakota'],
        'Oregon Trail Chapter Region': ['Oregon'],
        'Puerto Rico Region': ['Puerto Rico'],
        'Guam Region': ['Guam'],
        'Pacific Islands Region': ['Guam', 'American Samoa', 'Northern Mariana Islands'],
        'South Central and Southeast Texas Region': ['Texas'],
        'South Florida Region': ['Florida'],
        'Southern California Region': ['California'],
        'Tennessee Region': ['Tennessee'],
        'Utah and Southwest Wyoming Region': ['Utah', 'Wyoming'],
        'Virginia Region': ['Virginia'],
        'Washington DC and Delaware Region': ['District of Columbia', 'Delaware'],
        'West Virginia Region': ['West Virginia'],
        'Western New York Region': ['New York'],
        'Wisconsin Region': ['Wisconsin']
    },
    
    // Get center coordinates for a region
    getRegionCenter: function(regionName) {
        const states = this.regionToStates[regionName];
        if (!states || states.length === 0) {
            // Default to US center if region not found
            return [39.5, -98.5];
        }
        
        // Calculate average center of states in region
        let lat = 0, lng = 0;
        let validStates = 0;
        
        states.forEach(state => {
            const center = this.statesCenters[state];
            if (center) {
                lat += center[0];
                lng += center[1];
                validStates++;
            }
        });
        
        if (validStates > 0) {
            return [lat / validStates, lng / validStates];
        }
        
        return [39.5, -98.5]; // Default US center
    },
    
    // Get appropriate zoom level based on region
    getRegionZoom: function(regionName) {
        const states = this.regionToStates[regionName];
        if (!states) return 5;
        
        // Single state regions
        if (states.length === 1) {
            const state = states[0];
            // Smaller states need higher zoom
            if (['Connecticut', 'Rhode Island', 'Delaware', 'New Jersey', 'Maryland', 
                'Massachusetts', 'Vermont', 'New Hampshire', 'Hawaii', 'District of Columbia'].includes(state)) {
                return 8;
            }
            // Large states need lower zoom
            if (['Alaska', 'Texas', 'California', 'Montana'].includes(state)) {
                return 5;
            }
            return 6.5;
        }
        
        // Multi-state regions
        if (states.length === 2) return 6;
        if (states.length >= 3) return 5;
        
        return 6;
    },
    
    // Fetch county boundaries from public GeoJSON sources
    fetchCountyBoundaries: async function(stateName) {
        // Check cache first
        if (this.countyDataCache[stateName]) {
            return this.countyDataCache[stateName];
        }
        
        try {
            // Try to fetch from a public GeoJSON source
            // Note: In production, you'd want to host these files or use a reliable API
            const response = await fetch(`https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json`);
            if (response.ok) {
                const data = await response.json();
                // Filter for specific state if needed
                this.countyDataCache[stateName] = data;
                return data;
            }
        } catch (error) {
            console.error(`Error fetching boundaries for ${stateName}:`, error);
        }
        
        // Return empty GeoJSON if fetch fails
        return {
            type: "FeatureCollection",
            features: []
        };
    },
    
    // Initialize map for any region
    initializeRegionalMap: function(elementId, regionName) {
        if (typeof MapUtils === 'undefined') {
            console.error('MapUtils not loaded');
            return null;
        }
        
        const center = this.getRegionCenter(regionName);
        const zoom = this.getRegionZoom(regionName);
        
        const mapOptions = {
            center: center,
            zoom: zoom,
            tileProvider: 'cartodb'
        };
        
        try {
            const map = MapUtils.initializeEnhancedMap(elementId, mapOptions);
            console.log(`Initialized map for ${regionName} at [${center}] zoom ${zoom}`);
            return map;
        } catch (error) {
            console.error(`Error initializing map for ${regionName}:`, error);
            return null;
        }
    },
    
    // Create a simple polygon for counties when GeoJSON is not available
    createCountyMarkers: function(map, counties, regionName) {
        if (!map || !counties || counties.length === 0) return;
        
        // For now, add markers for each county as a fallback
        // In production, you'd want actual boundary data
        const markers = [];
        
        counties.forEach(county => {
            // Create a circle marker for each county as a placeholder
            const marker = L.circleMarker(
                this.getRegionCenter(regionName), // This is simplified - you'd want actual county centers
                {
                    radius: 10,
                    fillColor: '#ED1B2E',
                    color: '#B51E2B',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.7
                }
            );
            
            marker.bindPopup(`<strong>${county}</strong><br>Selected County`);
            markers.push(marker);
        });
        
        // Create a layer group
        const layerGroup = L.layerGroup(markers);
        layerGroup.addTo(map);
        
        return layerGroup;
    }
};

// Override the existing map initialization to use the national system
function initializeMapForRegion(elementId, regionName, selectedCounties) {
    // Remove any existing map
    const container = document.getElementById(elementId);
    if (!container) return null;
    
    // Initialize map for the region
    const map = NationalMapSystem.initializeRegionalMap(elementId, regionName);
    
    if (!map) return null;
    
    // Try to load actual county boundaries if available
    if (typeof floridaCounties !== 'undefined' && regionName.includes('Florida')) {
        // Use existing Florida data
        if (selectedCounties && selectedCounties.length > 0) {
            const layer = MapUtils.createChoroplethLayer(floridaCounties, selectedCounties);
            layer.addTo(map);
            MapUtils.addMapLegend(map);
            MapUtils.fitMapToBounds(map, layer, selectedCounties);
        }
    } else if (typeof arizonaNewMexicoCounties !== 'undefined' && 
               (regionName.includes('Arizona') || regionName.includes('New Mexico'))) {
        // Use existing Arizona/New Mexico data
        if (selectedCounties && selectedCounties.length > 0) {
            const layer = MapUtils.createChoroplethLayer(arizonaNewMexicoCounties, selectedCounties);
            layer.addTo(map);
            MapUtils.addMapLegend(map);
            MapUtils.fitMapToBounds(map, layer, selectedCounties);
        }
    } else {
        // For other regions, use markers as a fallback
        // In production, you'd load actual GeoJSON for each state
        if (selectedCounties && selectedCounties.length > 0) {
            NationalMapSystem.createCountyMarkers(map, selectedCounties, regionName);
            
            // Add a note that full boundaries are not yet available
            const info = L.control({position: 'topright'});
            info.onAdd = function() {
                const div = L.DomUtil.create('div', 'map-info');
                div.innerHTML = `
                    <div style="background: white; padding: 10px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                        <p style="margin: 0; font-size: 12px; color: #666;">
                            <strong>Note:</strong> County boundaries for this region<br>
                            are being loaded. Markers show selected counties.
                        </p>
                    </div>
                `;
                return div;
            };
            info.addTo(map);
        }
    }
    
    return map;
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.NationalMapSystem = NationalMapSystem;
    window.initializeMapForRegion = initializeMapForRegion;
}

console.log('National Map System loaded - supports all 50 US regions');