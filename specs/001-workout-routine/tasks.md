# Tasks: Gym Workout Routine Manager

**Input**: Design documents from `/specs/001-workout-routine/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/storage-api.md

**Tests**: No test tasks included (not requested in specification)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

All paths relative to repository root: `/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic file structure

- [x] T001 Create directory structure: css/, js/, assets/ at repository root
- [x] T002 Create index.html with viewport meta tag and basic HTML5 structure
- [x] T003 [P] Create css/main.css with CSS reset and base layout styles
- [x] T004 [P] Create css/mobile.css with mobile-first responsive styles
- [x] T005 [P] Create css/typography.css with large font styles for distance reading

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core storage layer that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Implement custom error classes in js/storage.js: StorageError, ValidationError, QuotaExceededError, NotFoundError, DataCorruptionError
- [x] T007 Implement generateUUID() helper function in js/storage.js
- [x] T008 Implement isStorageAvailable() feature detection in js/storage.js
- [x] T009 Implement getAllLists() function in js/storage.js with error handling for corrupted data
- [x] T010 Implement getListById(id) function in js/storage.js
- [x] T011 Implement createList(name) function in js/storage.js with validation (unique name, 1-50 chars)
- [x] T012 Implement addExercise(listId, exerciseData) function in js/storage.js with validation
- [x] T013 Implement updateList(id, updates) function in js/storage.js
- [x] T014 Implement deleteList(id) function in js/storage.js
- [x] T015 Implement updateExercise(listId, exerciseId, updates) function in js/storage.js
- [x] T016 Implement deleteExercise(listId, exerciseId) function in js/storage.js with validation (prevent empty list)
- [x] T017 Test storage functions in browser console: create list, add exercises, retrieve, verify persistence

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Saved Workout Lists (Priority: P1) 🎯 MVP

**Goal**: Users can view their saved workout lists and open them to see exercises

**Independent Test**: Create sample workout lists in localStorage via console, open app, verify lists display correctly, click a list to see exercises

### Implementation for User Story 1

- [x] T018 [P] [US1] Add home view structure to index.html with id="home-view"
- [x] T019 [P] [US1] Add list selection view structure to index.html with id="list-selection-view"
- [x] T020 [P] [US1] Add list viewer view structure to index.html with id="list-viewer-view"
- [x] T021 [P] [US1] Style home view in css/main.css: two large buttons for "My Saved Lists" and "Create New List"
- [x] T022 [P] [US1] Style list selection view in css/main.css: list of clickable workout list names
- [x] T023 [P] [US1] Style list viewer view in css/typography.css: large text for exercise names (28-36px), high contrast
- [x] T024 [US1] Create js/app.js and implement view switching logic (show/hide views with CSS classes)
- [x] T025 [US1] Implement initApp() in js/app.js: check localStorage availability, show error if unavailable
- [x] T026 [US1] Implement showHome() in js/app.js to display home view
- [x] T027 [US1] Wire up "My Saved Lists" button in js/app.js to call showListSelection()
- [x] T028 [US1] Create js/list-viewer.js for displaying workout lists and exercises
- [x] T029 [US1] Implement showListSelection() in js/list-viewer.js: call getAllLists() and display list names
- [x] T030 [US1] Add empty state message in showListSelection() when no lists exist
- [x] T031 [US1] Implement showExercises(listId) in js/list-viewer.js: call getListById() and display exercises sequentially
- [x] T032 [US1] Add back button to list selection view and wire to showHome()
- [x] T033 [US1] Add back button to list viewer view and wire to showListSelection()
- [x] T034 [US1] Add mobile-responsive styles in css/mobile.css for touch-friendly buttons (44px minimum)
- [ ] T035 [US1] Test User Story 1: Create sample lists via console, verify display, navigation, and empty state

**Checkpoint**: At this point, User Story 1 should be fully functional - users can view and navigate saved lists

---

## Phase 4: User Story 2 - Create New Workout List (Priority: P2)

**Goal**: Users can create new workout lists with exercises and save them to localStorage

**Independent Test**: Click "Create New List", enter list name, add exercises with names and details, save, verify list appears in "My Saved Lists"

### Implementation for User Story 2

