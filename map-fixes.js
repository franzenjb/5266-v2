// Comprehensive Map Fixes for Form 5266 v2
// This file fixes all map display and centering issues

// Override the MapUtils initialization to use working tile providers
if (typeof MapUtils !== 'undefined') {
    const originalInitializeEnhancedMap = MapUtils.initializeEnhancedMap;
    
    MapUtils.initializeEnhancedMap = function(elementId, options = {}) {
        const defaults = {
            center: options.center || [39.5, -98.5],
            zoom: options.zoom || 5,
            useMapbox: false,
            tileProvider: 'osm' // Default to OpenStreetMap which always works
        };
        
        const config = { ...defaults, ...options };
        
        // Create map
        const map = L.map(elementId, {
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            touchZoom: true
        }).setView(config.center, config.zoom);
        
        // Add tile layer - use reliable providers only
        let tileLayer;
        
        // Try OpenStreetMap first (most reliable, no API key needed)
        try {
            tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });
            tileLayer.addTo(map);
            console.log('Map initialized with OpenStreetMap tiles');
        } catch (error) {
            console.error('Error adding tile layer:', error);
            // Try CartoDB as fallback
            try {
                tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    subdomains: 'abcd',
                    maxZoom: 20
                });
                tileLayer.addTo(map);
                console.log('Map initialized with CartoDB tiles');
            } catch (error2) {
                console.error('Failed to add any tile layer:', error2);
            }
        }
        
        // Add zoom control to top right
        map.zoomControl.setPosition('topright');
        
        // Add scale control
        L.control.scale({
            position: 'bottomleft',
            maxWidth: 200,
            imperial: true,
            metric: false
        }).addTo(map);
        
        // Force a resize after a short delay to ensure proper rendering
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
        
        return map;
    };
    
    // Fix the fitMapToBounds function to ensure proper centering
    const originalFitMapToBounds = MapUtils.fitMapToBounds;
    
    MapUtils.fitMapToBounds = function(map, geoLayer, selectedCounties = []) {
        if (!map || !geoLayer || selectedCounties.length === 0) return;
        
        try {
            // Get bounds of selected counties
            const selectedBounds = [];
            let foundAny = false;
            
            geoLayer.eachLayer(function(layer) {
                const feature = layer.feature;
                if (!feature || !feature.properties) return;
                
                const countyName = feature.properties.name || feature.properties.NAME || '';
                const isSelected = selectedCounties.some(county => {
                    const c1 = county.toLowerCase().trim();
                    const c2 = countyName.toLowerCase().trim();
                    // More flexible matching
                    return c1.includes(c2) || c2.includes(c1) || 
                           c1.replace(' county', '') === c2.replace(' county', '') ||
                           c1 === c2;
                });
                
                if (isSelected) {
                    selectedBounds.push(layer.getBounds());
                    foundAny = true;
                }
            });
            
            if (foundAny && selectedBounds.length > 0) {
                // Create combined bounds
                let bounds = selectedBounds[0];
                for (let i = 1; i < selectedBounds.length; i++) {
                    bounds.extend(selectedBounds[i]);
                }
                
                // Fit map to bounds with padding
                map.fitBounds(bounds, { 
                    padding: [50, 50],
                    maxZoom: 10 // Don't zoom in too much
                });
                
                console.log(`Map centered on ${selectedBounds.length} selected counties`);
            } else {
                console.log('No matching counties found for centering');
            }
        } catch (error) {
            console.error('Error fitting map to bounds:', error);
        }
    };
}

// Fix for Live IAP map
function fixLiveIAPMap() {
    const mapContainer = document.getElementById('liveIAPMap');
    if (!mapContainer) return;
    
    // Clear any existing map
    mapContainer.innerHTML = '';
    
    // Reinitialize the map
    if (typeof initializeLiveIAPMap === 'function') {
        // Reset the global variable
        if (typeof liveIAPMap !== 'undefined' && liveIAPMap) {
            liveIAPMap.remove();
            liveIAPMap = null;
        }
        initializeLiveIAPMap();
    }
}

// Fix for Start Here map
function fixStartHereMap() {
    const mapContainer = document.getElementById('startHereMap');
    if (!mapContainer) return;
    
    // Clear any existing map
    mapContainer.innerHTML = '';
    
    // Reinitialize the map
    if (typeof initializeStartHereMap === 'function') {
        // Reset the global variable
        if (typeof startHereMap !== 'undefined' && startHereMap) {
            startHereMap.remove();
            startHereMap = null;
        }
        initializeStartHereMap();
    }
}

// Auto-fix maps when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Map fixes loading...');
    
    // Give other scripts time to initialize
    setTimeout(() => {
        // Check which tab is active and fix its map
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            if (activeTab.id === 'live-iap') {
                fixLiveIAPMap();
            } else if (activeTab.id === 'start-here') {
                fixStartHereMap();
            }
        }
        
        // Also listen for tab changes to fix maps when needed
        document.querySelectorAll('.tab-link').forEach(link => {
            link.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                setTimeout(() => {
                    if (targetTab === 'live-iap') {
                        fixLiveIAPMap();
                    } else if (targetTab === 'start-here') {
                        fixStartHereMap();
                    }
                }, 200);
            });
        });
        
        console.log('Map fixes applied');
    }, 1000);
});

// Function to manually refresh maps (can be called from console)
window.refreshMaps = function() {
    console.log('Manually refreshing all maps...');
    fixLiveIAPMap();
    fixStartHereMap();
    
    // Also trigger resize on all maps
    if (typeof liveIAPMap !== 'undefined' && liveIAPMap) {
        liveIAPMap.invalidateSize();
    }
    if (typeof startHereMap !== 'undefined' && startHereMap) {
        startHereMap.invalidateSize();
    }
    
    console.log('Maps refreshed');
};

console.log('Map fixes loaded - maps should now display properly with OpenStreetMap tiles');