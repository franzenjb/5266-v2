// Comprehensive Fix for Form 5266 v2
// This file fixes all core functionality issues

// Debug function to check data availability
function debugDataAvailability() {
    console.log('=== Data Availability Check ===');
    console.log('redCrossRegionsData exists:', typeof redCrossRegionsData !== 'undefined');
    console.log('allRegions exists:', typeof allRegions !== 'undefined');
    
    if (typeof redCrossRegionsData !== 'undefined') {
        const regions = Object.keys(redCrossRegionsData);
        console.log(`Found ${regions.length} regions`);
        console.log('Sample regions:', regions.slice(0, 5));
        
        // Check a sample region for counties
        if (regions.length > 0) {
            const sampleRegion = regions[0];
            const regionData = redCrossRegionsData[sampleRegion];
            console.log(`Sample region "${sampleRegion}":`, {
                countyCount: regionData.countyCount,
                chapters: regionData.chapters ? regionData.chapters.length : 0,
                counties: regionData.counties ? Object.keys(regionData.counties).length : 0
            });
        }
    }
}

// Fix the region dropdown population
function fixRegionDropdown() {
    const regionSelect = document.getElementById('region');
    if (!regionSelect) {
        console.error('Region select element not found');
        return;
    }
    
    // Clear and repopulate
    regionSelect.innerHTML = '<option value="">Select Region</option>';
    
    if (typeof allRegions !== 'undefined' && allRegions.length > 0) {
        console.log(`Populating dropdown with ${allRegions.length} regions`);
        allRegions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });
    } else if (typeof redCrossRegionsData !== 'undefined') {
        const regions = Object.keys(redCrossRegionsData).sort();
        console.log(`Using fallback - populating with ${regions.length} regions from redCrossRegionsData`);
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });
    } else {
        console.error('No region data available!');
    }
}

// Fix the county display when region is selected
function fixCountyDisplay() {
    const regionSelect = document.getElementById('region');
    if (!regionSelect) return;
    
    // Remove any existing listeners to avoid duplicates
    const newSelect = regionSelect.cloneNode(true);
    regionSelect.parentNode.replaceChild(newSelect, regionSelect);
    
    newSelect.addEventListener('change', function() {
        const selectedRegion = this.value;
        console.log(`Region changed to: ${selectedRegion}`);
        
        const regionInfo = document.getElementById('regionInfo');
        const countyGrid = document.getElementById('countyGrid');
        const chaptersDisplay = document.getElementById('chaptersDisplay');
        
        if (!selectedRegion) {
            if (regionInfo) regionInfo.classList.remove('active');
            if (countyGrid) countyGrid.innerHTML = '<div class="empty-state" style="padding: 2rem;"><p>Select a region to view available counties</p></div>';
            if (chaptersDisplay) chaptersDisplay.classList.remove('active');
            return;
        }
        
        // Get region data
        if (typeof redCrossRegionsData !== 'undefined' && redCrossRegionsData[selectedRegion]) {
            const regionData = redCrossRegionsData[selectedRegion];
            console.log(`Found data for ${selectedRegion}:`, {
                counties: regionData.counties ? Object.keys(regionData.counties).length : 0,
                chapters: regionData.chapters ? regionData.chapters.length : 0
            });
            
            // Update region info display
            if (document.getElementById('regionName')) {
                document.getElementById('regionName').textContent = selectedRegion;
            }
            if (document.getElementById('countyCount')) {
                document.getElementById('countyCount').textContent = regionData.countyCount || 0;
            }
            if (document.getElementById('chapterCount')) {
                document.getElementById('chapterCount').textContent = regionData.chapters ? regionData.chapters.length : 0;
            }
            if (document.getElementById('selectedCountyCount')) {
                document.getElementById('selectedCountyCount').textContent = '0';
            }
            if (regionInfo) {
                regionInfo.classList.add('active');
            }
            
            // Create county checkboxes
            if (countyGrid && regionData.counties) {
                countyGrid.innerHTML = '';
                const counties = Object.keys(regionData.counties).sort();
                
                console.log(`Creating checkboxes for ${counties.length} counties`);
                
                counties.forEach(countyName => {
                    const div = document.createElement('div');
                    div.className = 'county-item';
                    div.style.display = 'flex';
                    div.style.alignItems = 'center';
                    div.style.marginBottom = '0.5rem';
                    
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `county_${countyName.replace(/[^a-zA-Z0-9]/g, '_')}`;
                    checkbox.value = countyName;
                    checkbox.style.marginRight = '0.5rem';
                    
                    const label = document.createElement('label');
                    label.htmlFor = checkbox.id;
                    label.textContent = countyName;
                    label.style.cursor = 'pointer';
                    label.style.marginBottom = '0';
                    
                    checkbox.addEventListener('change', function() {
                        updateCountySelection(regionData);
                    });
                    
                    div.appendChild(checkbox);
                    div.appendChild(label);
                    countyGrid.appendChild(div);
                });
            }
        } else {
            console.error(`No data found for region: ${selectedRegion}`);
        }
    });
}

