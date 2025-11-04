# Data Model: Gym Workout Routine Manager

**Feature**: 001-workout-routine  
**Date**: 2025-11-04  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the data structures stored in browser localStorage. All data is stored as JSON and never leaves the client browser.

## Storage Key

**Primary Key**: `workoutLists`  
**Type**: JSON string containing array of WorkoutList objects  
**Max Size**: ~5MB (typical localStorage limit)

---

## Entity: WorkoutList

Represents a single workout routine containing multiple exercises.

### JSON Structure

```json
{
  "id": "uuid-string",
  "name": "Chest and Triceps",
  "createdAt": "2025-11-04T10:30:00Z",
  "updatedAt": "2025-11-04T10:30:00Z",
  "exercises": [
    {
      "id": "uuid-string",
      "name": "Bench Press",
      "sets": "4",
      "reps": "8-10",
      "weight": "135 lbs",
      "restTime": "90 sec",
      "notes": "Focus on form"
    }
  ]
}
```

### Field Definitions

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | string | Yes | UUID v4 format | Unique identifier for the list |
| `name` | string | Yes | 1-50 chars, non-empty | User-defined list name |
| `createdAt` | string | Yes | ISO 8601 datetime | Timestamp when list was created |
| `updatedAt` | string | Yes | ISO 8601 datetime | Timestamp of last modification |
| `exercises` | array | Yes | Array of Exercise objects | Ordered list of exercises |

### Business Rules

- List `name` must be unique across all lists
- List must contain at least one exercise to be saved (validation at save time)
- `updatedAt` must be updated whenever exercises are added, removed, or modified
- Exercise order in array determines display order (sequential)

---

## Entity: Exercise

Represents a single exercise within a workout list.

### JSON Structure

```json
{
  "id": "uuid-string",
  "name": "Bench Press",
  "sets": "4",
  "reps": "8-10",
  "weight": "135 lbs",
  "restTime": "90 sec",
  "notes": "Focus on form"
}
```

### Field Definitions

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `id` | string | Yes | UUID v4 format | Unique identifier for the exercise |
| `name` | string | Yes | 1-100 chars, non-empty | Exercise name (user-defined) |
| `sets` | string | No | Max 20 chars | Number or range of sets (e.g., "3", "3-4") |
| `reps` | string | No | Max 20 chars | Number or range of reps (e.g., "10", "8-12") |
| `weight` | string | No | Max 30 chars | Weight with unit (e.g., "135 lbs", "60 kg") |
| `restTime` | string | No | Max 20 chars | Rest period (e.g., "90 sec", "2 min") |
| `notes` | string | No | Max 200 chars | Additional notes or instructions |

### Business Rules

- Exercise `name` is the only required field
- All optional fields stored as strings for flexibility (no rigid structure)
- Users can provide as much or as little detail as needed
- Empty optional fields should be stored as empty strings or omitted

---

## Storage Structure

### Complete localStorage Example

```json
// Key: "workoutLists"
// Value: JSON string of array below
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Chest and Triceps",
    "createdAt": "2025-11-04T10:30:00Z",
    "updatedAt": "2025-11-04T10:30:00Z",
    "exercises": [
      {
        "id": "e1f2g3h4-i5j6-7890-abcd-ef1234567891",
        "name": "Bench Press",
        "sets": "4",
        "reps": "8-10",
        "weight": "135 lbs",
        "restTime": "90 sec",
        "notes": ""
      },
      {
        "id": "e1f2g3h4-i5j6-7890-abcd-ef1234567892",
        "name": "Incline Dumbbell Press",
        "sets": "3",
        "reps": "12",
        "weight": "50 lbs",
        "restTime": "60 sec",
        "notes": "Focus on squeeze at top"
      }
    ]
  },
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567893",
    "name": "Back and Biceps",
    "createdAt": "2025-11-04T11:00:00Z",
    "updatedAt": "2025-11-04T11:00:00Z",
    "exercises": [
      {
        "id": "e1f2g3h4-i5j6-7890-abcd-ef1234567894",
        "name": "Pull-ups",
        "sets": "4",
        "reps": "To failure",
        "weight": "Bodyweight",
        "restTime": "2 min",
        "notes": "Use assisted machine if needed"
      }
    ]
  }
]
```

