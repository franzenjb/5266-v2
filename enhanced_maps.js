// Enhanced mapping configuration with multiple provider options and advanced features
// Supports Mapbox, Leaflet with multiple tile providers, and advanced choropleth mapping

const MapConfig = {
    // Mapbox configuration (best option if you have a token)
    mapbox: {
        token: '', // Add your Mapbox token here if available
        styleUrl: 'mapbox://styles/mapbox/light-v11'
    },
    
    // Default map center and zoom
    defaults: {
        florida: {
            center: [27.8, -82.5],
            zoom: 6.5
        },
        arizonaNewMexico: {
            center: [34.5, -108.5],
            zoom: 6
        },
        nationalView: {
            center: [39.5, -98.5],
            zoom: 4
        }
    },
    
    // Color schemes for choropleth
    colors: {
        redCross: {
            selected: '#ED1B2E',
            hover: '#B51E2B',
            default: '#ECF0F1',
            border: '#7F8C8D'
        }
    }
};

// Enhanced map initialization with multiple tile provider options
function initializeEnhancedMap(elementId, options = {}) {
    const defaults = {
        center: MapConfig.defaults.florida.center,
        zoom: MapConfig.defaults.florida.zoom,
        useMapbox: false,
        tileProvider: 'cartodb'  // Options: 'osm', 'cartodb', 'esri', 'stamen'
    };
    
    const config = { ...defaults, ...options };
    
    // Create map
    const map = L.map(elementId, {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true
    }).setView(config.center, config.zoom);
    
    // Add tile layer based on configuration
    if (config.useMapbox && MapConfig.mapbox.token) {
        // Use Mapbox (best quality)
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/light-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: MapConfig.mapbox.token
        }).addTo(map);
    } else {
        // Use alternative tile providers
        let tileLayer;
        
        switch(config.tileProvider) {
            case 'cartodb':
                // CartoDB Positron (clean, light style similar to screenshot)
                tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    subdomains: 'abcd',
                    maxZoom: 20
                });
                break;
                
            case 'esri':
                // ESRI World Gray Canvas (professional looking)
                tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
                    maxZoom: 16
                });
                break;
                
            case 'stamen':
                // Stamen Toner Lite
                tileLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png', {
                    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
                        '<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; ' +
                        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    subdomains: 'abcd',
                    minZoom: 0,
                    maxZoom: 20
                });
                break;
                
            default:
                // OpenStreetMap (fallback)
                tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                });
        }
        
        tileLayer.addTo(map);
    }
    
    // Add zoom control to top right
    map.zoomControl.setPosition('topright');
    
    // Add scale control
    L.control.scale({
        position: 'bottomleft',
        maxWidth: 200,
        imperial: true,
        metric: false
    }).addTo(map);
    
    return map;
}

// Create choropleth layer with enhanced features
function createChoroplethLayer(geoData, selectedItems = [], options = {}) {
    const defaults = {
        propertyName: 'name',
        selectedColor: MapConfig.colors.redCross.selected,
        defaultColor: MapConfig.colors.redCross.default,
        borderColor: MapConfig.colors.redCross.border,
        hoverColor: MapConfig.colors.redCross.hover,
        borderWeight: 1,
        fillOpacity: 0.7,
        hoverFillOpacity: 0.85
    };
    
    const config = { ...defaults, ...options };
    
    // Normalize selected items for comparison
    const normalizedSelected = selectedItems.map(item => item.toLowerCase().trim());
    
    const choroplethLayer = L.geoJSON(geoData, {
        style: function(feature) {
            const isSelected = normalizedSelected.some(item => 
                feature.properties[config.propertyName].toLowerCase().includes(item.toLowerCase()) ||
                item.includes(feature.properties[config.propertyName].toLowerCase())
            );
            
            return {
                fillColor: isSelected ? config.selectedColor : config.defaultColor,
                weight: config.borderWeight,
                opacity: 1,
                color: config.borderColor,
                fillOpacity: config.fillOpacity
            };
        },
        
        onEachFeature: function(feature, layer) {
            const isSelected = normalizedSelected.some(item => 
                feature.properties[config.propertyName].toLowerCase().includes(item.toLowerCase()) ||
                item.includes(feature.properties[config.propertyName].toLowerCase())
            );
            
            // Create popup content
            const popupContent = createPopupContent(feature, isSelected);
            layer.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup'
            });
            
            // Add hover effects
            layer.on({
                mouseover: function(e) {
                    const layer = e.target;
                    layer.setStyle({
                        fillOpacity: config.hoverFillOpacity,
                        weight: config.borderWeight + 1
                    });
                    
                    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                        layer.bringToFront();
                    }
                },
                mouseout: function(e) {
                    e.target.setStyle({
                        fillOpacity: config.fillOpacity,
                        weight: config.borderWeight
                    });
                },
                click: function(e) {
                    // Optional: Add click handler for additional actions
                }
            });
        }
    });
    
    return choroplethLayer;
}

