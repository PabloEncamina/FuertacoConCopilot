/**
 * Storage API for Workout Routine Manager
 * Implements localStorage wrapper for workout list management
 */

// Constants
const STORAGE_KEY = 'workoutLists';
const MAX_LIST_NAME_LENGTH = 50;
const MAX_EXERCISE_NAME_LENGTH = 100;
const MAX_NOTES_LENGTH = 200;

// ============================================================================
// Custom Error Classes
// ============================================================================

class StorageError extends Error {
    constructor(message) {
        super(message);
        this.name = 'StorageError';
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

class QuotaExceededError extends Error {
    constructor(message = 'Storage quota exceeded. Please delete some lists or export your data.') {
        super(message);
        this.name = 'QuotaExceededError';
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}

class DataCorruptionError extends Error {
    constructor(message = 'Stored data is corrupted. Please export if possible and reset.') {
        super(message);
        this.name = 'DataCorruptionError';
    }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generates a UUID v4 string
 * @returns {string} UUID v4 string
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Checks if localStorage is available
 * @returns {boolean} true if localStorage is available
 */
function isStorageAvailable() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Validates UUID format
 * @param {string} uuid - UUID to validate
 * @returns {boolean} true if valid UUID
 */
function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

/**
 * Reads data from localStorage
 * @returns {Array} Array of workout lists
 * @throws {StorageError} if localStorage unavailable
 * @throws {DataCorruptionError} if data is corrupted
 */
function readFromStorage() {
    if (!isStorageAvailable()) {
        throw new StorageError('localStorage is not available');
    }
    
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            return [];
        }
        
        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) {
            throw new DataCorruptionError('Stored data is not an array');
        }
        
        return parsed;
    } catch (error) {
        if (error instanceof DataCorruptionError) {
            throw error;
        }
        throw new DataCorruptionError('Failed to parse stored data: ' + error.message);
    }
}

/**
 * Writes data to localStorage
 * @param {Array} data - Array of workout lists
 * @throws {StorageError} if localStorage unavailable
 * @throws {QuotaExceededError} if storage quota exceeded
 */
function writeToStorage(data) {
    if (!isStorageAvailable()) {
        throw new StorageError('localStorage is not available');
    }
    
    try {
        const jsonData = JSON.stringify(data);
        localStorage.setItem(STORAGE_KEY, jsonData);
    } catch (error) {
        if (error.name === 'QuotaExceededError' || error.code === 22) {
            throw new QuotaExceededError();
        }
        throw new StorageError('Failed to write to storage: ' + error.message);
    }
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validates a workout list
 * @param {Object} list - Workout list to validate
 * @throws {ValidationError} if validation fails
 */
function validateWorkoutList(list) {
    if (!list.id || !isValidUUID(list.id)) {
        throw new ValidationError('Invalid list ID');
    }
    
    if (!list.name || typeof list.name !== 'string' || list.name.trim().length === 0) {
        throw new ValidationError('List name is required');
    }
    
    if (list.name.length > MAX_LIST_NAME_LENGTH) {
        throw new ValidationError(`List name too long (max ${MAX_LIST_NAME_LENGTH} characters)`);
    }
    
    if (!list.exercises || !Array.isArray(list.exercises)) {
        throw new ValidationError('Exercises must be an array');
    }
    
    if (list.exercises.length === 0) {
        throw new ValidationError('List must contain at least one exercise');
    }
    
    list.exercises.forEach((exercise, index) => {
        validateExercise(exercise, index);
    });
}

/**
 * Validates an exercise
 * @param {Object} exercise - Exercise to validate
 * @param {number} index - Exercise index for error messages
 * @throws {ValidationError} if validation fails
 */
function validateExercise(exercise, index = 0) {
    if (!exercise.id || !isValidUUID(exercise.id)) {
        throw new ValidationError(`Exercise ${index + 1}: Invalid ID`);
    }
    
    if (!exercise.name || typeof exercise.name !== 'string' || exercise.name.trim().length === 0) {
        throw new ValidationError(`Exercise ${index + 1}: Name is required`);
    }
    
    if (exercise.name.length > MAX_EXERCISE_NAME_LENGTH) {
        throw new ValidationError(`Exercise ${index + 1}: Name too long (max ${MAX_EXERCISE_NAME_LENGTH} characters)`);
    }
    
    // Validate optional fields if present
    if (exercise.sets && exercise.sets.length > 20) {
        throw new ValidationError(`Exercise ${index + 1}: Sets field too long (max 20 characters)`);
    }
    
    if (exercise.reps && exercise.reps.length > 20) {
        throw new ValidationError(`Exercise ${index + 1}: Reps field too long (max 20 characters)`);
    }
    
    if (exercise.weight && exercise.weight.length > 30) {
        throw new ValidationError(`Exercise ${index + 1}: Weight field too long (max 30 characters)`);
    }
    
    if (exercise.restTime && exercise.restTime.length > 20) {
        throw new ValidationError(`Exercise ${index + 1}: Rest time field too long (max 20 characters)`);
    }
    
    if (exercise.notes && exercise.notes.length > MAX_NOTES_LENGTH) {
        throw new ValidationError(`Exercise ${index + 1}: Notes too long (max ${MAX_NOTES_LENGTH} characters)`);
    }
}

// ============================================================================
// Core API Functions
// ============================================================================

/**
 * Retrieves all workout lists from localStorage
 * @returns {Array} Array of WorkoutList objects
 * @throws {StorageError} if localStorage unavailable
 * @throws {DataCorruptionError} if data is corrupted
 */
function getAllLists() {
    return readFromStorage();
}

/**
 * Retrieves a single workout list by ID
 * @param {string} id - UUID of the workout list
 * @returns {Object|null} WorkoutList object or null if not found
 * @throws {StorageError} if localStorage unavailable
 */
function getListById(id) {
    const lists = readFromStorage();
    return lists.find(list => list.id === id) || null;
}

/**
 * Creates a new workout list
 * @param {string} name - Name of the workout list
 * @returns {Object} Newly created WorkoutList object
 * @throws {ValidationError} if name is invalid or duplicate
 * @throws {QuotaExceededError} if storage quota exceeded
 * @throws {StorageError} if localStorage unavailable
 */
function createList(name) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        throw new ValidationError('List name is required');
    }
    