- [x] T036 [P] [US2] Add list creation view structure to index.html with id="list-creation-view"
- [x] T037 [P] [US2] Style list creation form in css/main.css: input for list name, exercise form fields
- [x] T038 [P] [US2] Style exercise input fields in css/mobile.css: name (required), sets, reps, weight, rest time, notes (optional)
- [x] T039 [US2] Create js/list-manager.js for workout list creation and editing
- [x] T040 [US2] Implement showCreateList() in js/list-manager.js: display empty form, initialize in-memory list
- [x] T041 [US2] Wire up "Create New List" button in js/app.js to call showCreateList()
- [x] T042 [US2] Implement addExerciseToForm() in js/list-manager.js: add exercise input fields dynamically
- [x] T043 [US2] Implement removeExerciseFromForm(index) in js/list-manager.js: remove exercise from form
- [x] T044 [US2] Implement validateListForm() in js/list-manager.js: check list name non-empty, at least one exercise
- [x] T045 [US2] Implement saveList() in js/list-manager.js: validate form, call createList(), call addExercise() for each exercise
- [x] T046 [US2] Add error display for validation errors in js/list-manager.js (empty name, no exercises)
- [x] T047 [US2] Add error handling for QuotaExceededError with user-friendly message
- [x] T048 [US2] Implement unsaved changes tracking in js/list-manager.js (set flag when form modified)
- [x] T049 [US2] Add confirmation prompt before navigating away with unsaved changes
- [x] T050 [US2] Add back button to list creation view with unsaved changes check
- [x] T051 [US2] Wire save button to saveList() and redirect to showListSelection() on success
- [ ] T052 [US2] Test User Story 2: Create list with 5 exercises, save, verify appears in "My Saved Lists", verify persistence after refresh

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - full create and view workflow functional

---

## Phase 5: User Story 3 - View Exercise Details in Workout (Priority: P3)

**Goal**: Optimize text display for distance viewing during workouts with large, high-contrast typography

**Independent Test**: Open a saved workout list, verify text is readable from 3 feet away, check contrast and layout

### Implementation for User Story 3

- [x] T053 [P] [US3] Enhance exercise display in css/typography.css: use clamp() for responsive font sizing
- [x] T054 [P] [US3] Set exercise name font size in css/typography.css: clamp(28px, 5vw, 36px)
- [x] T055 [P] [US3] Set exercise details font size in css/typography.css: clamp(18px, 3vw, 24px)
- [x] T056 [P] [US3] Add high contrast colors in css/typography.css: #000 on #FFF or #FFF on #222
- [x] T057 [P] [US3] Add clear visual separation between exercises in css/main.css: borders or spacing
- [x] T058 [P] [US3] Optimize line height and letter spacing for readability in css/typography.css
- [x] T059 [US3] Update showExercises() in js/list-viewer.js to use enhanced typography classes
- [x] T060 [US3] Add optional exercise details display (sets, reps, weight, rest time, notes) in readable format
- [ ] T061 [US3] Test User Story 3: View exercises on mobile device, verify readability from 3 feet away

**Checkpoint**: All user stories should now be independently functional with optimized display

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final enhancements, edge cases, and data management features

- [x] T062 [P] Implement exportAllData() in js/storage.js: generate JSON with metadata
- [x] T063 [P] Implement clearAllData() in js/storage.js for testing/reset
- [x] T064 Add export button to home view in index.html
- [x] T065 Wire export button to exportAllData() and trigger JSON download in browser
- [ ] T066 [P] Add loading states/spinners for storage operations in css/main.css
- [x] T067 [P] Implement reorderExercises(listId, exerciseIds) in js/storage.js (optional enhancement)
- [ ] T068 Add delete list functionality: button in list selection view, confirmation dialog
- [ ] T069 Add delete exercise functionality: button in list viewer, update display
- [ ] T070 Add edit list functionality: pre-populate form in js/list-manager.js, update instead of create
- [ ] T071 Test edge cases: extremely long names, localStorage quota exceeded, corrupted data
- [ ] T072 Test cross-browser: Chrome, Firefox, Safari, Edge
- [ ] T073 Test mobile devices: various screen sizes (320px-414px), portrait and landscape
- [ ] T074 Optimize performance: check initial load time under 2 seconds
- [ ] T075 Add accessibility attributes: ARIA labels, semantic HTML, keyboard navigation
- [ ] T076 Final validation: verify all functional requirements (FR-001 through FR-012) are met

