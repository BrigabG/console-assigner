// Configuración de personas y las platafoconst CONSOLES// Configuración de consolas disponibles
const CONSOLES_CONFIG = {
    "PC": {
        emoji: "💻",
        name: "PC",
        color: "#6c5ce7"
    },
    "PS4": {
        emoji: "🔵",
        name: "PlayStation 4",
        color: "#0984e3"
    },
    "PS5": {
        emoji: "🟦",
        name: "PlayStation 5",
        color: "#74b9ff"
    },
    "Xbox": {
        emoji: "🟢",
        name: "Xbox",
        color: "#00b894"
    },
    "Switch": {
        emoji: "🔴",
        name: "Nintendo Switch",
        color: "#e17055"
    },
    "iOS": {
        emoji: "📱",
        name: "iPhone/iPad",
        color: "#636e72"
    },
    "Android": {
        emoji: "🤖",
        name: "Android",
        color: "#55a3ff"
    }
};"PC": {
        emoji: "💻",
        name: "PC",
        color: "#6c5ce7"
    },
    "PS4": {
        emoji: "🔵",
        name: "PlayStation 4",
        color: "#0984e3"
    },
    "PS5": {
        emoji: "🟦",
        name: "PlayStation 5",
        color: "#74b9ff"
    },usar
// Cada persona tiene un array con las plataformas/consolas disponibles para ella

const PEOPLE_CONFIG = {
    // PS5 - Solo estas personas pueden usar PS5 (+ iOS/Android + PC)
    "Ignacio Pourteau 🌪️": ["PC", "PS5", "Switch", "iOS", "Android"],
    "Genaro Ramos 🫅🏽": ["PC", "PS5", "iOS", "Android"],
    "Denisse Melo 🕷": ["PC", "PS5", "iOS", "Android"],
    "Daniel Salerno 👹": ["PC", "PS5", "iOS", "Android"],
    "Nahuel Buceta 🤠": ["PC", "PS5", "iOS", "Android"],
    "Gabriel Guerrero 👑": ["PC", "PS5", "iOS", "Android"],
    "Santiago Colonel 🥊": ["PC", "PS5", "iOS", "Android"],
    "Tomás Amigo 😺": ["PC", "PS5", "iOS", "Android"],
    
    // Personas que solo tienen PC + iOS/Android
    "Emilia Fernández 🦄": ["PC", "iOS", "Android"],
    "Tomás Murphy 🎸": ["PC", "iOS", "Android"],
    
    // Xbox - Solo estas personas pueden usar Xbox (+ iOS/Android + PC)
    "Gino Lupis 🐉": ["PC", "Xbox", "iOS", "Android"],
    "Biaggio di Stefano": ["PC", "Xbox", "iOS", "Android"],
    "Leonardo Valenzuela 🤘🏼": ["PC", "Xbox", "iOS", "Android"],
    "Federico Durán": ["PC", "Xbox", "iOS", "Android"],
    
    // Switch - Solo estas personas pueden usar Switch (+ iOS/Android + PC)
    "Nicolás Cadel 🪬": ["PC", "Switch", "iOS", "Android"],
    "Boris Schwindt": ["PC", "Switch", "iOS", "Android"],
    "Nairet Vergara": ["PC", "Switch", "iOS", "Android"],
    "Agustín Reynoso 9️⃣": ["PC", "Switch", "iOS", "Android"],
    "Facundo Villafane 🛸": ["PC", "Switch", "iOS", "Android"],
    
    // PS4 - Solo estas personas pueden usar PS4 (+ iOS/Android + PC)
    "Rocío Deluca 🐯": ["PC", "PS4", "iOS", "Android"],
    "Milton Lagos 💀": ["PC", "PS4", "iOS", "Android"],
    "Lucas Presas": ["PC", "PS4", "iOS", "Android"],
    "Matías Mena ✝️": ["PC", "PS4", "iOS", "Android"]
};

// Orden de prioridad de las consolas (PC primero, luego PS4, etc.)
const CONSOLE_ORDER = ["PC", "PS4", "PS5", "Xbox", "Switch", "iOS", "Android"];

// Configuración de consolas disponibles
const CONSOLES_CONFIG = {
    "PC": {
        emoji: "�",
        name: "PC",
        color: "#6c5ce7"
    },
    "PS4": {
        emoji: "�",
        name: "PlayStation 4",
        color: "#0984e3"
    },
    "PS5": {
        emoji: "�",
        name: "PlayStation 5",
        color: "#74b9ff"
    },
    "Xbox": {
        emoji: "🟢",
        name: "Xbox",
        color: "#00b894"
    },
    "Switch": {
        emoji: "🔴",
        name: "Nintendo Switch",
        color: "#e17055"
    },
    "iOS": {
        emoji: "📱",
        name: "iPhone/iPad",
        color: "#636e72"
    },
    "Android": {
        emoji: "🤖",
        name: "Android",
        color: "#55a3ff"
    }
};

// Función para obtener todas las personas disponibles
function getAllPeople() {
    return Object.keys(PEOPLE_CONFIG);
}

// Función para obtener las consolas que puede usar una persona
function getConsolesForPerson(person) {
    return PEOPLE_CONFIG[person] || [];
}

// Función para obtener las personas que pueden usar una consola específica
function getPeopleForConsole(consoleName) {
    return Object.keys(PEOPLE_CONFIG).filter(person => 
        PEOPLE_CONFIG[person].includes(consoleName)
    );
}

// Función para obtener todas las consolas disponibles en orden
function getAvailableConsoles() {
    return CONSOLE_ORDER;
}

// Función para obtener configuración de una consola
function getConsoleConfig(consoleName) {
    return CONSOLES_CONFIG[consoleName] || {
        emoji: "🎮",
        name: consoleName,
        color: "#636e72"
    };
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PEOPLE_CONFIG,
        CONSOLES_CONFIG,
        CONSOLE_ORDER,
        getAllPeople,
        getConsolesForPerson,
        getPeopleForConsole,
        getAvailableConsoles,
        getConsoleConfig
    };
}