    if (name.length > MAX_LIST_NAME_LENGTH) {
        throw new ValidationError(`List name too long (max ${MAX_LIST_NAME_LENGTH} characters)`);
    }
    
    const lists = readFromStorage();
    
    // Check for duplicate name
    if (lists.some(list => list.name.toLowerCase() === name.toLowerCase())) {
        throw new ValidationError('A list with this name already exists');
    }
    
    const newList = {
        id: generateUUID(),
        name: name.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        exercises: []
    };
    
    lists.push(newList);
    writeToStorage(lists);
    
    return newList;
}

/**
 * Updates properties of an existing workout list
 * @param {string} id - UUID of the workout list
 * @param {Object} updates - Partial WorkoutList object
 * @returns {Object} Updated WorkoutList object
 * @throws {NotFoundError} if list not found
 * @throws {ValidationError} if updates are invalid
 * @throws {QuotaExceededError} if storage quota exceeded
 */
function updateList(id, updates) {
    const lists = readFromStorage();
    const index = lists.findIndex(list => list.id === id);
    
    if (index === -1) {
        throw new NotFoundError('List not found');
    }
    
    const updatedList = {
        ...lists[index],
        ...updates,
        id: lists[index].id, // Prevent ID change
        createdAt: lists[index].createdAt, // Prevent creation date change
        updatedAt: new Date().toISOString()
    };
    
    // Validate if exercises were updated
    if (updates.exercises) {
        updatedList.exercises.forEach((exercise, idx) => validateExercise(exercise, idx));
    }
    
    lists[index] = updatedList;
    writeToStorage(lists);
    
    return updatedList;
}

/**
 * Deletes a workout list
 * @param {string} id - UUID of the workout list
 * @returns {boolean} true if deleted, false if not found
 * @throws {StorageError} if localStorage unavailable
 */
function deleteList(id) {
    const lists = readFromStorage();
    const index = lists.findIndex(list => list.id === id);
    
    if (index === -1) {
        return false;
    }
    
    lists.splice(index, 1);
    writeToStorage(lists);
    
    return true;
}

/**
 * Adds a new exercise to a workout list
 * @param {string} listId - UUID of the workout list
 * @param {Object} exerciseData - Exercise data
 * @returns {Object} Newly created Exercise object
 * @throws {NotFoundError} if list not found
 * @throws {ValidationError} if exercise data invalid
 * @throws {QuotaExceededError} if storage quota exceeded
 */
function addExercise(listId, exerciseData) {
    const lists = readFromStorage();
    const listIndex = lists.findIndex(list => list.id === listId);
    
    if (listIndex === -1) {
        throw new NotFoundError('List not found');
    }
    
    const newExercise = {
        id: generateUUID(),
        name: exerciseData.name?.trim() || '',
        sets: exerciseData.sets?.trim() || '',
        reps: exerciseData.reps?.trim() || '',
        weight: exerciseData.weight?.trim() || '',
        restTime: exerciseData.restTime?.trim() || '',
        notes: exerciseData.notes?.trim() || ''
    };
    
    validateExercise(newExercise);
    
    lists[listIndex].exercises.push(newExercise);
    lists[listIndex].updatedAt = new Date().toISOString();
    
    writeToStorage(lists);
    
    return newExercise;
}

