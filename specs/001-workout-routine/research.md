# Research: Gym Workout Routine Manager

**Feature**: 001-workout-routine  
**Date**: 2025-11-04  
**Phase**: 0 - Outline & Research

## Research Questions Resolved

### 1. localStorage vs Cookies for Data Persistence

**Decision**: Use localStorage

**Rationale**:
- **Capacity**: localStorage provides 5-10MB storage (typically 5MB minimum) vs cookies' 4KB limit
- **Performance**: localStorage is synchronous and faster for client-side operations
- **Simplicity**: No HTTP overhead, data never sent to server
- **Best Practice**: localStorage is the modern standard for client-side data persistence in SPAs
- **Use Case Fit**: Workout lists with multiple exercises per list require more than 4KB

**Alternatives Considered**:
- **Cookies**: Rejected due to 4KB size limit and unnecessary HTTP overhead
- **IndexedDB**: Rejected as overkill for simple JSON data structures; adds complexity without benefit
- **SessionStorage**: Rejected as data would be lost when browser tab closes

**Implementation Notes**:
- Store workout lists as JSON array in single localStorage key
- Implement quota exceeded error handling
- Provide data export to JSON for backup

---

### 2. Single-Page vs Multi-Page Architecture

**Decision**: Single HTML file with JavaScript-driven view switching

**Rationale**:
- **Performance**: Eliminates page load delays between views (instant transitions)
- **User Experience**: Smooth transitions without full page reloads
- **Simplicity**: Easier state management without URL routing
- **Mobile Optimization**: Feels more app-like, better for gym use
- **Constitution Compliance**: No build step required, simple file structure

**Alternatives Considered**:
- **Multiple HTML files**: Rejected due to page load delays and state management complexity
- **Hash-based routing**: Rejected as unnecessary for 3 simple views
- **History API routing**: Rejected as overkill for this use case

**Implementation Notes**:
- Three main views: Home, List Manager (create/edit), List Viewer
- CSS classes to show/hide views
- JavaScript manages view transitions and state

---

### 3. Typography for Distance Readability

**Decision**: Use relative units (rem/em) with base font-size of 20px minimum, scalable to 28px+ for exercise display

**Rationale**:
- **Accessibility**: Relative units respect user browser settings
- **Distance Reading**: 28-32px font size readable from 1 meter distance on 5-6" screens
- **Mobile Optimization**: Viewport-based scaling with CSS clamp()
- **Best Practice**: rem for consistent sizing, em for component-relative sizing

**Alternatives Considered**:
- **Fixed pixel sizes**: Rejected for accessibility and scaling issues
- **Viewport units only**: Rejected for unpredictable behavior across devices
- **User-adjustable size**: Deferred to future enhancement

**Implementation Notes**:
- Base: 20px (1.25rem on default 16px)
- Exercise names: clamp(28px, 5vw, 36px)
- Exercise details: clamp(18px, 3vw, 24px)
- Buttons: clamp(18px, 4vw, 24px)
- High contrast: #000 on #FFF or #FFF on #222

---

### 4. Mobile-First Responsive Design Strategy

**Decision**: CSS Grid for layout with mobile-first media queries

**Rationale**:
- **Constitution Compliance**: CSS Grid and Flexbox explicitly recommended
- **Mobile Priority**: Design for phone first, enhance for larger screens
- **Simplicity**: Grid handles both simple and complex layouts
- **Performance**: Native CSS, no framework overhead
- **Flexibility**: Easy to adjust for different screen orientations

**Alternatives Considered**:
- **Flexbox only**: Rejected for more complex layouts (Grid + Flexbox combo optimal)
- **CSS Framework (Bootstrap, Tailwind)**: Rejected per constitution (minimal dependencies)
- **Desktop-first**: Rejected as primary use case is mobile in gym

**Implementation Notes**:
- Base styles for mobile (320px+)
- Media query breakpoint at 768px for tablet/desktop enhancements
- Touch-friendly tap targets: minimum 44x44px
- Vertical layouts for mobile, optional horizontal for larger screens

---

### 5. Data Validation and Error Handling

**Decision**: Client-side validation before localStorage operations with graceful error handling

**Rationale**:
- **Data Integrity**: Prevent invalid data from corrupting storage
- **User Experience**: Immediate feedback on validation errors
- **Quota Management**: Detect and handle storage quota exceeded gracefully
- **Constitution Requirement**: Explicit requirement for validation and error handling

**Alternatives Considered**:
- **No validation**: Rejected as risks data corruption
- **Schema validation library**: Rejected per minimal dependencies principle

**Implementation Notes**:
- Validate list names (non-empty, max length 50 chars)
- Validate exercise data (non-empty names)
- Try-catch around all localStorage operations
- User-friendly error messages for quota exceeded
- Graceful degradation if localStorage unavailable

---

### 6. Data Export/Import Functionality

**Decision**: Implement JSON export with download, defer import to future enhancement

**Rationale**:
- **Constitution Requirement**: "Include data export to JSON functionality"
- **User Control**: Users can backup their workout data
- **Privacy**: No server upload, data stays local
- **Simplicity**: Export is simpler than import (no validation complexity)

**Alternatives Considered**:
- **Full import/export**: Export prioritized, import deferred as optional enhancement
- **CSV format**: Rejected as JSON better preserves structure
- **Cloud sync**: Rejected as violates client-side-only principle

**Implementation Notes**:
- Export button on home screen or settings
- Generate JSON blob with all workout lists
- Trigger browser download with filename: `workout-lists-YYYY-MM-DD.json`
- Include data format version for future compatibility

---

## Technical Decisions Summary

| Decision Area | Choice | Key Reason |
|--------------|---------|------------|
| Storage | localStorage | Capacity and simplicity |
| Architecture | Single-page with view switching | Performance and UX |
| Typography | rem/clamp with 28-36px exercise text | Distance readability |
| Layout | CSS Grid + Flexbox | Constitution compliance, flexibility |
| Dependencies | Zero (vanilla JS) | Constitution requirement |
| Validation | Client-side with error handling | Data integrity and UX |
| Export | JSON download | User control and backup |

---

## Risk Mitigation

**Risk**: localStorage quota exceeded  
**Mitigation**: Error handling with user message, export functionality for backup, limit list count in UI

**Risk**: Browser doesn't support localStorage  
**Mitigation**: Feature detection with fallback message, graceful degradation

**Risk**: Text not readable from distance  
**Mitigation**: Large base font sizes, high contrast, testing on actual devices

**Risk**: Data corruption  
**Mitigation**: Validation before save, JSON parsing with error handling, export for recovery

---

## Next Steps (Phase 1)

1. Create data-model.md defining JSON structure for workout lists and exercises
2. Create storage-api.md contract documenting localStorage wrapper functions
3. Create quickstart.md with setup and testing instructions
4. Update agent context with technology choices
