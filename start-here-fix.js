// Start Here Statistics Fix and IAP Integration
// This ensures Start Here data properly flows to IAP Builder

(function() {
    // Save Start Here data and make it available to IAP Builder
    window.saveStartHereData = function() {
        const operationData = {
            drNumber: document.getElementById('drNumber')?.value || '',
            operationName: document.getElementById('operationName')?.value || '',
            startDate: document.getElementById('startDate')?.value || '',
            region: document.getElementById('region')?.value || '',
            counties: [],
            chapters: [],
            droDirector: document.getElementById('droDirector')?.value || '',
            droDirectorPhone: document.getElementById('droDirectorPhone')?.value || '',
            droDirectorEmail: document.getElementById('droDirectorEmail')?.value || '',
            deputyDirector: document.getElementById('deputyDirector')?.value || '',
            deputyDirectorPhone: document.getElementById('deputyDirectorPhone')?.value || '',
            deputyDirectorEmail: document.getElementById('deputyDirectorEmail')?.value || ''
        };
        
        // Get selected counties
        const selectedCounties = document.querySelectorAll('#countyGrid input:checked');
        selectedCounties.forEach(checkbox => {
            operationData.counties.push(checkbox.value);
        });
        
        // Get associated chapters
        if (typeof redCrossRegionsData !== 'undefined' && operationData.region) {
            const regionData = redCrossRegionsData[operationData.region];
            if (regionData) {
                const chaptersSet = new Set();
                operationData.counties.forEach(county => {
                    if (regionData.counties && regionData.counties[county]) {
                        chaptersSet.add(regionData.counties[county]);
                    }
                });
                operationData.chapters = Array.from(chaptersSet);
            }
        }
        
        // Save to localStorage
        localStorage.setItem('form5266_operation', JSON.stringify(operationData));
        
        // Update IAP current with this data
        const currentIAP = JSON.parse(localStorage.getItem('form5266_iap_current')) || {};
        currentIAP.drNumber = operationData.drNumber;
        currentIAP.incidentName = operationData.operationName;
        currentIAP.droDirector = operationData.droDirector;
        currentIAP.droDirectorPhone = operationData.droDirectorPhone;
        currentIAP.deputyDirector = operationData.deputyDirector;
        currentIAP.deputyDirectorPhone = operationData.deputyDirectorPhone;
        currentIAP.region = operationData.region;
        currentIAP.counties = operationData.counties;
        currentIAP.chapters = operationData.chapters;
        localStorage.setItem('form5266_iap_current', JSON.stringify(currentIAP));
        
        // Log update
        if (window.addSystemUpdate) {
            window.addSystemUpdate('Start Here data saved and synced to IAP', 'save');
        }
        
        return operationData;
    };
    
    // Auto-save on input changes
    function attachAutoSave() {
        const fields = [
            'drNumber', 'operationName', 'startDate', 'region',
            'droDirector', 'droDirectorPhone', 'droDirectorEmail',
            'deputyDirector', 'deputyDirectorPhone', 'deputyDirectorEmail'
        ];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('change', function() {
                    saveStartHereData();
                    if (window.addSystemUpdate) {
                        window.addSystemUpdate(`${fieldId} updated: ${this.value}`, 'data');
                    }
                });
            }
        });
    }
    
    // Fix the populateRegions function
    window.fixPopulateRegions = function() {
        const regionSelect = document.getElementById('region');
        if (!regionSelect) return;
        
        // Clear existing options except the first
        regionSelect.innerHTML = '<option value="">Select Region</option>';
        
        // Try multiple data sources
        let regions = [];
        
        if (typeof allRegions !== 'undefined' && Array.isArray(allRegions)) {
            regions = allRegions;
            console.log('Using allRegions array:', regions.length);
        } else if (typeof redCrossRegionsData !== 'undefined') {
            regions = Object.keys(redCrossRegionsData);
            console.log('Using redCrossRegionsData keys:', regions.length);
        }
        
        if (regions.length === 0) {
            console.error('No regions data found!');
            // Add fallback regions
            regions = [
                'Alabama', 'Alaska', 'Arizona-New Mexico', 'Arkansas', 'California',
                'Central & Southern Illinois', 'Colorado-Wyoming', 'Connecticut-Rhode Island',
                'Delaware', 'Florida', 'Georgia', 'Greater New York', 'Greater Pennsylvania',
                'Hawaii & Pacific Islands', 'Idaho-Montana', 'Indiana', 'Iowa', 'Kansas-Oklahoma',
                'Kentucky', 'Louisiana', 'Maine', 'Maryland-National Capital & Greater Chesapeake',
                'Massachusetts', 'Michigan', 'Minnesota-Dakotas', 'Mississippi', 'Missouri',
                'Nebraska', 'Nevada-Utah', 'New Hampshire-Vermont', 'New Jersey',
                'North Carolina', 'Northern & Eastern Michigan', 'Northern California',
                'Northern New England', 'Ohio', 'Oregon', 'South Carolina', 'Southeast Michigan',
                'Southeast Pennsylvania', 'Southern California', 'Tennessee', 'Texas',
                'Virginia', 'Washington', 'West Virginia', 'Western New York', 'Wisconsin'
            ];
        }
        
        // Sort regions alphabetically
        regions.sort();
        
        // Add regions to dropdown
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });
        
        if (window.addSystemUpdate) {
            window.addSystemUpdate(`Loaded ${regions.length} regions`, 'success');
        }
    };
    
    // Initialize Start Here when DOM is ready
    function initializeStartHere() {
        // Fix populate regions
        fixPopulateRegions();
        
        // Attach auto-save
        attachAutoSave();
        
        // Load existing data
        const savedData = JSON.parse(localStorage.getItem('form5266_operation')) || {};
        if (savedData.drNumber) {
            document.getElementById('drNumber').value = savedData.drNumber || '';
            document.getElementById('operationName').value = savedData.operationName || '';
            document.getElementById('startDate').value = savedData.startDate || '';
            document.getElementById('droDirector').value = savedData.droDirector || '';
            document.getElementById('droDirectorPhone').value = savedData.droDirectorPhone || '';
            document.getElementById('droDirectorEmail').value = savedData.droDirectorEmail || '';
            document.getElementById('deputyDirector').value = savedData.deputyDirector || '';
            document.getElementById('deputyDirectorPhone').value = savedData.deputyDirectorPhone || '';
            document.getElementById('deputyDirectorEmail').value = savedData.deputyDirectorEmail || '';
            
            if (savedData.region) {
                document.getElementById('region').value = savedData.region;
                // Trigger region change to load counties
                document.getElementById('region').dispatchEvent(new Event('change'));
                
                // Check selected counties after a delay
                setTimeout(() => {
                    if (savedData.counties && savedData.counties.length > 0) {
                        savedData.counties.forEach(county => {
                            const checkbox = document.querySelector(`#countyGrid input[value="${county}"]`);
                            if (checkbox) {
                                checkbox.checked = true;
                            }
                        });
                        // Update the selected counties display
                        if (typeof updateSelectedCounties === 'function') {
                            updateSelectedCounties();
                        }
                    }
                }, 500);
            }
        }
        
        if (window.addSystemUpdate) {
            window.addSystemUpdate('Start Here Statistics initialized', 'success');
        }
    }
    
    // Wait for DOM and data to be ready
    function waitForDataAndInit() {
        if (document.getElementById('region')) {
            initializeStartHere();
        } else {
            setTimeout(waitForDataAndInit, 100);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForDataAndInit);
    } else {
        waitForDataAndInit();
    }
    
    // Also reinitialize when Start Here tab is clicked
    document.addEventListener('click', function(e) {
        if (e.target.textContent === 'Start Here Statistics' && e.target.classList.contains('tab-link')) {
            setTimeout(() => {
                if (document.getElementById('region').options.length <= 1) {
                    fixPopulateRegions();
                }
            }, 100);
        }
    });
})();