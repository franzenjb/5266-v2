// Main Application JavaScript for Form 5266 v2
// This contains all the core functionality

// Initialize data storage
let operationData = JSON.parse(localStorage.getItem('form5266_operation')) || {};
let contacts = JSON.parse(localStorage.getItem('form5266_contacts')) || [];
let feedingData = JSON.parse(localStorage.getItem('form5266_feeding')) || [];
let activityLog = JSON.parse(localStorage.getItem('form5266_activity')) || [];
let iapData = JSON.parse(localStorage.getItem('form5266_iap')) || [];
let currentRegionData = null;

// Tab switching
function initializeTabs() {
    document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', (e) => {
            // Check if this is an external link (no data-tab attribute)
            const tabName = link.dataset.tab;
            if (!tabName) {
                // This is an external link (IAP Builder pages), let it navigate normally
                return;
            }
            
            e.preventDefault();
            
            // Remove active class from all tabs and links
            document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked link and corresponding tab
            link.classList.add('active');
            const targetTab = document.getElementById(tabName);
            if (targetTab) {
                targetTab.classList.add('active');
            }
            
            // Update Live IAP when switching to it
            if (tabName === 'live-iap') {
                updateLiveIAP();
            }
            // Update feeding stats when switching to service lines
            if (tabName === 'service-lines') {
                updateFeedingStats();
            }
        });
    });
}

// Populate regions dropdown
function populateRegions() {
    const regionSelect = document.getElementById('region');
    if (!regionSelect) return;
    
    // Clear existing options except the first
    regionSelect.innerHTML = '<option value="">Select Region</option>';
    
    // Add all regions from the data
    if (typeof allRegions !== 'undefined') {
        console.log('Loading ' + allRegions.length + ' regions...');
        allRegions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionSelect.appendChild(option);
        });
    } else {
        console.error('allRegions is not defined! Check if redcross_data.js is loaded.');
        // Fallback - try to get regions from redCrossRegionsData
        if (typeof redCrossRegionsData !== 'undefined') {
            const regions = Object.keys(redCrossRegionsData);
            console.log('Using fallback - found ' + regions.length + ' regions from redCrossRegionsData');
            regions.forEach(region => {
                const option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                regionSelect.appendChild(option);
            });
        }
    }
}

// Handle region selection
function initializeRegionHandler() {
    const regionSelect = document.getElementById('region');
    if (!regionSelect) return;
    
    regionSelect.addEventListener('change', function() {
        const selectedRegion = this.value;
        
        if (!selectedRegion) {
            document.getElementById('regionInfo').classList.remove('active');
            document.getElementById('countyGrid').innerHTML = '<div class="empty-state" style="padding: 2rem;"><p>Select a region to view available counties</p></div>';
            document.getElementById('chaptersDisplay').classList.remove('active');
            return;
        }
        
        // Get region data
        if (typeof redCrossRegionsData !== 'undefined' && redCrossRegionsData[selectedRegion]) {
            currentRegionData = redCrossRegionsData[selectedRegion];
            
            // Display region info
            if (document.getElementById('regionName')) {
                document.getElementById('regionName').textContent = selectedRegion;
            }
            if (document.getElementById('countyCount')) {
                document.getElementById('countyCount').textContent = currentRegionData.countyCount || 0;
            }
            if (document.getElementById('chapterCount')) {
                document.getElementById('chapterCount').textContent = currentRegionData.chapters ? currentRegionData.chapters.length : 0;
            }
            if (document.getElementById('selectedCountyCount')) {
                document.getElementById('selectedCountyCount').textContent = '0';
            }
            if (document.getElementById('regionInfo')) {
                document.getElementById('regionInfo').classList.add('active');
            }
            
            // Create county checkboxes
            const countyGrid = document.getElementById('countyGrid');
            if (!countyGrid) {
                console.error('countyGrid element not found');
                return;
            }
            countyGrid.innerHTML = '';
            
            if (currentRegionData.counties) {
                const counties = Object.keys(currentRegionData.counties);
                counties.sort();
                
                counties.forEach(countyName => {
                    const div = document.createElement('div');
                    div.className = 'county-item';
                    
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `county_${countyName.replace(/[^a-zA-Z0-9]/g, '_')}`;
                    checkbox.value = countyName;
                    checkbox.addEventListener('change', updateSelectedCounties);
                    
                    const label = document.createElement('label');
                    label.htmlFor = checkbox.id;
                    label.textContent = countyName;
                    
                    div.appendChild(checkbox);
                    div.appendChild(label);
                    countyGrid.appendChild(div);
                });
            }
        }
    });
}

