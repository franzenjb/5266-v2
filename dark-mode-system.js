// Dark Mode Toggle System for Form 5266 v2
// Brad's favorite feature - complete application theming

(function() {
    // Check for saved preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply theme on page load
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    // Create dark mode toggle button
    function createDarkModeToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'darkModeToggle';
        toggle.className = 'dark-mode-toggle';
        toggle.setAttribute('aria-label', 'Toggle dark mode');
        toggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
        
        // Add to header
        const header = document.querySelector('.header-content');
        if (header) {
            header.appendChild(toggle);
        }
        
        return toggle;
    }
    
    // Add comprehensive dark mode styles
    function addDarkModeStyles() {
        const style = document.createElement('style');
        style.id = 'darkModeStyles';
        style.textContent = `
            /* Dark mode toggle button */
            .dark-mode-toggle {
                position: fixed;
                top: 4.5rem;
                right: 2rem;
                z-index: 10000;
                background: var(--gray-light);
                border: 2px solid var(--gray-medium);
                border-radius: 50%;
                width: 45px;
                height: 45px;
                font-size: 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
            
            .dark-mode-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            
            /* Dark mode root variables */
            body.dark-mode {
                --bg-primary: #1a1a1a;
                --bg-secondary: #2d2d2d;
                --bg-card: #2d2d2d;
                --text-primary: #e0e0e0;
                --text-secondary: #b0b0b0;
                --border-color: #404040;
                --shadow: rgba(0,0,0,0.5);
                
                /* Keep Red Cross brand color */
                --red-cross-red: #ED1B2E;
                --red-cross-dark: #B51E2B;
                --red-cross-light: rgba(237, 27, 46, 0.1);
                
                /* Adjusted colors for dark mode */
                --gray-dark: #e0e0e0;
                --gray-medium: #b0b0b0;
                --gray-light: #404040;
                --success-green: #4ade80;
                --warning-yellow: #fbbf24;
                --info-blue: #60a5fa;
            }
            
            /* Base dark mode styles */
            body.dark-mode {
                background-color: var(--bg-primary);
                color: var(--text-primary);
            }
            
            /* Header */
            body.dark-mode .header {
                background-color: var(--bg-secondary);
                box-shadow: 0 2px 4px var(--shadow);
            }
            
            body.dark-mode .logo-section h1 {
                color: var(--text-primary);
            }
            
            /* Navigation */
            body.dark-mode .nav-tabs {
                background-color: var(--bg-secondary);
                border-bottom-color: var(--border-color);
            }
            
            body.dark-mode .tab-link {
                color: var(--text-secondary);
                border-bottom-color: transparent;
            }
            
            body.dark-mode .tab-link:hover {
                color: var(--text-primary);
                background-color: rgba(255,255,255,0.05);
            }
            
            body.dark-mode .tab-link.active {
                color: var(--red-cross-red);
                border-bottom-color: var(--red-cross-red);
            }
            
            /* Cards */
            body.dark-mode .card {
                background-color: var(--bg-card);
                box-shadow: 0 2px 8px var(--shadow);
                border: 1px solid var(--border-color);
            }
            
            body.dark-mode .card-header {
                border-bottom-color: var(--border-color);
            }
            
            body.dark-mode .card-title {
                color: var(--text-primary);
            }
            
            /* Forms */
            body.dark-mode input,
            body.dark-mode select,
            body.dark-mode textarea {
                background-color: var(--bg-primary);
                color: var(--text-primary);
                border-color: var(--border-color);
            }
            
            body.dark-mode input:focus,
            body.dark-mode select:focus,
            body.dark-mode textarea:focus {
                border-color: var(--red-cross-red);
                box-shadow: 0 0 0 3px rgba(237, 27, 46, 0.2);
            }
            
            body.dark-mode label {
                color: var(--text-secondary);
            }
            
            /* Buttons */
            body.dark-mode .btn {
                background-color: var(--bg-secondary);
                color: var(--text-primary);
                border-color: var(--border-color);
            }
            
            body.dark-mode .btn:hover {
                background-color: var(--border-color);
            }
            
            body.dark-mode .btn-primary {
                background-color: var(--red-cross-red);
                border-color: var(--red-cross-red);
                color: white;
            }
            
            body.dark-mode .btn-primary:hover {
                background-color: var(--red-cross-dark);
            }
            
            /* Tables */
            body.dark-mode table {
                background-color: var(--bg-card);
                color: var(--text-primary);
            }
            
            body.dark-mode th {
                background-color: var(--bg-secondary);
                color: var(--text-primary);
                border-color: var(--border-color);
            }
            
            body.dark-mode td {
                border-color: var(--border-color);
            }
            
            body.dark-mode tbody tr:hover {
                background-color: rgba(255,255,255,0.05);
            }
            
            /* Alerts */
            body.dark-mode .alert {
                background-color: var(--bg-card);
                border-color: var(--border-color);
                color: var(--text-primary);
            }
            
            body.dark-mode .alert-success {
                background-color: rgba(74, 222, 128, 0.1);
                border-color: var(--success-green);
                color: var(--success-green);
            }
            
            body.dark-mode .alert-warning {
                background-color: rgba(251, 191, 36, 0.1);
                border-color: var(--warning-yellow);
                color: var(--warning-yellow);
            }
            
            body.dark-mode .alert-info {
                background-color: rgba(96, 165, 250, 0.1);
                border-color: var(--info-blue);
                color: var(--info-blue);
            }
            
            /* Statistics display */
            body.dark-mode .stat-value {
                color: var(--text-primary);
            }
            
            body.dark-mode .stat-label {
                color: var(--text-secondary);
            }
            
            /* Empty states */
            body.dark-mode .empty-state {
                background-color: var(--bg-secondary);
                color: var(--text-secondary);
            }
            
            /* Feeding entries */
            body.dark-mode .feeding-entry {
                background-color: var(--bg-secondary);
                border-color: var(--border-color);
            }
            
            /* Modal/Dialog styles */
            body.dark-mode .modal {
                background-color: var(--bg-card);
                color: var(--text-primary);
            }
            
            body.dark-mode .modal-header {
                border-bottom-color: var(--border-color);
            }
            
            body.dark-mode .modal-footer {
                border-top-color: var(--border-color);
            }
            
            /* Scrollbars */
            body.dark-mode ::-webkit-scrollbar {
                width: 12px;
                height: 12px;
            }
            
            body.dark-mode ::-webkit-scrollbar-track {
                background: var(--bg-primary);
            }
            
            body.dark-mode ::-webkit-scrollbar-thumb {
                background: var(--border-color);
                border-radius: 6px;
            }
            
            body.dark-mode ::-webkit-scrollbar-thumb:hover {
                background: var(--gray-medium);
            }
            
            /* Map container dark mode */
            body.dark-mode .map-container {
                background-color: var(--bg-secondary);
                border-color: var(--border-color);
            }
            
            /* Leaflet map controls in dark mode */
            body.dark-mode .leaflet-control {
                background-color: var(--bg-card);
                color: var(--text-primary);
            }
            
            body.dark-mode .leaflet-control a {
                background-color: var(--bg-card);
                color: var(--text-primary);
            }
            
            body.dark-mode .leaflet-control a:hover {
                background-color: var(--bg-secondary);
            }
            
            body.dark-mode .leaflet-popup-content-wrapper {
                background-color: var(--bg-card);
                color: var(--text-primary);
            }
            
            body.dark-mode .leaflet-popup-tip {
                background-color: var(--bg-card);
            }
            
            /* Transition for smooth theme switching */
            body, .header, .nav-tabs, .card, input, select, textarea, .btn, table, .alert, .modal {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }
            
            /* Dark mode toggle in dark mode */
            body.dark-mode .dark-mode-toggle {
                background: var(--bg-secondary);
                border-color: var(--border-color);
                color: var(--text-primary);
            }
            
            /* Service line cards in dark mode */
            body.dark-mode .service-line-card {
                background-color: var(--bg-card);
                border-color: var(--border-color);
            }
            
            body.dark-mode .service-line-card:hover {
                background-color: var(--bg-secondary);
            }
            
            /* Chapter tags in dark mode */
            body.dark-mode .chapter-tag {
                background-color: var(--bg-secondary);
                color: var(--text-primary);
                border-color: var(--border-color);
            }
            
            /* County list items in dark mode */
            body.dark-mode .county-item {
                background-color: var(--bg-secondary);
                border-color: var(--border-color);
            }
            
            body.dark-mode .county-item:hover {
                background-color: rgba(237, 27, 46, 0.1);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Toggle dark mode
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        // Update button icon
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) {
            toggle.innerHTML = isDark ? '☀️' : '🌙';
        }
        
        // Save preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Switch map tiles if maps exist
        if (isDark) {
            switchToDarkMapTiles();
        } else {
            switchToLightMapTiles();
        }
        
        // Log the change
        if (window.addSystemUpdate) {
            window.addSystemUpdate(`Theme changed to ${isDark ? 'dark' : 'light'} mode`, 'info');
        }
    }
    
    // Switch to dark map tiles
    function switchToDarkMapTiles() {
        if (typeof L !== 'undefined') {
            // Find all map instances
            document.querySelectorAll('.leaflet-container').forEach(container => {
                const mapId = container.id;
                if (window[mapId + '_map'] || window.liveIAPMap) {
                    const map = window[mapId + '_map'] || window.liveIAPMap;
                    
                    // Remove existing tile layers
                    map.eachLayer(layer => {
                        if (layer instanceof L.TileLayer) {
                            map.removeLayer(layer);
                        }
                    });
                    
                    // Add dark tile layer (CartoDB Dark Matter)
                    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                        attribution: '© OpenStreetMap contributors © CARTO',
                        subdomains: 'abcd',
                        maxZoom: 19
                    }).addTo(map);
                }
            });
        }
    }
    
    // Switch to light map tiles
    function switchToLightMapTiles() {
        if (typeof L !== 'undefined') {
            // Find all map instances
            document.querySelectorAll('.leaflet-container').forEach(container => {
                const mapId = container.id;
                if (window[mapId + '_map'] || window.liveIAPMap) {
                    const map = window[mapId + '_map'] || window.liveIAPMap;
                    
                    // Remove existing tile layers
                    map.eachLayer(layer => {
                        if (layer instanceof L.TileLayer) {
                            map.removeLayer(layer);
                        }
                    });
                    
                    // Add light tile layer (OpenStreetMap)
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors',
                        maxZoom: 19
                    }).addTo(map);
                }
            });
        }
    }
    
    // Initialize dark mode system
    function initializeDarkMode() {
        addDarkModeStyles();
        const toggle = createDarkModeToggle();
        
        // Add click listener
        toggle.addEventListener('click', toggleDarkMode);
        
        // Apply dark tiles if starting in dark mode
        if (currentTheme === 'dark') {
            setTimeout(() => {
                switchToDarkMapTiles();
            }, 1000);
        }
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDarkMode);
    } else {
        initializeDarkMode();
    }
})();