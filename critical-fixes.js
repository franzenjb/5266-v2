// CRITICAL FIXES - Make Start Here Statistics save and maps work!

(function() {
    'use strict';
    
    console.log('CRITICAL FIXES LOADING...');
    
    // ============= FIX 1: SAVE START HERE STATISTICS =============
    
    // Save form data on EVERY change
    function saveStartHereData() {
        const data = {
            drNumber: document.getElementById('drNumber')?.value || '',
            operationName: document.getElementById('operationName')?.value || '',
            startDate: document.getElementById('startDate')?.value || '',
            region: document.getElementById('region')?.value || '',
            droDirector: document.getElementById('droDirector')?.value || '',
            droDirectorPhone: document.getElementById('droDirectorPhone')?.value || '',
            droDirectorEmail: document.getElementById('droDirectorEmail')?.value || '',
            deputyDirector: document.getElementById('deputyDirector')?.value || '',
            deputyDirectorPhone: document.getElementById('deputyDirectorPhone')?.value || '',
            deputyDirectorEmail: document.getElementById('deputyDirectorEmail')?.value || '',
            // Get selected counties
            counties: [],
            chapters: []
        };
        
        // Get checked counties
        const checkedBoxes = document.querySelectorAll('#countyGrid input[type="checkbox"]:checked');
        checkedBoxes.forEach(box => {
            data.counties.push(box.value);
        });
        
        // Save to localStorage directly
        localStorage.setItem('form5266_operation', JSON.stringify(data));
        
        // Also save to DataStore if it exists
        if (window.DataStore) {
            DataStore.set('operation', null, data);
        }
        
        console.log('Start Here data saved:', data);
    }
    
    // Restore form data when tab is shown
    function restoreStartHereData() {
        console.log('Restoring Start Here data...');
        
        const savedData = JSON.parse(localStorage.getItem('form5266_operation')) || {};
        
        // Restore all form fields
        if (document.getElementById('drNumber')) {
            document.getElementById('drNumber').value = savedData.drNumber || '';
        }
        if (document.getElementById('operationName')) {
            document.getElementById('operationName').value = savedData.operationName || '';
        }
        if (document.getElementById('startDate')) {
            document.getElementById('startDate').value = savedData.startDate || '';
        }
        if (document.getElementById('droDirector')) {
            document.getElementById('droDirector').value = savedData.droDirector || '';
        }
        if (document.getElementById('droDirectorPhone')) {
            document.getElementById('droDirectorPhone').value = savedData.droDirectorPhone || '';
        }
        if (document.getElementById('droDirectorEmail')) {
            document.getElementById('droDirectorEmail').value = savedData.droDirectorEmail || '';
        }
        if (document.getElementById('deputyDirector')) {
            document.getElementById('deputyDirector').value = savedData.deputyDirector || '';
        }
        if (document.getElementById('deputyDirectorPhone')) {
            document.getElementById('deputyDirectorPhone').value = savedData.deputyDirectorPhone || '';
        }
        if (document.getElementById('deputyDirectorEmail')) {
            document.getElementById('deputyDirectorEmail').value = savedData.deputyDirectorEmail || '';
        }
        
        // Restore region
        if (savedData.region && document.getElementById('region')) {
            document.getElementById('region').value = savedData.region;
            // Trigger change event to load counties
            document.getElementById('region').dispatchEvent(new Event('change'));
            
            // Restore county selections after delay
            if (savedData.counties && savedData.counties.length > 0) {
                setTimeout(() => {
                    savedData.counties.forEach(county => {
                        const checkbox = document.querySelector(`#countyGrid input[value="${county}"]`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                    });
                    // Update the county count
                    updateSelectedCounties();
                }, 500);
            }
        }
        
        console.log('Start Here data restored:', savedData);
    }
    
    // ============= FIX 2: MAKE MAPS WORK =============
    
    let mapInstances = {
        startHere: null,
        liveIAP: null
    };
    
    // Simple map creation
    function createSimpleMap(containerId) {
        console.log(`Creating map: ${containerId}`);
        
        const container = document.getElementById(containerId);
        if (!container) return null;
        
        // Clear and set height
        container.innerHTML = '';
        container.style.height = '400px';
        
        try {
            const map = L.map(containerId).setView([39.8283, -98.5795], 4);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(map);
            return map;
        } catch (e) {
            console.error(`Map error: ${e}`);
            return null;
        }
    }
    
    // Update map with counties
    function updateMapWithCounties(mapId) {
        console.log(`Updating map: ${mapId}`);
        
        // Get the map instance or create it
        let map = mapInstances[mapId];
        if (!map) {
            const containerId = mapId === 'startHere' ? 'startHereMap' : 'liveIAPMap';
            map = createSimpleMap(containerId);
            if (!map) return;
            mapInstances[mapId] = map;
        }
        
        // Clear existing layers
        map.eachLayer(layer => {
            if (layer instanceof L.Marker || layer instanceof L.GeoJSON) {
                map.removeLayer(layer);
            }
        });
        
        // Get saved data
        const savedData = JSON.parse(localStorage.getItem('form5266_operation')) || {};
        
        if (!savedData.counties || savedData.counties.length === 0) {
            console.log('No counties to display');
            return;
        }
        
        console.log(`Adding ${savedData.counties.length} counties to map`);
        
        // Add markers for each county
        let addedMarkers = 0;
        savedData.counties.forEach(county => {
            // Simple coordinates for Florida counties
            const coords = getFloridaCountyCoords(county);
            if (coords) {
                L.marker(coords)
                    .addTo(map)
                    .bindPopup(`<strong>${county}</strong>`);
                addedMarkers++;
            }
        });
        
        console.log(`Added ${addedMarkers} markers to map`);
        
        // Zoom to Florida if counties are selected
        if (addedMarkers > 0 && savedData.region === 'Florida') {
            map.setView([27.6648, -81.5158], 6);
        }
    }
    
    // Get Florida county coordinates
    function getFloridaCountyCoords(county) {
        const coords = {
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
            'Orange': [28.5383, -81.3792],
            'Osceola': [28.0564, -81.0815],
            'Brevard': [28.2639, -80.7214],
            'Volusia': [29.0280, -81.0750],
            'Polk': [27.8947, -81.5862],
            'Duval': [30.3322, -81.6557],
            'Leon': [30.4383, -84.2807]
        };
        return coords[county] || null;
    }
    
    // Update selected counties (override the existing function)
    window.updateSelectedCounties = function() {
        const selectedCheckboxes = document.querySelectorAll('#countyGrid input:checked');
        document.getElementById('selectedCountyCount').textContent = selectedCheckboxes.length;
        
        // Save immediately
        saveStartHereData();
        
        // Update maps immediately
        updateMapWithCounties('startHere');
        updateMapWithCounties('liveIAP');
        
        console.log(`Selected ${selectedCheckboxes.length} counties`);
    };
    
    // ============= FIX 3: ATTACH EVENT LISTENERS =============
    
    function attachEventListeners() {
        console.log('Attaching event listeners...');
        
        // Save on any input change
        const inputs = document.querySelectorAll('#start-here input, #start-here select');
        inputs.forEach(input => {
            input.addEventListener('change', saveStartHereData);
            input.addEventListener('blur', saveStartHereData);
        });
        
        // Listen for county checkbox changes
        document.addEventListener('change', function(e) {
            if (e.target.type === 'checkbox' && e.target.closest('#countyGrid')) {
                console.log('County checkbox changed');
                updateSelectedCounties();
            }
        });
        
        // Listen for tab switches
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('tab-link')) {
                const tabName = e.target.dataset.tab;
                console.log(`Tab switched to: ${tabName}`);
                
                setTimeout(() => {
                    if (tabName === 'start-here') {
                        restoreStartHereData();
                        updateMapWithCounties('startHere');
                    } else if (tabName === 'live-iap') {
                        updateMapWithCounties('liveIAP');
                    }
                }, 100);
            }
        });
    }
    
    // ============= INITIALIZE ON LOAD =============
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log('CRITICAL FIXES INITIALIZING...');
        
        // Restore data immediately
        setTimeout(() => {
            restoreStartHereData();
            attachEventListeners();
            
            // Update map if on Start Here tab
            const activeTab = document.querySelector('.tab-content.active');
            if (activeTab && activeTab.id === 'start-here') {
                updateMapWithCounties('startHere');
            }
        }, 500);
    });
    
    // Export for debugging
    window.saveStartHereData = saveStartHereData;
    window.restoreStartHereData = restoreStartHereData;
    window.updateMapWithCounties = updateMapWithCounties;
    
    console.log('CRITICAL FIXES LOADED - Data will save and maps will work!');
    
})();