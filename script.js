// ==========================================================================
// VARIABLES GLOBALES Y ELEMENTOS DEL DOM
// ==========================================================================

// Obtener referencias a los elementos del DOM
const randomizeBtn = document.getElementById('randomizeBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsContainer = document.getElementById('results');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');
const consolesGrid = document.getElementById('consolesGrid');
const totalConsolesSpan = document.getElementById('totalConsoles');

// Estado de la aplicación
let consoleCounters = {};

// ==========================================================================
// FUNCIONES DE INICIALIZACIÓN
// ==========================================================================

/**
 * Inicializa la interfaz de consolas
 */
function initializeConsoles() {
    const consoles = getAvailableConsoles();
    consolesGrid.innerHTML = '';
    
    // Inicializar contadores
    consoles.forEach(consoleName => {
        consoleCounters[consoleName] = 0;
    });
    
    // Crear elementos de interfaz para cada consola
    consoles.forEach(consoleName => {
        const consoleElement = createConsoleElement(consoleName);
        consolesGrid.appendChild(consoleElement);
    });
    
    updateTotalConsoles();
}

/**
 * Crea el elemento HTML para una consola
 * @param {string} consoleName - Nombre de la consola
 * @returns {HTMLElement} Elemento de la consola
 */
function createConsoleElement(consoleName) {
    const config = getConsoleConfig(consoleName);
    const availablePeople = getPeopleForConsole(consoleName);
    
    const consoleDiv = document.createElement('div');
    consoleDiv.className = 'console-item';
    
    consoleDiv.innerHTML = `
        <div class="console-header">
            <span class="console-emoji">${config.emoji}</span>
            <span class="console-name">${config.name}</span>
        </div>
        
        <div class="console-counter">
            <button class="counter-btn decrease" onclick="decreaseCounter('${consoleName}')">−</button>
            <span class="counter-display" id="counter-${consoleName}">0</span>
            <button class="counter-btn increase" onclick="increaseCounter('${consoleName}')">+</button>
        </div>
        
        <div class="available-people">
            <strong>${availablePeople.length}</strong> personas disponibles
        </div>
    `;
    
    return consoleDiv;
}

// ==========================================================================
// FUNCIONES DE GESTIÓN DE CONTADORES
// ==========================================================================

/**
 * Incrementa el contador de una consola
 * @param {string} consoleName - Nombre de la consola
 */
function increaseCounter(consoleName) {
    const availablePeople = getPeopleForConsole(consoleName);
    const maxCount = availablePeople.length;
    
    if (consoleCounters[consoleName] < maxCount) {
        consoleCounters[consoleName]++;
        updateCounterDisplay(consoleName);
        updateTotalConsoles();
        hideResults();
        hideError();
    } else {
        showError(`❌ Solo hay ${maxCount} personas disponibles para ${consoleName}`);
    }
}

/**
 * Decrementa el contador de una consola
 * @param {string} consoleName - Nombre de la consola
 */
function decreaseCounter(consoleName) {
    if (consoleCounters[consoleName] > 0) {
        consoleCounters[consoleName]--;
        updateCounterDisplay(consoleName);
        updateTotalConsoles();
        hideResults();
        hideError();
    }
}

/**
 * Actualiza la visualización del contador
 * @param {string} consoleName - Nombre de la consola
 */
function updateCounterDisplay(consoleName) {
    const counterElement = document.getElementById(`counter-${consoleName}`);
    if (counterElement) {
        counterElement.textContent = consoleCounters[consoleName];
    }
}

/**
 * Actualiza el total de consolas
 */
function updateTotalConsoles() {
    const total = Object.values(consoleCounters).reduce((sum, count) => sum + count, 0);
    totalConsolesSpan.textContent = `Total: ${total} consola${total !== 1 ? 's' : ''}`;
}

// ==========================================================================
// FUNCIONES PRINCIPALES DE RANDOMIZACIÓN
// ==========================================================================

/**
 * Función principal que maneja la randomización de asignaciones
 */
function randomizeAssignments() {
    hideError();
    
    // Verificar que hay consolas seleccionadas
    const totalConsoles = Object.values(consoleCounters).reduce((sum, count) => sum + count, 0);
    if (totalConsoles === 0) {
        showError('❌ Por favor, selecciona al menos una consola para el playtest.');
        return;
    }
    
    // Realizar la asignación inteligente
    try {
        const assignments = createSmartAssignments();
        displayResults(assignments);
        showTemporaryMessage(`✅ ¡Asignación completada! ${totalConsoles} consola${totalConsoles > 1 ? 's' : ''} asignada${totalConsoles > 1 ? 's' : ''}`);
    } catch (error) {
        showError(`❌ Error en la asignación: ${error.message}`);
    }
}

/**
 * Crea asignaciones inteligentes respetando las restricciones de cada persona
 * @returns {Object} Objeto con asignaciones organizadas por consola
 */