// Create rich popup content
function createPopupContent(feature, isSelected) {
    const name = feature.properties.name;
    const region = feature.properties.region || 'Unknown Region';
    const status = isSelected ? 'Active' : 'Not Active';
    const statusColor = isSelected ? '#ED1B2E' : '#7F8C8D';
    
    let html = `
        <div style="font-family: 'Open Sans', sans-serif;">
            <h4 style="margin: 0 0 10px 0; color: #2C3E50; border-bottom: 2px solid ${statusColor}; padding-bottom: 5px;">
                ${name} County
            </h4>
            <table style="width: 100%; font-size: 14px;">
                <tr>
                    <td style="padding: 3px 0; font-weight: 600; color: #7F8C8D;">Region:</td>
                    <td style="padding: 3px 0;">${region}</td>
                </tr>
                <tr>
                    <td style="padding: 3px 0; font-weight: 600; color: #7F8C8D;">Status:</td>
                    <td style="padding: 3px 0;">
                        <span style="color: ${statusColor}; font-weight: 600;">${status}</span>
                    </td>
                </tr>
    `;
    
    // Add additional data if available
    if (feature.properties.population) {
        html += `
            <tr>
                <td style="padding: 3px 0; font-weight: 600; color: #7F8C8D;">Population:</td>
                <td style="padding: 3px 0;">${feature.properties.population.toLocaleString()}</td>
            </tr>
        `;
    }
    
    if (feature.properties.chapter) {
        html += `
            <tr>
                <td style="padding: 3px 0; font-weight: 600; color: #7F8C8D;">Chapter:</td>
                <td style="padding: 3px 0;">${feature.properties.chapter}</td>
            </tr>
        `;
    }
    
    html += `
            </table>
        </div>
    `;
    
    return html;
}

// Add custom legend control
function addMapLegend(map, options = {}) {
    const legend = L.control({ position: options.position || 'bottomright' });
    
    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'map-legend');
        
        div.innerHTML = `
            <div style="background: white; padding: 10px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #2C3E50;">Legend</h4>
                <div style="display: flex; align-items: center; margin: 4px 0;">
                    <div style="width: 20px; height: 20px; background: ${MapConfig.colors.redCross.selected}; margin-right: 8px; border: 1px solid #999;"></div>
                    <span style="font-size: 12px;">Active Counties</span>
                </div>
                <div style="display: flex; align-items: center; margin: 4px 0;">
                    <div style="width: 20px; height: 20px; background: ${MapConfig.colors.redCross.default}; margin-right: 8px; border: 1px solid #999;"></div>
                    <span style="font-size: 12px;">Other Counties</span>
                </div>
            </div>
        `;
        
        return div;
    };
    
    legend.addTo(map);
    return legend;
}

// Add data overlay (for showing statistics on the map)
function addDataOverlay(map, data, position = 'topright') {
    const overlay = L.control({ position: position });
    
    overlay.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'data-overlay');
        
        div.innerHTML = `
            <div style="background: white; padding: 15px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); min-width: 200px;">
                <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #ED1B2E; font-weight: 600;">Operation Statistics</h4>
                <div style="font-size: 12px; color: #2C3E50;">
                    <div style="margin: 5px 0;">
                        <span style="font-weight: 600;">Active Counties:</span> ${data.activeCounties || 0}
                    </div>
                    <div style="margin: 5px 0;">
                        <span style="font-weight: 600;">Total Chapters:</span> ${data.chapters || 0}
                    </div>
                    <div style="margin: 5px 0;">
                        <span style="font-weight: 600;">Total Meals:</span> ${(data.meals || 0).toLocaleString()}
                    </div>
                    <div style="margin: 5px 0;">
                        <span style="font-weight: 600;">Total Snacks:</span> ${(data.snacks || 0).toLocaleString()}
                    </div>
                </div>
            </div>
        `;
        
        return div;
    };
    
    overlay.addTo(map);
    return overlay;
}

// Helper function to fit map to selected counties
function fitMapToBounds(map, geoLayer, selectedCounties = []) {
    if (selectedCounties.length > 0) {
        // Get bounds of selected counties
        const selectedBounds = [];
        
        geoLayer.eachLayer(function(layer) {
            const feature = layer.feature;
            const isSelected = selectedCounties.some(county => 
                feature.properties.name.toLowerCase().includes(county.toLowerCase()) ||
                county.toLowerCase().includes(feature.properties.name.toLowerCase())
            );
            
            if (isSelected) {
                selectedBounds.push(layer.getBounds());
            }
        });
        
        if (selectedBounds.length > 0) {
            // Create combined bounds
            let bounds = selectedBounds[0];
            for (let i = 1; i < selectedBounds.length; i++) {
                bounds.extend(selectedBounds[i]);
            }
            
            // Fit map to bounds with padding
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }
}

// Export functions for use in other files
if (typeof window !== 'undefined') {
    window.MapUtils = {
        initializeEnhancedMap,
        createChoroplethLayer,
        addMapLegend,
        addDataOverlay,
        fitMapToBounds,
        createPopupContent,
        MapConfig
    };
}