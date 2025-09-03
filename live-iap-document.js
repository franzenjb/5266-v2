// Live IAP Document Display System
// Formats and displays the IAP like the official Red Cross IAP PDFs

(function() {
    // Generate formatted IAP document
    window.generateLiveIAPDocument = function() {
        // Get data from localStorage
        const operationData = JSON.parse(localStorage.getItem('form5266_operation')) || {};
        const currentIAP = JSON.parse(localStorage.getItem('form5266_iap_current')) || {};
        const feedingData = JSON.parse(localStorage.getItem('form5266_feeding')) || [];
        const shelteringData = JSON.parse(localStorage.getItem('form5266_sheltering')) || [];
        const massCareData = JSON.parse(localStorage.getItem('form5266_mass_care')) || {};
        
        // Calculate statistics
        const totalMeals = feedingData.reduce((sum, f) => sum + (f.meals || 0), 0);
        const totalSnacks = feedingData.reduce((sum, f) => sum + (f.snacks || 0), 0);
        const totalShelters = shelteringData.length;
        const shelterCapacity = shelteringData.reduce((sum, s) => sum + (s.capacity || 0), 0);
        
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
        
        // Format the current date
        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Generate the IAP document HTML
        const html = `
            <div class="iap-document">
                <!-- Cover Page -->
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
                    
                    <div class="iap-info-box">
                        <div class="iap-info-row">
                            <span class="iap-label">IAP Number:</span>
                            <span class="iap-value">${currentIAP.iapNumber || '001'}</span>
                        </div>
                        <div class="iap-info-row">
                            <span class="iap-label">DR Number:</span>
                            <span class="iap-value">${operationData.drNumber || currentIAP.drNumber || 'TBD'}</span>
                        </div>
                        <div class="iap-info-row">
                            <span class="iap-label">Incident Name:</span>
                            <span class="iap-value">${operationData.operationName || currentIAP.incidentName || 'Disaster Response Operation'}</span>
                        </div>
                        <div class="iap-info-row">
                            <span class="iap-label">Operational Period:</span>
                            <span class="iap-value">${currentIAP.periodStart || today.toLocaleDateString()} to ${currentIAP.periodEnd || today.toLocaleDateString()}</span>
                        </div>
                        <div class="iap-info-row">
                            <span class="iap-label">Date Prepared:</span>
                            <span class="iap-value">${dateStr}</span>
                        </div>
                        <div class="iap-info-row">
                            <span class="iap-label">Time Prepared:</span>
                            <span class="iap-value">${today.toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Director's Message -->
                ${currentIAP.directorMessage ? `
                <div class="iap-page">
                    <h2 class="iap-section-title">1. DIRECTOR'S MESSAGE</h2>
                    <div class="iap-content">
                        ${currentIAP.directorMessage}
                    </div>
                </div>
                ` : ''}
                
                <!-- Command Staff -->
                <div class="iap-page">
                    <h2 class="iap-section-title">2. COMMAND STAFF</h2>
                    <div class="iap-roster">
                        <table class="iap-table">
                            <thead>
                                <tr>
                                    <th>Position</th>
                                    <th>Name</th>
                                    <th>Contact</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>DRO Director</strong></td>
                                    <td>${operationData.droDirector || currentIAP.droDirector || 'TBD'}</td>
                                    <td>${operationData.droDirectorPhone || currentIAP.droDirectorPhone || ''}</td>
                                </tr>
                                <tr>
                                    <td><strong>Deputy Director</strong></td>
                                    <td>${operationData.deputyDirector || currentIAP.deputyDirector || 'TBD'}</td>
                                    <td>${operationData.deputyDirectorPhone || currentIAP.deputyDirectorPhone || ''}</td>
                                </tr>
                                <tr>
                                    <td><strong>Planning Chief</strong></td>
                                    <td>${currentIAP.planningChief || 'TBD'}</td>
                                    <td>${currentIAP.planningChiefPhone || ''}</td>
                                </tr>
                                <tr>
                                    <td><strong>Operations Chief</strong></td>
                                    <td>${currentIAP.operationsChief || 'TBD'}</td>
                                    <td>${currentIAP.operationsChiefPhone || ''}</td>
                                </tr>
                                <tr>
                                    <td><strong>Logistics Chief</strong></td>
                                    <td>${currentIAP.logisticsChief || 'TBD'}</td>
                                    <td>${currentIAP.logisticsChiefPhone || ''}</td>
                                </tr>
                                <tr>
                                    <td><strong>Finance Chief</strong></td>
                                    <td>${currentIAP.financeChief || 'TBD'}</td>
                                    <td>${currentIAP.financeChiefPhone || ''}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Geographic Coverage -->
                <div class="iap-page">
                    <h2 class="iap-section-title">3. GEOGRAPHIC COVERAGE</h2>
                    <div class="iap-content">
                        <div class="iap-info-grid">
                            <div>
                                <strong>Region:</strong> ${operationData.region || 'Not specified'}
                            </div>
                            <div>
                                <strong>Active Counties:</strong> ${operationData.counties ? operationData.counties.length : 0}
                            </div>
                            <div>
                                <strong>Active Chapters:</strong> ${operationData.chapters ? operationData.chapters.length : 0}
                            </div>
                        </div>
                        
                        ${operationData.counties && operationData.counties.length > 0 ? `
                        <div class="iap-counties">
                            <strong>Counties:</strong>
                            <div class="county-list">
                                ${operationData.counties.map(county => `<span class="county-tag">${county}</span>`).join(' ')}
                            </div>
                        </div>
                        ` : ''}
                        
                        <!-- Map placeholder -->
                        <div id="iapOperationalMap" class="iap-map" style="height: 400px; margin-top: 1rem; border: 1px solid #ddd; border-radius: 4px;"></div>
                    </div>
                </div>
                
                <!-- Service Lines Overview -->
                <div class="iap-page">
                    <h2 class="iap-section-title">4. SERVICE LINES OVERVIEW</h2>
                    
                    <!-- Feeding Statistics -->
                    <div class="service-section">
                        <h3>Feeding Operations</h3>
                        <table class="iap-table">
                            <tr>
                                <td><strong>Line 9 - Meals Served:</strong></td>
                                <td class="text-right">${totalMeals.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td><strong>Line 10 - Snacks Served:</strong></td>
                                <td class="text-right">${totalSnacks.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td><strong>Active Feeding Sites:</strong></td>
                                <td class="text-right">${feedingData.length}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <!-- Sheltering Statistics -->
                    <div class="service-section">
                        <h3>Sheltering Operations</h3>
                        <table class="iap-table">
                            <tr>
                                <td><strong>Line 38 - Shelters Opened:</strong></td>
                                <td class="text-right">${totalShelters}</td>
                            </tr>
                            <tr>
                                <td><strong>Total Shelter Capacity:</strong></td>
                                <td class="text-right">${shelterCapacity.toLocaleString()}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <!-- Mass Care Statistics -->
                    <div class="service-section">
                        <h3>Mass Care / Distribution</h3>
                        <table class="iap-table">
                            <tr>
                                <td><strong>Emergency Supplies Distributed:</strong></td>
                                <td class="text-right">${massCareData.suppliesDistributed || 0}</td>
                            </tr>
                            <tr>
                                <td><strong>Cleanup Kits Distributed:</strong></td>
                                <td class="text-right">${massCareData.cleanupKits || 0}</td>
                            </tr>
                            <tr>
                                <td><strong>Comfort Kits Distributed:</strong></td>
                                <td class="text-right">${massCareData.comfortKits || 0}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                
                <!-- Safety & Security -->
                ${currentIAP.safetyMessage ? `
                <div class="iap-page">
                    <h2 class="iap-section-title">5. SAFETY & SECURITY</h2>
                    <div class="iap-content">
                        ${currentIAP.safetyMessage}
                    </div>
                    
                    ${currentIAP.weatherForecast ? `
                    <div class="weather-section">
                        <h3>Weather Forecast</h3>
                        ${currentIAP.weatherForecast}
                    </div>
                    ` : ''}
                </div>
                ` : ''}
                
                <!-- External Coordination -->
                ${currentIAP.externalCoordination ? `
                <div class="iap-page">
                    <h2 class="iap-section-title">6. EXTERNAL COORDINATION</h2>
                    <div class="iap-content">
                        ${currentIAP.externalCoordination}
                    </div>
                </div>
                ` : ''}
                
                <!-- Ancillary Notes -->
                ${currentIAP.ancillaryNotes ? `
                <div class="iap-page">
                    <h2 class="iap-section-title">7. ANCILLARY NOTES</h2>
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
    
    // Add IAP document styles
    function addIAPStyles() {
        const style = document.createElement('style');
        style.id = 'iapDocumentStyles';
        style.textContent = `
            .iap-document-container {
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-top: 1rem;
                overflow: hidden;
            }
            
            .iap-document {
                padding: 2rem;
                max-width: 1200px;
                margin: 0 auto;
                font-family: 'Open Sans', -apple-system, sans-serif;
            }
            
            .iap-page {
                margin-bottom: 3rem;
                page-break-after: auto;
            }
            
            .iap-cover-page {
                text-align: center;
                padding: 3rem 2rem;
                background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
                border-bottom: 3px solid var(--red-cross-red);
            }
            
            .iap-cover-photo {
                margin-bottom: 2rem;
            }
            
            .iap-cover-photo img {
                max-width: 100%;
                max-height: 400px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            .iap-header {
                margin-bottom: 2rem;
            }
            
            .iap-logo {
                width: 60px;
                height: 60px;
                margin-bottom: 1rem;
            }
            
            .iap-header h1 {
                color: var(--red-cross-red);
                font-size: 2.5rem;
                font-weight: 700;
                margin: 0.5rem 0;
            }
            
            .iap-header h2 {
                color: var(--gray-dark);
                font-size: 1.5rem;
                font-weight: 600;
                margin: 0.5rem 0;
            }
            
            .iap-header h3 {
                color: var(--gray-medium);
                font-size: 1.2rem;
                font-weight: 400;
                margin: 0.5rem 0;
            }
            
            .iap-info-box {
                background: white;
                border: 2px solid var(--gray-light);
                border-radius: 8px;
                padding: 1.5rem;
                margin: 2rem auto;
                max-width: 600px;
                text-align: left;
            }
            
            .iap-info-row {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem 0;
                border-bottom: 1px solid var(--gray-light);
            }
            
            .iap-info-row:last-child {
                border-bottom: none;
            }
            
            .iap-label {
                font-weight: 600;
                color: var(--gray-dark);
            }
            
            .iap-value {
                color: var(--gray-dark);
            }
            
            .iap-section-title {
                color: var(--red-cross-red);
                font-size: 1.5rem;
                font-weight: 700;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid var(--red-cross-red);
            }
            
            .iap-content {
                line-height: 1.6;
                color: var(--gray-dark);
            }
            
            .iap-table {
                width: 100%;
                border-collapse: collapse;
                margin: 1rem 0;
            }
            
            .iap-table th {
                background: var(--gray-light);
                padding: 0.75rem;
                text-align: left;
                font-weight: 600;
                border: 1px solid #ddd;
            }
            
            .iap-table td {
                padding: 0.75rem;
                border: 1px solid #ddd;
            }
            
            .iap-table tr:nth-child(even) {
                background: #f9f9f9;
            }
            
            .text-right {
                text-align: right;
            }
            
            .service-section {
                margin: 2rem 0;
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 8px;
            }
            
            .service-section h3 {
                color: var(--gray-dark);
                margin-bottom: 1rem;
                font-size: 1.2rem;
            }
            
            .county-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-top: 0.5rem;
            }
            
            .county-tag {
                background: var(--red-cross-light);
                color: var(--red-cross-red);
                padding: 0.25rem 0.75rem;
                border-radius: 16px;
                font-size: 0.9rem;
                border: 1px solid var(--red-cross-red);
            }
            
            .iap-footer {
                margin-top: 3rem;
                padding-top: 2rem;
                border-top: 2px solid var(--gray-light);
                display: flex;
                justify-content: space-between;
                color: var(--gray-medium);
                font-size: 0.9rem;
            }
            
            .iap-map {
                width: 100%;
                background: #f0f0f0;
            }
            
            .weather-section {
                margin-top: 2rem;
                padding: 1rem;
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                border-radius: 4px;
            }
            
            .weather-section h3 {
                color: #856404;
                margin-bottom: 0.5rem;
            }
            
            /* Dark mode support */
            body.dark-mode .iap-document-container {
                background: var(--bg-card);
            }
            
            body.dark-mode .iap-document {
                color: var(--text-primary);
            }
            
            body.dark-mode .iap-cover-page {
                background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-secondary) 100%);
            }
            
            body.dark-mode .iap-info-box {
                background: var(--bg-secondary);
                border-color: var(--border-color);
            }
            
            body.dark-mode .iap-info-row {
                border-bottom-color: var(--border-color);
            }
            
            body.dark-mode .iap-table th {
                background: var(--bg-secondary);
                border-color: var(--border-color);
            }
            
            body.dark-mode .iap-table td {
                border-color: var(--border-color);
            }
            
            body.dark-mode .iap-table tr:nth-child(even) {
                background: var(--bg-secondary);
            }
            
            body.dark-mode .service-section {
                background: var(--bg-secondary);
            }
            
            body.dark-mode .county-tag {
                background: rgba(237, 27, 46, 0.1);
            }
            
            body.dark-mode .weather-section {
                background: rgba(255, 193, 7, 0.1);
                border-left-color: #ffc107;
            }
            
            /* Print styles */
            @media print {
                .iap-page {
                    page-break-after: always;
                }
                
                .iap-document {
                    padding: 0;
                }
                
                .btn, .alert {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Update the Live IAP display
    function updateLiveIAPDisplay() {
        const container = document.getElementById('iapDocumentContainer');
        if (!container) return;
        
        const html = generateLiveIAPDocument();
        container.innerHTML = html;
        
        // Initialize map if present
        const mapEl = document.getElementById('iapOperationalMap');
        if (mapEl && typeof initializeMap === 'function') {
            setTimeout(() => {
                const operationData = JSON.parse(localStorage.getItem('form5266_operation')) || {};
                const map = initializeMap('iapOperationalMap', {
                    center: [28.5383, -81.3792], // Florida center as default
                    zoom: 7
                });
                
                // Add county layers if available
                if (map && operationData.counties && operationData.counties.length > 0) {
                    // This would add the county overlays
                    if (window.addSystemUpdate) {
                        window.addSystemUpdate('IAP operational map loaded', 'map');
                    }
                }
            }, 500);
        }
        
        if (window.addSystemUpdate) {
            window.addSystemUpdate('Live IAP document updated', 'success');
        }
    }
    
    // Monitor for IAP changes
    function monitorIAPChanges() {
        // Watch for localStorage changes
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            originalSetItem.apply(this, arguments);
            if (key.includes('iap') || key.includes('form5266')) {
                setTimeout(updateLiveIAPDisplay, 100);
            }
        };
    }
    
    // Print IAP
    window.printIAP = function() {
        window.print();
        if (window.addSystemUpdate) {
            window.addSystemUpdate('IAP sent to printer', 'info');
        }
    };
    
    // Export IAP to PDF (placeholder - would need a library like jsPDF)
    window.exportIAPToPDF = function() {
        alert('PDF export will be implemented with jsPDF library. For now, use Print > Save as PDF.');
        if (window.addSystemUpdate) {
            window.addSystemUpdate('PDF export requested', 'warning');
        }
    };
    
    // Initialize
    function initializeLiveIAP() {
        addIAPStyles();
        
        // Add button handlers
        const printBtn = document.getElementById('printIAP');
        if (printBtn) {
            printBtn.addEventListener('click', printIAP);
        }
        
        const exportBtn = document.getElementById('exportIAPPDF');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportIAPToPDF);
        }
        
        // Initial display update
        updateLiveIAPDisplay();
        
        // Monitor for changes
        monitorIAPChanges();
        
        // Update when Live IAP tab is clicked
        document.addEventListener('click', function(e) {
            if (e.target.textContent === 'Live IAP' && e.target.classList.contains('tab-link')) {
                setTimeout(updateLiveIAPDisplay, 100);
            }
        });
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLiveIAP);
    } else {
        initializeLiveIAP();
    }
})();