// Configuración de personas por plataforma/consola
// Este archivo contiene la organización de todas las personas disponibles
// agrupadas por la plataforma o consola que pueden usar

const PEOPLE_BY_PLATFORM = {
    "PS5": [
        "Ignacio Pourteau 🌪️",
        "Genaro Ramos 🫅🏽",
        "Denisse Melo 🕷",
        "Daniel Salerno 👹",
        "Nahuel Buceta 🤠",
        "Gabriel Guerrero 👑",
        "Santiago Colonel 🥊",
        "Tomás Amigo 😺"
    ],
    "iOS": [
        "TODAS LAS PERSONAS"
    ],
    "Android": [
        "TODAS LAS PERSONAS"
    ],
    "Xbox": [
        "Gino Lupis 🐉",
        "Biaggio di Stefano",
        "Leonardo Valenzuela 🤘🏼",
        "Federico Durán"
    ],
    "Switch": [
        "Nicolás Cadel 🪬",
        "Boris Schwindt",
        "Nairet Vergara",
        "Agustín Reynoso 9️⃣",
        "Facundo Villafane 🛸",
        "Ignacio Pourteau 🌪️"
    ],
    "PS4": [
        "Rocío Deluca 🐯",
        "Milton Lagos 💀",
        "Lucas Presas",
        "Matías Mena ✝️"
    ]
};

// Lista completa de todas las personas (para iOS y Android)
const ALL_PEOPLE = [
    "Ignacio Pourteau 🌪️",
    "Genaro Ramos 🫅🏽",
    "Denisse Melo 🕷",
    "Daniel Salerno 👹",
    "Nahuel Buceta 🤠",
    "Gabriel Guerrero 👑",
    "Santiago Colonel 🥊",
    "Tomás Amigo 😺",
    "Gino Lupis 🐉",
    "Biaggio di Stefano",
    "Leonardo Valenzuela 🤘🏼",
    "Federico Durán",
    "Nicolás Cadel 🪬",
    "Boris Schwindt",
    "Nairet Vergara",
    "Agustín Reynoso 9️⃣",
    "Facundo Villafane 🛸",
    "Rocío Deluca 🐯",
    "Milton Lagos 💀",
    "Lucas Presas",
    "Matías Mena ✝️"
];

// Función para obtener las personas disponibles para una plataforma
function getPeopleForPlatform(platform) {
    if (platform === "iOS" || platform === "Android") {
        return ALL_PEOPLE;
    }
    return PEOPLE_BY_PLATFORM[platform] || [];
}

// Función para obtener todas las plataformas disponibles
function getAvailablePlatforms() {
    return Object.keys(PEOPLE_BY_PLATFORM);
}

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PEOPLE_BY_PLATFORM,
        ALL_PEOPLE,
        getPeopleForPlatform,
        getAvailablePlatforms
    };
}
