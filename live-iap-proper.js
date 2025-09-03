// Live IAP Document - Proper Structure Matching Real IAP Template
// This generates the ACTUAL IAP document structure, not a summary

function generateProperLiveIAP() {
    // Use the unified data store
    const operationData = window.DataStore ? DataStore.get('operation') : JSON.parse(localStorage.getItem('form5266_operation')) || {};
    const iapData = window.DataStore ? DataStore.get('iap') : JSON.parse(localStorage.getItem('form5266_iap_current')) || {};
    const feedingData = window.DataStore ? DataStore.get('feeding') : JSON.parse(localStorage.getItem('form5266_feeding')) || [];
    const contacts = window.DataStore ? DataStore.get('contacts') : JSON.parse(localStorage.getItem('form5266_contacts')) || [];
    
    // Get current date/time for operational period
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formatDate = (date) => {
        return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
    };
    
    const operationalPeriod = `06:00 ${formatDate(now)} to 05:59 ${formatDate(tomorrow)}`;
    
    return `
        <style>
            .iap-document {
                max-width: 1200px;
                margin: 0 auto;
                font-family: Arial, sans-serif;
                background: white;
                padding: 2rem;
            }
            
            .iap-page {
                page-break-after: always;
                margin-bottom: 3rem;
                padding-bottom: 2rem;
                border-bottom: 2px solid #ccc;
            }
            
            .iap-header {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                border: 2px solid black;
                margin-bottom: 1rem;
            }
            
            .iap-header > div {
                padding: 0.5rem;
                border-right: 1px solid black;
            }
            
            .iap-header > div:last-child {
                border-right: none;
            }
            
            .iap-title {
                font-size: 1.8rem;
                font-weight: bold;
                text-align: center;
                margin: 2rem 0;
            }
            
            .iap-cover-photo {
                width: 100%;
                max-width: 600px;
                height: 400px;
                border: 2px solid black;
                margin: 2rem auto;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f0f0f0;
            }
            
            .iap-table {
                width: 100%;
                border-collapse: collapse;
                margin: 1rem 0;
            }
            
            .iap-table th,
            .iap-table td {
                border: 1px solid black;
                padding: 0.5rem;
                text-align: left;
            }
            
            .iap-table th {
                background: #e0e0e0;
                font-weight: bold;
            }
            
            .section-header {
                background: #d0d0d0;
                font-weight: bold;
            }
            
            .iap-footer {
                display: flex;
                justify-content: space-between;
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px solid #999;
                font-size: 0.9rem;
            }
            
            .signature-block {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 3rem;
                margin: 2rem 0;
            }
            
            .signature-line {
                border-bottom: 1px solid black;
                margin-top: 3rem;
            }
            
            .org-chart {
                text-align: center;
                margin: 2rem 0;
            }
            
            .org-box {
                display: inline-block;
                border: 2px solid black;
                padding: 0.5rem 1rem;
                margin: 0.5rem;
                background: white;
            }
            
            .objectives-table {
                width: 100%;
                margin: 1rem 0;
            }
            
            .objectives-table td {
                padding: 0.5rem;
                vertical-align: top;
            }
            
            .priority-number {
                font-weight: bold;
                font-size: 1.2rem;
                width: 3rem;
            }
            
            @media print {
                .iap-page {
                    page-break-after: always;
                }
            }
        </style>
        
        <div class="iap-document">
            <!-- PAGE 1: COVER PAGE -->
            <div class="iap-page">
                <div class="iap-header">
                    <div>
                        <strong>Incident Name:</strong><br>
                        ${operationData.operationName || '[DR common name]'}
                    </div>
                    <div>
                        <strong>DR Number:</strong><br>
                        ${operationData.drNumber || 'XXX-XX'}
                    </div>
                    <div>
                        <strong>Operational Period:</strong><br>
                        ${operationalPeriod}
                    </div>
                </div>
                
                <div class="iap-title">
                    Incident Action Plan [#${iapData.iapNumber || '01'}]<br>
                    DR ${operationData.drNumber || 'XXX-XX'} ${operationData.operationName || '[DR common name]'}<br>
                    <span style="font-size: 1rem; font-weight: normal;">${operationalPeriod}</span>
                </div>
                
                <div class="iap-cover-photo">
                    ${iapData.coverPhoto ? 
                        `<img src="${iapData.coverPhoto}" style="max-width: 100%; max-height: 100%; object-fit: cover;">` :
                        '[Insert Photo]'
                    }
                </div>
                
                <table class="iap-table">
                    <tr>
                        <th colspan="2">Documents Included:</th>
                        <th>Y/N</th>
                        <th colspan="2">Documents Included:</th>
                        <th>Y/N</th>
                    </tr>
                    <tr>
                        <td colspan="2">Director's Intent/Message</td>
                        <td>Y</td>
                        <td colspan="2">Incident Organization Chart</td>
                        <td>Y</td>
                    </tr>
                    <tr>
                        <td colspan="2">Incident Priorities and Objectives</td>
                        <td>Y</td>
                        <td colspan="2">Work Assignment</td>
                        <td>Y</td>
                    </tr>
                    <tr>
                        <td colspan="2">Status of Previous Operating Period's Objectives</td>
                        <td>Y</td>
                        <td colspan="2">Work Sites</td>
                        <td>Y</td>
                    </tr>
                    <tr>
                        <td colspan="2">Contact Roster DRO HQ</td>
                        <td>Y</td>
                        <td colspan="2">Daily Schedule</td>
                        <td>Y</td>
                    </tr>
                    <tr>
                        <td colspan="2">Incident Open Action Tracker</td>
                        <td>Y</td>
                        <td colspan="2">General Message</td>
                        <td>Y</td>
                    </tr>
                </table>
                
                <div class="signature-block">
                    <div>
                        <strong>Prepared By:</strong><br><br>
                        <div class="signature-line"></div>
                        ${iapData.preparedBy || '[name]'}<br>
                        AD Information & Planning
                    </div>
                    <div>
                        <strong>Approved By:</strong><br><br>
                        <div class="signature-line"></div>
                        ${operationData.droDirector || '[name]'}<br>
                        DRO Director
                    </div>
                </div>
                
                <div class="iap-footer">
                    <span>Prepared By: ${iapData.preparedBy || '[name]'} AD Planning</span>
                    <span>Page 1 of 16</span>
                </div>
            </div>
            
            <!-- PAGE 2: DIRECTOR'S INTENT/MESSAGE -->
            <div class="iap-page">
                <div class="iap-header">
                    <div>
                        <strong>Incident Name:</strong><br>
                        ${operationData.operationName || '[DR common name]'}
                    </div>
                    <div>
                        <strong>DR Number:</strong><br>
                        ${operationData.drNumber || 'XXX-XX'}
                    </div>
                    <div>
                        <strong>Operational Period:</strong><br>
                        ${operationalPeriod}
                    </div>
                </div>
                
                <h2>Director's Intent/Message</h2>
                
                <div style="min-height: 400px; padding: 1rem; border: 1px solid #ccc; background: #f9f9f9;">
                    ${iapData.directorsMessage || '<p>DRO Brief Link (RC View) –</p><p>Account String</p>'}
                </div>
                
                <div class="iap-footer">
                    <span>Prepared By: ${iapData.preparedBy || '[name]'} AD Planning</span>
                    <span>Page 2 of 16</span>
                </div>
            </div>
            
            <!-- PAGE 3: INCIDENT PRIORITIES AND OBJECTIVES -->
            <div class="iap-page">
                <div class="iap-header">
                    <div>
                        <strong>Incident Name:</strong><br>
                        ${operationData.operationName || '[DR common name]'}
                    </div>
                    <div>
                        <strong>DR Number:</strong><br>
                        ${operationData.drNumber || 'XXX-XX'}
                    </div>
                    <div>
                        <strong>Operational Period:</strong><br>
                        ${operationalPeriod}
                    </div>
                </div>
                
                <h2>Incident Priorities and Objectives</h2>
                
                <h3>Incident Priorities:</h3>
                <table class="objectives-table">
                    ${[1, 2, 3, 4, 5].map(i => `
                        <tr>
                            <td class="priority-number">${i}.</td>
                            <td>${iapData[`priority${i}`] || ''}</td>
                        </tr>
                    `).join('')}
                </table>
                
                <h3>Incident Objectives:</h3>
                <table class="iap-table">
                    <tr>
                        <th width="10%">#</th>
                        <th width="90%">Description</th>
                    </tr>
                    ${[1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3].map(num => `
                        <tr>
                            <td>${num}</td>
                            <td>${iapData[`objective${num}`] || ''}</td>
                        </tr>
                    `).join('')}
                </table>
                
                <div class="iap-footer">
                    <span>Prepared By: ${iapData.preparedBy || '[name]'} AD Planning</span>
                    <span>Page 3 of 16</span>
                </div>
            </div>
            
            <!-- PAGE 4: STATUS OF PREVIOUS OPERATING PERIOD'S OBJECTIVES -->
            <div class="iap-page">
                <div class="iap-header">
                    <div>
                        <strong>Incident Name:</strong><br>
                        ${operationData.operationName || '[DR common name]'}
                    </div>
                    <div>
                        <strong>DR Number:</strong><br>
                        ${operationData.drNumber || 'XXX-XX'}
                    </div>
                    <div>
                        <strong>Operational Period:</strong><br>
                        ${operationalPeriod}
                    </div>
                </div>
                
                <h2>Status of Previous Operating Period's Objectives</h2>
                
                <table class="iap-table">
                    <tr>
                        <th width="10%">Obj #</th>
                        <th width="40%">Objective</th>
                        <th width="15%">Status</th>
                        <th width="35%">Significant Actions</th>
                    </tr>
                    ${(iapData.previousObjectives || []).length > 0 ? 
                        iapData.previousObjectives.map((obj, i) => `
                            <tr>
                                <td>${i + 1}.</td>
                                <td>${obj.objective || ''}</td>
                                <td>${obj.status || 'In Progress'}</td>
                                <td>${obj.actions || ''}</td>
                            </tr>
                        `).join('') :
                        `<tr>
                            <td>1.</td>
                            <td>Monitor current evacuation areas and continue communicating to the workforce about evacuation precautions.</td>
                            <td>Achieved</td>
                            <td>Evacuation areas monitored; precautions communicated to workforce through IAP and daily briefings.</td>
                        </tr>`
                    }
                </table>
                
                <div class="iap-footer">
                    <span>Prepared By: ${iapData.preparedBy || '[name]'} AD Planning</span>
                    <span>Page 4 of 16</span>
                </div>
            </div>
            
            <!-- PAGE 5: INCIDENT OPEN ACTION TRACKER -->
            <div class="iap-page">
                <div class="iap-header">
                    <div>
                        <strong>Incident Name:</strong><br>
                        ${operationData.operationName || '[DR common name]'}
                    </div>
                    <div>
                        <strong>DR Number:</strong><br>
                        ${operationData.drNumber || 'XXX-XX'}
                    </div>
                    <div>
                        <strong>Operational Period:</strong><br>
                        ${operationalPeriod}
                    </div>
                </div>
                
                <h2>Incident Open Action Tracker</h2>
                
                <table class="iap-table">
                    <tr>
                        <th>ID</th>
                        <th>Mission Title</th>
                        <th>Status</th>
                        <th>Request Type</th>
                        <th>Requestor Agency Type</th>
                        <th>Mission Owner Name</th>
                        <th>Due Date</th>
                        <th>District/Zone</th>
                    </tr>
                    ${(iapData.actionTracker || []).length > 0 ?
                        iapData.actionTracker.map(action => `
                            <tr>
                                <td>${action.id || ''}</td>
                                <td>${action.title || ''}</td>
                                <td>${action.status || ''}</td>
                                <td>${action.requestType || ''}</td>
                                <td>${action.requestorAgency || ''}</td>
                                <td>${action.owner || ''}</td>
                                <td>${action.dueDate || ''}</td>
                                <td>${action.district || ''}</td>
                            </tr>
                        `).join('') :
                        '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No open action items</td></tr>'
                    }
                </table>
                
                <div class="iap-footer">
                    <span>Prepared By: ${iapData.preparedBy || '[name]'} AD Planning</span>
                    <span>Page 5 of 16</span>
                </div>
            </div>
            
            <!-- PAGES 6-8: CONTACT ROSTER DRO HQ -->
            <div class="iap-page">
                <div class="iap-header">
                    <div>
                        <strong>Incident Name:</strong><br>
                        ${operationData.operationName || '[DR common name]'}
                    </div>
                    <div>
                        <strong>DR Number:</strong><br>
                        ${operationData.drNumber || 'XXX-XX'}
                    </div>
                    <div>
                        <strong>Operational Period:</strong><br>
                        ${operationalPeriod}
                    </div>
                </div>
                
                <h2>Contact Roster DRO HQ</h2>
                
                <table class="iap-table">
                    <tr class="section-header">
                        <td colspan="4"><strong>24 Hour Lines</strong></td>
                    </tr>
                    <tr>
                        <th width="30%">Position</th>
                        <th width="25%">Name</th>
                        <th width="20%">Phone</th>
                        <th width="25%">Email (@redcross.org)</th>
                    </tr>
                    <tr>
                        <td>24 Hour / Lodging</td>
                        <td>${iapData.lodging24hr || ''}</td>
                        <td>${iapData.lodging24hrPhone || ''}</td>
                        <td>${iapData.lodging24hrEmail || ''}</td>
                    </tr>
                    <tr>
                        <td>24 Hour / DMH</td>
                        <td>${iapData.dmh24hr || ''}</td>
                        <td>${iapData.dmh24hrPhone || ''}</td>
                        <td>${iapData.dmh24hrEmail || ''}</td>
                    </tr>
                    <tr>
                        <td>24 Hour / DHS</td>
                        <td>${iapData.dhs24hr || ''}</td>
                        <td>${iapData.dhs24hrPhone || ''}</td>
                        <td>${iapData.dhs24hrEmail || ''}</td>
                    </tr>
                    <tr>
                        <td>24 Hour / Staffing</td>
                        <td>${iapData.staffing24hr || ''}</td>
                        <td>${iapData.staffing24hrPhone || ''}</td>
                        <td>${iapData.staffing24hrEmail || ''}</td>
                    </tr>
                    
                    <tr class="section-header">
                        <td colspan="4"><strong>Command</strong></td>
                    </tr>
                    <tr>
                        <td>DRO Director</td>
                        <td>${operationData.droDirector || ''}</td>
                        <td>${operationData.droDirectorPhone || ''}</td>
                        <td>${operationData.droDirectorEmail || ''}</td>
                    </tr>
                    <tr>
                        <td>Deputy DRO Director</td>
                        <td>${operationData.deputyDirector || ''}</td>
                        <td>${operationData.deputyDirectorPhone || ''}</td>
                        <td>${operationData.deputyDirectorEmail || ''}</td>
                    </tr>
                    <tr>
                        <td>Chief of Staff</td>
                        <td>${iapData.chiefOfStaff || ''}</td>
                        <td>${iapData.chiefOfStaffPhone || ''}</td>
                        <td>${iapData.chiefOfStaffEmail || ''}</td>
                    </tr>
                    <tr>
                        <td>Elected Official Liaison (EOL) Chief</td>
                        <td>${iapData.eolChief || ''}</td>
                        <td>${iapData.eolChiefPhone || ''}</td>
                        <td>${iapData.eolChiefEmail || ''}</td>
                    </tr>
                    <tr>
                        <td>RCCO</td>
                        <td>${iapData.rcco || ''}</td>
                        <td>${iapData.rccoPhone || ''}</td>
                        <td>${iapData.rccoEmail || ''}</td>
                    </tr>
                    <tr>
                        <td>Regional Executive</td>
                        <td>${iapData.regionalExec || ''}</td>
                        <td>${iapData.regionalExecPhone || ''}</td>
                        <td>${iapData.regionalExecEmail || ''}</td>
                    </tr>
                    
                    <tr class="section-header">
                        <td colspan="4"><strong>Operations Section</strong></td>
                    </tr>
                    <tr>
                        <td>AD Operations</td>
                        <td>${iapData.adOperations || ''}</td>
                        <td>${iapData.adOperationsPhone || ''}</td>
                        <td>${iapData.adOperationsEmail || ''}</td>
                    </tr>
                    <tr>
                        <td>Deputy AD Operations</td>
                        <td>${iapData.deputyAdOperations || ''}</td>
                        <td>${iapData.deputyAdOperationsPhone || ''}</td>
                        <td>${iapData.deputyAdOperationsEmail || ''}</td>
                    </tr>
                    <tr>
                        <td>HQ Mass Care Chief</td>
                        <td>${iapData.massCareChief || ''}</td>
                        <td>${iapData.massCareChiefPhone || ''}</td>
                        <td>${iapData.massCareChiefEmail || ''}</td>
                    </tr>
                    <tr>
                        <td>HQ Sheltering Manager</td>
                        <td>${iapData.shelteringManager || ''}</td>
                        <td>${iapData.shelteringManagerPhone || ''}</td>
                        <td>${iapData.shelteringManagerEmail || ''}</td>
                    </tr>
                    <tr>
                        <td>HQ Feeding Manager</td>
                        <td>${iapData.feedingManager || ''}</td>
                        <td>${iapData.feedingManagerPhone || ''}</td>
                        <td>${iapData.feedingManagerEmail || ''}</td>
                    </tr>
                </table>
                
                <div class="iap-footer">
                    <span>Prepared By: ${iapData.preparedBy || '[name]'} AD Planning</span>
                    <span>Page 6 of 16</span>
                </div>
            </div>
            
            <!-- PAGE 10: INCIDENT ORGANIZATION CHART -->
            <div class="iap-page">
                <div class="iap-header">
                    <div>
                        <strong>Incident Name:</strong><br>
                        ${operationData.operationName || '[DR common name]'}
                    </div>
                    <div>
                        <strong>DR Number:</strong><br>
                        ${operationData.drNumber || 'XXX-XX'}
                    </div>
                    <div>
                        <strong>Operational Period:</strong><br>
                        ${operationalPeriod}
                    </div>
                </div>
                
                <h2>Incident Organization Chart</h2>
                <h3 style="text-align: center;">Command and Section Staff</h3>
                
                <div class="org-chart">
                    <div class="org-box" style="margin-bottom: 2rem;">
                        <strong>DRO Director</strong><br>
                        ${operationData.droDirector || '[Name]'}
                    </div>
                    
                    <div style="display: flex; justify-content: center; gap: 2rem; margin: 2rem 0;">
                        <div class="org-box">
                            <strong>Deputy Director</strong><br>
                            ${operationData.deputyDirector || '[Name]'}
                        </div>
                        <div class="org-box">
                            <strong>Chief of Staff</strong><br>
                            ${iapData.chiefOfStaff || '[Name]'}
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem; margin-top: 3rem;">
                        <div class="org-box">
                            <strong>AD Operations</strong><br>
                            ${iapData.adOperations || '[Name]'}
                        </div>
                        <div class="org-box">
                            <strong>AD Planning</strong><br>
                            ${iapData.adPlanning || '[Name]'}
                        </div>
                        <div class="org-box">
                            <strong>AD Logistics</strong><br>
                            ${iapData.adLogistics || '[Name]'}
                        </div>
                        <div class="org-box">
                            <strong>AD Finance</strong><br>
                            ${iapData.adFinance || '[Name]'}
                        </div>
                        <div class="org-box">
                            <strong>AD Workforce</strong><br>
                            ${iapData.adWorkforce || '[Name]'}
                        </div>
                        <div class="org-box">
                            <strong>AD External Relations</strong><br>
                            ${iapData.adExternalRelations || '[Name]'}
                        </div>
                    </div>
                    
                    <div style="margin-left: 0; margin-top: 1rem;">
                        <div class="org-box">
                            <strong>Deputy AD Operations</strong><br>
                            ${iapData.deputyAdOperations || '[Name]'}
                        </div>
                    </div>
                </div>
                
                <div class="iap-footer">
                    <span>Prepared By: ${iapData.preparedBy || '[name]'} AD Planning</span>
                    <span>Page 10 of 16</span>
                </div>
            </div>
            
            <!-- PAGE 13: WORK ASSIGNMENTS -->
            <div class="iap-page">
                <div class="iap-header">
                    <div>
                        <strong>Incident Name:</strong><br>
                        ${operationData.operationName || '[DR common name]'}
                    </div>
                    <div>
                        <strong>DR Number:</strong><br>
                        ${operationData.drNumber || 'XXX-XX'}
                    </div>
                    <div>
                        <strong>Operational Period:</strong><br>
                        ${operationalPeriod}
                    </div>
                </div>
                
                <h2>Work Assignment</h2>
                
                <div style="border: 2px solid black; padding: 1rem; margin-bottom: 1rem;">
                    <strong>District/Zone/County:</strong> ${iapData.workDistrict || ''}<br>
                    <strong>Operations Leadership:</strong><br>
                    AD Operations - ${iapData.adOperations || ''}<br>
                    District Director - ${iapData.districtDirector || ''}<br>
                    Deputy District Director - ${iapData.deputyDistrictDirector || ''}
                </div>
                
                <table class="iap-table">
                    <tr>
                        <th>Resource Identifier</th>
                        <th>Leader Name & Contact Information</th>
                        <th>Total # of persons</th>
                        <th>Reporting Location</th>
                        <th>Reporting Time / Operating Hours</th>
                    </tr>
                    ${(iapData.workAssignments || []).length > 0 ?
                        iapData.workAssignments.map(assignment => `
                            <tr>
                                <td rowspan="2">${assignment.resource || ''}</td>
                                <td>${assignment.leader || ''}</td>
                                <td>${assignment.personnel || ''}</td>
                                <td>${assignment.location || ''}</td>
                                <td>${assignment.hours || ''}</td>
                            </tr>
                            <tr>
                                <td colspan="4"><strong>Work Assignment:</strong> ${assignment.description || ''}</td>
                            </tr>
                        `).join('') :
                        `<tr>
                            <td rowspan="2">Ridgeview Shelter</td>
                            <td>Day - John Doe<br>(999) 999-9999<br>Night - Jane Doe<br>(111) 111-1111</td>
                            <td>SH/SA - 6<br>SH/SV - 2</td>
                            <td>123 Main Street<br>Anywhere MD 21133</td>
                            <td>06:00 Day Shift<br>18:00 Night Shift</td>
                        </tr>
                        <tr>
                            <td colspan="4"><strong>Work Assignment:</strong> Operate a Shelter at Ridgeview ES for 100 persons</td>
                        </tr>`
                    }
                </table>
                
                <div class="iap-footer">
                    <span>Prepared By: ${iapData.preparedBy || '[name]'} AD Planning</span>
                    <span>Page 13 of 16</span>
                </div>
            </div>
            
            <!-- PAGE 14: WORK SITES -->
            <div class="iap-page">
                <div class="iap-header">
                    <div>
                        <strong>Incident Name:</strong><br>
                        ${operationData.operationName || '[DR common name]'}
                    </div>
                    <div>
                        <strong>DR Number:</strong><br>
                        ${operationData.drNumber || 'XXX-XX'}
                    </div>
                    <div>
                        <strong>Operational Period:</strong><br>
                        ${operationalPeriod}
                    </div>
                </div>
                
                <h2>Work Sites</h2>
                
                <table class="iap-table">
                    <tr>
                        <th>Site Type/Location</th>
                        <th>District/Zone/County</th>
                        <th>Site Operational Hours</th>
                        <th>Contact Information</th>
                        <th>Additional Information</th>
                    </tr>
                    ${(iapData.workSites || []).length > 0 ?
                        iapData.workSites.map(site => `
                            <tr>
                                <td>${site.type || ''}<br>${site.location || ''}</td>
                                <td>${site.district || ''}</td>
                                <td>${site.hours || ''}</td>
                                <td>${site.contact || ''}</td>
                                <td>${site.additional || ''}</td>
                            </tr>
                        `).join('') :
                        `<tr>
                            <td>Shelter Mercedes Dome<br>1202 N. Vermont<br>Mercedes, TX</td>
                            <td>D1 - Hidalgo</td>
                            <td>Monday - Sunday<br>0700 - 1900</td>
                            <td>Bill Blind<br>303-359-XXXX</td>
                            <td></td>
                        </tr>`
                    }
                </table>
                
                <div class="iap-footer">
                    <span>Prepared By: ${iapData.preparedBy || '[name]'} AD Planning</span>
                    <span>Page 14 of 16</span>
                </div>
            </div>
            
            <!-- PAGE 15: GENERAL MESSAGE -->
            <div class="iap-page">
                <div class="iap-header">
                    <div>
                        <strong>Incident Name:</strong><br>
                        ${operationData.operationName || '[DR common name]'}
                    </div>
                    <div>
                        <strong>DR Number:</strong><br>
                        ${operationData.drNumber || 'XXX-XX'}
                    </div>
                    <div>
                        <strong>Operational Period:</strong><br>
                        ${operationalPeriod}
                    </div>
                </div>
                
                <h2>General Message</h2>
                
                <div style="min-height: 600px; padding: 1rem; border: 1px solid #ccc; background: #f9f9f9;">
                    ${iapData.generalMessage || ''}
                </div>
                
                <div class="iap-footer">
                    <span>Prepared By: ${iapData.preparedBy || '[name]'} AD Planning</span>
                    <span>Page 15 of 16</span>
                </div>
            </div>
            
            <!-- PAGE 16: DAILY SCHEDULE -->
            <div class="iap-page">
                <div class="iap-header">
                    <div>
                        <strong>Incident Name:</strong><br>
                        ${operationData.operationName || '[DR common name]'}
                    </div>
                    <div>
                        <strong>DR Number:</strong><br>
                        ${operationData.drNumber || 'XXX-XX'}
                    </div>
                    <div>
                        <strong>Operational Period:</strong><br>
                        ${operationalPeriod}
                    </div>
                </div>
                
                <h2>Daily Schedule</h2>
                <p style="text-align: right; font-style: italic; margin-bottom: 1rem;">All times are EDT</p>
                
                <table class="iap-table">
                    <tr>
                        <th width="15%">Time</th>
                        <th width="30%">Product/Meeting</th>
                        <th width="25%">Location</th>
                        <th width="30%">Required Attendance/Participation</th>
                    </tr>
                    ${(iapData.dailySchedule || []).length > 0 ?
                        iapData.dailySchedule.map(item => `
                            <tr>
                                <td>${item.time || ''}</td>
                                <td>${item.meeting || ''}</td>
                                <td>${item.location || ''}</td>
                                <td>${item.attendance || ''}</td>
                            </tr>
                        `).join('') :
                        `<tr>
                            <td>8:00 AM</td>
                            <td>Operational Leadership Meeting</td>
                            <td>Room Name<br>Conf Call # Participant Code:</td>
                            <td>DRO Director, Deputy Director, all ADs</td>
                        </tr>
                        <tr>
                            <td>11:00 AM</td>
                            <td>Daily Sheltering Support Coordination Meeting</td>
                            <td>Room Name<br>Conf Call # Participant Code:</td>
                            <td>AD of Operations, AD of Logistics, AD of Workforce, Mass Care Chief, Fulfillment Chief, IDC Chief, Gov. Operations Manager, Sheltering HQ Manager, Feeding HQ Manager, NHQ Liaison(s)</td>
                        </tr>
                        <tr>
                            <td>12:00 PM</td>
                            <td>Operational Planning Worksheets Due</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>1:00 PM</td>
                            <td>Tactics Meeting</td>
                            <td>Room Name<br>Conf Call # Participant Code:</td>
                            <td>Deputy Director, AD Operations, AD Information & Planning, and District Directors</td>
                        </tr>
                        <tr>
                            <td>4:00 PM</td>
                            <td>Planning Meeting</td>
                            <td>Room Name<br>Conf Call # Participant Code:</td>
                            <td>DRO Director, Deputy Director, AD Operations, AD Information & Planning</td>
                        </tr>
                        <tr>
                            <td>6:00 PM</td>
                            <td>IAP Distributed</td>
                            <td>Email</td>
                            <td>All assigned staff in Volunteer Connection and additional personnel</td>
                        </tr>
                        <tr>
                            <td>6:00 PM</td>
                            <td>Operations Briefing</td>
                            <td>Room Name<br>Conf Call # Participant Code:</td>
                            <td>DRO Director, Deputy Director, all ADs, and District Directors</td>
                        </tr>`
                    }
                </table>
                
                <div class="iap-footer">
                    <span>Prepared By: ${iapData.preparedBy || '[name]'} AD Planning</span>
                    <span>Page 16 of 16</span>
                </div>
            </div>
        </div>
    `;
}

// Make function globally available
window.generateLiveIAPDocument = generateProperLiveIAP;