// ==========================================================================
// VARIABLES GLOBALES Y ELEMENTOS DEL DOM
// ==========================================================================

// Obtener referencias a los elementos del DOM
const peopleListTextarea = document.getElementById('peopleList');
const consoleCountInput = document.getElementById('consoleCount');
const randomizeBtn = document.getElementById('randomizeBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsContainer = document.getElementById('results');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');
const platformSelect = document.getElementById('platformSelect');
const loadPlatformBtn = document.getElementById('loadPlatformBtn');

// ==========================================================================
// FUNCIONES DE GESTIÓN DE PLATAFORMAS
// ==========================================================================

/**
 * Inicializa el selector de plataformas con las opciones disponibles
 */
function initializePlatformSelector() {
    // Limpiar opciones existentes (excepto la primera)
    platformSelect.innerHTML = '<option value="">🎮 Todas las plataformas</option>';
    
    // Agregar cada plataforma como opción
    const platforms = getAvailablePlatforms();
    platforms.forEach(platform => {
        const option = document.createElement('option');
        option.value = platform;
        option.textContent = `${getPlatformEmoji(platform)} ${platform}`;
        platformSelect.appendChild(option);
    });
}

/**
 * Obtiene el emoji correspondiente a cada plataforma
 * @param {string} platform - Nombre de la plataforma
 * @returns {string} Emoji correspondiente
 */
function getPlatformEmoji(platform) {
    const emojis = {
        'PS5': '🟦',
        'PS4': '🔵',
        'Xbox': '🟢',
        'Switch': '🔴',
        'iOS': '📱',
        'Android': '🤖'
    };
    return emojis[platform] || '🎮';
}

/**
 * Carga las personas de la plataforma seleccionada en el textarea
 */
function loadPeopleFromPlatform() {
    const selectedPlatform = platformSelect.value;
    
    if (!selectedPlatform) {
        // Si no hay plataforma seleccionada, limpiar el textarea
        peopleListTextarea.value = '';
        peopleListTextarea.placeholder = 'Selecciona una plataforma arriba o ingresa personas manualmente...';
        return;
    }
    
    // Obtener las personas de la plataforma seleccionada
    const people = getPeopleForPlatform(selectedPlatform);
    
    // Cargar las personas en el textarea
    peopleListTextarea.value = people.join('\n');
    
    // Actualizar el placeholder
    peopleListTextarea.placeholder = `Personas disponibles para ${selectedPlatform}`;
    
    // Ocultar resultados anteriores
    hideResults();
    hideError();
    
    // Mostrar mensaje de confirmación
    showTemporaryMessage(`✅ Cargadas ${people.length} personas de ${selectedPlatform}`);
}

/**
 * Muestra un mensaje temporal de confirmación
 * @param {string} message - Mensaje a mostrar
 */
