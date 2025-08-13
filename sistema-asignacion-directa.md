# 🎮 Sistema de Asignación Directa - Funcionamiento

## 📋 Cómo Funciona Ahora

El sistema funciona exactamente como el original: **lee la hoja "ConsolasNecesarias" y escribe las asignaciones directamente en la misma hoja**.

## 🏗️ Estructura de la Hoja "ConsolasNecesarias"

### Columnas:
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| **Primary** | **Model** | **Station** | **Location** | **POD** | **Name** | **Username** |
| PS5 | Pro Kit | *[asignado]* | *[asignado]* | *[asignado]* | *[asignado]* | *[asignado]* |
| PS5 | Pro Kit | *[asignado]* | *[asignado]* | *[asignado]* | *[asignado]* | *[asignado]* |
| Switch | Docked | *[asignado]* | *[asignado]* | *[asignado]* | *[asignado]* | *[asignado]* |
| iOS | iPhone 13 | *[asignado]* | *[asignado]* | *[asignado]* | *[asignado]* | *[asignado]* |

### Funcionamiento:
1. **TÚ configuras:** Columnas A (Primary) y B (Model) con las consolas que necesitas
2. **EL SCRIPT asigna:** Personas en columnas C-G para cada fila
3. **Cada fila** = **Una asignación individual**

## 📝 Ejemplo de Configuración

### Antes de ejecutar el script:
```
A (Primary) | B (Model)      | C | D | E | F | G
PS5         | Pro Kit        |   |   |   |   |  
PS5         | Pro Kit        |   |   |   |   |  
PS5         | Test Kit       |   |   |   |   |  
Switch      | Docked         |   |   |   |   |  
Switch      | Docked - OLED  |   |   |   |   |  
iOS         | iPhone 13      |   |   |   |   |  
iOS         | iPhone 13      |   |   |   |   |  
Android     | Samsung Galaxy S21 FE |   |   |   |   |  
```

### Después de ejecutar el script:
```
A (Primary) | B (Model)      | C (Station) | D (Location)  | E (POD)     | F (Name)        | G (Username)
PS5         | Pro Kit        | WK001       | Buenos Aires  | POD-BA-001  | Juan Pérez      | juan.perez@epam.com
PS5         | Pro Kit        | WK003       | Córdoba       | POD-CB-001  | María García    | maria.garcia@epam.com
PS5         | Test Kit       | WK002       | Buenos Aires  | POD-BA-002  | Carlos López    | carlos.lopez@epam.com
Switch      | Docked         | WK004       | Buenos Aires  | POD-BA-003  | Ana Martín      | ana.martin@epam.com
Switch      | Docked - OLED  | WK005       | Mendoza       | POD-MZ-001  | Luis Rodríguez  | luis.rodriguez@epam.com
iOS         | iPhone 13      | WK006       | Córdoba       | POD-CB-002  | Sofia Jiménez   | sofia.jimenez@epam.com
iOS         | iPhone 13      | WK007       | Buenos Aires  | POD-BA-004  | Pedro Gómez     | pedro.gomez@epam.com
Android     | Samsung Galaxy S21 FE | WK008 | Mendoza     | POD-MZ-002  | Laura Fernández | laura.fernandez@epam.com
```

## 🎯 Algoritmo de Asignación

### 1. **Priorización Inteligente:**
- Consolas con **menos personas disponibles** se asignan primero
- Evita quedarse sin candidatos para hardware limitado

### 2. **Distribución Geográfica Equitativa:**
- Mantiene proporciones por ubicación automáticamente
- Buenos Aires: 50% personas → ~50% asignaciones
- Córdoba: 30% personas → ~30% asignaciones
- Mendoza: 20% personas → ~20% asignaciones

### 3. **Matching Exacto:**
- **Requerido:** `PS5 - Pro Kit`
- **Stash:** `"PS5 Pro Kit, Switch Docked, iPhone 13"`  
- **Resultado:** ✅ MATCH (string exacto encontrado)

### 4. **Sin Repeticiones:**
- Una persona = máximo una asignación
- Sistema de backup automático para personas no asignadas

## 🔧 Configuración de Hojas

### Hoja "ConsolasNecesarias":
- **Columna A:** Primary (PS5, Switch, iOS, Android, etc.)
- **Columna B:** Model (Pro Kit, Docked, iPhone 13, etc.)
- **Columnas C-G:** Se llenan automáticamente con las asignaciones

### Hoja "Personas":
- **Columna A:** Station (WK001, WK002, etc.)
- **Columna B:** Location (Buenos Aires, Córdoba, etc.)
- **Columna C:** POD (POD-BA-001, POD-CB-001, etc.)
- **Columna D:** Name (nombre completo)
- **Columna E:** Username (email corporativo)
- **Columna F:** Stash (lista de modelos: "PS5 Pro Kit, iPhone 13, Switch Docked")

## 🚀 Cómo Usar

### 1. Configurar ConsolasNecesarias:
```
Fila 1: Headers automáticos
Fila 2: PS5 | Pro Kit
Fila 3: PS5 | Pro Kit  
Fila 4: Switch | Docked
Fila 5: iOS | iPhone 13
...
```

### 2. Configurar Personas:
```
Juan | Buenos Aires | POD-BA-001 | Juan Pérez | juan@epam.com | PS5 Pro Kit, Switch Docked, iPhone 13
María | Córdoba | POD-CB-001 | María García | maria@epam.com | PS5 Pro Kit, iPhone 13, Android Samsung Galaxy S21 FE
...
```

### 3. Ejecutar:
- **🎮 Console Assigner > 🎲 Randomizar Asignación**

### 4. Resultado:
- ✅ Cada fila de ConsolasNecesarias tendrá una persona asignada
- ✅ Hoja "PersonasNoAsignadas" con backup automático
- ✅ Distribución geográfica equitativa
- ✅ Matching exacto de hardware

## 📊 Ventajas del Sistema

### ✅ **Integrado:**
- No crea hojas adicionales
- Todo en ConsolasNecesarias como el sistema original

### ✅ **Inteligente:**
- Prioriza hardware con disponibilidad limitada
- Distribución geográfica automática
- Matching exacto de modelos específicos

### ✅ **Eficiente:**
- Una fila = una asignación
- Headers automáticos
- Limpieza automática de resultados previos

### ✅ **Completo:**
- Sistema de backup automático
- Logs detallados para debugging
- Validaciones de datos

## 🎮 ¡Listo para Usar!

El sistema funciona exactamente como necesitas:
1. **Lees** Primary/Model de columnas A y B
2. **Asignas** personas directamente en columnas C-G
3. **Una fila** = **una asignación completa**
4. **Distribución geográfica** automática y equitativa
