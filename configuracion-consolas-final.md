# 🎮 Configuración de Consolas - Lista Oficial

## 📊 Hoja "ConsolasNecesarias" - Estructura de Datos

Usa esta estructura exacta en tu Google Sheet. Cada fila representa una asignación necesaria:

| Primary | Model | Cantidad |
|---------|-------|----------|
| PS4 | Base Kit | 2 |
| PS4 | Pro Test Kit | 1 |
| PS4 | Dev Kit | 1 |
| PS5 | Pro Kit | 3 |
| PS5 | Test Kit | 2 |
| XB1 | Base Test Kit / S Test Kit (Base Mode) | 1 |
| XB1 | XBox1 X | 2 |
| XSX | Anaconda | 2 |
| XSX | Lockhart | 3 |
| Switch | Docked | 4 |
| Switch | Docked - OLED | 2 |
| Switch | Undocked | 3 |
| PC | Desktop Epic-1 | 1 |
| PC | Desktop Recommended - 2 | 2 |
| PC | Laptop Recommended -1 | 3 |
| PC | Laptop Recommended -2 | 2 |
| Android | Samsung Galaxy S9 | 1 |
| Android | Samsung Galaxy S21 FE | 2 |
| Android | Samsung S20 Ultra Mali | 1 |
| Android | Xiaomi Redmi Note 8 Pro | 2 |
| iOS | iPhone 12 | 2 |
| iOS | iPhone 13 | 3 |
| iOS | iPhone 15 Pro | 1 |
| iOS | iPhone 16 | 1 |
| iPAD | iPad mini (6th Gen) | 2 |
| iPAD | iPad Air 5 | 1 |

## 👥 Hoja "Personas" - Ejemplos de Stash

Cada persona debe tener su Stash con los modelos exactos separados por comas:

| Station | Location | POD | Name | Username | Stash |
|---------|----------|-----|------|----------|--------|
| WK001 | Buenos Aires | POD-BA-001 | Juan Pérez | juan.perez@epam.com | PS5 Pro Kit, Switch Docked, iPhone 13, Desktop Epic-1 |
| WK002 | Córdoba | POD-CB-001 | María García | maria.garcia@epam.com | PS4 Base Kit, XSX Anaconda, Switch Docked - OLED, Samsung Galaxy S21 FE |
| WK003 | Buenos Aires | POD-BA-002 | Carlos López | carlos.lopez@epam.com | PS5 Test Kit, XB1 XBox1 X, Laptop Recommended -1, iPhone 15 Pro |
| WK004 | Mendoza | POD-MZ-001 | Ana Martín | ana.martin@epam.com | Switch Undocked, Android Xiaomi Redmi Note 8 Pro, iPad Air 5 |
| WK005 | Buenos Aires | POD-BA-003 | Luis Rodríguez | luis.rodriguez@epam.com | PS4 Pro Test Kit, XSX Lockhart, PC Desktop Recommended - 2 |
| WK006 | Córdoba | POD-CB-002 | Sofia Jiménez | sofia.jimenez@epam.com | PS5 Pro Kit, Switch Docked, iPhone 12, iPad mini (6th Gen) |
| WK007 | Buenos Aires | POD-BA-004 | Pedro Gómez | pedro.gomez@epam.com | XB1 Base Test Kit / S Test Kit (Base Mode), Samsung Galaxy S9, iPhone 16 |
| WK008 | Mendoza | POD-MZ-002 | Laura Fernández | laura.fernandez@epam.com | PS4 Dev Kit, Switch Docked - OLED, Samsung S20 Ultra Mali |

## 🎯 Matching Exacto

### ✅ Ejemplos de Match Exitoso:
- **Necesario:** `PS5 - Pro Kit` ↔ **Stash:** `"PS5 Pro Kit, Switch Docked"` → ✅ MATCH
- **Necesario:** `Switch - Docked - OLED` ↔ **Stash:** `"Switch Docked - OLED, iPhone 13"` → ✅ MATCH  
- **Necesario:** `iOS - iPhone 15 Pro` ↔ **Stash:** `"iPhone 15 Pro, PS5 Test Kit"` → ✅ MATCH

