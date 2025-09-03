// Live IAP Document with Correct Structure Matching IAP Builder
// This matches the accordion sections from the IAP Builder exactly

(function() {
    // Generate IAP document matching the exact IAP Builder structure
    window.generateCorrectIAPDocument = function() {
        // Get all data from localStorage
        const operationData = JSON.parse(localStorage.getItem('form5266_operation')) || {};
        const currentIAP = JSON.parse(localStorage.getItem('form5266_iap_current')) || {};
        const feedingData = JSON.parse(localStorage.getItem('form5266_feeding')) || [];
        const shelteringData = JSON.parse(localStorage.getItem('form5266_sheltering')) || [];
        const commandStaff = JSON.parse(localStorage.getItem('form5266_command_staff')) || [];
        
        // If no IAP exists, show empty state
        if (!currentIAP.iapNumber && !operationData.drNumber) {
            return `
                <div class="empty-state" style="padding: 3rem; text-align: center;">
                    <div class="empty-state-icon" style="font-size: 4rem;">📄</div>
                    <h3>No Active Incident Action Plan</h3>
                    <p>Create an IAP using the IAP Builder to see it displayed here in real-time.</p>
                    <a href="iap-enhanced.html" class="btn btn-primary" style="margin-top: 1rem;">
                        <span>📝</span> Go to IAP Builder
                    </a>
                </div>
            `;
        }
        
        // Format dates
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Build the IAP document following exact accordion structure
        const html = `
            <div class="iap-document">
                <!-- Cover Page with Photo -->
                <div class="iap-page iap-cover-page">
                    ${currentIAP.coverPhoto ? `
                        <div class="iap-cover-photo">
                            <img src="${currentIAP.coverPhoto}" alt="Operation Photo">
                        </div>
                    ` : ''}
                    <div class="iap-header">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23ED1B2E'/%3E%3Crect x='20' y='26' width='20' height='8' fill='white'/%3E%3Crect x='26' y='20' width='8' height='20' fill='white'/%3E%3C/svg%3E" alt="Red Cross" class="iap-logo">
                        <h1>INCIDENT ACTION PLAN</h1>
                        <h2>American Red Cross</h2>
                        <h3>${operationData.region || 'Regional'} Disaster Response</h3>
                    </div>
                </div>
                
                <!-- SECTION 1: Basic Information & Operational Period -->
                <div class="iap-page">
                    <h2 class="iap-section-title">SECTION 1: BASIC INFORMATION & OPERATIONAL PERIOD</h2>
                    <div class="iap-info-box">
                        <table class="iap-info-table">
                            <tr>
                                <td><strong>IAP Number:</strong></td>
                                <td>${currentIAP.iapNumber || '001'}</td>
                                <td><strong>Date Prepared:</strong></td>
                                <td>${dateStr}</td>
                            </tr>
                            <tr>
                                <td><strong>DR Number:</strong></td>
                                <td>${operationData.drNumber || currentIAP.drNumber || 'TBD'}</td>
                                <td><strong>Time Prepared:</strong></td>
                                <td>${today.toLocaleTimeString()}</td>
                            </tr>
                            <tr>
                                <td><strong>Incident Name:</strong></td>
                                <td colspan="3">${operationData.operationName || currentIAP.incidentName || 'Disaster Response Operation'}</td>
                            </tr>
                            <tr>
                                <td><strong>Operational Period:</strong></td>
                                <td>From: ${currentIAP.periodStart || today.toLocaleDateString()}</td>
                                <td>To: ${currentIAP.periodEnd || today.toLocaleDateString()}</td>
                                <td>Time: ${currentIAP.periodTime || '0700-1900'}</td>
                            </tr>
                            <tr>
                                <td><strong>Prepared By:</strong></td>
                                <td>${currentIAP.preparedBy || 'Planning Section'}</td>
                                <td><strong>Approved By:</strong></td>
                                <td>${currentIAP.approvedBy || operationData.droDirector || 'DRO Director'}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                
                <!-- SECTION 2: Director's Message & Objectives -->
                ${currentIAP.directorMessage ? `
                <div class="iap-page">
                    <h2 class="iap-section-title">SECTION 2: DIRECTOR'S MESSAGE & OBJECTIVES</h2>
                    <div class="iap-content">
                        <div class="director-message">
                            ${currentIAP.directorMessage}
                        </div>
                        ${currentIAP.objectives ? `
                        <div class="objectives-section">
                            <h3>Operational Objectives</h3>
                            ${currentIAP.objectives}
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}
                
                <!-- SECTIONS 3-9: Command Staff, Geography, Service Lines, etc. -->
                <div class="iap-page">
                    <h2 class="iap-section-title">SECTION 3: COMMAND & GENERAL STAFF</h2>
                    <div class="iap-content">
                        <h3>Incident Command Structure</h3>
                        <table class="iap-command-table">
                            <thead>
                                <tr>
                                    <th>Position</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Command Staff -->
                                <tr class="section-header">
                                    <td colspan="4"><strong>COMMAND STAFF</strong></td>
                                </tr>
                                <tr>
                                    <td>Incident Commander (DRO Director)</td>
                                    <td>${operationData.droDirector || currentIAP.droDirector || 'TBD'}</td>
                                    <td>${operationData.droDirectorPhone || ''}</td>
                                    <td>${operationData.droDirectorEmail || ''}</td>
                                </tr>
                                <tr>
                                    <td>Deputy Incident Commander</td>
                                    <td>${operationData.deputyDirector || currentIAP.deputyDirector || 'TBD'}</td>
                                    <td>${operationData.deputyDirectorPhone || ''}</td>
                                    <td>${operationData.deputyDirectorEmail || ''}</td>
                                </tr>
                                <tr>
                                    <td>Public Information Officer</td>
                                    <td>${currentIAP.pioOfficer || 'TBD'}</td>
                                    <td>${currentIAP.pioPhone || ''}</td>
                                    <td>${currentIAP.pioEmail || ''}</td>
                                </tr>
                                <tr>
                                    <td>Safety Officer</td>
                                    <td>${currentIAP.safetyOfficer || 'TBD'}</td>
                                    <td>${currentIAP.safetyPhone || ''}</td>
                                    <td>${currentIAP.safetyEmail || ''}</td>
                                </tr>
                                <tr>
                                    <td>Liaison Officer</td>
                                    <td>${currentIAP.liaisonOfficer || 'TBD'}</td>
                                    <td>${currentIAP.liaisonPhone || ''}</td>
                                    <td>${currentIAP.liaisonEmail || ''}</td>
                                </tr>
                                
                                <!-- General Staff -->
                                <tr class="section-header">
                                    <td colspan="4"><strong>GENERAL STAFF</strong></td>
                                </tr>
                                <tr>
                                    <td>Operations Section Chief</td>
                                    <td>${currentIAP.operationsChief || 'TBD'}</td>
                                    <td>${currentIAP.operationsChiefPhone || ''}</td>
                                    <td>${currentIAP.operationsChiefEmail || ''}</td>
                                </tr>
                                <tr>
                                    <td>Planning Section Chief</td>
                                    <td>${currentIAP.planningChief || 'TBD'}</td>
                                    <td>${currentIAP.planningChiefPhone || ''}</td>
                                    <td>${currentIAP.planningChiefEmail || ''}</td>
                                </tr>
                                <tr>
                                    <td>Logistics Section Chief</td>
                                    <td>${currentIAP.logisticsChief || 'TBD'}</td>
                                    <td>${currentIAP.logisticsChiefPhone || ''}</td>
                                    <td>${currentIAP.logisticsChiefEmail || ''}</td>
                                </tr>
                                <tr>
                                    <td>Finance Section Chief</td>
                                    <td>${currentIAP.financeChief || 'TBD'}</td>
                                    <td>${currentIAP.financeChiefPhone || ''}</td>
                                    <td>${currentIAP.financeChiefEmail || ''}</td>
                                </tr>
                                
                                ${commandStaff.map(staff => `
                                <tr>
                                    <td>${staff.position}</td>
                                    <td>${staff.name}</td>
                                    <td>${staff.phone || ''}</td>
                                    <td>${staff.email || ''}</td>
                                </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        
                        <!-- Org Chart Note -->
                        <div class="org-chart-note">
                            <p style="font-style: italic; margin-top: 1rem;">
                                Note: An organizational chart can be generated from this Command Staff data using 
                                tools like OrgChart.js or D3.js. This feature is planned for future implementation.
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- SECTION 4: Geographic Coverage -->
                <div class="iap-page">
                    <h2 class="iap-section-title">SECTION 4: GEOGRAPHIC COVERAGE & AFFECTED AREAS</h2>
                    <div class="iap-content">
                        <div class="iap-info-grid">
                            <div><strong>Region:</strong> ${operationData.region || 'Not specified'}</div>
                            <div><strong>Active Counties:</strong> ${operationData.counties ? operationData.counties.length : 0}</div>
                            <div><strong>Active Chapters:</strong> ${operationData.chapters ? operationData.chapters.length : 0}</div>
                        </div>
                        
                        ${operationData.counties && operationData.counties.length > 0 ? `
                        <div class="iap-counties">
                            <h3>Affected Counties</h3>
                            <div class="county-list">
                                ${operationData.counties.map(county => `<span class="county-tag">${county}</span>`).join(' ')}
                            </div>
                        </div>
                        ` : ''}
                        
                        <div id="iapOperationalMap" class="iap-map" style="height: 400px; margin-top: 1rem; border: 1px solid #ddd; border-radius: 4px;"></div>
                    </div>
                </div>
                
                <!-- SECTIONS 5-9: Service Lines -->
                <div class="iap-page">
                    <h2 class="iap-section-title">SECTIONS 5-9: SERVICE LINE OPERATIONS</h2>
                    
                    <!-- Feeding Operations -->
                    <div class="service-section">
                        <h3>Section 5: Feeding Operations</h3>
                        <table class="iap-table">
                            <tr>
                                <td><strong>Line 9 - Total Meals Served:</strong></td>
                                <td class="text-right">${feedingData.reduce((sum, f) => sum + f.meals, 0).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td><strong>Line 10 - Total Snacks Served:</strong></td>
                                <td class="text-right">${feedingData.reduce((sum, f) => sum + f.snacks, 0).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td><strong>Active Feeding Sites:</strong></td>
                                <td class="text-right">${feedingData.length}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <!-- Sheltering Operations -->
                    <div class="service-section">
                        <h3>Section 6: Sheltering Operations</h3>
                        <table class="iap-table">
                            <tr>
                                <td><strong>Line 38 - Shelters Opened:</strong></td>
                                <td class="text-right">${shelteringData.length}</td>
                            </tr>
                            <tr>
                                <td><strong>Total Shelter Capacity:</strong></td>
                                <td class="text-right">${shelteringData.reduce((sum, s) => sum + (s.capacity || 0), 0).toLocaleString()}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <!-- Other Service Lines -->
                    <div class="service-section">
                        <h3>Section 7: Mass Care / Distribution of Emergency Supplies</h3>
                        <p>Data entry pending</p>
                    </div>
                    
                    <div class="service-section">
                        <h3>Section 8: Government Operations</h3>
                        <p>Data entry pending</p>
                    </div>
                    
                    <div class="service-section">
                        <h3>Section 9: Staff Wellness</h3>
                        <p>Data entry pending</p>
                    </div>
                </div>
                
                <!-- SECTION 10: Safety & Security -->
                ${currentIAP.safetyMessage || currentIAP.weatherForecast ? `
                <div class="iap-page">
                    <h2 class="iap-section-title">SECTION 10: SAFETY & SECURITY INFORMATION</h2>
                    <div class="iap-content">
                        ${currentIAP.safetyMessage ? `
                        <div class="safety-section">
                            <h3>Safety Concerns & Hazards</h3>
                            ${currentIAP.safetyMessage}
                        </div>
                        ` : ''}
                        
                        ${currentIAP.weatherForecast ? `
                        <div class="weather-section">
                            <h3>Weather Forecast</h3>
                            ${currentIAP.weatherForecast}
                            <p style="font-style: italic; margin-top: 1rem;">
                                Future Enhancement: Automatic NWS weather integration with AI-amalgamated 
                                forecasts from multiple stations based on selected counties.
                            </p>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}
                
                <!-- SECTION 11: External Coordination -->
                ${currentIAP.externalCoordination ? `
                <div class="iap-page">
                    <h2 class="iap-section-title">SECTION 11: EXTERNAL COORDINATION & PARTNERS</h2>
                    <div class="iap-content">
                        ${currentIAP.externalCoordination}
                    </div>
                </div>
                ` : ''}
                
                <!-- SECTION 12: Ancillary Notes -->
                ${currentIAP.ancillaryNotes ? `
                <div class="iap-page">
                    <h2 class="iap-section-title">SECTION 12: ANCILLARY NOTES & ADDITIONAL INFORMATION</h2>
                    <div class="iap-content">
                        ${currentIAP.ancillaryNotes}
                    </div>
                </div>
                ` : ''}
                
                <!-- Footer -->
                <div class="iap-footer">
                    <div class="iap-prepared-by">
                        <div>Prepared by: ${currentIAP.preparedBy || 'Planning Section'}</div>
                        <div>Approved by: ${currentIAP.approvedBy || operationData.droDirector || 'DRO Director'}</div>
                    </div>
                    <div class="iap-timestamp">
                        Generated: ${new Date().toLocaleString()}
                    </div>
                </div>
            </div>
        `;
        
        return html;
    };
    
    // Replace the old generation function
    window.generateLiveIAPDocument = window.generateCorrectIAPDocument;
    
    // Update styles for the command staff table
    function addCommandStaffStyles() {
        const existingStyle = document.getElementById('commandStaffStyles');
        if (existingStyle) return;
        
        const style = document.createElement('style');
        style.id = 'commandStaffStyles';
        style.textContent = `
            .iap-command-table {
                width: 100%;
                border-collapse: collapse;
                margin: 1.5rem 0;
            }
            
            .iap-command-table th {
                background: var(--red-cross-red);
                color: white;
                padding: 0.75rem;
                text-align: left;
                font-weight: 600;
            }
            
            .iap-command-table td {
                padding: 0.5rem 0.75rem;
                border: 1px solid #ddd;
            }
            
            .iap-command-table tr.section-header td {
                background: #f0f0f0;
                font-weight: bold;
                padding: 0.75rem;
            }
            
            .iap-command-table tr:nth-child(even) {
                background: #f9f9f9;
            }
            
            .iap-info-table {
                width: 100%;
                border-collapse: collapse;
                margin: 1rem 0;
            }
            
            .iap-info-table td {
                padding: 0.5rem;
                border: 1px solid #ddd;
            }
            
            .org-chart-note {
                background: #f0f9ff;
                border-left: 4px solid var(--info-blue);
                padding: 1rem;
                margin-top: 2rem;
                border-radius: 4px;
            }
            
            /* Dark mode support */
            body.dark-mode .iap-command-table th {
                background: var(--red-cross-red);
            }
            
            body.dark-mode .iap-command-table td {
                border-color: var(--border-color);
            }
            
            body.dark-mode .iap-command-table tr.section-header td {
                background: var(--bg-secondary);
            }
            
            body.dark-mode .iap-command-table tr:nth-child(even) {
                background: var(--bg-secondary);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addCommandStaffStyles);
    } else {
        addCommandStaffStyles();
    }
})();