// Ultimate Map Fix for Form 5266 v2
// This ensures maps ALWAYS work with reliable OpenStreetMap tiles

(function() {
    // Global map references
    window.allMaps = {};
    
    // Force OpenStreetMap tiles for ALL maps
    window.forceReliableMapTiles = function() {
        // Override any map initialization to use OpenStreetMap
        if (typeof L !== 'undefined') {
            const originalMap = L.map;
            L.map = function(id, options) {
                const map = originalMap.call(this, id, options);
                
                // Store map reference
                window.allMaps[id] = map;
                
                // Always add OpenStreetMap tiles
                setTimeout(() => {
                    // Remove any existing tile layers
                    map.eachLayer(layer => {
                        if (layer instanceof L.TileLayer) {
                            map.removeLayer(layer);
                        }
                    });
                    
                    // Add reliable OpenStreetMap tiles
                    const isDarkMode = document.body.classList.contains('dark-mode');
                    if (isDarkMode) {
                        // Dark tiles for dark mode
                        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                            attribution: '© OpenStreetMap contributors © CARTO',
                            subdomains: 'abcd',
                            maxZoom: 19
                        }).addTo(map);
                    } else {
                        // Standard OpenStreetMap tiles
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '© OpenStreetMap contributors',
                            maxZoom: 19
                        }).addTo(map);
                    }
                    
                    // Log success
                    if (window.addSystemUpdate) {
                        window.addSystemUpdate(`Map initialized: ${id}`, 'map');
                    }
                }, 100);
                
                return map;
            };
        }
    };
    
    // Fix existing maps
    window.fixAllMaps = function() {
        console.log('Fixing all maps...');
        
        // Find all Leaflet containers
        document.querySelectorAll('.leaflet-container').forEach(container => {
            const mapId = container.id;
            console.log('Found map container:', mapId);
            
            // Try to get the map instance
            let map = null;
            
            // Check various possible map references
            if (window[mapId + '_map']) {
                map = window[mapId + '_map'];
            } else if (window[mapId]) {
                map = window[mapId];
            } else if (mapId === 'liveIAPMap' && window.liveIAPMap) {
                map = window.liveIAPMap;
            } else if (mapId === 'operationalMap' && window.operationalMap) {
                map = window.operationalMap;
            }
            
            if (map && map._container) {
                console.log('Fixing map:', mapId);
                
                // Remove all tile layers
                map.eachLayer(layer => {
                    if (layer instanceof L.TileLayer) {
                        map.removeLayer(layer);
                    }
                });
                
                // Add OpenStreetMap tiles
                const isDarkMode = document.body.classList.contains('dark-mode');
                const tileLayer = isDarkMode ? 
                    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                        attribution: '© OpenStreetMap contributors © CARTO',
                        subdomains: 'abcd',
                        maxZoom: 19
                    }) :
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors',
                        maxZoom: 19
                    });
                
                tileLayer.addTo(map);
                
                // Invalidate size to ensure proper rendering
                setTimeout(() => {
                    map.invalidateSize();
                }, 100);
                
                if (window.addSystemUpdate) {
                    window.addSystemUpdate(`Map fixed: ${mapId}`, 'success');
                }
            }
        });
    };
    
    // Initialize map for a specific element
    window.initializeMap = function(elementId, options = {}) {
        console.log('Initializing map:', elementId);
        
        const container = document.getElementById(elementId);
        if (!container) {
            console.error('Map container not found:', elementId);
            return null;
        }
        
        // Default options
        const defaults = {
            center: [28.5383, -81.3792], // Orlando, FL (center of Florida)
            zoom: 7,
            scrollWheelZoom: true,
            zoomControl: true
        };
        
        const mapOptions = Object.assign({}, defaults, options);
        
        try {
            // Create map
            const map = L.map(elementId, mapOptions);
            
            // Add OpenStreetMap tiles immediately
            const isDarkMode = document.body.classList.contains('dark-mode');
            const tileLayer = isDarkMode ? 
                L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                    attribution: '© OpenStreetMap contributors © CARTO',
                    subdomains: 'abcd',
                    maxZoom: 19
                }) :
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 19
                });
            
            tileLayer.addTo(map);
            
            // Store map reference
            window.allMaps[elementId] = map;
            window[elementId + '_map'] = map;
            
            // Ensure map renders properly
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
            
            if (window.addSystemUpdate) {
                window.addSystemUpdate(`Map created: ${elementId}`, 'success');
            }
            
            return map;
        } catch (error) {
            console.error('Error creating map:', error);
            if (window.addSystemUpdate) {
                window.addSystemUpdate(`Map error: ${elementId} - ${error.message}`, 'error');
            }
            return null;
        }
    };
    
    // Auto-fix maps when tabs change
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('tab-link')) {
            setTimeout(() => {
                fixAllMaps();
            }, 200);
        }
    });
    
    // Initialize maps on page load
    function initializeMapsOnLoad() {
        console.log('Initializing maps on load...');
        
        // Wait for Leaflet to be loaded
        if (typeof L === 'undefined') {
            console.log('Waiting for Leaflet...');
            setTimeout(initializeMapsOnLoad, 100);
            return;
        }
        
        // Apply the override
        forceReliableMapTiles();
        
        // Initialize Live IAP map if element exists
        const liveIAPMapEl = document.getElementById('liveIAPMap');
        if (liveIAPMapEl && !window.liveIAPMap) {
            window.liveIAPMap = initializeMap('liveIAPMap', {
                center: [28.5383, -81.3792],
                zoom: 7
            });
        }
        
        // Initialize operational map if element exists
        const operationalMapEl = document.getElementById('operationalMap');
        if (operationalMapEl && !window.operationalMap) {
            window.operationalMap = initializeMap('operationalMap', {
                center: [39.5, -98.5], // US center
                zoom: 4
            });
        }
        
        // Fix any existing maps
        setTimeout(() => {
            fixAllMaps();
        }, 500);
    }
    
    // Global refresh function for console debugging
    window.refreshMaps = function() {
        console.log('Refreshing all maps...');
        fixAllMaps();
        
        // Re-initialize if needed
        Object.keys(window.allMaps).forEach(mapId => {
            const map = window.allMaps[mapId];
            if (map && map._container) {
                map.invalidateSize();
            }
        });
    };
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMapsOnLoad);
    } else {
        initializeMapsOnLoad();
    }
    
    // Also try to fix maps after a delay to catch late-loading elements
    setTimeout(() => {
        initializeMapsOnLoad();
    }, 2000);
})();