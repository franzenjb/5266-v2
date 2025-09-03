// Fix for Start Here Statistics Map
// This file adds map functionality to the Start Here page

let startHereMap = null;
let startHereMapLayer = null;

// Initialize Start Here map
function initializeStartHereMap() {
    const mapContainer = document.getElementById('startHereMap');
    if (!mapContainer || startHereMap) return;
    
    // Check if required libraries are loaded
    if (typeof MapUtils === 'undefined') {
        console.error('MapUtils not loaded for Start Here map');
        setTimeout(() => initializeStartHereMap(), 500);
        return;
    }
    
    const region = document.getElementById('region').value || '';
    
    // Use National Map System if available
    if (typeof NationalMapSystem !== 'undefined' && region) {
        startHereMap = NationalMapSystem.initializeRegionalMap('startHereMap', region);
        if (startHereMap) {
            console.log(`Start Here map initialized for ${region}`);
            updateStartHereMap();
            return;
        }
    }
    
    // Fallback to default initialization
    let mapOptions = {
        center: [39.5, -98.5], // US center
        zoom: 4,
        tileProvider: 'cartodb'
    };
    
    try {
        startHereMap = MapUtils.initializeEnhancedMap('startHereMap', mapOptions);
        console.log('Start Here map initialized with default view');
        updateStartHereMap();
    } catch (error) {
        console.error('Error initializing Start Here map:', error);
    }
}

// Update map when counties are selected
function updateStartHereMap() {
    if (!startHereMap) {
        initializeStartHereMap();
        return;
    }
    
    // Get selected counties from checkboxes
    const selectedCounties = [];
    const checkboxes = document.querySelectorAll('#countyGrid input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        if (checkbox.value) {
            selectedCounties.push(checkbox.value);
        }
    });
    
    // Get region to determine which county data to use
    const region = document.getElementById('region').value || '';
    
    // Remove existing layer if present
    if (startHereMapLayer) {
        startHereMap.removeLayer(startHereMapLayer);
        startHereMapLayer = null;
    }
    
    // Add new layer with selected counties
    if (typeof floridaCounties !== 'undefined' || typeof arizonaNewMexicoCounties !== 'undefined') {
        let geoData = typeof floridaCounties !== 'undefined' ? floridaCounties : null;
        if (region && region.toLowerCase().includes('arizona') && typeof arizonaNewMexicoCounties !== 'undefined') {
            geoData = arizonaNewMexicoCounties;
        }
        
        if (geoData) {
            startHereMapLayer = MapUtils.createChoroplethLayer(geoData, selectedCounties);
            startHereMapLayer.addTo(startHereMap);
            
            // Fit map to selected counties if any
            if (selectedCounties.length > 0) {
                setTimeout(() => {
                    MapUtils.fitMapToBounds(startHereMap, startHereMapLayer, selectedCounties);
                }, 100);
            }
            
            console.log(`Updated Start Here map with ${selectedCounties.length} counties`);
        }
    }
}

// Override existing updateCountiesSelection to include map update
const originalUpdateCountiesSelection = window.updateCountiesSelection;
if (typeof originalUpdateCountiesSelection === 'function') {
    window.updateCountiesSelection = function() {
        // Call original function
        originalUpdateCountiesSelection.apply(this, arguments);
        
        // Update map after counties selection changes
        setTimeout(() => updateStartHereMap(), 100);
    };
}

// Add event listener for region change to reinitialize map
document.addEventListener('DOMContentLoaded', function() {
    const regionSelect = document.getElementById('region');
    if (regionSelect) {
        const originalOnChange = regionSelect.onchange;
        regionSelect.addEventListener('change', function() {
            // If there was an original handler, call it
            if (originalOnChange) {
                originalOnChange.call(this);
            }
            
            // Reinitialize map for new region
            if (startHereMap) {
                startHereMap.remove();
                startHereMap = null;
                startHereMapLayer = null;
            }
            setTimeout(() => initializeStartHereMap(), 100);
        });
    }
    
    // Add event delegation for county checkboxes
    const countyGrid = document.getElementById('countyGrid');
    if (countyGrid) {
        countyGrid.addEventListener('change', function(e) {
            if (e.target.type === 'checkbox') {
                updateStartHereMap();
                
                // Update selected count
                const selectedCount = document.querySelectorAll('#countyGrid input[type="checkbox"]:checked').length;
                const selectedCountyCountElement = document.getElementById('selectedCountyCount');
                if (selectedCountyCountElement) {
                    selectedCountyCountElement.textContent = selectedCount;
                }
                
                // Add update to activity feed
                if (typeof addUpdate === 'function') {
                    const action = e.target.checked ? 'Selected' : 'Deselected';
                    addUpdate(`${action} ${e.target.value} County`);
                }
            }
        });
    }
    
    // Initialize map when Start Here tab is activated
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            if (targetTab === 'start-here') {
                setTimeout(() => {
                    if (!startHereMap) {
                        initializeStartHereMap();
                    }
                }, 100);
            }
        });
    });
    
    // Check if Start Here is active on load
    const startHereTab = document.getElementById('start-here');
    if (startHereTab && startHereTab.classList.contains('active')) {
        setTimeout(() => initializeStartHereMap(), 500);
    }
});

console.log('Start Here map fix loaded');