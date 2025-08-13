# 🎮 Guía de Migración a Sistema Hardware-Específico

## 📋 Resumen de Cambios

El sistema ha sido actualizado para manejar **modelos específicos de hardware** en lugar de categorías genéricas. Esto permite un matching mucho más preciso entre las consolas disponibles y las necesidades.

## 🔧 Nuevas Estructuras de Datos

### 1. Hoja "Personas" 
**Nueva estructura (6 columnas):**

| Station | Location | POD | Name | Username | Stash |
|---------|----------|-----|------|----------|--------|
| WK001 | Buenos Aires | POD-BA-001 | Juan Pérez | juan.perez@epam.com | PS5, Xbox Series X, Nintendo Switch |
| WK002 | Córdoba | POD-CB-001 | María García | maria.garcia@epam.com | PS5 Pro, PS4, Nintendo Switch OLED |
| WK003 | Buenos Aires | POD-BA-002 | Carlos López | carlos.lopez@epam.com | Xbox Series S, PS5, PC Gaming |

**Campo Stash:** Lista separada por comas con los modelos exactos de hardware que tiene disponible cada persona.

### 2. Hoja "ConsolasNecesarias"
**Nueva estructura (3 columnas):**

| Primary | Model | Cantidad |
|---------|-------|----------|
| PlayStation | PS5 | 3 |
| PlayStation | PS5 Pro | 1 |
| Xbox | Xbox Series X | 2 |
| Nintendo | Nintendo Switch | 2 |
| Nintendo | Nintendo Switch OLED | 1 |

**Campos:**
- **Primary:** Categoría principal (PlayStation, Xbox, Nintendo, PC, etc.)
- **Model:** Modelo específico (PS5, PS5 Pro, Xbox Series X, RTX 4080, etc.)
- **Cantidad:** Cuántas unidades necesitas de esa combinación exacta

## 🎯 Lógica de Matching

### Ejemplo de Funcionamiento:
1. **Consola requerida:** PlayStation - PS5 Pro
2. **Persona con Stash:** "PS5, PS5 Pro, Nintendo Switch"
3. **Resultado:** ✅ MATCH (la persona tiene "PS5 Pro" en su stash)

### Casos Importantes:
- ❌ **PS5** NO satisface **PS5 Pro** (modelos específicos diferentes)
- ❌ **Xbox Series X** NO satisface **Xbox Series S** (aunque sean de la misma familia)
- ✅ **Nintendo Switch OLED** satisface **Nintendo Switch OLED** (match exacto)

## 📊 Hojas de Resultados

### Hoja "Asignaciones" (Principal)
Contiene las asignaciones principales con columnas:
- Orden, Consola, Primary, Model, Nombre, Ubicación, Equipo, Usuario EPAM, Modelos Disponibles

### Hoja "Backup" 
Contiene personas no asignadas con todas sus consolas disponibles:
- Orden, Consolas Disponibles, Nombre, Ubicación, Equipo, Usuario EPAM, Modelos en Stash

## 🚀 Nuevas Funcionalidades

### 1. **Distribución Geográfica Equitativa**
- El algoritmo mantiene la proporción de participación por ubicación
- Si Buenos Aires tiene 60% del total, tendrá ~60% de las asignaciones

### 2. **Algoritmo de Prioridad Inteligente**
- Consolas con menor disponibilidad se asignan primero
- Reduce el riesgo de quedar sin candidatos para consolas limitadas

### 3. **Matching Hardware-Específico**
- Verificación exacta de modelo en el Stash de cada persona
- Soporte para cualquier tipo de hardware (consolas, PCs, dispositivos móviles)

### 4. **Logging Detallado**
- Registro completo del proceso de asignación en los logs de Google Apps Script
- Facilita el debugging y optimización

## 📝 Pasos para Migrar

### 1. **Actualizar Hoja "Personas":**
```
Antigua: ID | Ubicación | Equipo | Nombre | Usuario EPAM | [Consola Flags]
Nueva:   Station | Location | POD | Name | Username | Stash
```

### 2. **Actualizar Hoja "ConsolasNecesarias":**
```
Antigua: Platform | Cantidad
Nueva:   Primary | Model | Cantidad
```

### 3. **Ejecutar desde Google Sheets:**
- 🎮 Console Assigner > 🎲 Randomizar Asignación

## 🎯 Ejemplos de Configuración

### Para Consolas Gaming:
| Primary | Model | Cantidad |
|---------|-------|----------|
| PlayStation | PS5 | 5 |
| PlayStation | PS5 Pro | 2 |
| Xbox | Xbox Series X | 3 |
| Xbox | Xbox Series S | 2 |
| Nintendo | Switch OLED | 2 |

### Para Hardware de Desarrollo:
| Primary | Model | Cantidad |
|---------|-------|----------|
| GPU | RTX 4090 | 2 |
| GPU | RTX 4080 | 3 |
| CPU | Intel i9-13900K | 1 |
| Mobile | iPhone 15 Pro | 2 |

### Stash de Personas:
```
"RTX 4090, Intel i9-13900K, PS5 Pro, iPhone 15 Pro"
"RTX 4080, PS5, Xbox Series X, Nintendo Switch OLED"
"MacBook Pro M3, iPad Pro, PS5, Nintendo Switch"
```

## ✅ Ventajas del Nuevo Sistema

1. **Precisión:** Matching exacto de modelos específicos
2. **Flexibilidad:** Soporta cualquier tipo de hardware
3. **Escalabilidad:** Fácil agregar nuevos modelos sin cambiar código
4. **Equidad:** Distribución geográfica automática
5. **Transparencia:** Logs detallados del proceso

## 🔧 Funciones del Menú

- **🎲 Randomizar Asignación:** Ejecuta el algoritmo completo
- **🗑️ Limpiar Resultados:** Limpia hojas de resultados
- **📊 Actualizar Contadores:** Muestra resumen de configuración actual