// Update selected counties and chapters
function updateSelectedCounties() {
    const selectedCheckboxes = document.querySelectorAll('#countyGrid input:checked');
    document.getElementById('selectedCountyCount').textContent = selectedCheckboxes.length;
    
    // Update the Start Here map when counties are selected
    if (typeof updateStartHereMap === 'function') {
        updateStartHereMap();
    }
    
    // Collect unique chapters
    const chaptersSet = new Set();
    selectedCheckboxes.forEach(checkbox => {
        if (currentRegionData && currentRegionData.counties) {
            const chapter = currentRegionData.counties[checkbox.value];
            if (chapter) {
                chaptersSet.add(chapter);
            }
        }
    });
    
    // Display chapters
    const chaptersContainer = document.getElementById('chaptersList');
    if (chaptersSet.size > 0) {
        chaptersContainer.innerHTML = '';
        Array.from(chaptersSet).sort().forEach(chapter => {
            const tag = document.createElement('span');
            tag.className = 'chapter-tag';
            tag.textContent = chapter;
            chaptersContainer.appendChild(tag);
        });
        document.getElementById('chaptersDisplay').classList.add('active');
    } else {
        document.getElementById('chaptersDisplay').classList.remove('active');
    }
    
    // Save selected counties
    operationData.counties = Array.from(selectedCheckboxes).map(cb => cb.value);
    operationData.chapters = Array.from(chaptersSet);
    saveOperationData();
}

// Save operation data
function saveOperationData() {
    operationData.drNumber = document.getElementById('drNumber')?.value || '';
    operationData.operationName = document.getElementById('operationName')?.value || '';
    operationData.startDate = document.getElementById('startDate')?.value || '';
    operationData.region = document.getElementById('region')?.value || '';
    operationData.droDirector = document.getElementById('droDirector')?.value || '';
    operationData.droDirectorPhone = document.getElementById('droDirectorPhone')?.value || '';
    operationData.droDirectorEmail = document.getElementById('droDirectorEmail')?.value || '';
    operationData.deputyDirector = document.getElementById('deputyDirector')?.value || '';
    operationData.deputyDirectorPhone = document.getElementById('deputyDirectorPhone')?.value || '';
    operationData.deputyDirectorEmail = document.getElementById('deputyDirectorEmail')?.value || '';
    
    localStorage.setItem('form5266_operation', JSON.stringify(operationData));
    
    // Update Live IAP
    updateLiveIAP();
}

