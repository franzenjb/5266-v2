// IAP Data Bridge - Connects IAP Builder data to Live IAP
// This ensures data from IAP Builder flows to the Live IAP document

(function() {
    'use strict';
    
    // Function to merge all IAP data sources
    function mergeIAPData() {
        console.log('Merging IAP data from all sources...');
        
        // Get base IAP data from DataStore
        let iapData = window.DataStore ? 
            DataStore.get('iap') : 
            JSON.parse(localStorage.getItem('form5266_iap_current')) || {};
        
        // Get Director's Message from IAP Builder
        const directorContent = JSON.parse(localStorage.getItem('iap_director_content') || '{}');
        if (directorContent.directorsMessage) {
            iapData.directorsMessage = directorContent.directorsMessage;
        }
        
        // Get Priorities and Objectives from IAP Builder
        const prioritiesContent = JSON.parse(localStorage.getItem('iap_priorities') || '{}');
        if (prioritiesContent) {
            // Priorities
            if (prioritiesContent.priorities) {
                prioritiesContent.priorities.forEach((p, i) => {
                    iapData[`priority${i + 1}`] = p;
                });
            }
            // Objectives
            if (prioritiesContent.objectives) {
                Object.keys(prioritiesContent.objectives).forEach(key => {
                    iapData[`objective${key}`] = prioritiesContent.objectives[key];
                });
            }
        }
        
        // Get Safety & Security content (Section 10)
        const safetyContent = JSON.parse(localStorage.getItem('iap_safety_content') || '{}');
        if (safetyContent) {
            iapData.safetyConcerns = safetyContent.safetyConcerns || '';
            iapData.weatherForecast = safetyContent.weatherForecast || '';
            iapData.securityInfo = safetyContent.securityInfo || '';
            iapData.medicalPlan = safetyContent.medicalPlan || '';
            iapData.safetyMessage = `
                <h3>Safety Concerns</h3>
                ${safetyContent.safetyConcerns || '<p>None identified</p>'}
                
                <h3>Weather Forecast</h3>
                ${safetyContent.weatherForecast || '<p>See current NWS forecast</p>'}
                
                <h3>Security Information</h3>
                ${safetyContent.securityInfo || '<p>Standard security protocols in effect</p>'}
                
                <h3>Medical Plan</h3>
                ${safetyContent.medicalPlan || '<p>EMS available through 911</p>'}
            `;
        }
        
        // Get External Coordination content (Section 11)
        const externalContent = JSON.parse(localStorage.getItem('iap_external_content') || '{}');
        if (externalContent) {
            iapData.eocStatus = externalContent.eocStatus || '';
            iapData.partnerOrgs = externalContent.partnerOrgs || '';
            iapData.externalMeetings = externalContent.externalMeetings || '';
            iapData.coordinationNotes = externalContent.coordinationNotes || '';
            iapData.externalCoordination = `
                <h3>EOC Status</h3>
                ${externalContent.eocStatus || '<p>No EOCs currently activated</p>'}
                
                <h3>Partner Organizations</h3>
                ${externalContent.partnerOrgs || '<p>None currently coordinating</p>'}
                
                <h3>External Meetings</h3>
                ${externalContent.externalMeetings || '<p>No external meetings scheduled</p>'}
                
                <h3>Coordination Notes</h3>
                ${externalContent.coordinationNotes || '<p>None</p>'}
            `;
        }
        
        // Get Ancillary Notes content (Section 12)
        const notesContent = JSON.parse(localStorage.getItem('iap_notes_content') || '{}');
        if (notesContent) {
            iapData.specialInstructions = notesContent.specialInstructions || '';
            iapData.additionalNotes = notesContent.additionalNotes || '';
            iapData.attachments = notesContent.attachments || '';
            iapData.lessonsLearned = notesContent.lessonsLearned || '';
            
            // Combine all notes into generalMessage
            iapData.generalMessage = `
                <h3>Special Instructions</h3>
                ${notesContent.specialInstructions || '<p>None</p>'}
                
                <h3>Additional Notes</h3>
                ${notesContent.additionalNotes || '<p>None</p>'}
                
                <h3>Attachments</h3>
                ${notesContent.attachments || '<p>None</p>'}
                
                <h3>Lessons Learned</h3>
                ${notesContent.lessonsLearned || '<p>None</p>'}
            `;
        }
        
        // Get Command Staff from IAP Builder
        const commandStaff = JSON.parse(localStorage.getItem('iap_command_staff') || '{}');
        if (commandStaff) {
            Object.assign(iapData, commandStaff);
        }
        
        // Get Work Assignments
        const workAssignments = JSON.parse(localStorage.getItem('iap_work_assignments') || '[]');
        if (workAssignments.length > 0) {
            iapData.workAssignments = workAssignments;
        }
        
        // Get Work Sites
        const workSites = JSON.parse(localStorage.getItem('iap_work_sites') || '[]');
        if (workSites.length > 0) {
            iapData.workSites = workSites;
        }
        
        // Get Daily Schedule
        const dailySchedule = JSON.parse(localStorage.getItem('iap_daily_schedule') || '[]');
        if (dailySchedule.length > 0) {
            iapData.dailySchedule = dailySchedule;
        }
        
        // Save merged data back to DataStore
        if (window.DataStore) {
            DataStore.set('iap', null, iapData);
        } else {
            localStorage.setItem('form5266_iap_current', JSON.stringify(iapData));
        }
        
        console.log('IAP data merged successfully', iapData);
        return iapData;
    }
    
    // Update Live IAP with merged data
    function updateLiveIAPWithMergedData() {
        const mergedData = mergeIAPData();
        
        // Force Live IAP update
        if (typeof updateLiveIAP === 'function') {
            updateLiveIAP();
        }
        
        // Also try to update the proper IAP
        if (typeof generateProperLiveIAP === 'function') {
            const container = document.getElementById('iapDocumentContainer');
            if (container) {
                container.innerHTML = generateProperLiveIAP();
            }
        }
    }
    
    // Listen for storage events (when IAP Builder saves)
    window.addEventListener('storage', function(e) {
        if (e.key && e.key.startsWith('iap_')) {
            console.log('IAP Builder data changed:', e.key);
            setTimeout(updateLiveIAPWithMergedData, 100);
        }
    });
    
    // Listen for tab switches to Live IAP
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('tab-link')) {
            const tabName = e.target.dataset.tab;
            if (tabName === 'live-iap') {
                console.log('Switching to Live IAP, merging data...');
                setTimeout(updateLiveIAPWithMergedData, 200);
            }
        }
    });
    
    // Also update when returning from IAP Builder
    window.addEventListener('focus', function() {
        // Check if we're on Live IAP tab
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab && activeTab.id === 'live-iap') {
            console.log('Window focused on Live IAP, updating...');
            updateLiveIAPWithMergedData();
        }
    });
    
    // Initial merge on load
    document.addEventListener('DOMContentLoaded', function() {
        console.log('IAP Data Bridge initializing...');
        
        // Do initial merge after a delay
        setTimeout(() => {
            mergeIAPData();
            
            // If we're on Live IAP, update it
            const activeTab = document.querySelector('.tab-content.active');
            if (activeTab && activeTab.id === 'live-iap') {
                updateLiveIAPWithMergedData();
            }
        }, 1000);
    });
    
    // Export functions for manual calling
    window.mergeIAPData = mergeIAPData;
    window.updateLiveIAPWithMergedData = updateLiveIAPWithMergedData;
    
    console.log('IAP Data Bridge loaded - IAP Builder data will flow to Live IAP');
    
})();