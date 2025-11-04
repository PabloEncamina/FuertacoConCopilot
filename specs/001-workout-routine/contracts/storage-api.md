# Storage API Contract

**Feature**: 001-workout-routine  
**Date**: 2025-11-04  
**Phase**: 1 - Design & Contracts

## Overview

This contract defines the JavaScript API for interacting with localStorage. All functions in `storage.js` must implement this interface.

## Constants

```javascript
const STORAGE_KEY = 'workoutLists';
const MAX_LIST_NAME_LENGTH = 50;
const MAX_EXERCISE_NAME_LENGTH = 100;
const MAX_NOTES_LENGTH = 200;
```

---

## API Functions

### getAllLists()

Retrieves all workout lists from localStorage.

**Signature**:
```javascript
function getAllLists(): WorkoutList[]
```

**Returns**: Array of WorkoutList objects (empty array if no data)

**Throws**: 
- `StorageError` if localStorage is unavailable
- `DataCorruptionError` if stored data is invalid JSON

**Example**:
```javascript
const lists = getAllLists();
console.log(`Found ${lists.length} workout lists`);
```

---

### getListById(id)

Retrieves a single workout list by its ID.

**Signature**:
```javascript
function getListById(id: string): WorkoutList | null
```

**Parameters**:
- `id` (string): UUID of the workout list

**Returns**: WorkoutList object or null if not found

**Throws**: 
- `StorageError` if localStorage is unavailable
- `DataCorruptionError` if stored data is invalid

**Example**:
```javascript
const list = getListById('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
if (list) {
  console.log(`Found list: ${list.name}`);
}
```

---

### createList(name)

Creates a new empty workout list.

**Signature**:
```javascript
function createList(name: string): WorkoutList
```

**Parameters**:
- `name` (string): Name of the workout list (1-50 chars, must be unique)

**Returns**: Newly created WorkoutList object with empty exercises array

**Throws**: 
- `ValidationError` if name is empty, too long, or duplicate
- `QuotaExceededError` if localStorage quota exceeded
- `StorageError` if localStorage is unavailable

**Example**:
```javascript
try {
  const newList = createList('Leg Day');
  console.log(`Created list with ID: ${newList.id}`);
} catch (error) {
  console.error(`Failed to create list: ${error.message}`);
}
```

---

### updateList(id, updates)

Updates properties of an existing workout list.

**Signature**:
```javascript
function updateList(id: string, updates: Partial<WorkoutList>): WorkoutList
```

**Parameters**:
- `id` (string): UUID of the workout list to update
- `updates` (object): Partial WorkoutList object with fields to update

**Returns**: Updated WorkoutList object

**Throws**: 
- `NotFoundError` if list with given ID doesn't exist
- `ValidationError` if updates are invalid
- `QuotaExceededError` if localStorage quota exceeded
- `StorageError` if localStorage is unavailable

**Example**:
```javascript
const updated = updateList('a1b2c3d4-e5f6-7890-abcd-ef1234567890', {
  name: 'Upper Body - Updated'
});
```

---

### deleteList(id)

Deletes a workout list permanently.

**Signature**:
```javascript
function deleteList(id: string): boolean
```

**Parameters**:
- `id` (string): UUID of the workout list to delete

**Returns**: true if deleted, false if not found

**Throws**: 
- `StorageError` if localStorage is unavailable

**Example**:
```javascript
const deleted = deleteList('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
if (deleted) {
  console.log('List deleted successfully');
}
```

---

### addExercise(listId, exerciseData)

Adds a new exercise to a workout list.

**Signature**:
```javascript
function addExercise(listId: string, exerciseData: ExerciseInput): Exercise
```

**Parameters**:
- `listId` (string): UUID of the workout list
- `exerciseData` (object): Exercise data (name required, other fields optional)
  ```javascript
  {
    name: string,        // Required
    sets?: string,
    reps?: string,
    weight?: string,
    restTime?: string,
    notes?: string
  }
  ```

**Returns**: Newly created Exercise object with generated ID

**Throws**: 
- `NotFoundError` if list with given ID doesn't exist
- `ValidationError` if exercise data is invalid
- `QuotaExceededError` if localStorage quota exceeded
- `StorageError` if localStorage is unavailable

**Example**:
```javascript
const exercise = addExercise('a1b2c3d4-e5f6-7890-abcd-ef1234567890', {
  name: 'Squats',
  sets: '5',
  reps: '5',
  weight: '225 lbs',
  restTime: '3 min'
});
```

---

### updateExercise(listId, exerciseId, updates)

Updates properties of an existing exercise.

**Signature**:
```javascript
function updateExercise(listId: string, exerciseId: string, updates: Partial<Exercise>): Exercise
```

**Parameters**:
- `listId` (string): UUID of the workout list
- `exerciseId` (string): UUID of the exercise to update
- `updates` (object): Partial Exercise object with fields to update

**Returns**: Updated Exercise object

**Throws**: 
- `NotFoundError` if list or exercise not found
- `ValidationError` if updates are invalid
- `QuotaExceededError` if localStorage quota exceeded
- `StorageError` if localStorage is unavailable