function createSmartAssignments() {
    const assignments = {};
    const usedPeople = new Set();
    
    // Obtener todas las consolas en orden de prioridad
    const consoleOrder = getAvailableConsoles();
    
    // Procesar cada consola en orden de prioridad
    for (const consoleName of consoleOrder) {
        const neededCount = consoleCounters[consoleName];
        if (neededCount === 0) continue;
        
        assignments[consoleName] = [];
        
        // Obtener personas disponibles para esta consola que no han sido usadas
        const availablePeople = getPeopleForConsole(consoleName)
            .filter(person => !usedPeople.has(person));
        
        // Verificar que hay suficientes personas disponibles
        if (availablePeople.length < neededCount) {
            throw new Error(`No hay suficientes personas disponibles para ${consoleName}. Necesitas ${neededCount}, pero solo hay ${availablePeople.length} disponibles.`);
        }
        
        // Randomizar y seleccionar las personas necesarias
        const shuffledPeople = shuffleArray([...availablePeople]);
        const selectedPeople = shuffledPeople.slice(0, neededCount);
        
        // Asignar personas a esta consola
        selectedPeople.forEach((person, index) => {
            assignments[consoleName].push({
                console: consoleName,
                consoleNumber: index + 1,
                person: person
            });
            usedPeople.add(person);
        });
    }
    
    return assignments;
}

/**
 * Función para mezclar un array aleatoriamente (Fisher-Yates shuffle)
 * @param {Array} array - Array a mezclar
 * @returns {Array} Array mezclado
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ==========================================================================
// FUNCIONES DE VISUALIZACIÓN DE RESULTADOS
// ==========================================================================

/**
 * Muestra los resultados de las asignaciones organizados por consola
 * @param {Object} assignments - Asignaciones organizadas por consola
 */
function displayResults(assignments) {
    resultsContainer.innerHTML = '';
    
    // Obtener consolas en orden de prioridad
    const consoleOrder = getAvailableConsoles();
    
    consoleOrder.forEach(consoleName => {
        if (assignments[consoleName] && assignments[consoleName].length > 0) {
            const consoleGroup = createConsoleGroupElement(consoleName, assignments[consoleName]);
            resultsContainer.appendChild(consoleGroup);
        }
    });
    
    // Mostrar la sección de resultados
    resultsSection.classList.add('visible');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Crea un elemento de grupo de consola para los resultados
 * @param {string} consoleName - Nombre de la consola
 * @param {Array} assignments - Asignaciones para esta consola
 * @returns {HTMLElement} Elemento del grupo de consola
 */
function createConsoleGroupElement(consoleName, assignments) {
    const config = getConsoleConfig(consoleName);
    
    const groupDiv = document.createElement('div');
    groupDiv.className = 'console-group';
    groupDiv.style.borderLeftColor = config.color;
    
    // Header del grupo
    const headerDiv = document.createElement('div');
    headerDiv.className = 'console-group-header';
    headerDiv.style.color = config.color;
    headerDiv.innerHTML = `
        <span>${config.emoji}</span>
        <span>${config.name} (${assignments.length})</span>
    `;
    
    // Contenedor de asignaciones
    const assignmentsDiv = document.createElement('div');
    assignmentsDiv.className = 'console-assignments';
    
    // Crear elemento para cada asignación
    assignments.forEach(assignment => {
        const assignmentElement = createAssignmentElement(assignment, config.color);
        assignmentsDiv.appendChild(assignmentElement);
    });
    
    groupDiv.appendChild(headerDiv);
    groupDiv.appendChild(assignmentsDiv);
    
    return groupDiv;
}

/**
 * Crea un elemento de asignación individual
 * @param {Object} assignment - Datos de la asignación
 * @param {string} color - Color de la consola
 * @returns {HTMLElement} Elemento de asignación
 */
function createAssignmentElement(assignment, color) {
    const div = document.createElement('div');
    div.className = 'assignment-item';
    
    const numberSpan = document.createElement('span');
    numberSpan.className = 'assignment-number';
    numberSpan.style.backgroundColor = color + '20';
    numberSpan.style.color = color;
    numberSpan.textContent = `#${assignment.consoleNumber}`;
    
    const personSpan = document.createElement('span');
    personSpan.className = 'person-name';
    personSpan.textContent = assignment.person;
    
    div.appendChild(numberSpan);
    div.appendChild(personSpan);
    
    return div;
}

// ==========================================================================
// FUNCIONES DE UTILIDAD Y MENSAJES
// ==========================================================================

/**
 * Muestra un mensaje de error al usuario
 * @param {string} message - Mensaje de error a mostrar
 */
function showError(message) {
    errorMessage.innerHTML = message;
    errorSection.style.display = 'block';
    
    errorSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
    
    setTimeout(hideError, 5000);
}

/**
 * Oculta el mensaje de error
 */
function hideError() {
    errorSection.style.display = 'none';
}

/**
 * Oculta la sección de resultados
 */
function hideResults() {
    resultsSection.classList.remove('visible');
}

/**
 * Muestra un mensaje temporal de confirmación
 * @param {string} message - Mensaje a mostrar
 */
function showTemporaryMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
        z-index: 1000;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    messageElement.textContent = message;
    
    if (!document.querySelector('#temp-message-styles')) {
        const style = document.createElement('style');
        style.id = 'temp-message-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, 3000);
}

// ==========================================================================
// EVENT LISTENERS Y INICIALIZACIÓN
// ==========================================================================

/**
 * Configurar los event listeners cuando el DOM esté cargado
 */
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la interfaz de consolas
    initializeConsoles();
    
    // Event listener para el botón de randomizar
    randomizeBtn.addEventListener('click', randomizeAssignments);
    
    console.log('🎮 Console Assigner v2.0 inicializado correctamente');
});

// ==========================================================================
// FUNCIONES GLOBALES (ACCESIBLES DESDE HTML)
// ==========================================================================

// Hacer las funciones de contador accesibles globalmente para onclick
window.increaseCounter = increaseCounter;
window.decreaseCounter = decreaseCounter;