// Add feeding entry
function addFeedingEntry() {
    const date = document.getElementById('feedingDate').value;
    const location = document.getElementById('feedingLocation').value;
    const meals = parseInt(document.getElementById('mealsServed').value) || 0;
    const snacks = parseInt(document.getElementById('snacksServed').value) || 0;
    
    if (date && location) {
        feedingData.push({
            date,
            location,
            meals,
            snacks,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('form5266_feeding', JSON.stringify(feedingData));
        
        // Clear form
        document.getElementById('feedingLocation').value = '';
        document.getElementById('mealsServed').value = '';
        document.getElementById('snacksServed').value = '';
        
        // Update display
        updateFeedingDisplay();
        updateFeedingStats();
        updateLiveIAP();
        
        // Show confirmation
        const btn = document.getElementById('addFeedingBtn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Added';
        btn.style.backgroundColor = 'var(--success-green)';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
        }, 2000);
    }
}

// Update feeding display
function updateFeedingDisplay() {
    const tbody = document.querySelector('#feedingHistory tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    feedingData.slice().reverse().forEach((entry, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.location}</td>
            <td>${entry.meals.toLocaleString()}</td>
            <td>${entry.snacks.toLocaleString()}</td>
            <td>
                <button onclick="deleteFeedingEntry(${feedingData.length - 1 - index})" 
                        style="background: var(--red-cross-red); color: white; border: none; 
                               padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer;">
                    Delete
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Delete feeding entry
window.deleteFeedingEntry = function(index) {
    if (confirm('Are you sure you want to delete this entry?')) {
        feedingData.splice(index, 1);
        localStorage.setItem('form5266_feeding', JSON.stringify(feedingData));
        updateFeedingDisplay();
        updateFeedingStats();
        updateLiveIAP();
    }
};

// Update feeding statistics
function updateFeedingStats() {
    const totalMeals = feedingData.reduce((sum, f) => sum + f.meals, 0);
    const totalSnacks = feedingData.reduce((sum, f) => sum + f.snacks, 0);
    
    // Update Live IAP stats if elements exist
    if (document.getElementById('liveIAPMeals')) {
        document.getElementById('liveIAPMeals').textContent = totalMeals.toLocaleString();
    }
    if (document.getElementById('liveIAPSnacks')) {
        document.getElementById('liveIAPSnacks').textContent = totalSnacks.toLocaleString();
    }
}

// Update Live IAP
function updateLiveIAP() {
    // Use the proper IAP document generator
    if (typeof generateProperLiveIAP === 'function') {
        const container = document.getElementById('iapDocumentContainer');
        if (container) {
            container.innerHTML = generateProperLiveIAP();
        }
    } else if (typeof generateLiveIAPDocument === 'function') {
        // Fallback to old generator if new one not loaded
        const container = document.getElementById('iapDocumentContainer');
        if (container) {
            container.innerHTML = generateLiveIAPDocument();
        }
    }
}

// Add contact
function addContact() {
    const role = document.getElementById('contactRole').value;
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const email = document.getElementById('contactEmail').value;
    
    if (role && name) {
        contacts.push({ role, name, phone, email });
        localStorage.setItem('form5266_contacts', JSON.stringify(contacts));
        
        // Clear form
        document.getElementById('contactRole').value = '';
        document.getElementById('contactName').value = '';
        document.getElementById('contactPhone').value = '';
        document.getElementById('contactEmail').value = '';
        
        // Update display
        displayContacts();
    }
}

// Display contacts
function displayContacts() {
    const container = document.getElementById('contactsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    contacts.forEach((contact, index) => {
        const div = document.createElement('div');
        div.className = 'contact-card';
        div.innerHTML = `
            <div style="flex: 1;">
                <strong>${contact.role}</strong><br>
                ${contact.name}<br>
                ${contact.phone ? `📞 ${contact.phone}` : ''}
                ${contact.email ? `<br>✉️ ${contact.email}` : ''}
            </div>
            <button onclick="deleteContact(${index})" 
                    style="background: var(--red-cross-red); color: white; border: none;
                           padding: 0.5rem; border-radius: 4px; cursor: pointer;">
                Remove
            </button>
        `;
        container.appendChild(div);
    });
}

// Delete contact
window.deleteContact = function(index) {
    if (confirm('Remove this contact?')) {
        contacts.splice(index, 1);
        localStorage.setItem('form5266_contacts', JSON.stringify(contacts));
        displayContacts();
    }
};


// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Form 5266 v2...');
    
    // Initialize tabs
    initializeTabs();
    
    // Populate regions dropdown
    populateRegions();
    
    // Initialize region handler
    initializeRegionHandler();
    
    // Display existing contacts
    displayContacts();
    
    // Update feeding stats
    updateFeedingDisplay();
    updateFeedingStats();
    
    // Initialize Live IAP view
    updateLiveIAP();
    
    // Restore form values if operation data exists
    if (operationData.drNumber) {
        // Only set values if elements exist
        if (document.getElementById('drNumber')) {
            document.getElementById('drNumber').value = operationData.drNumber || '';
        }
        if (document.getElementById('operationName')) {
            document.getElementById('operationName').value = operationData.operationName || '';
        }
        if (document.getElementById('startDate')) {
            document.getElementById('startDate').value = operationData.startDate || '';
        }
        if (document.getElementById('region')) {
            document.getElementById('region').value = operationData.region || '';
        }
        if (document.getElementById('droDirector')) {
            document.getElementById('droDirector').value = operationData.droDirector || '';
        }
        if (document.getElementById('droDirectorPhone')) {
            document.getElementById('droDirectorPhone').value = operationData.droDirectorPhone || '';
        }
        if (document.getElementById('droDirectorEmail')) {
            document.getElementById('droDirectorEmail').value = operationData.droDirectorEmail || '';
        }
        if (document.getElementById('deputyDirector')) {
            document.getElementById('deputyDirector').value = operationData.deputyDirector || '';
        }
        if (document.getElementById('deputyDirectorPhone')) {
            document.getElementById('deputyDirectorPhone').value = operationData.deputyDirectorPhone || '';
        }
        if (document.getElementById('deputyDirectorEmail')) {
            document.getElementById('deputyDirectorEmail').value = operationData.deputyDirectorEmail || '';
        }
        
        // Trigger region change to load counties
        if (operationData.region && document.getElementById('region')) {
            document.getElementById('region').dispatchEvent(new Event('change'));
            
            // After counties load, check the selected ones
            setTimeout(() => {
                if (operationData.counties) {
                    operationData.counties.forEach(county => {
                        const checkbox = document.querySelector(`#countyGrid input[value="${county}"]`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                    });
                    updateSelectedCounties();
                }
            }, 100);
        }
    }
    
    // Set today's date as default for feeding form
    const feedingDateInput = document.getElementById('feedingDate');
    if (feedingDateInput) {
        feedingDateInput.value = new Date().toISOString().split('T')[0];
    }
    
    // Attach button handlers
    const addFeedingBtn = document.getElementById('addFeedingBtn');
    if (addFeedingBtn) {
        addFeedingBtn.addEventListener('click', addFeedingEntry);
    }
    
    const addContactBtn = document.getElementById('addContactBtn');
    if (addContactBtn) {
        addContactBtn.addEventListener('click', addContact);
    }
    
    console.log('Form 5266 v2 initialized successfully');
});