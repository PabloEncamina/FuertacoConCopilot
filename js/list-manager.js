/**
 * List Manager Module
 * Handles creating and editing workout lists
 */

// Track unsaved changes
let hasUnsavedChanges = false;
let exerciseCounter = 0;

/**
 * Shows the list creation view
 */
function showCreateList() {
    hideAllViews();
    document.getElementById('list-creation-view').classList.add('active');
    
    // Reset form
    document.getElementById('list-creation-form').reset();
    document.getElementById('exercise-forms').innerHTML = '';
    document.getElementById('form-errors').style.display = 'none';
    exerciseCounter = 0;
    hasUnsavedChanges = false;
    
    // Add first exercise form
    addExerciseToForm();
}

/**
 * Adds a new exercise input form
 */
function addExerciseToForm() {
    exerciseCounter++;
    const container = document.getElementById('exercise-forms');
    
    const exerciseForm = document.createElement('div');
    exerciseForm.className = 'exercise-form';
    exerciseForm.dataset.exerciseNumber = exerciseCounter;
    
    exerciseForm.innerHTML = `
        <h3>Exercise ${exerciseCounter}</h3>
        ${exerciseCounter > 1 ? '<button type="button" class="btn-remove-exercise" onclick="removeExerciseFromForm(' + exerciseCounter + ')">Remove</button>' : ''}
        
        <div class="form-group">
            <label for="exercise-name-${exerciseCounter}">Exercise Name *</label>
            <input type="text" id="exercise-name-${exerciseCounter}" name="exercise-name-${exerciseCounter}" maxlength="100" required>
        </div>
        
        <div class="form-group">
            <label for="exercise-sets-${exerciseCounter}">Sets</label>
            <input type="text" id="exercise-sets-${exerciseCounter}" name="exercise-sets-${exerciseCounter}" maxlength="20" placeholder="e.g., 3 or 3-4">
        </div>
        
        <div class="form-group">
            <label for="exercise-reps-${exerciseCounter}">Reps</label>
            <input type="text" id="exercise-reps-${exerciseCounter}" name="exercise-reps-${exerciseCounter}" maxlength="20" placeholder="e.g., 10 or 8-12">
        </div>
        
        <div class="form-group">
            <label for="exercise-weight-${exerciseCounter}">Weight</label>
            <input type="text" id="exercise-weight-${exerciseCounter}" name="exercise-weight-${exerciseCounter}" maxlength="30" placeholder="e.g., 135 lbs or 60 kg">
        </div>
        
        <div class="form-group">
            <label for="exercise-rest-${exerciseCounter}">Rest Time</label>
            <input type="text" id="exercise-rest-${exerciseCounter}" name="exercise-rest-${exerciseCounter}" maxlength="20" placeholder="e.g., 90 sec or 2 min">
        </div>
        
        <div class="form-group">
            <label for="exercise-notes-${exerciseCounter}">Notes</label>
            <textarea id="exercise-notes-${exerciseCounter}" name="exercise-notes-${exerciseCounter}" maxlength="200" rows="2" placeholder="Optional notes or instructions"></textarea>
        </div>
    `;
    
    container.appendChild(exerciseForm);
    
    // Mark as having unsaved changes when user types
    exerciseForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            hasUnsavedChanges = true;
        });
    });
}

/**
 * Removes an exercise form
 * @param {number} exerciseNumber - Exercise number to remove
 */
function removeExerciseFromForm(exerciseNumber) {
    const exerciseForms = document.getElementById('exercise-forms');
    const formToRemove = exerciseForms.querySelector(`[data-exercise-number="${exerciseNumber}"]`);
    
    if (formToRemove) {
        formToRemove.remove();
        hasUnsavedChanges = true;
        
        // Renumber remaining exercises
        const remainingForms = exerciseForms.querySelectorAll('.exercise-form');
        remainingForms.forEach((form, index) => {
            const h3 = form.querySelector('h3');
            if (h3) {
                h3.textContent = `Exercise ${index + 1}`;
            }
        });
    }
}

/**
 * Validates the list creation form
 * @returns {Object|null} Validation result with errors or null if valid
 */
function validateListForm() {
    const errors = [];
    
    // Validate list name
    const listName = document.getElementById('list-name').value.trim();
    if (!listName) {
        errors.push('List name is required');
    }
    
    // Validate at least one exercise
    const exerciseForms = document.querySelectorAll('.exercise-form');
    if (exerciseForms.length === 0) {
        errors.push('At least one exercise is required');
    }
    
    // Validate each exercise has a name
    let hasValidExercise = false;
    exerciseForms.forEach((form, index) => {
        const exerciseNum = form.dataset.exerciseNumber;
        const exerciseName = document.getElementById(`exercise-name-${exerciseNum}`).value.trim();
        
        if (!exerciseName) {
            errors.push(`Exercise ${index + 1}: Name is required`);
        } else {
            hasValidExercise = true;
        }
    });
    
    if (!hasValidExercise && exerciseForms.length > 0) {
        errors.push('At least one exercise must have a name');
    }
    
    return errors.length > 0 ? errors : null;
}

/**
 * Saves the workout list
 */
function saveList() {
    // Validate form
    const errors = validateListForm();
    const errorDiv = document.getElementById('form-errors');
    
    if (errors) {
        errorDiv.innerHTML = errors.map(err => `<p>• ${err}</p>`).join('');
        errorDiv.style.display = 'block';
        return;
    }
    
    errorDiv.style.display = 'none';
    
    try {
        // Get list name
        const listName = document.getElementById('list-name').value.trim();
        
        // Create list
        const newList = createList(listName);
        
        // Add exercises
        const exerciseForms = document.querySelectorAll('.exercise-form');
        exerciseForms.forEach(form => {
            const exerciseNum = form.dataset.exerciseNumber;
            const exerciseName = document.getElementById(`exercise-name-${exerciseNum}`).value.trim();
            
            if (exerciseName) {
                const exerciseData = {
                    name: exerciseName,
                    sets: document.getElementById(`exercise-sets-${exerciseNum}`).value.trim(),
                    reps: document.getElementById(`exercise-reps-${exerciseNum}`).value.trim(),
                    weight: document.getElementById(`exercise-weight-${exerciseNum}`).value.trim(),
                    restTime: document.getElementById(`exercise-rest-${exerciseNum}`).value.trim(),
                    notes: document.getElementById(`exercise-notes-${exerciseNum}`).value.trim()
                };
                
                addExercise(newList.id, exerciseData);
            }
        });
        
        // Clear unsaved changes flag
        hasUnsavedChanges = false;
        
        // Show success and redirect to list selection
        showListSelection();
        
    } catch (error) {
        if (error instanceof QuotaExceededError) {
            showError('Storage is full! Please delete some lists or export your data.');
        } else if (error instanceof ValidationError) {
            errorDiv.innerHTML = `<p>• ${error.message}</p>`;
            errorDiv.style.display = 'block';
        } else {
            showError('Failed to save list: ' + error.message);
        }
    }
}

/**
 * Checks for unsaved changes before navigating away
 * @returns {boolean} true if safe to navigate, false if should stay
 */
function checkUnsavedChanges() {
    if (hasUnsavedChanges) {
        return confirm('You have unsaved changes. Are you sure you want to leave?');
    }
    return true;
}

/**
 * Handles back button from list creation with unsaved changes check
 */
function handleBackFromCreation() {
    if (checkUnsavedChanges()) {
        showHome();
    }
}
