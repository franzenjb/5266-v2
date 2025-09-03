// Dark Mode Support for IAP Builder
// Syncs with main application theme

(function() {
    // Apply saved theme on page load
    function applyTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }
    
    // Create dark mode toggle button for IAP Builder
    function createDarkModeToggle() {
        const existingToggle = document.getElementById('darkModeToggle');
        if (existingToggle) return;
        
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        const toggle = document.createElement('button');
        toggle.id = 'darkModeToggle';
        toggle.className = 'dark-mode-toggle';
        toggle.setAttribute('aria-label', 'Toggle dark mode');
        toggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
        toggle.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 2rem;
            z-index: 10000;
            background: #ECF0F1;
            border: 2px solid #7F8C8D;
            border-radius: 50%;
            width: 45px;
            height: 45px;
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(toggle);
        
        toggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            toggle.innerHTML = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            // Switch map tiles if needed
            if (typeof switchMapTheme === 'function') {
                switchMapTheme(isDark);
            }
        });
    }
    
    // Add dark mode styles for IAP Builder
    function addDarkModeStyles() {
        const existingStyles = document.getElementById('iapDarkModeStyles');
        if (existingStyles) return;
        
        const style = document.createElement('style');
        style.id = 'iapDarkModeStyles';
        style.textContent = `
            /* Dark mode variables */
            body.dark-mode {
                --bg-primary: #1a1a1a;
                --bg-secondary: #2d2d2d;
                --bg-card: #2d2d2d;
                --text-primary: #e0e0e0;
                --text-secondary: #b0b0b0;
                --border-color: #404040;
                --shadow: rgba(0,0,0,0.5);
                
                background-color: var(--bg-primary);
                color: var(--text-primary);
            }
            
            /* Header */
            body.dark-mode .header {
                background-color: var(--bg-secondary);
                box-shadow: 0 2px 4px var(--shadow);
            }
            
            body.dark-mode .header h1 {
                color: var(--text-primary);
            }
            
            /* Navigation */
            body.dark-mode .nav-link {
                color: var(--text-secondary);
            }
            
            body.dark-mode .nav-link:hover {
                color: var(--text-primary);
                background-color: rgba(255,255,255,0.05);
            }
            
            /* Accordion */
            body.dark-mode .accordion-header {
                background-color: var(--bg-secondary);
                color: var(--text-primary);
                border-color: var(--border-color);
            }
            
            body.dark-mode .accordion-header:hover {
                background-color: #3a3a3a;
            }
            
            body.dark-mode .accordion-header.active {
                background-color: #ED1B2E;
                color: white;
            }
            
            body.dark-mode .accordion-content {
                background-color: var(--bg-card);
                border-color: var(--border-color);
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
                border-color: #ED1B2E;
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
                background-color: #ED1B2E;
                border-color: #ED1B2E;
                color: white;
            }
            
            /* Cards */
            body.dark-mode .card {
                background-color: var(--bg-card);
                box-shadow: 0 2px 8px var(--shadow);
                border-color: var(--border-color);
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
            
            /* Rich text editor */
            body.dark-mode .ql-toolbar {
                background-color: var(--bg-secondary);
                border-color: var(--border-color);
            }
            
            body.dark-mode .ql-toolbar button {
                color: var(--text-primary);
            }
            
            body.dark-mode .ql-toolbar button:hover {
                background-color: rgba(255,255,255,0.1);
            }
            
            body.dark-mode .ql-toolbar .ql-stroke {
                stroke: var(--text-primary);
            }
            
            body.dark-mode .ql-toolbar .ql-fill {
                fill: var(--text-primary);
            }
            
            body.dark-mode .ql-container {
                background-color: var(--bg-primary);
                border-color: var(--border-color);
            }
            
            body.dark-mode .ql-editor {
                color: var(--text-primary);
            }
            
            body.dark-mode .ql-editor.ql-blank::before {
                color: var(--text-secondary);
            }
            
            /* Cover photo upload area */
            body.dark-mode .cover-photo-upload {
                background-color: var(--bg-secondary);
                border-color: var(--border-color);
                color: var(--text-primary);
            }
            
            body.dark-mode .upload-area {
                background-color: var(--bg-primary);
                border-color: var(--border-color);
            }
            
            /* Preview section */
            body.dark-mode #previewContent {
                background-color: var(--bg-card);
                color: var(--text-primary);
            }
            
            /* Transition for smooth switching */
            body, .header, .accordion-header, .accordion-content,
            input, select, textarea, .btn, .card, .ql-toolbar, .ql-container {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize dark mode for IAP Builder
    function initializeDarkMode() {
        applyTheme();
        addDarkModeStyles();
        createDarkModeToggle();
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDarkMode);
    } else {
        initializeDarkMode();
    }
})();