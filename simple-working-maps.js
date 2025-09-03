// Simple Working Maps - Just make the maps work!
// No more complex fixes - just basic, working maps

(function() {
    'use strict';
    
    let startHereMapInstance = null;
    let liveIAPMapInstance = null;
    
    // Simple function to create a map
    function createMap(containerId) {
        console.log(`Creating map in container: ${containerId}`);
        
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Map container ${containerId} not found`);
            return null;
        }
        
        // Set height if not set
        if (!container.style.height) {
            container.style.height = '400px';
        }
        
        // Clear any existing content
        container.innerHTML = '';
        
        try {
            // Create map centered on USA
            const map = L.map(containerId, {
                center: [39.8283, -98.5795], // Center of USA
                zoom: 4,
                scrollWheelZoom: false
            });
            
            // Add OpenStreetMap tiles (free, no API key needed)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(map);
            
            console.log(`Map created successfully in ${containerId}`);
            return map;
            
        } catch (error) {
            console.error(`Failed to create map in ${containerId}:`, error);
            // Show error message in container
            container.innerHTML = `
                <div style="padding: 2rem; text-align: center; background: #f0f0f0;">
                    <p style="color: #666;">Map could not be loaded</p>
                    <small>${error.message}</small>
                </div>
            `;
            return null;
        }
    }
    
    // Initialize Start Here map
    function initStartHereMap() {
        console.log('Initializing Start Here map...');
        
        // Only create if container exists and map doesn't
        if (document.getElementById('startHereMap') && !startHereMapInstance) {
            startHereMapInstance = createMap('startHereMap');
            
            if (startHereMapInstance) {
                // Add selected counties if any
                updateStartHereMapWithCounties();
            }
        }
    }
    
    // Initialize Live IAP map
    function initLiveIAPMap() {
        console.log('Initializing Live IAP map...');
        
        // Only create if container exists and map doesn't
        if (document.getElementById('liveIAPMap') && !liveIAPMapInstance) {
            liveIAPMapInstance = createMap('liveIAPMap');
            
            if (liveIAPMapInstance) {
                // Add selected counties if any
                updateLiveIAPMapWithCounties();
            }
        }
    }
    
    // Update Start Here map with selected counties
    function updateStartHereMapWithCounties() {
        if (!startHereMapInstance) return;
        
        // Get selected counties from DataStore or localStorage
        const operationData = window.DataStore ? 
            DataStore.get('operation') : 
            JSON.parse(localStorage.getItem('form5266_operation')) || {};
        
        if (operationData.counties && operationData.counties.length > 0) {
            console.log(`Updating Start Here map with ${operationData.counties.length} counties`);
            
            // For now, just add markers for counties (since we don't have all boundaries)
            operationData.counties.forEach(countyName => {
                // Try to find county coordinates
                const coords = getCountyCoordinates(countyName, operationData.region);
                if (coords) {
                    L.marker(coords)
                        .addTo(startHereMapInstance)
                        .bindPopup(`<strong>${countyName}</strong>`);
                }
            });
            
            // Zoom to show all markers
            if (operationData.region) {
                const regionCoords = getRegionCenter(operationData.region);
                if (regionCoords) {
                    startHereMapInstance.setView(regionCoords, 6);
                }
            }
        }
    }
    
    // Update Live IAP map with selected counties
    function updateLiveIAPMapWithCounties() {
        if (!liveIAPMapInstance) return;
        
        // Get selected counties from DataStore or localStorage
        const operationData = window.DataStore ? 
            DataStore.get('operation') : 
            JSON.parse(localStorage.getItem('form5266_operation')) || {};
        
        if (operationData.counties && operationData.counties.length > 0) {
            console.log(`Updating Live IAP map with ${operationData.counties.length} counties`);
            
            // For now, just add markers for counties
            operationData.counties.forEach(countyName => {
                const coords = getCountyCoordinates(countyName, operationData.region);
                if (coords) {
                    L.marker(coords)
                        .addTo(liveIAPMapInstance)
                        .bindPopup(`<strong>${countyName}</strong>`);
                }
            });
            
            // Zoom to show all markers
            if (operationData.region) {
                const regionCoords = getRegionCenter(operationData.region);
                if (regionCoords) {
                    liveIAPMapInstance.setView(regionCoords, 6);
                }
            }
        }
    }
    
    // Get approximate county coordinates (placeholder - would need real data)
    function getCountyCoordinates(countyName, region) {
        // For Florida counties, we have some data
        if (region === 'Florida') {
            const floridaCounties = {
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
                'Orange': [28.5383, -81.3792],
                'Osceola': [28.0564, -81.0815],
                'Brevard': [28.2639, -80.7214],
                'Volusia': [29.0280, -81.0750],
                'Seminole': [28.7097, -81.2085],
                'Lake': [28.7611, -81.7178],
                'Polk': [27.8947, -81.5862]
            };
            return floridaCounties[countyName] || null;
        }
        
        // For other regions, return null (would need more data)
        return null;
    }
    
    // Get region center coordinates
    function getRegionCenter(region) {
        const regionCenters = {
            'Florida': [27.6648, -81.5158],
            'Alabama': [32.3182, -86.9023],
            'Alaska': [64.0685, -152.2782],
            'Arizona': [34.0489, -111.0937],
            'Arkansas': [34.7465, -92.2896],
            'California': [36.7783, -119.4179],
            'Colorado': [39.5501, -105.7821],
            'Connecticut': [41.6032, -73.0877],
            'Delaware': [38.9108, -75.5277],
            'Georgia': [32.1656, -82.9001],
            'Hawaii': [19.8968, -155.5828],
            'Idaho': [44.0682, -114.7420],
            'Illinois': [40.6331, -89.3985],
            'Indiana': [40.2672, -86.1349],
            'Iowa': [41.8780, -93.0977],
            'Kansas': [39.0119, -98.4842],
            'Kentucky': [37.8393, -84.2700],
            'Louisiana': [30.9843, -91.9623],
            'Maine': [45.2538, -69.4455],
            'Maryland': [39.0458, -76.6413],
            'Massachusetts': [42.4072, -71.3824],
            'Michigan': [44.3148, -85.6024],
            'Minnesota': [46.7296, -94.6859],
            'Mississippi': [32.3547, -89.3985],
            'Missouri': [37.9643, -91.8318],
            'Montana': [46.8797, -110.3626],
            'Nebraska': [41.4925, -99.9018],
            'Nevada': [38.8026, -116.4194],
            'New Hampshire': [43.1939, -71.5724],
            'New Jersey': [40.0583, -74.4057],
            'New Mexico': [34.5199, -105.8701],
            'New York': [43.0000, -75.0000],
            'North Carolina': [35.7596, -79.0193],
            'North Dakota': [47.5515, -101.0020],
            'Ohio': [40.4173, -82.9071],
            'Oklahoma': [35.0078, -97.0929],
            'Oregon': [43.8041, -120.5542],
            'Pennsylvania': [41.2033, -77.1945],
            'Rhode Island': [41.5801, -71.4774],
            'South Carolina': [33.8361, -81.1637],
            'South Dakota': [43.9695, -99.9018],
            'Tennessee': [35.5175, -86.5804],
            'Texas': [31.9686, -99.9018],
            'Utah': [39.3210, -111.0937],
            'Vermont': [44.5588, -72.5778],
            'Virginia': [37.4316, -78.6569],
            'Washington': [47.7511, -120.7401],
            'West Virginia': [38.5976, -80.4549],
            'Wisconsin': [43.7844, -88.7879],
            'Wyoming': [43.0760, -107.2903]
        };
        
        return regionCenters[region] || [39.8283, -98.5795]; // Default to USA center
    }
    
    // Initialize maps when tab is shown
    function handleTabSwitch(tabName) {
        console.log(`Tab switched to: ${tabName}`);
        
        // Use setTimeout to ensure tab content is visible
        setTimeout(() => {
            if (tabName === 'start-here') {
                initStartHereMap();
            } else if (tabName === 'live-iap') {
                initLiveIAPMap();
            }
        }, 100);
    }
    
    // Listen for tab switches
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('tab-link')) {
            const tabName = e.target.dataset.tab;
            if (tabName) {
                handleTabSwitch(tabName);
            }
        }
    });
    
    // Initialize on page load if tabs are visible
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Simple Working Maps initializing...');
        
        // Check which tab is active
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            if (activeTab.id === 'start-here') {
                setTimeout(initStartHereMap, 500);
            } else if (activeTab.id === 'live-iap') {
                setTimeout(initLiveIAPMap, 500);
            }
        }
    });
    
    // Export functions for manual calling
    window.initStartHereMap = initStartHereMap;
    window.initLiveIAPMap = initLiveIAPMap;
    window.updateStartHereMapWithCounties = updateStartHereMapWithCounties;
    window.updateLiveIAPMapWithCounties = updateLiveIAPMapWithCounties;
    
    console.log('Simple Working Maps loaded - use initStartHereMap() or initLiveIAPMap() to manually initialize');
    
})();