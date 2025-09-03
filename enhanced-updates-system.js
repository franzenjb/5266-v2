// Enhanced Updates System for Form 5266 v2
// This tracks ALL changes across the entire application and displays them in a prominent scrolling box

(function() {
    // Store for all updates
    const updates = [];
    let updateBox = null;
    
    // Create and style the enhanced update box
    function createUpdateBox() {
        // Remove existing box if any
        const existing = document.getElementById('enhancedUpdateBox');
        if (existing) existing.remove();
        
        // Create new enhanced update box
        const box = document.createElement('div');
        box.id = 'enhancedUpdateBox';
        box.className = 'enhanced-update-box';
        box.innerHTML = `
            <div class="update-box-header">
                <h3>📡 Live System Updates</h3>
                <button id="clearUpdates" class="clear-btn">Clear</button>
            </div>
            <div id="enhancedUpdatesList" class="updates-list"></div>
        `;
        
        return box;
    }
    
    // Add update to the system
    window.addSystemUpdate = function(message, type = 'info') {
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
        const update = {
            time: time,
            message: message,
            type: type, // info, success, warning, error, data
            timestamp: Date.now()
        };
        
        updates.unshift(update);
        if (updates.length > 100) updates.pop(); // Keep last 100 updates
        
        renderUpdates();
    };
    
    // Render updates to the display
    function renderUpdates() {
        const list = document.getElementById('enhancedUpdatesList');
        if (!list) return;
        
        const html = updates.slice(0, 50).map(update => {
            const icon = getIcon(update.type);
            return `
                <div class="update-item update-${update.type}">
                    <span class="update-icon">${icon}</span>
                    <span class="update-time">${update.time}</span>
                    <span class="update-text">${update.message}</span>
                </div>
            `;
        }).join('');
        
        list.innerHTML = html;
    }
    
    // Get icon based on update type
    function getIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            data: '📊',
            map: '🗺️',
            save: '💾',
            load: '📂',
            nav: '🔄'
        };
        return icons[type] || '📝';
    }
    
    // Monitor all input changes
    function monitorInputs() {
        document.addEventListener('input', function(e) {
            const target = e.target;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
                const fieldName = target.placeholder || target.name || target.id || 'field';
                const value = target.type === 'checkbox' ? (target.checked ? 'checked' : 'unchecked') : target.value;
                if (value) {
                    addSystemUpdate(`${fieldName} updated: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`, 'data');
                }
            }
        });
    }
    
    // Monitor localStorage changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        if (key.startsWith('form5266_')) {
            const shortKey = key.replace('form5266_', '');
            addSystemUpdate(`Data saved: ${shortKey}`, 'save');
        }
    };
    
    // Monitor tab changes
    function monitorTabs() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('tab-link')) {
                const tabName = e.target.textContent;
                addSystemUpdate(`Navigated to: ${tabName}`, 'nav');
            }
        });
    }
    
    // Monitor map interactions
    window.monitorMapUpdate = function(action, details) {
        addSystemUpdate(`Map: ${action} - ${details}`, 'map');
    };
    
    // Monitor button clicks
    function monitorButtons() {
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.classList.contains('btn')) {
                const btnText = e.target.textContent.trim();
                if (btnText && btnText !== 'Clear') {
                    addSystemUpdate(`Action: ${btnText}`, 'info');
                }
            }
        });
    }
    
    // Initialize the enhanced update system
    function initializeUpdateSystem() {
        // Wait for Live IAP tab to be available
        const liveIAP = document.getElementById('live-iap');
        if (!liveIAP) {
            setTimeout(initializeUpdateSystem, 100);
            return;
        }
        
        // Find or create the update box container
        let container = liveIAP.querySelector('.dashboard-grid');
        if (!container) {
            container = liveIAP;
        }
        
        // Create and insert the update box
        updateBox = createUpdateBox();
        
        // Insert it as the second item (after Active IAP card)
        const firstCard = container.querySelector('.card');
        if (firstCard && firstCard.nextSibling) {
            container.insertBefore(updateBox, firstCard.nextSibling);
        } else {
            container.appendChild(updateBox);
        }
        
        // Add clear button functionality
        document.getElementById('clearUpdates').addEventListener('click', function() {
            updates.length = 0;
            renderUpdates();
            addSystemUpdate('Updates cleared', 'info');
        });
        
        // Start monitoring
        monitorInputs();
        monitorTabs();
        monitorButtons();
        
        // Add initial message
        addSystemUpdate('Enhanced update system initialized', 'success');
        addSystemUpdate('Monitoring all system changes', 'info');
    }
    
    // Add CSS styles for the enhanced update box
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .enhanced-update-box {
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                padding: 1.5rem;
                margin-bottom: 2rem;
                border-left: 4px solid var(--red-cross-red);
                height: 400px;
                display: flex;
                flex-direction: column;
                grid-column: span 2;
            }
            
            .update-box-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                padding-bottom: 0.75rem;
                border-bottom: 2px solid var(--gray-light);
            }
            
            .update-box-header h3 {
                margin: 0;
                color: var(--gray-dark);
                font-size: 1.2rem;
            }
            
            .clear-btn {
                background: var(--gray-light);
                border: none;
                padding: 0.25rem 0.75rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.85rem;
                transition: background 0.2s;
            }
            
            .clear-btn:hover {
                background: var(--gray-medium);
                color: white;
            }
            
            .updates-list {
                flex: 1;
                overflow-y: auto;
                padding-right: 0.5rem;
            }
            
            .update-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem;
                margin-bottom: 0.5rem;
                border-radius: 4px;
                background: var(--gray-light);
                animation: slideIn 0.3s ease;
                font-size: 0.9rem;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            .update-icon {
                font-size: 1rem;
            }
            
            .update-time {
                color: var(--gray-medium);
                font-size: 0.8rem;
                min-width: 70px;
            }
            
            .update-text {
                flex: 1;
                color: var(--gray-dark);
            }
            
            .update-success {
                background: #d4edda;
                border-left: 3px solid var(--success-green);
            }
            
            .update-warning {
                background: #fff3cd;
                border-left: 3px solid var(--warning-yellow);
            }
            
            .update-error {
                background: #f8d7da;
                border-left: 3px solid var(--red-cross-red);
            }
            
            .update-data {
                background: #d1ecf1;
                border-left: 3px solid var(--info-blue);
            }
            
            .update-map {
                background: #e7e3fc;
                border-left: 3px solid #6f42c1;
            }
            
            .update-save {
                background: #d4edda;
                border-left: 3px solid var(--success-green);
            }
            
            .update-nav {
                background: #ffeaa7;
                border-left: 3px solid #fdcb6e;
            }
            
            /* Dark mode support */
            body.dark-mode .enhanced-update-box {
                background: #2d2d2d;
                color: #e0e0e0;
            }
            
            body.dark-mode .update-box-header {
                border-bottom-color: #404040;
            }
            
            body.dark-mode .update-item {
                background: #1a1a1a;
            }
            
            body.dark-mode .clear-btn {
                background: #404040;
                color: #e0e0e0;
            }
            
            body.dark-mode .clear-btn:hover {
                background: #505050;
            }
            
            /* Scrollbar styling */
            .updates-list::-webkit-scrollbar {
                width: 8px;
            }
            
            .updates-list::-webkit-scrollbar-track {
                background: var(--gray-light);
                border-radius: 4px;
            }
            
            .updates-list::-webkit-scrollbar-thumb {
                background: var(--gray-medium);
                border-radius: 4px;
            }
            
            .updates-list::-webkit-scrollbar-thumb:hover {
                background: var(--gray-dark);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addStyles();
            setTimeout(initializeUpdateSystem, 100);
        });
    } else {
        addStyles();
        setTimeout(initializeUpdateSystem, 100);
    }
})();