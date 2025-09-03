// Fixes for Form 5266 v2
// This file contains fixes for the accordion, maps, and updates functionality

// Global variable for Live IAP map
let liveIAPMap = null;

// Add update to the scrolling list  
function addUpdate(message) {
    const updatesList = document.getElementById('updatesList');
    if (!updatesList) return;
    
    const updateItem = document.createElement('div');
    updateItem.className = 'update-item';
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    updateItem.innerHTML = `
        <span class="update-time">${time}</span>
        <span class="update-text">${message}</span>
    `;
    
    updatesList.insertBefore(updateItem, updatesList.firstChild);
    
    // Keep only last 20 updates
    while (updatesList.children.length > 20) {
        updatesList.removeChild(updatesList.lastChild);
    }
}

// Initialize Live IAP map
function initializeLiveIAPMap() {
    const mapContainer = document.getElementById('liveIAPMap');
    if (!mapContainer || liveIAPMap) return;
    
    // Check if enhanced_maps.js is loaded
    if (typeof MapUtils === 'undefined') {
        console.error('MapUtils not loaded');
        setTimeout(() => initializeLiveIAPMap(), 500);
        return;
    }
    
    // Get data from localStorage
    const operationData = JSON.parse(localStorage.getItem('form5266_operation')) || {};
    const feedingData = JSON.parse(localStorage.getItem('form5266_feeding')) || [];
    const selectedCounties = operationData.counties || [];
    const region = operationData.region || '';
    
    // Use National Map System if available
    try {
        if (typeof NationalMapSystem !== 'undefined' && region) {
            liveIAPMap = NationalMapSystem.initializeRegionalMap('liveIAPMap', region);
            if (liveIAPMap) {
                console.log(`Live IAP map initialized for ${region}`);
            }
        } else {
            // Fallback to default settings
            let mapOptions = {
                center: [39.5, -98.5], // US center
                zoom: 4,
                tileProvider: 'cartodb'
            };
            
            liveIAPMap = MapUtils.initializeEnhancedMap('liveIAPMap', mapOptions);
        }
        
        if (!liveIAPMap) return;
        
        // Add county layers if available
        if (typeof floridaCounties !== 'undefined' || typeof arizonaNewMexicoCounties !== 'undefined') {
            let geoData = typeof floridaCounties !== 'undefined' ? floridaCounties : null;
            if (region && region.toLowerCase().includes('arizona') && typeof arizonaNewMexicoCounties !== 'undefined') {
                geoData = arizonaNewMexicoCounties;
            }
            
            if (geoData && selectedCounties.length > 0) {
                const choroplethLayer = MapUtils.createChoroplethLayer(geoData, selectedCounties);
                choroplethLayer.addTo(liveIAPMap);
                MapUtils.addMapLegend(liveIAPMap);
                
                // Add data overlay with statistics
                const totalMeals = feedingData.reduce((sum, f) => sum + f.meals, 0);
                const totalSnacks = feedingData.reduce((sum, f) => sum + f.snacks, 0);
                
                MapUtils.addDataOverlay(liveIAPMap, {
                    activeCounties: selectedCounties.length,
                    chapters: operationData.chapters ? operationData.chapters.length : 0,
                    meals: totalMeals,
                    snacks: totalSnacks
                });
                
                // Fit map to selected counties
                MapUtils.fitMapToBounds(liveIAPMap, choroplethLayer, selectedCounties);
            }
        }
        
        addUpdate('Operational map initialized');
    } catch (error) {
        console.error('Error initializing map:', error);
        addUpdate('Error loading map');
    }
}

// Enhanced tab switching with map initialization
document.addEventListener('DOMContentLoaded', function() {
    // Override existing tab switching to add map initialization
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetTab = this.getAttribute('data-tab');
            
            // Skip if no data-tab (external link)
            if (!targetTab) return;
            
            // Initialize Live IAP map when tab is activated
            if (targetTab === 'live-iap') {
                setTimeout(() => {
                    if (!liveIAPMap) {
                        initializeLiveIAPMap();
                    }
                }, 100);
            }
            
            // Add update when switching tabs
            if (targetTab) {
                addUpdate(`Switched to ${targetTab.replace('-', ' ')} view`);
            }
        });
    });
    
    // Initialize map if Live IAP is active on load
    if (document.getElementById('live-iap') && document.getElementById('live-iap').classList.contains('active')) {
        setTimeout(() => initializeLiveIAPMap(), 500);
    }
    
    // Add initial update
    addUpdate('System initialized');
});

// Fix accordion functionality in IAP Builder
function fixAccordions() {
    // This will be called from the IAP accordion page
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        // Remove any existing listeners
        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);
        
        // Add new listener
        newHeader.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content) {
                content.classList.toggle('active');
            }
        });
    });
}

// Fix for Load Sample Data to not overwrite
if (typeof loadSampleData !== 'undefined') {
    const originalLoadSampleData = loadSampleData;
    loadSampleData = function() {
        if (confirm('This will ADD sample data to your existing data (not replace it). Continue?')) {
            // Call original function but merge data instead
            originalLoadSampleData.call(this);
        }
    };
}

console.log('Fixes loaded successfully');