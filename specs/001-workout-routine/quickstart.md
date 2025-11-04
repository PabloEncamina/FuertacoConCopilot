# Quickstart Guide: Gym Workout Routine Manager

**Feature**: 001-workout-routine  
**Date**: 2025-11-04  
**Branch**: `001-workout-routine`

## Overview

A static web application for managing gym workout routines. Runs entirely in the browser with no server required. Data persists locally using localStorage.

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Text editor (VS Code, Sublime, or similar)
- Basic understanding of HTML, CSS, and JavaScript
- No build tools or dependencies required

---

## Quick Setup

### 1. File Structure

Create the following directory structure from the repository root:

```
/
├── index.html
├── css/
│   ├── main.css
│   ├── mobile.css
│   └── typography.css
└── js/
    ├── storage.js
    ├── app.js
    ├── list-manager.js
    └── list-viewer.js
```

### 2. Run the Application

**Option A: Open directly in browser**
```bash
# Navigate to project root
cd /path/to/FuertacoConCopilot

# Open in browser (use your browser's path)
open index.html  # macOS
start index.html # Windows
```

**Option B: Use a local web server (recommended for testing)**
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if installed)
npx serve

# Then open: http://localhost:8000
```

### 3. First Run

1. Open the app in your mobile browser or responsive mode
2. You'll see two options: "My Saved Lists" and "Create New List"
3. Create your first workout list
4. Add exercises with names and optional details
5. Save and view your list

---

## Development Workflow

### Starting Development

```bash
# 1. Ensure you're on the feature branch
git checkout 001-workout-routine

# 2. Open in browser or start local server
python -m http.server 8000

# 3. Open in browser with DevTools
# Chrome: F12 or Cmd+Option+I (Mac) / Ctrl+Shift+I (Windows)

# 4. Test mobile view
# Chrome DevTools > Toggle device toolbar (Cmd+Shift+M / Ctrl+Shift+M)
```

### Making Changes

1. **Edit files** in your text editor
2. **Refresh browser** to see changes (no build step needed)
3. **Check console** for JavaScript errors
4. **Test on mobile** using responsive mode or actual device

### Testing localStorage

```javascript
// Open browser console and test storage functions

// Check if localStorage is available
isStorageAvailable(); // Should return true

// Create a test list
const list = createList('Test Workout');
console.log(list);

// Add an exercise
const exercise = addExercise(list.id, {
  name: 'Test Exercise',
  reps: '10'
});

// Get all lists
const allLists = getAllLists();
console.log(allLists);