---

## Dependencies and Execution Order

### Critical Path

```
Phase 1 (Setup) → Phase 2 (Foundational) → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3) → Phase 6 (Polish)
```

### User Story Dependencies

- **US1 (View Lists)**: Depends on Phase 2 (storage layer)
- **US2 (Create Lists)**: Depends on Phase 2 (storage layer), independent of US1
- **US3 (Distance Reading)**: Depends on US1 (display infrastructure), enhances existing views

### Parallel Opportunities

**Phase 1 (Setup)**: Tasks T003, T004, T005 can run in parallel (different CSS files)

**Phase 2 (Foundational)**: Tasks T006-T016 must be sequential (each builds on previous)

**Phase 3 (US1)**: 
- Parallel Group 1: T018, T019, T020 (different HTML sections)
- Parallel Group 2: T021, T022, T023 (different CSS concerns)
- Sequential: T024-T035 (app logic builds incrementally)

**Phase 4 (US2)**:
- Parallel Group 1: T036, T037, T038 (HTML and CSS)
- Sequential: T039-T052 (form logic and integration)

**Phase 5 (US3)**:
- All CSS tasks (T053-T058) can run in parallel
- JavaScript updates (T059-T061) sequential

**Phase 6 (Polish)**:
- Parallel Group 1: T062, T063, T066, T067 (independent enhancements)
- Sequential: T064-T076 (integration and testing)

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

**Recommended MVP**: User Story 1 only (Phase 1 + Phase 2 + Phase 3)

**Why**: Delivers core value - users can view pre-created workout lists. This can be tested immediately by creating sample data via console.

**MVP Task Count**: 35 tasks (T001-T035)

**Estimated Effort**: 2-3 days for experienced developer

### Incremental Delivery

1. **Sprint 1 - MVP**: Complete Phases 1-3 (US1)
   - Deliverable: View saved lists
   - Test: Create sample lists via console, view and navigate
   
2. **Sprint 2 - Full Workflow**: Add Phase 4 (US2)
   - Deliverable: Create and view workflow
   - Test: End-to-end list creation and viewing
   
3. **Sprint 3 - Enhanced UX**: Add Phase 5 (US3)
   - Deliverable: Distance-readable display
   - Test: Physical gym environment testing
   
4. **Sprint 4 - Production Ready**: Add Phase 6 (Polish)
   - Deliverable: Complete feature set with export, delete, edit
   - Test: Full acceptance testing across browsers

---

## Task Summary

**Total Tasks**: 76

**By Phase**:
- Phase 1 (Setup): 5 tasks
- Phase 2 (Foundational): 12 tasks (BLOCKING)
- Phase 3 (US1 - MVP): 18 tasks
- Phase 4 (US2): 17 tasks
- Phase 5 (US3): 9 tasks
- Phase 6 (Polish): 15 tasks

**By User Story**:
- US1 (View Saved Lists - P1): 18 tasks
- US2 (Create New List - P2): 17 tasks
- US3 (Distance Reading - P3): 9 tasks
- Shared/Infrastructure: 32 tasks

**Parallelization Opportunities**: 
- 15 tasks marked [P] can run in parallel within their phase
- CSS tasks can often run concurrently with JS tasks in different phases

---

## Validation Checklist

### Format Validation
- ✅ All tasks use checkbox format: `- [ ]`
- ✅ All tasks have sequential IDs (T001-T076)
- ✅ User story tasks have [US#] labels
- ✅ Parallelizable tasks marked with [P]
- ✅ All tasks include file paths in descriptions

### Completeness Validation
- ✅ All user stories from spec.md are covered (US1, US2, US3)
- ✅ All entities from data-model.md are addressed (WorkoutList, Exercise)
- ✅ All API functions from storage-api.md are implemented
- ✅ All functional requirements (FR-001 to FR-012) are mapped to tasks
- ✅ Each user story has independent test criteria
- ✅ MVP scope clearly defined (US1 only)

### Execution Validation
- ✅ Dependencies clearly documented
- ✅ Critical path identified (Foundational is blocking)
- ✅ Parallel opportunities identified
- ✅ Incremental delivery strategy defined