---

## Data Operations

### Create New List

1. Generate UUID for list `id`
2. Set `createdAt` and `updatedAt` to current timestamp
3. Initialize empty `exercises` array
4. Validate `name` is unique and non-empty
5. Add to array and save to localStorage

### Add Exercise to List

1. Generate UUID for exercise `id`
2. Validate exercise `name` is non-empty
3. Add to list's `exercises` array
4. Update list's `updatedAt` timestamp
5. Save to localStorage

### Update List

1. Modify list or exercise fields
2. Update list's `updatedAt` timestamp
3. Validate data integrity
4. Save to localStorage

### Delete List

1. Remove list object from array by `id`
2. Save updated array to localStorage

### Delete Exercise from List

1. Remove exercise from list's `exercises` array by `id`
2. Update list's `updatedAt` timestamp
3. Save to localStorage

---

## Validation Rules

### On Save (localStorage Write)

```javascript
function validateWorkoutList(list) {
  // List validation
  if (!list.id || !isValidUUID(list.id)) throw new Error("Invalid list ID");
  if (!list.name || list.name.trim().length === 0) throw new Error("List name required");
  if (list.name.length > 50) throw new Error("List name too long (max 50 chars)");
  if (!list.exercises || !Array.isArray(list.exercises)) throw new Error("Exercises must be an array");
  if (list.exercises.length === 0) throw new Error("List must contain at least one exercise");
  
  // Exercise validation
  list.exercises.forEach((exercise, index) => {
    if (!exercise.id || !isValidUUID(exercise.id)) throw new Error(`Exercise ${index + 1}: Invalid ID`);
    if (!exercise.name || exercise.name.trim().length === 0) throw new Error(`Exercise ${index + 1}: Name required`);
    if (exercise.name.length > 100) throw new Error(`Exercise ${index + 1}: Name too long (max 100 chars)`);
    // Optional fields validation
    if (exercise.sets && exercise.sets.length > 20) throw new Error(`Exercise ${index + 1}: Sets too long`);
    if (exercise.reps && exercise.reps.length > 20) throw new Error(`Exercise ${index + 1}: Reps too long`);
    if (exercise.weight && exercise.weight.length > 30) throw new Error(`Exercise ${index + 1}: Weight too long`);
    if (exercise.restTime && exercise.restTime.length > 20) throw new Error(`Exercise ${index + 1}: Rest time too long`);
    if (exercise.notes && exercise.notes.length > 200) throw new Error(`Exercise ${index + 1}: Notes too long (max 200 chars)`);
  });
  
  return true;
}
```

---

## Migration Strategy

### Version 1.0 (Initial)

Current structure as defined above. No migrations needed.

### Future Versions

If data structure changes are needed:

1. Add `version` field to root of stored data: `{ version: "1.0", lists: [...] }`
2. Implement migration functions that detect version and transform data
3. Run migration on app load before any data operations
4. Preserve backward compatibility where possible

---

## Size Estimation

**Average list**: 1 list with 8 exercises, moderate details  
**Estimated JSON size**: ~2KB per list

**Maximum lists**: Assuming 5MB localStorage limit  
**Estimated capacity**: ~2,000 lists (unrealistic for single user)  
**Realistic capacity**: 50-100 lists per user

**Risk**: Unlikely to hit quota with normal usage. Error handling implemented for edge cases.

---

## Export Format

JSON export matches storage structure exactly:

```json
{
  "version": "1.0",
  "exportDate": "2025-11-04T15:30:00Z",
  "workoutLists": [
    // Array of WorkoutList objects as defined above
  ]
}
```

Exported file includes metadata for future import functionality.