// Update county selection and chapters
function updateCountySelection(regionData) {
    const selectedCheckboxes = document.querySelectorAll('#countyGrid input:checked');
    
    if (document.getElementById('selectedCountyCount')) {
        document.getElementById('selectedCountyCount').textContent = selectedCheckboxes.length;
    }
    
    // Collect unique chapters
    const chaptersSet = new Set();
    selectedCheckboxes.forEach(checkbox => {
        if (regionData && regionData.counties) {
            const chapter = regionData.counties[checkbox.value];
            if (chapter) {
                chaptersSet.add(chapter);
            }
        }
    });
    
    // Display chapters
    const chaptersDisplay = document.getElementById('chaptersDisplay');
    const chaptersList = document.getElementById('chaptersList');
    
    if (chaptersList && chaptersSet.size > 0) {
        chaptersList.innerHTML = '';
        Array.from(chaptersSet).sort().forEach(chapter => {
            const tag = document.createElement('span');
            tag.className = 'chapter-tag';
            tag.style.cssText = 'display: inline-block; background: var(--red-cross-light); color: var(--red-cross-red); padding: 0.25rem 0.75rem; margin: 0.25rem; border-radius: 20px; font-size: 0.875rem;';
            tag.textContent = chapter;
            chaptersList.appendChild(tag);
        });
        
        if (chaptersDisplay) {
            chaptersDisplay.classList.add('active');
        }
    } else if (chaptersDisplay) {
        chaptersDisplay.classList.remove('active');
    }
    
    // Save selected counties
    const operationData = JSON.parse(localStorage.getItem('form5266_operation')) || {};
    operationData.counties = Array.from(selectedCheckboxes).map(cb => cb.value);
    operationData.chapters = Array.from(chaptersSet);
    localStorage.setItem('form5266_operation', JSON.stringify(operationData));
    
    // Update maps if the function exists
    if (typeof updateStartHereMap === 'function') {
        updateStartHereMap();
    }
}

// Fix maps to display properly
function fixMaps() {
    console.log('Fixing maps...');
    
    // Ensure all map containers are visible
    const mapContainers = document.querySelectorAll('.map-container, #startHereMap, #liveIAPMap');
    mapContainers.forEach(container => {
        if (container && !container.style.height) {
            container.style.height = '400px';
        }
    });
    
    // Trigger map refresh if functions exist
    if (typeof refreshMaps === 'function') {
        console.log('Refreshing all maps...');
        setTimeout(refreshMaps, 500);
    }
    
    if (typeof initializeStartHereMap === 'function') {
        console.log('Initializing Start Here map...');
        setTimeout(initializeStartHereMap, 500);
    }
}

// Apply all fixes when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Applying comprehensive fixes...');
    
    // Run debug check
    debugDataAvailability();
    
    // Apply fixes with slight delays to ensure data is loaded
    setTimeout(() => {
        fixRegionDropdown();
        fixCountyDisplay();
        
        // Restore saved region if exists
        const savedData = JSON.parse(localStorage.getItem('form5266_operation')) || {};
        if (savedData.region) {
            const regionSelect = document.getElementById('region');
            if (regionSelect) {
                regionSelect.value = savedData.region;
                regionSelect.dispatchEvent(new Event('change'));
                
                // Restore selected counties after a delay
                setTimeout(() => {
                    if (savedData.counties) {
                        savedData.counties.forEach(county => {
                            const checkbox = document.querySelector(`#countyGrid input[value="${county}"]`);
                            if (checkbox) {
                                checkbox.checked = true;
                            }
                        });
                        
                        // Trigger update
                        const firstCheckbox = document.querySelector('#countyGrid input');
                        if (firstCheckbox) {
                            firstCheckbox.dispatchEvent(new Event('change'));
                        }
                    }
                }, 500);
            }
        }
        
        // Fix maps
        fixMaps();
    }, 100);
});

// Also fix when switching tabs
document.querySelectorAll('.tab-link').forEach(link => {
    link.addEventListener('click', function() {
        setTimeout(fixMaps, 100);
    });
});

console.log('Comprehensive fix loaded');