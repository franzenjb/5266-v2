// Data Flow Integration Layer
// This ensures all components use the unified data store

(function() {
    'use strict';
    
    // Wait for DataStore to be available
    if (!window.DataStore) {
        console.error('DataStore not initialized! Make sure unified-data-system.js loads first.');
        return;
    }
    
    // Override global variables to use DataStore
    Object.defineProperty(window, 'operationData', {
        get: function() {
            return DataStore.get('operation');
        },
        set: function(value) {
            DataStore.set('operation', null, value);
        }
    });
    
    Object.defineProperty(window, 'feedingData', {
        get: function() {
            return DataStore.get('feeding');
        },
        set: function(value) {
            DataStore.set('feeding', null, value);
        }
    });
    
    Object.defineProperty(window, 'contacts', {
        get: function() {
            return DataStore.get('contacts');
        },
        set: function(value) {
            DataStore.set('contacts', null, value);
        }
    });
    
    Object.defineProperty(window, 'iapData', {
        get: function() {
            return DataStore.get('iap');
        },
        set: function(value) {
            DataStore.set('iap', null, value);
        }
    });
    
    // Override the save functions to use DataStore
    const originalSaveOperation = window.saveOperationData;
    window.saveOperationData = function() {
        // Get form values
        const formData = {
            drNumber: document.getElementById('drNumber')?.value || '',
            operationName: document.getElementById('operationName')?.value || '',
            startDate: document.getElementById('startDate')?.value || '',
            region: document.getElementById('region')?.value || '',
            droDirector: document.getElementById('droDirector')?.value || '',
            droDirectorPhone: document.getElementById('droDirectorPhone')?.value || '',
            droDirectorEmail: document.getElementById('droDirectorEmail')?.value || '',
            deputyDirector: document.getElementById('deputyDirector')?.value || '',
            deputyDirectorPhone: document.getElementById('deputyDirectorPhone')?.value || '',
            deputyDirectorEmail: document.getElementById('deputyDirectorEmail')?.value || ''
        };
        
        // Update each field in DataStore
        Object.keys(formData).forEach(key => {
            DataStore.set('operation', key, formData[key]);
        });
        
        // Update Live IAP
        if (typeof updateLiveIAP === 'function') {
            updateLiveIAP();
        }
    };
    
    // Override feeding entry function
    const originalAddFeeding = window.addFeedingEntry;
    window.addFeedingEntry = function() {
        const date = document.getElementById('feedingDate')?.value;
        const location = document.getElementById('feedingLocation')?.value;
        const meals = parseInt(document.getElementById('mealsServed')?.value) || 0;
        const snacks = parseInt(document.getElementById('snacksServed')?.value) || 0;
        
        if (date && location) {
            const entry = {
                date,
                location,
                meals,
                snacks,
                timestamp: new Date().toISOString()
            };
            
            DataStore.add('feeding', entry);
            
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
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = '✓ Added';
                btn.style.backgroundColor = 'var(--success-green)';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                }, 2000);
            }
        }
    };
    
    // Override contact function
    const originalAddContact = window.addContact;
    window.addContact = function() {
        const role = document.getElementById('contactRole')?.value;
        const name = document.getElementById('contactName')?.value;
        const phone = document.getElementById('contactPhone')?.value;
        const email = document.getElementById('contactEmail')?.value;
        
        if (role && name) {
            const contact = { role, name, phone, email };
            DataStore.add('contacts', contact);
            
            // Clear form
            document.getElementById('contactRole').value = '';
            document.getElementById('contactName').value = '';
            document.getElementById('contactPhone').value = '';
            document.getElementById('contactEmail').value = '';
            
            // Update display
            displayContacts();
            updateLiveIAP();
        }
    };
    
    // Update feeding display to use DataStore
    window.updateFeedingDisplay = function() {
        const tbody = document.querySelector('#feedingHistory tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        const feedingData = DataStore.get('feeding');
        
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
    };
    
    // Update delete functions
    window.deleteFeedingEntry = function(index) {
        if (confirm('Are you sure you want to delete this entry?')) {
            DataStore.remove('feeding', index);
            updateFeedingDisplay();
            updateFeedingStats();
            updateLiveIAP();
        }
    };
    
    window.deleteContact = function(index) {
        if (confirm('Remove this contact?')) {
            DataStore.remove('contacts', index);
            displayContacts();
            updateLiveIAP();
        }
    };
    
    // Display contacts using DataStore
    window.displayContacts = function() {
        const container = document.getElementById('contactsList');
        if (!container) return;
        
        container.innerHTML = '';
        const contacts = DataStore.get('contacts');
        
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
    };
    
    // Update feeding statistics
    window.updateFeedingStats = function() {
        const stats = DataStore.getStatistics();
        
        // Update Live IAP stats if elements exist
        if (document.getElementById('liveIAPMeals')) {
            document.getElementById('liveIAPMeals').textContent = stats.totalMeals.toLocaleString();
        }
        if (document.getElementById('liveIAPSnacks')) {
            document.getElementById('liveIAPSnacks').textContent = stats.totalSnacks.toLocaleString();
        }
    };
    
    // Auto-save form fields to DataStore
    function attachAutoSave() {
        // Start Here Statistics fields
        const operationFields = [
            'drNumber', 'operationName', 'startDate', 'region',
            'droDirector', 'droDirectorPhone', 'droDirectorEmail',
            'deputyDirector', 'deputyDirectorPhone', 'deputyDirectorEmail'
        ];
        
        operationFields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                // Set initial value from DataStore
                const value = DataStore.get('operation', fieldId);
                if (value) {
                    element.value = value;
                }
                
                // Auto-save on change
                element.addEventListener('change', function() {
                    DataStore.set('operation', fieldId, this.value);
                });
                
                // Also save on blur for text inputs
                if (element.type === 'text' || element.type === 'email' || element.type === 'tel') {
                    element.addEventListener('blur', function() {
                        DataStore.set('operation', fieldId, this.value);
                    });
                }
            }
        });
    }
    
    // Subscribe to data changes for real-time updates
    DataStore.subscribe('operation', (data) => {
        console.log('Operation data updated:', data);
        
        // Update any dependent UI
        if (typeof updateStartHereMap === 'function') {
            updateStartHereMap();
        }
    });
    
    DataStore.subscribe('feeding', (data) => {
        console.log('Feeding data updated:', data);
        updateFeedingDisplay();
        updateFeedingStats();
    });
    
    DataStore.subscribe('contacts', (data) => {
        console.log('Contacts updated:', data);
        displayContacts();
    });
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachAutoSave);
    } else {
        attachAutoSave();
    }
    
    console.log('Data Flow Integration initialized - all components now use unified DataStore');
    
})();