function showTemporaryMessage(message) {
    // Crear elemento temporal para el mensaje
    const messageElement = document.createElement('div');
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
        z-index: 1000;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    messageElement.textContent = message;
    
    // Agregar la animación CSS
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
    
    // Remover el mensaje después de 3 segundos
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
// FUNCIONES PRINCIPALES
// ==========================================================================

/**
 * Función principal que maneja la randomización de asignaciones
 * Se ejecuta cuando el usuario hace clic en el botón "Randomizar"
 */
function randomizeAssignments() {
    // Limpiar errores previos
    hideError();
    
    // Obtener y validar los datos de entrada
    const people = getPeopleFromTextarea();
    const consoleCount = getConsoleCount();
    
    // Validar que hay suficientes personas
    if (!validateInput(people, consoleCount)) {
        return;
    }
    
    // Realizar la asignación aleatoria
    const assignments = createRandomAssignments(people, consoleCount);
    
    // Mostrar los resultados
    displayResults(assignments);
}

/**
 * Obtiene la lista de personas del textarea y la procesa
 * @returns {Array} Array de nombres de personas (sin líneas vacías)
 */
function getPeopleFromTextarea() {
    const rawText = peopleListTextarea.value.trim();
    
    // Dividir por líneas y filtrar líneas vacías
    const people = rawText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    
    return people;
}

/**
 * Obtiene el número de consolas del input
 * @returns {number} Número de consolas seleccionadas
 */
function getConsoleCount() {
    const count = parseInt(consoleCountInput.value);
    
    // Asegurar que el valor esté en un rango válido
    return Math.max(1, Math.min(20, count || 1));
}

/**
 * Valida que los datos de entrada sean correctos
 * @param {Array} people - Lista de personas
 * @param {number} consoleCount - Número de consolas
 * @returns {boolean} True si la validación es exitosa
 */
function validateInput(people, consoleCount) {
    // Verificar que hay al menos una persona
    if (people.length === 0) {
        showError('❌ Por favor, ingresa al menos una persona en la lista.');
        return false;
    }
    
    // Verificar que hay suficientes personas para las consolas
    if (people.length < consoleCount) {
        showError(`❌ No hay suficientes personas para ${consoleCount} consola${consoleCount > 1 ? 's' : ''}. 
                   Tienes ${people.length} persona${people.length > 1 ? 's' : ''} en la lista.`);
        return false;
    }
    
    return true;
}

/**
 * Crea asignaciones aleatorias de personas a consolas
 * @param {Array} people - Lista de personas disponibles
 * @param {number} consoleCount - Número de consolas a asignar
 * @returns {Array} Array de objetos con asignaciones {console, person}
 */
function createRandomAssignments(people, consoleCount) {
    // Crear una copia del array para no modificar el original
    const availablePeople = [...people];
    const assignments = [];
    
    // Asignar personas aleatoriamente a cada consola
    for (let i = 1; i <= consoleCount; i++) {
        // Seleccionar una persona aleatoria de las disponibles
        const randomIndex = Math.floor(Math.random() * availablePeople.length);
        const selectedPerson = availablePeople[randomIndex];
        
        // Crear la asignación
        assignments.push({
            console: i,
            person: selectedPerson
        });
        
        // Remover la persona seleccionada para evitar duplicados
        availablePeople.splice(randomIndex, 1);
    }
    
    return assignments;
}

/**
 * Muestra los resultados de las asignaciones en la interfaz
 * @param {Array} assignments - Array de asignaciones a mostrar
 */
function displayResults(assignments) {
    // Limpiar resultados previos
    resultsContainer.innerHTML = '';
    
    // Crear elementos HTML para cada asignación
    assignments.forEach(assignment => {
        const assignmentElement = createAssignmentElement(assignment);
        resultsContainer.appendChild(assignmentElement);
    });
    
    // Mostrar la sección de resultados con animación
    resultsSection.classList.add('visible');
    
    // Scroll suave hacia los resultados
    resultsSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

/**
 * Crea un elemento HTML para mostrar una asignación individual
 * @param {Object} assignment - Objeto con la asignación {console, person}
 * @returns {HTMLElement} Elemento div con la asignación formateada
 */
function createAssignmentElement(assignment) {
    // Crear el contenedor principal
    const div = document.createElement('div');
    div.className = 'assignment-item';
    
    // Crear el elemento para el número de consola
    const consoleSpan = document.createElement('span');
    consoleSpan.className = 'console-number';
    consoleSpan.textContent = `Consola ${assignment.console}`;
    
    // Crear el elemento para el nombre de la persona
    const personSpan = document.createElement('span');
    personSpan.className = 'person-name';
    personSpan.textContent = `→ ${assignment.person}`;
    
    // Ensamblar el elemento completo
    div.appendChild(consoleSpan);
    div.appendChild(personSpan);
    
    return div;
}

/**
 * Muestra un mensaje de error al usuario
 * @param {string} message - Mensaje de error a mostrar
 */
function showError(message) {
    errorMessage.innerHTML = message;
    errorSection.style.display = 'block';
    
    // Scroll hacia el error para que sea visible
    errorSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
    
    // Ocultar automáticamente después de 5 segundos
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

// ==========================================================================
// EVENT LISTENERS Y INICIALIZACIÓN
// ==========================================================================

/**
 * Configurar los event listeners cuando el DOM esté cargado
 */
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el selector de plataformas
    initializePlatformSelector();
    
    // Event listener para el botón de randomizar
    randomizeBtn.addEventListener('click', randomizeAssignments);
    
    // Event listener para cargar personas de plataforma
    loadPlatformBtn.addEventListener('click', loadPeopleFromPlatform);
    
    // Event listener para detectar cambios en los inputs y ocultar resultados
    peopleListTextarea.addEventListener('input', hideResults);
    consoleCountInput.addEventListener('input', hideResults);
    
    // Event listener para cambios en el selector de plataforma
    platformSelect.addEventListener('change', function() {
        if (platformSelect.value) {
            loadPeopleFromPlatform();
        }
    });
    
    // Event listener para permitir randomizar con Enter en el input de consolas
    consoleCountInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            randomizeAssignments();
        }
    });
    
    // Enfocar automáticamente el textarea al cargar la página
    peopleListTextarea.focus();
    
    console.log('🎮 Console Assigner inicializado correctamente');
});

// ==========================================================================
// FUNCIONES ADICIONALES DE UTILIDAD
// ==========================================================================

/**
 * Función para limpiar completamente la interfaz
 * Útil si se quiere agregar un botón de "Reset" en el futuro
 */
function resetInterface() {
    peopleListTextarea.value = '';
    consoleCountInput.value = '3';
    platformSelect.value = '';
    hideError();
    hideResults();
    peopleListTextarea.focus();
}

/**
 * Función para exportar los resultados como texto
 * Útil si se quiere agregar funcionalidad de exportación en el futuro
 * @param {Array} assignments - Array de asignaciones
 * @returns {string} Texto formateado con las asignaciones
 */
function exportAssignments(assignments) {
    let exportText = '🎮 ASIGNACIÓN DE CONSOLAS\n';
    exportText += '=' .repeat(30) + '\n\n';
    
    assignments.forEach(assignment => {
        exportText += `Consola ${assignment.console} → ${assignment.person}\n`;
    });
    
    exportText += '\n✨ Generado por Console Assigner';
    
    return exportText;
}
