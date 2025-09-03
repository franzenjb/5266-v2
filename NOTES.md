# Project Notes - Form 5266 v2

## Feature Requests

### Dark Mode Toggle (Priority: High)
**Requested by:** Brad  
**Date:** September 3, 2025  
**Description:** Add ability to toggle the entire application between light and dark themes

**Implementation Ideas:**
- Add toggle button in header (sun/moon icon)
- Store preference in localStorage
- CSS variables approach for easy theming:
  - Create dark theme variables
  - Swap CSS variable values on toggle
  - Smooth transitions between modes

**Dark Theme Color Suggestions:**
- Background: #1a1a1a (main), #2d2d2d (cards)
- Text: #e0e0e0 (primary), #b0b0b0 (secondary)
- Red Cross Red: Keep #ED1B2E for brand consistency
- Borders: #404040
- Success/Warning/Info: Slightly muted versions

**Components to Theme:**
- Main dashboard
- All cards and forms
- Navigation and header
- Maps (use dark map tiles)
- IAP Builder accordions
- Modals and alerts
- Tables and data grids
- Charts (if added)

**Technical Notes:**
- Use CSS custom properties (variables)
- Add `.dark-mode` class to body
- Transition duration: 0.3s for smooth switching
- Consider system preference detection: `prefers-color-scheme`
- Maps: Switch to dark tile providers (CartoDB Dark Matter)

## Other Enhancement Ideas

### Future Considerations
- Real-time collaboration features
- Mobile responsive improvements
- Export to multiple formats (Excel, PDF, CSV)
- Integration with Red Cross systems
- Offline mode with service workers
- Advanced reporting dashboards
- Role-based access control
- Audit trail/history tracking

## Brad's Preferences
- **Loves dark mode** - Make it a priority feature
- Clean, professional interface
- Fast, responsive interactions
- Data visualization emphasis

---
*Last Updated: September 3, 2025*