**Example**:
```javascript
const updated = updateExercise(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'e1f2g3h4-i5j6-7890-abcd-ef1234567891',
  { weight: '245 lbs' }
);
```

---

### deleteExercise(listId, exerciseId)

Deletes an exercise from a workout list.

**Signature**:
```javascript
function deleteExercise(listId: string, exerciseId: string): boolean
```

**Parameters**:
- `listId` (string): UUID of the workout list
- `exerciseId` (string): UUID of the exercise to delete

**Returns**: true if deleted, false if not found

**Throws**: 
- `StorageError` if localStorage is unavailable
- `ValidationError` if deleting would leave list with no exercises

**Example**:
```javascript
const deleted = deleteExercise(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'e1f2g3h4-i5j6-7890-abcd-ef1234567891'
);
```

---

### reorderExercises(listId, exerciseIds)

Reorders exercises within a workout list.

**Signature**:
```javascript
function reorderExercises(listId: string, exerciseIds: string[]): WorkoutList
```

**Parameters**:
- `listId` (string): UUID of the workout list
- `exerciseIds` (array): Array of exercise IDs in desired order

**Returns**: Updated WorkoutList object

**Throws**: 
- `NotFoundError` if list not found
- `ValidationError` if exerciseIds don't match list's exercises
- `QuotaExceededError` if localStorage quota exceeded
- `StorageError` if localStorage is unavailable

**Example**:
```javascript
const reordered = reorderExercises(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  ['ex-3', 'ex-1', 'ex-2'] // New order
);
```

---

### exportAllData()

Exports all workout lists as JSON string.

**Signature**:
```javascript
function exportAllData(): string
```

**Returns**: JSON string containing all workout lists with metadata

**Throws**: 
- `StorageError` if localStorage is unavailable
- `DataCorruptionError` if stored data is invalid

**Example**:
```javascript
const jsonData = exportAllData();
const blob = new Blob([jsonData], { type: 'application/json' });
// Trigger download...
```

---

### clearAllData()

Deletes all workout lists (for testing or reset).

**Signature**:
```javascript
function clearAllData(): void
```

**Returns**: void

**Throws**: 
- `StorageError` if localStorage is unavailable

**Example**:
```javascript
clearAllData();
console.log('All data cleared');
```

---

## Error Types

### StorageError

Thrown when localStorage is unavailable or inaccessible.

```javascript
class StorageError extends Error {
  constructor(message) {
    super(message);
    this.name = 'StorageError';
  }
}
```

### ValidationError

Thrown when data fails validation rules.

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### QuotaExceededError

Thrown when localStorage quota is exceeded.

```javascript
class QuotaExceededError extends Error {
  constructor(message = 'Storage quota exceeded. Please delete some lists or export your data.') {
    super(message);
    this.name = 'QuotaExceededError';
  }
}
```

### NotFoundError

Thrown when requested resource doesn't exist.

```javascript
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}
```

### DataCorruptionError

Thrown when stored data cannot be parsed or is invalid.

```javascript
class DataCorruptionError extends Error {
  constructor(message = 'Stored data is corrupted. Please export if possible and reset.') {
    super(message);
    this.name = 'DataCorruptionError';
  }
}
```

---

## Helper Functions

### generateUUID()

Generates a UUID v4 string.

**Signature**:
```javascript
function generateUUID(): string
```

**Returns**: UUID v4 string

**Example**:
```javascript
const id = generateUUID();
// Returns: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
```

---

### isStorageAvailable()

Checks if localStorage is available in the browser.

**Signature**:
```javascript
function isStorageAvailable(): boolean
```

**Returns**: true if localStorage is available, false otherwise

**Example**:
```javascript
if (!isStorageAvailable()) {
  alert('This app requires localStorage to function');
}
```

---

## Usage Pattern

```javascript
// Initialize app
if (!isStorageAvailable()) {
  showError('localStorage not available');
  return;
}

try {
  // Load all lists
  const lists = getAllLists();
  
  // Create new list
  const newList = createList('My Workout');
  
  // Add exercises
  addExercise(newList.id, { name: 'Push-ups', reps: '20' });
  addExercise(newList.id, { name: 'Squats', reps: '15' });
  
  // Get updated list
  const updated = getListById(newList.id);
  console.log(`List has ${updated.exercises.length} exercises`);
  
} catch (error) {
  if (error instanceof QuotaExceededError) {
    showError('Storage full. Please delete old lists.');
  } else if (error instanceof ValidationError) {
    showError(`Invalid data: ${error.message}`);
  } else {
    showError('An unexpected error occurred');
  }
}
```

---

## Testing Checklist

- [ ] Test with localStorage disabled
- [ ] Test with quota exceeded simulation
- [ ] Test with corrupted data in localStorage
- [ ] Test concurrent modifications (multiple tabs)
- [ ] Test all validation rules
- [ ] Test error handling for each function
- [ ] Test with empty state (no lists)
- [ ] Test with maximum realistic data (50+ lists)
