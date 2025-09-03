// Working Reactive Maps - Maps that actually update when you select counties!

(function() {
    'use strict';
    
    let startHereMapInstance = null;
    let liveIAPMapInstance = null;
    let startHereMarkers = [];
    let liveIAPMarkers = [];
    
    // Create a basic map
    function createMap(containerId) {
        console.log(`Creating map: ${containerId}`);
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return null;
        }
        
        // Ensure height
        container.style.height = '400px';
        container.innerHTML = '';
        
        try {
            const map = L.map(containerId).setView([39.8283, -98.5795], 4);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap',
                maxZoom: 18
            }).addTo(map);
            
            return map;
        } catch (e) {
            console.error(`Map creation failed: ${e.message}`);
            container.innerHTML = '<div style="padding: 2rem; text-align: center;">Map unavailable</div>';
            return null;
        }
    }
    
    // Clear markers from map
    function clearMarkers(markers, map) {
        markers.forEach(marker => {
            if (map && marker) {
                map.removeLayer(marker);
            }
        });
        markers.length = 0;
    }
    
    // Get Florida county boundaries (we have this data)
    function getFloridaCountyBoundary(countyName) {
        // Check if we have Florida county data
        if (typeof floridaCountiesGeoJSON !== 'undefined') {
            const feature = floridaCountiesGeoJSON.features.find(f => 
                f.properties && f.properties.NAME === countyName
            );
            if (feature) {
                return feature;
            }
        }
        return null;
    }
    
    // Update Start Here map
    function updateStartHereMap() {
        console.log('updateStartHereMap called');
        
        if (!startHereMapInstance) {
            console.log('No Start Here map instance, creating...');
            const container = document.getElementById('startHereMap');
            if (container) {
                startHereMapInstance = createMap('startHereMap');
            }
        }
        
        if (!startHereMapInstance) {
            console.error('Could not create Start Here map');
            return;
        }
        
        // Clear existing markers
        clearMarkers(startHereMarkers, startHereMapInstance);
        
        // Get current data
        const operationData = window.DataStore ? 
            DataStore.get('operation') : 
            JSON.parse(localStorage.getItem('form5266_operation')) || {};
        
        console.log('Operation data:', operationData);
        
        if (!operationData.counties || operationData.counties.length === 0) {
            console.log('No counties selected');
            return;
        }
        
        console.log(`Adding ${operationData.counties.length} counties to map`);
        
        let bounds = [];
        
        operationData.counties.forEach(countyName => {
            console.log(`Processing county: ${countyName}`);
            
            // For Florida, try to add actual boundaries
            if (operationData.region === 'Florida') {
                const boundary = getFloridaCountyBoundary(countyName);
                if (boundary) {
                    const layer = L.geoJSON(boundary, {
                        style: {
                            fillColor: '#ff0000',
                            weight: 2,
                            opacity: 1,
                            color: '#ff0000',
                            fillOpacity: 0.3
                        }
                    }).addTo(startHereMapInstance);
                    
                    layer.bindPopup(`<strong>${countyName}</strong>`);
                    startHereMarkers.push(layer);
                    
                    // Add bounds
                    const layerBounds = layer.getBounds();
                    bounds.push([layerBounds.getSouth(), layerBounds.getWest()]);
                    bounds.push([layerBounds.getNorth(), layerBounds.getEast()]);
                    
                    console.log(`Added boundary for ${countyName}`);
                    return;
                }
            }
            
            // Fallback to markers
            const coords = getCountyCoordinates(countyName, operationData.region);
            if (coords) {
                const marker = L.marker(coords)
                    .addTo(startHereMapInstance)
                    .bindPopup(`<strong>${countyName}</strong>`);
                
                startHereMarkers.push(marker);
                bounds.push(coords);
                console.log(`Added marker for ${countyName} at ${coords}`);
            } else {
                console.log(`No coordinates found for ${countyName}`);
            }
        });
        
        // Zoom to show all markers/boundaries
        if (bounds.length > 0) {
            startHereMapInstance.fitBounds(bounds, { padding: [50, 50] });
            console.log('Map zoomed to show all counties');
        }
    }
    
    // Update Live IAP map
    function updateLiveIAPMap() {
        console.log('updateLiveIAPMap called');
        
        if (!liveIAPMapInstance) {
            const container = document.getElementById('liveIAPMap');
            if (container) {
                liveIAPMapInstance = createMap('liveIAPMap');
            }
        }
        
        if (!liveIAPMapInstance) return;
        
        // Clear existing markers
        clearMarkers(liveIAPMarkers, liveIAPMapInstance);
        
        // Get current data
        const operationData = window.DataStore ? 
            DataStore.get('operation') : 
            JSON.parse(localStorage.getItem('form5266_operation')) || {};
        
        if (!operationData.counties || operationData.counties.length === 0) {
            return;
        }
        
        let bounds = [];
        
        operationData.counties.forEach(countyName => {
            // For Florida, try boundaries
            if (operationData.region === 'Florida') {
                const boundary = getFloridaCountyBoundary(countyName);
                if (boundary) {
                    const layer = L.geoJSON(boundary, {
                        style: {
                            fillColor: '#ff0000',
                            weight: 2,
                            opacity: 1,
                            color: '#ff0000',
                            fillOpacity: 0.3
                        }
                    }).addTo(liveIAPMapInstance);
                    
                    layer.bindPopup(`<strong>${countyName}</strong>`);
                    liveIAPMarkers.push(layer);
                    
                    const layerBounds = layer.getBounds();
                    bounds.push([layerBounds.getSouth(), layerBounds.getWest()]);
                    bounds.push([layerBounds.getNorth(), layerBounds.getEast()]);
                    return;
                }
            }
            
            // Fallback to markers
            const coords = getCountyCoordinates(countyName, operationData.region);
            if (coords) {
                const marker = L.marker(coords)
                    .addTo(liveIAPMapInstance)
                    .bindPopup(`<strong>${countyName}</strong>`);
                
                liveIAPMarkers.push(marker);
                bounds.push(coords);
            }
        });
        
        // Zoom to show all
        if (bounds.length > 0) {
            liveIAPMapInstance.fitBounds(bounds, { padding: [50, 50] });
        }
    }
    
    // County coordinates
    function getCountyCoordinates(countyName, region) {
        const coords = {
            'Florida': {
                'Miami-Dade': [25.7617, -80.1918],
                'Broward': [26.1224, -80.1373],
                'Palm Beach': [26.7056, -80.0364],
                'Monroe': [24.6463, -81.4503],
                'Collier': [26.0765, -81.4170],
                'Lee': [26.5318, -81.8358],
                'Charlotte': [26.9898, -82.0453],
                'Sarasota': [27.2658, -82.4795],
                'Manatee': [27.4799, -82.3543],
                'Pinellas': [27.8764, -82.7779],
                'Hillsborough': [27.9904, -82.3018],
                'Pasco': [28.3232, -82.4319],
                'Hernando': [28.5544, -82.3885],
                'Citrus': [28.8831, -82.4597],
                'Sumter': [28.7494, -82.1047],
                'Marion': [29.2123, -82.0620],
                'Levy': [29.2553, -82.7992],
                'Alachua': [29.6516, -82.3248],
                'Orange': [28.5383, -81.3792],
                'Osceola': [28.0564, -81.0815],
                'Brevard': [28.2639, -80.7214],
                'Volusia': [29.0280, -81.0750],
                'Seminole': [28.7097, -81.2085],
                'Lake': [28.7611, -81.7178],
                'Polk': [27.8947, -81.5862],
                'Duval': [30.3322, -81.6557],
                'St. Johns': [29.9012, -81.3124],
                'Clay': [29.9858, -81.8545],
                'Putnam': [29.5844, -81.7787],
                'Flagler': [29.4099, -81.2573],
                'Nassau': [30.6107, -81.7632],
                'Baker': [30.3308, -82.2846],
                'Bradford': [29.9441, -82.1098],
                'Columbia': [30.1897, -82.6393],
                'Union': [30.0727, -82.3498],
                'Gilchrist': [29.6838, -82.8137],
                'Dixie': [29.5966, -83.1501],
                'Lafayette': [30.1127, -83.2236],
                'Suwannee': [30.3926, -82.9962],
                'Hamilton': [30.5061, -82.9468],
                'Madison': [30.4693, -83.4132],
                'Taylor': [30.0441, -83.5816],
                'Leon': [30.4383, -84.2807],
                'Wakulla': [30.1463, -84.3765],
                'Jefferson': [30.5450, -83.8781],
                'Gadsden': [30.5896, -84.6145],
                'Liberty': [30.2373, -84.8824],
                'Franklin': [29.7969, -84.8630],
                'Gulf': [29.9491, -85.2040],
                'Bay': [30.2266, -85.6477],
                'Calhoun': [30.4521, -85.1851],
                'Jackson': [30.7769, -85.2286],
                'Washington': [30.6168, -85.6138],
                'Holmes': [30.8541, -85.8655],
                'Walton': [30.5702, -86.1199],
                'Okaloosa': [30.7435, -86.5815],
                'Santa Rosa': [30.6741, -86.9371],
                'Escambia': [30.6389, -87.3414],
                'DeSoto': [27.1878, -81.8092],
                'Hardee': [27.5125, -81.8153],
                'Highlands': [27.3479, -81.3367],
                'Glades': [26.9311, -81.1845],
                'Hendry': [26.5801, -81.4140],
                'Indian River': [27.6367, -80.3978],
                'Martin': [27.0669, -80.2331],
                'Okeechobee': [27.2439, -80.8298],
                'St. Lucie': [27.3364, -80.3520]
            }
        };
        
        if (coords[region] && coords[region][countyName]) {
            return coords[region][countyName];
        }
        return null;
    }
    
    // Hook into county checkbox changes
    function setupCountyListeners() {
        console.log('Setting up county listeners');
        
        // Listen for changes to county checkboxes
        document.addEventListener('change', function(e) {
            if (e.target.type === 'checkbox' && e.target.closest('#countyGrid')) {
                console.log('County checkbox changed');
                setTimeout(() => {
                    updateStartHereMap();
                    updateLiveIAPMap();
                }, 100);
            }
        });
        
        // Listen for tab switches
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('tab-link')) {
                const tabName = e.target.dataset.tab;
                console.log(`Tab switched to: ${tabName}`);
                
                setTimeout(() => {
                    if (tabName === 'start-here') {
                        updateStartHereMap();
                    } else if (tabName === 'live-iap') {
                        updateLiveIAPMap();
                    }
                }, 200);
            }
        });
    }
    
    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Reactive Maps initializing...');
        
        setupCountyListeners();
        
        // If DataStore exists, subscribe to changes
        if (window.DataStore) {
            DataStore.subscribe('operation', function(data) {
                console.log('Operation data changed, updating maps');
                updateStartHereMap();
                updateLiveIAPMap();
            });
        }
        
        // Initial map update
        setTimeout(() => {
            const activeTab = document.querySelector('.tab-content.active');
            if (activeTab) {
                if (activeTab.id === 'start-here') {
                    updateStartHereMap();
                } else if (activeTab.id === 'live-iap') {
                    updateLiveIAPMap();
                }
            }
        }, 1000);
    });
    
    // Export functions
    window.updateStartHereMap = updateStartHereMap;
    window.updateLiveIAPMap = updateLiveIAPMap;
    
    console.log('Reactive Maps loaded - maps will update when counties are selected');
    
})();