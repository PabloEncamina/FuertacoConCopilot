/**
 * Main Application Module
 * Handles app initialization and navigation
 */

// Initialize app on DOM load
document.addEventListener('DOMContentLoaded', initApp);

/**
 * Initializes the application
 */
function initApp() {
    // Check localStorage availability
    if (!isStorageAvailable()) {
        showError('This app requires localStorage to function. Please enable it in your browser settings.');
        return;
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Show home view
    showHome();
}

/**
 * Sets up all event listeners
 */
function setupEventListeners() {
    // Home view buttons
    document.getElementById('btn-my-lists').addEventListener('click', showListSelection);
    document.getElementById('btn-create-list').addEventListener('click', showCreateList);
    document.getElementById('btn-export').addEventListener('click', handleExport);
    
    // Back buttons
    document.getElementById('btn-back-from-selection').addEventListener('click', showHome);
    document.getElementById('btn-back-from-viewer').addEventListener('click', showListSelection);
    document.getElementById('btn-back-from-creation').addEventListener('click', handleBackFromCreation);
    
    // List creation buttons
    document.getElementById('btn-add-exercise').addEventListener('click', addExerciseToForm);
    document.getElementById('list-creation-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveList();
    });
    
    // Error modal
    document.getElementById('btn-close-error').addEventListener('click', closeError);
    
    // Track changes in list name input
    document.getElementById('list-name').addEventListener('input', () => {
        hasUnsavedChanges = true;
    });
}

/**
 * Shows the home view
 */
function showHome() {
    hideAllViews();
    document.getElementById('home-view').classList.add('active');
}

/**
 * Hides all views
 */
function hideAllViews() {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
}

/**
 * Shows an error modal
 * @param {string} message - Error message to display
 */
function showError(message) {
    const modal = document.getElementById('error-modal');
    const messageEl = document.getElementById('error-message');
    
    messageEl.textContent = message;
    modal.style.display = 'flex';
}

/**
 * Closes the error modal
 */
function closeError() {
    document.getElementById('error-modal').style.display = 'none';
}

/**
 * Handles data export
 */
function handleExport() {
    try {
        const jsonData = exportAllData();
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().split('T')[0];
        a.download = `workout-lists-${date}.json`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
    } catch (error) {
        showError('Failed to export data: ' + error.message);
    }
}