// Clear test data
clearAllData();
```

---

## File Implementation Order

Follow this order to build the application incrementally:

### Phase 1: Storage Layer (P1 - Critical)

**File**: `js/storage.js`

Implement these functions first:
1. `isStorageAvailable()` - Feature detection
2. `generateUUID()` - ID generation
3. `getAllLists()` - Read from localStorage
4. `createList()` - Create new list
5. `addExercise()` - Add exercise to list
6. Error classes (ValidationError, StorageError, etc.)

**Test**: Run storage functions in browser console

---

### Phase 2: Home Screen (P1 - Critical)

**Files**: `index.html`, `css/main.css`, `js/app.js`

1. Create HTML structure with three views:
   - Home view (two buttons)
   - List selection view
   - List viewer view
   - List creator view
2. Implement basic CSS layout and typography
3. Implement view switching in `app.js`
4. Wire up "My Saved Lists" button to display saved lists
5. Wire up "Create New List" button to show creation form

**Test**: Navigate between views, see placeholder data

---

### Phase 3: List Viewer (P1 - Critical)

**Files**: `js/list-viewer.js`, `css/typography.css`

1. Implement `displayListSelection()` - Show all saved lists
2. Implement `displayExercises()` - Show exercises in selected list
3. Add large typography styles for distance reading
4. Add back button navigation

**Test**: View saved lists and exercises with readable text

---

### Phase 4: List Creator (P2 - Important)

**Files**: `js/list-manager.js`, `css/mobile.css`

1. Implement list name input form
2. Implement exercise input form (name + optional fields)
3. Add exercise to list in-memory before saving
4. Implement save functionality (calls storage.js)
5. Add validation and error messages
6. Add confirmation prompt for unsaved work

**Test**: Create lists, add exercises, save, verify persistence

---

### Phase 5: Mobile Optimization (P3 - Enhancement)

**Files**: `css/mobile.css`, all CSS files

1. Add responsive media queries
2. Optimize touch targets (44px minimum)
3. Test on actual mobile devices
4. Adjust font sizes for distance reading
5. Improve contrast and readability

**Test**: Use on physical phone in gym environment

---

### Phase 6: Data Export (Optional)

**Files**: `js/storage.js`, `js/app.js`

1. Implement `exportAllData()` in storage.js
2. Add export button to home screen
3. Trigger JSON download in browser
4. Test export with sample data

**Test**: Export data, verify JSON structure

---

## Testing Checklist

### Manual Testing

- [ ] **Create List**: Can create a new workout list with a name
- [ ] **Add Exercise**: Can add exercises to a list
- [ ] **Save List**: List persists after browser refresh
- [ ] **View Lists**: Can see all saved lists on home screen
- [ ] **View Exercises**: Can open a list and see all exercises
- [ ] **Delete Exercise**: Can remove an exercise from a list
- [ ] **Delete List**: Can delete an entire list
- [ ] **Empty State**: Shows helpful message when no lists exist
- [ ] **Validation**: Cannot save list without name
- [ ] **Validation**: Cannot save list without exercises
- [ ] **Navigation**: Back button works from all screens
- [ ] **Unsaved Changes**: Prompts before discarding unsaved work

### Browser Testing

- [ ] **Chrome**: Test on latest version
- [ ] **Firefox**: Test on latest version
- [ ] **Safari**: Test on iOS Safari
- [ ] **Edge**: Test on latest version

### Mobile Testing

- [ ] **Small Screen** (320px): Layout works correctly
- [ ] **Medium Screen** (375px): Common phone size
- [ ] **Large Screen** (414px): Large phone size
- [ ] **Tablet** (768px): iPad size
- [ ] **Touch Targets**: All buttons easy to tap (44px minimum)
- [ ] **Distance Reading**: Text readable from 3 feet away

### localStorage Testing

- [ ] **Available**: App detects localStorage availability
- [ ] **Disabled**: Shows error if localStorage disabled
- [ ] **Quota Exceeded**: Handles quota error gracefully
- [ ] **Corrupted Data**: Handles invalid JSON gracefully
- [ ] **Multiple Tabs**: Data syncs between tabs (manual refresh)

### Performance Testing

- [ ] **Initial Load**: Page loads in under 2 seconds
- [ ] **View Switching**: Instant transition between views
- [ ] **Large Dataset**: Test with 20+ lists with 10+ exercises each
- [ ] **Export**: Export completes quickly with large dataset

---

## Debugging Tips

### localStorage Inspection

**Chrome DevTools**:
1. Open DevTools (F12)
2. Go to Application tab
3. Expand "Local Storage" in left sidebar
4. Click on your domain
5. See `workoutLists` key and value

### Clear localStorage

```javascript
// In browser console
localStorage.clear();
location.reload();
```

### View Stored Data

```javascript
// In browser console
const data = localStorage.getItem('workoutLists');
console.log(JSON.parse(data));
```

### Simulate Quota Error

```javascript
// Fill localStorage to test quota handling
try {
  const bigString = 'x'.repeat(5 * 1024 * 1024); // 5MB
  localStorage.setItem('test', bigString);
} catch (e) {
  console.log('Quota exceeded:', e);
}
localStorage.removeItem('test');
```

---

## Common Issues

### Issue: Changes not visible after refresh

**Solution**: Hard refresh to bypass cache
- Chrome/Firefox: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Safari: Cmd+Option+R

### Issue: localStorage not available

**Solution**: Check browser settings
- Ensure cookies/storage not blocked
- Disable private/incognito mode
- Check browser security settings

### Issue: Text too small on mobile

**Solution**: Check viewport meta tag in HTML
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Issue: Can't see console errors

**Solution**: Enable DevTools on mobile
- iOS Safari: Settings > Safari > Advanced > Web Inspector
- Android Chrome: chrome://inspect

---

## Production Deployment

### Deploy to GitHub Pages

```bash
# From main branch
git checkout main
git merge 001-workout-routine

# Push to GitHub
git push origin main

# Enable GitHub Pages in repository settings
# Settings > Pages > Source: main branch / root
```

### Deploy to Any Static Host

Simply upload all files to any web hosting service:
- Netlify: Drag and drop folder
- Vercel: Deploy via Git
- AWS S3: Upload as static website
- Any web server: Copy files to public directory

**No build step required** - just upload the files!

---

## Next Steps

1. Implement Phase 1 (storage.js)
2. Test storage functions in console
3. Implement Phase 2 (home screen)
4. Iterate through phases
5. Test on mobile device
6. Deploy and use in gym!

---

## Resources

- [localStorage API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Mobile Web Best Practices](https://developers.google.com/web/fundamentals/design-and-ux/principles)
- [Responsive Design](https://web.dev/responsive-web-design-basics/)

---

## Support

For issues or questions:
1. Check browser console for errors
2. Review data-model.md for data structure
3. Review storage-api.md for API documentation
4. Test with sample data in console