/**
 * Updates an existing exercise
 * @param {string} listId - UUID of the workout list
 * @param {string} exerciseId - UUID of the exercise
 * @param {Object} updates - Partial Exercise object
 * @returns {Object} Updated Exercise object
 * @throws {NotFoundError} if list or exercise not found
 * @throws {ValidationError} if updates invalid
 * @throws {QuotaExceededError} if storage quota exceeded
 */
function updateExercise(listId, exerciseId, updates) {
    const lists = readFromStorage();
    const listIndex = lists.findIndex(list => list.id === listId);
    
    if (listIndex === -1) {
        throw new NotFoundError('List not found');
    }
    
    const exerciseIndex = lists[listIndex].exercises.findIndex(ex => ex.id === exerciseId);
    
    if (exerciseIndex === -1) {
        throw new NotFoundError('Exercise not found');
    }
    
    const updatedExercise = {
        ...lists[listIndex].exercises[exerciseIndex],
        ...updates,
        id: lists[listIndex].exercises[exerciseIndex].id // Prevent ID change
    };
    
    validateExercise(updatedExercise);
    
    lists[listIndex].exercises[exerciseIndex] = updatedExercise;
    lists[listIndex].updatedAt = new Date().toISOString();
    
    writeToStorage(lists);
    
    return updatedExercise;
}

/**
 * Deletes an exercise from a workout list
 * @param {string} listId - UUID of the workout list
 * @param {string} exerciseId - UUID of the exercise
 * @returns {boolean} true if deleted, false if not found
 * @throws {ValidationError} if deletion would leave list empty
 * @throws {StorageError} if localStorage unavailable
 */
function deleteExercise(listId, exerciseId) {
    const lists = readFromStorage();
    const listIndex = lists.findIndex(list => list.id === listId);
    
    if (listIndex === -1) {
        return false;
    }
    
    const exerciseIndex = lists[listIndex].exercises.findIndex(ex => ex.id === exerciseId);
    
    if (exerciseIndex === -1) {
        return false;
    }
    
    // Prevent deleting last exercise
    if (lists[listIndex].exercises.length === 1) {
        throw new ValidationError('Cannot delete the last exercise. Delete the list instead.');
    }
    
    lists[listIndex].exercises.splice(exerciseIndex, 1);
    lists[listIndex].updatedAt = new Date().toISOString();
    
    writeToStorage(lists);
    
    return true;
}

/**
 * Reorders exercises within a workout list
 * @param {string} listId - UUID of the workout list
 * @param {Array<string>} exerciseIds - Array of exercise IDs in desired order
 * @returns {Object} Updated WorkoutList object
 * @throws {NotFoundError} if list not found
 * @throws {ValidationError} if exercise IDs don't match
 * @throws {QuotaExceededError} if storage quota exceeded
 */
function reorderExercises(listId, exerciseIds) {
    const lists = readFromStorage();
    const listIndex = lists.findIndex(list => list.id === listId);
    
    if (listIndex === -1) {
        throw new NotFoundError('List not found');
    }
    
    const list = lists[listIndex];
    
    // Validate that all exercise IDs match
    if (exerciseIds.length !== list.exercises.length) {
        throw new ValidationError('Exercise ID count mismatch');
    }
    
    const reorderedExercises = exerciseIds.map(id => {
        const exercise = list.exercises.find(ex => ex.id === id);
        if (!exercise) {
            throw new ValidationError(`Exercise with ID ${id} not found`);
        }
        return exercise;
    });
    
    lists[listIndex].exercises = reorderedExercises;
    lists[listIndex].updatedAt = new Date().toISOString();
    
    writeToStorage(lists);
    
    return lists[listIndex];
}

/**
 * Exports all workout lists as JSON string
 * @returns {string} JSON string with all data
 * @throws {StorageError} if localStorage unavailable
 */
function exportAllData() {
    const lists = readFromStorage();
    
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        workoutLists: lists
    };
    
    return JSON.stringify(exportData, null, 2);
}

/**
 * Clears all workout lists from storage
 * @throws {StorageError} if localStorage unavailable
 */
function clearAllData() {
    if (!isStorageAvailable()) {
        throw new StorageError('localStorage is not available');
    }
    
    localStorage.removeItem(STORAGE_KEY);
}