### ❌ Ejemplos de No Match:
- **Necesario:** `PS5 - Pro Kit` ↔ **Stash:** `"PS5 Test Kit"` → ❌ NO MATCH (modelos diferentes)
- **Necesario:** `XSX - Anaconda` ↔ **Stash:** `"XSX Lockhart"` → ❌ NO MATCH (modelos diferentes)
- **Necesario:** `Switch - Docked` ↔ **Stash:** `"Switch Undocked"` → ❌ NO MATCH (modos diferentes)

## 🔄 Cómo Funciona el Sistema

### 1. **Lectura de Configuración:**
```javascript
// El sistema lee todas las filas de ConsolasNecesarias
// Cada fila se convierte en una asignación necesaria
Primary: "PS5", Model: "Pro Kit", Cantidad: 1 (por cada fila)
```

### 2. **Procesamiento de Personas:**
```javascript
// Para cada persona, analiza su Stash
Stash: "PS5 Pro Kit, iPhone 13, Switch Docked"
// Se divide en: ["PS5 Pro Kit", "iPhone 13", "Switch Docked"]
```

### 3. **Matching Algorithm:**
```javascript
// Verifica si cada modelo requerido está en el Stash
Requerido: "PS5 Pro Kit" 
Stash: ["PS5 Pro Kit", "iPhone 13", "Switch Docked"]
Resultado: ✅ MATCH (string exacto encontrado)
```

### 4. **Distribución Geográfica:**
```javascript
// Mantiene proporciones por ubicación
Buenos Aires: 4 personas → 60% del total → recibirá ~60% de asignaciones
Córdoba: 2 personas → 30% del total → recibirá ~30% de asignaciones  
Mendoza: 2 personas → 30% del total → recibirá ~30% de asignaciones
```

## 📝 Instrucciones de Configuración

### Paso 1: Crear/Actualizar Hoja "ConsolasNecesarias"
1. Columna A: **Primary** (PS4, PS5, XB1, XSX, Switch, PC, Android, iOS, iPAD)
2. Columna B: **Model** (modelo específico según la lista oficial)
3. Cada fila = 1 asignación necesaria

### Paso 2: Crear/Actualizar Hoja "Personas"  
1. Columna A: **Station** (ID del workstation)
2. Columna B: **Location** (Buenos Aires, Córdoba, Mendoza, etc.)
3. Columna C: **POD** (identificador del POD)
4. Columna D: **Name** (nombre completo)
5. Columna E: **Username** (email corporativo)
6. Columna F: **Stash** (lista de modelos separados por comas)

### Paso 3: Ejecutar Asignación
1. Abre tu Google Sheet
2. Ve a: **🎮 Console Assigner > 🎲 Randomizar Asignación**
3. Revisa los resultados en las hojas "Asignaciones" y "Backup"

## ⚙️ Configuración Recomendada

### Para Testing de Juegos:
```
Primary: PS5, Model: Pro Kit, Cantidad: 5
Primary: PS5, Model: Test Kit, Cantidad: 3
Primary: XSX, Model: Anaconda, Cantidad: 4
Primary: Switch, Model: Docked, Cantidad: 6
Primary: PC, Model: Desktop Recommended - 2, Cantidad: 3
```

### Para Testing Móvil:
```
Primary: iOS, Model: iPhone 13, Cantidad: 4
Primary: iOS, Model: iPhone 15 Pro, Cantidad: 2
Primary: Android, Model: Samsung Galaxy S21 FE, Cantidad: 3
Primary: Android, Model: Xiaomi Redmi Note 8 Pro, Cantidad: 2
Primary: iPAD, Model: iPad mini (6th Gen), Cantidad: 2
```

### Stash de Ejemplo para Tester Completo:
```
"PS5 Pro Kit, PS4 Base Kit, XSX Anaconda, Switch Docked, iPhone 13, Samsung Galaxy S21 FE, Desktop Recommended - 2, iPad Air 5"
```

## 🎮 ¡Listo para usar!

Con esta configuración tendrás un sistema de asignación de hardware completamente automatizado que:

- ✅ Hace matching exacto de modelos específicos
- ✅ Distribuye equitativamente por ubicaciones geográficas  
- ✅ Prioriza hardware con disponibilidad limitada
- ✅ Genera listas de backup automáticamente
- ✅ Proporciona logs detallados para debugging
