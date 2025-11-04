/**
 * List Viewer Module
 * Handles displaying workout lists and exercises
 */

/**
 * Shows the list selection view with all saved workout lists
 */
function showListSelection() {
    hideAllViews();
    document.getElementById('list-selection-view').classList.add('active');
    
    try {
        const lists = getAllLists();
        const container = document.getElementById('list-selection-container');
        const emptyMessage = document.getElementById('empty-lists-message');
        
        container.innerHTML = '';
        
        if (lists.length === 0) {
            emptyMessage.style.display = 'block';
            container.style.display = 'none';
        } else {
            emptyMessage.style.display = 'none';
            container.style.display = 'flex';
            
            lists.forEach(list => {
                const listItem = createListItem(list);
                container.appendChild(listItem);
            });
        }
    } catch (error) {
        showError('Failed to load workout lists: ' + error.message);
    }
}

/**
 * Creates a DOM element for a workout list item
 * @param {Object} list - Workout list object
 * @returns {HTMLElement} List item element
 */
function createListItem(list) {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.onclick = () => showExercises(list.id);
    
    const title = document.createElement('h3');
    title.textContent = list.name;
    
    const info = document.createElement('p');
    const exerciseCount = list.exercises.length;
    const exerciseText = exerciseCount === 1 ? 'exercise' : 'exercises';
    info.textContent = `${exerciseCount} ${exerciseText}`;
    
    div.appendChild(title);
    div.appendChild(info);
    
    return div;
}

/**
 * Shows exercises for a specific workout list
 * @param {string} listId - UUID of the workout list
 */
function showExercises(listId) {
    hideAllViews();
    document.getElementById('list-viewer-view').classList.add('active');
    
    try {
        const list = getListById(listId);
        
        if (!list) {
            showError('Workout list not found');
            showListSelection();
            return;
        }
        
        // Set list title
        document.getElementById('list-viewer-title').textContent = list.name;
        
        // Display exercises
        const container = document.getElementById('exercise-list-container');
        container.innerHTML = '';
        
        list.exercises.forEach((exercise, index) => {
            const exerciseItem = createExerciseItem(exercise, index + 1);
            container.appendChild(exerciseItem);
        });
        
    } catch (error) {
        showError('Failed to load exercises: ' + error.message);
        showListSelection();
    }
}

/**
 * Creates a DOM element for an exercise item
 * @param {Object} exercise - Exercise object
 * @param {number} number - Exercise number in sequence
 * @returns {HTMLElement} Exercise item element
 */
function createExerciseItem(exercise, number) {
    const div = document.createElement('div');
    div.className = 'exercise-item';
    
    const title = document.createElement('h3');
    title.textContent = `${number}. ${exercise.name}`;
    div.appendChild(title);
    
    // Create details container
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'exercise-details';
    
    // Add details if they exist
    if (exercise.sets) {
        detailsContainer.appendChild(createDetailElement('Sets', exercise.sets));
    }
    
    if (exercise.reps) {
        detailsContainer.appendChild(createDetailElement('Reps', exercise.reps));
    }
    
    if (exercise.weight) {
        detailsContainer.appendChild(createDetailElement('Weight', exercise.weight));
    }
    
    if (exercise.restTime) {
        detailsContainer.appendChild(createDetailElement('Rest', exercise.restTime));
    }
    
    if (detailsContainer.children.length > 0) {
        div.appendChild(detailsContainer);
    }
    
    // Add notes if they exist
    if (exercise.notes && exercise.notes.trim() !== '') {
        const notes = document.createElement('div');
        notes.className = 'exercise-notes';
        notes.innerHTML = `<strong>Notes:</strong> ${exercise.notes}`;
        div.appendChild(notes);
    }
    
    return div;
}

/**
 * Creates a detail element for exercise information
 * @param {string} label - Label text
 * @param {string} value - Value text
 * @returns {HTMLElement} Detail element
 */
function createDetailElement(label, value) {
    const div = document.createElement('div');
    div.className = 'exercise-detail';
    div.innerHTML = `<strong>${label}:</strong> ${value}`;
    return div;
}
