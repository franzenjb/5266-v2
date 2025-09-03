// Unified Data Management System for Form 5266 v2
// This is the single source of truth for all data in the application
// All components read from and write to this central system

(function() {
    'use strict';
    
    // Define the complete data structure
    const DATA_KEYS = {
        OPERATION: 'form5266_operation',
        CONTACTS: 'form5266_contacts',
        FEEDING: 'form5266_feeding',
        SHELTERING: 'form5266_sheltering',
        MASS_CARE: 'form5266_mass_care',
        HEALTH_SERVICES: 'form5266_health_services',
        STAFF_WELLNESS: 'form5266_staff_wellness',
        GOVERNMENT_OPS: 'form5266_government_ops',
        IAP_CURRENT: 'form5266_iap_current',
        IAP_HISTORY: 'form5266_iap_history',
        ACTIVITY_LOG: 'form5266_activity'
    };
    
    // Central Data Store - this is the single source of truth
    class UnifiedDataStore {
        constructor() {
            this.listeners = {};
            this.data = this.loadAllData();
            this.initializeDataStructure();
        }
        
        // Initialize complete data structure with all fields
        initializeDataStructure() {
            // Ensure all data structures exist
            if (!this.data.operation) this.data.operation = {};
            if (!this.data.contacts) this.data.contacts = [];
            if (!this.data.feeding) this.data.feeding = [];
            if (!this.data.sheltering) this.data.sheltering = [];
            if (!this.data.masscare) this.data.masscare = {};
            if (!this.data.health) this.data.health = {};
            if (!this.data.wellness) this.data.wellness = {};
            if (!this.data.government) this.data.government = {};
            if (!this.data.iap) this.data.iap = {};
            if (!this.data.activity) this.data.activity = [];
            
            // Define the complete operation structure
            const operationDefaults = {
                // Start Here Statistics
                drNumber: '',
                operationName: '',
                startDate: '',
                endDate: '',
                region: '',
                counties: [],
                chapters: [],
                
                // Command Staff
                droDirector: '',
                droDirectorPhone: '',
                droDirectorEmail: '',
                deputyDirector: '',
                deputyDirectorPhone: '',
                deputyDirectorEmail: '',
                chiefOfStaff: '',
                chiefOfStaffPhone: '',
                chiefOfStaffEmail: '',
                
                // Operations Section
                adOperations: '',
                adOperationsPhone: '',
                adOperationsEmail: '',
                deputyAdOperations: '',
                deputyAdOperationsPhone: '',
                deputyAdOperationsEmail: '',
                
                // Planning Section
                adPlanning: '',
                adPlanningPhone: '',
                adPlanningEmail: '',
                
                // Logistics Section
                adLogistics: '',
                adLogisticsPhone: '',
                adLogisticsEmail: '',
                
                // Finance Section
                adFinance: '',
                adFinancePhone: '',
                adFinanceEmail: '',
                
                // Workforce Section
                adWorkforce: '',
                adWorkforcePhone: '',
                adWorkforceEmail: '',
                
                // External Relations
                adExternalRelations: '',
                adExternalRelationsPhone: '',
                adExternalRelationsEmail: ''
            };
            
            // Merge defaults with existing data
            this.data.operation = {...operationDefaults, ...this.data.operation};
            
            // Define IAP structure
            const iapDefaults = {
                // Basic Info
                iapNumber: '01',
                preparedBy: '',
                preparationDate: new Date().toISOString(),
                operationalPeriodStart: '',
                operationalPeriodEnd: '',
                
                // Cover Page
                coverPhoto: '',
                
                // Director's Message
                directorsMessage: '',
                
                // Priorities (1-5)
                priority1: '',
                priority2: '',
                priority3: '',
                priority4: '',
                priority5: '',
                
                // Objectives (1.1-5.3)
                'objective1.1': '', 'objective1.2': '', 'objective1.3': '',
                'objective2.1': '', 'objective2.2': '', 'objective2.3': '',
                'objective3.1': '', 'objective3.2': '', 'objective3.3': '',
                'objective4.1': '', 'objective4.2': '', 'objective4.3': '',
                'objective5.1': '', 'objective5.2': '', 'objective5.3': '',
                
                // Previous Objectives Status
                previousObjectives: [],
                
                // Action Tracker
                actionTracker: [],
                
                // 24-Hour Lines
                lodging24hr: '', lodging24hrPhone: '', lodging24hrEmail: '',
                dmh24hr: '', dmh24hrPhone: '', dmh24hrEmail: '',
                dhs24hr: '', dhs24hrPhone: '', dhs24hrEmail: '',
                staffing24hr: '', staffing24hrPhone: '', staffing24hrEmail: '',
                
                // Additional Command Staff
                eolChief: '', eolChiefPhone: '', eolChiefEmail: '',
                rcco: '', rccoPhone: '', rccoEmail: '',
                regionalExec: '', regionalExecPhone: '', regionalExecEmail: '',
                
                // Mass Care Team
                massCareChief: '', massCareChiefPhone: '', massCareChiefEmail: '',
                shelteringManager: '', shelteringManagerPhone: '', shelteringManagerEmail: '',
                feedingManager: '', feedingManagerPhone: '', feedingManagerEmail: '',
                desManager: '', desManagerPhone: '', desManagerEmail: '',
                reunificationManager: '', reunificationManagerPhone: '', reunificationManagerEmail: '',
                
                // Client Care Team
                clientCareChief: '', clientCareChiefPhone: '', clientCareChiefEmail: '',
                dhsManager: '', dhsManagerPhone: '', dhsManagerEmail: '',
                dmhManager: '', dmhManagerPhone: '', dmhManagerEmail: '',
                dscManager: '', dscManagerPhone: '', dscManagerEmail: '',
                diManager: '', diManagerPhone: '', diManagerEmail: '',
                caseworkManager: '', caseworkManagerPhone: '', caseworkManagerEmail: '',
                qcManager: '', qcManagerPhone: '', qcManagerEmail: '',
                recoveryManager: '', recoveryManagerPhone: '', recoveryManagerEmail: '',
                
                // Work Assignments
                workDistrict: '',
                districtDirector: '',
                deputyDistrictDirector: '',
                workAssignments: [],
                
                // Work Sites
                workSites: [],
                
                // General Message
                generalMessage: '',
                
                // Daily Schedule
                dailySchedule: [
                    {time: '8:00 AM', meeting: 'Operational Leadership Meeting', location: 'Room Name\nConf Call # Participant Code:', attendance: 'DRO Director, Deputy Director, all ADs'},
                    {time: '11:00 AM', meeting: 'Daily Sheltering Support Coordination Meeting', location: 'Room Name\nConf Call # Participant Code:', attendance: 'AD of Operations, AD of Logistics, AD of Workforce, Mass Care Chief, Fulfillment Chief, IDC Chief, Gov. Operations Manager, Sheltering HQ Manager, Feeding HQ Manager, NHQ Liaison(s)'},
                    {time: '12:00 PM', meeting: 'Operational Planning Worksheets Due', location: '', attendance: ''},
                    {time: '1:00 PM', meeting: 'Tactics Meeting', location: 'Room Name\nConf Call # Participant Code:', attendance: 'Deputy Director, AD Operations, AD Information & Planning, and District Directors'},
                    {time: '4:00 PM', meeting: 'Planning Meeting', location: 'Room Name\nConf Call # Participant Code:', attendance: 'DRO Director, Deputy Director, AD Operations, AD Information & Planning'},
                    {time: '6:00 PM', meeting: 'IAP Distributed', location: 'Email', attendance: 'All assigned staff in Volunteer Connection and additional personnel'},
                    {time: '6:00 PM', meeting: 'Operations Briefing', location: 'Room Name\nConf Call # Participant Code:', attendance: 'DRO Director, Deputy Director, all ADs, and District Directors'}
                ],
                
                // Safety & Security Messages
                safetyMessage: '',
                
                // Weather Forecast (future integration)
                weatherForecast: '',
                weatherWarnings: []
            };
            
            // Merge IAP defaults
            this.data.iap = {...iapDefaults, ...this.data.iap};
        }
        
        // Load all data from localStorage
        loadAllData() {
            const data = {
                operation: JSON.parse(localStorage.getItem(DATA_KEYS.OPERATION)) || {},
                contacts: JSON.parse(localStorage.getItem(DATA_KEYS.CONTACTS)) || [],
                feeding: JSON.parse(localStorage.getItem(DATA_KEYS.FEEDING)) || [],
                sheltering: JSON.parse(localStorage.getItem(DATA_KEYS.SHELTERING)) || [],
                masscare: JSON.parse(localStorage.getItem(DATA_KEYS.MASS_CARE)) || {},
                health: JSON.parse(localStorage.getItem(DATA_KEYS.HEALTH_SERVICES)) || {},
                wellness: JSON.parse(localStorage.getItem(DATA_KEYS.STAFF_WELLNESS)) || {},
                government: JSON.parse(localStorage.getItem(DATA_KEYS.GOVERNMENT_OPS)) || {},
                iap: JSON.parse(localStorage.getItem(DATA_KEYS.IAP_CURRENT)) || {},
                activity: JSON.parse(localStorage.getItem(DATA_KEYS.ACTIVITY_LOG)) || []
            };
            return data;
        }
        
        // Save all data to localStorage
        saveAllData() {
            localStorage.setItem(DATA_KEYS.OPERATION, JSON.stringify(this.data.operation));
            localStorage.setItem(DATA_KEYS.CONTACTS, JSON.stringify(this.data.contacts));
            localStorage.setItem(DATA_KEYS.FEEDING, JSON.stringify(this.data.feeding));
            localStorage.setItem(DATA_KEYS.SHELTERING, JSON.stringify(this.data.sheltering));
            localStorage.setItem(DATA_KEYS.MASS_CARE, JSON.stringify(this.data.masscare));
            localStorage.setItem(DATA_KEYS.HEALTH_SERVICES, JSON.stringify(this.data.health));
            localStorage.setItem(DATA_KEYS.STAFF_WELLNESS, JSON.stringify(this.data.wellness));
            localStorage.setItem(DATA_KEYS.GOVERNMENT_OPS, JSON.stringify(this.data.government));
            localStorage.setItem(DATA_KEYS.IAP_CURRENT, JSON.stringify(this.data.iap));
            localStorage.setItem(DATA_KEYS.ACTIVITY_LOG, JSON.stringify(this.data.activity));
        }
        
        // Get data by category
        get(category, field = null) {
            if (field) {
                return this.data[category] ? this.data[category][field] : null;
            }
            return this.data[category] || null;
        }
        
        // Set data and notify listeners
        set(category, field, value) {
            if (!this.data[category]) {
                this.data[category] = {};
            }
            
            // If field is null, we're setting the entire category
            if (field === null) {
                this.data[category] = value;
            } else {
                this.data[category][field] = value;
            }
            
            this.saveAllData();
            this.notifyListeners(category, field);
            this.logActivity('UPDATE', category, field, value);
        }
        
        // Add item to array (for feeding, contacts, etc.)
        add(category, item) {
            if (!Array.isArray(this.data[category])) {
                this.data[category] = [];
            }
            this.data[category].push(item);
            this.saveAllData();
            this.notifyListeners(category);
            this.logActivity('ADD', category, null, item);
        }
        
        // Remove item from array
        remove(category, index) {
            if (Array.isArray(this.data[category])) {
                const removed = this.data[category].splice(index, 1);
                this.saveAllData();
                this.notifyListeners(category);
                this.logActivity('REMOVE', category, index, removed[0]);
            }
        }
        
        // Update specific item in array
        update(category, index, item) {
            if (Array.isArray(this.data[category]) && this.data[category][index]) {
                this.data[category][index] = item;
                this.saveAllData();
                this.notifyListeners(category);
                this.logActivity('UPDATE', category, index, item);
            }
        }
        
        // Subscribe to data changes
        subscribe(category, callback) {
            if (!this.listeners[category]) {
                this.listeners[category] = [];
            }
            this.listeners[category].push(callback);
            
            // Return unsubscribe function
            return () => {
                const index = this.listeners[category].indexOf(callback);
                if (index > -1) {
                    this.listeners[category].splice(index, 1);
                }
            };
        }
        
        // Notify all listeners of a category
        notifyListeners(category, field = null) {
            if (this.listeners[category]) {
                this.listeners[category].forEach(callback => {
                    callback(this.data[category], field);
                });
            }
            
            // Also notify global listeners
            if (this.listeners['*']) {
                this.listeners['*'].forEach(callback => {
                    callback(category, this.data[category], field);
                });
            }
        }
        
        // Log activity
        logActivity(action, category, field, value) {
            const entry = {
                timestamp: new Date().toISOString(),
                action: action,
                category: category,
                field: field,
                value: value,
                user: 'System' // Could be expanded to track actual users
            };
            
            this.data.activity.unshift(entry);
            
            // Keep only last 100 activities
            if (this.data.activity.length > 100) {
                this.data.activity = this.data.activity.slice(0, 100);
            }
            
            localStorage.setItem(DATA_KEYS.ACTIVITY_LOG, JSON.stringify(this.data.activity));
        }
        
        // Get computed statistics
        getStatistics() {
            const stats = {
                // Feeding statistics
                totalMeals: this.data.feeding.reduce((sum, f) => sum + (f.meals || 0), 0),
                totalSnacks: this.data.feeding.reduce((sum, f) => sum + (f.snacks || 0), 0),
                feedingLocations: [...new Set(this.data.feeding.map(f => f.location))].length,
                
                // Sheltering statistics
                totalShelters: this.data.sheltering.length,
                totalCapacity: this.data.sheltering.reduce((sum, s) => sum + (s.capacity || 0), 0),
                totalOccupancy: this.data.sheltering.reduce((sum, s) => sum + (s.occupancy || 0), 0),
                
                // Geographic statistics
                activeCounties: this.data.operation.counties ? this.data.operation.counties.length : 0,
                activeChapters: this.data.operation.chapters ? this.data.operation.chapters.length : 0,
                
                // Staffing statistics
                totalContacts: this.data.contacts.length,
                
                // Operation info
                drNumber: this.data.operation.drNumber,
                operationName: this.data.operation.operationName,
                daysActive: this.calculateDaysActive()
            };
            
            return stats;
        }
        
        // Calculate days active
        calculateDaysActive() {
            if (this.data.operation.startDate) {
                const start = new Date(this.data.operation.startDate);
                const now = new Date();
                const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
                return days >= 0 ? days : 0;
            }
            return 0;
        }
        
        // Export all data (for backup/transfer)
        exportData() {
            return JSON.stringify(this.data, null, 2);
        }
        
        // Import data (restore from backup)
        importData(jsonString) {
            try {
                const importedData = JSON.parse(jsonString);
                this.data = importedData;
                this.initializeDataStructure();
                this.saveAllData();
                
                // Notify all listeners
                Object.keys(this.listeners).forEach(category => {
                    this.notifyListeners(category);
                });
                
                return true;
            } catch (error) {
                console.error('Failed to import data:', error);
                return false;
            }
        }
        
        // Clear all data (reset)
        clearAllData() {
            if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                this.data = {
                    operation: {},
                    contacts: [],
                    feeding: [],
                    sheltering: [],
                    masscare: {},
                    health: {},
                    wellness: {},
                    government: {},
                    iap: {},
                    activity: []
                };
                
                this.initializeDataStructure();
                this.saveAllData();
                
                // Notify all listeners
                Object.keys(this.listeners).forEach(category => {
                    this.notifyListeners(category);
                });
                
                // Reload page to reset UI
                location.reload();
            }
        }
    }
    
    // Create global instance
    window.DataStore = new UnifiedDataStore();
    
    // Helper functions for backward compatibility
    window.getOperationData = () => DataStore.get('operation');
    window.setOperationData = (data) => DataStore.set('operation', null, data);
    window.getFeedingData = () => DataStore.get('feeding');
    window.getContacts = () => DataStore.get('contacts');
    window.getIAPData = () => DataStore.get('iap');
    
    // Auto-update functions that components can call
    window.updateOperationField = (field, value) => {
        DataStore.set('operation', field, value);
    };
    
    window.updateIAPField = (field, value) => {
        DataStore.set('iap', field, value);
    };
    
    window.addFeedingEntry = (entry) => {
        DataStore.add('feeding', entry);
    };
    
    window.addContact = (contact) => {
        DataStore.add('contacts', contact);
    };
    
    // Subscribe to changes and update UI
    DataStore.subscribe('*', (category, data, field) => {
        console.log(`Data updated - Category: ${category}, Field: ${field}`);
        
        // Update any relevant UI components
        if (typeof updateLiveIAP === 'function') {
            updateLiveIAP();
        }
        
        // Update statistics displays
        const stats = DataStore.getStatistics();
        
        // Update any statistics elements
        if (document.getElementById('totalMeals')) {
            document.getElementById('totalMeals').textContent = stats.totalMeals.toLocaleString();
        }
        if (document.getElementById('totalSnacks')) {
            document.getElementById('totalSnacks').textContent = stats.totalSnacks.toLocaleString();
        }
        if (document.getElementById('activeCounties')) {
            document.getElementById('activeCounties').textContent = stats.activeCounties;
        }
        if (document.getElementById('activeChapters')) {
            document.getElementById('activeChapters').textContent = stats.activeChapters;
        }
    });
    
    console.log('Unified Data System initialized');
    
})();