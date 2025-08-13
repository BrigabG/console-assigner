# 🎮 Console Assigner - Sistema de Asignación Aleatoria

Sistema completo para asignar personas a consolas de forma aleatoria e inteligente, disponible como aplicación web y como script de Google Sheets.

## 🚀 Versiones Disponibles

### 📱 Web App
- **URL**: [https://usuario.github.io/ConsoleAssigner](https://usuario.github.io/ConsoleAssigner)
- **Archivos**: `index.html`, `script.js`, `style.css`, `people-config.js`
- **Uso**: Perfecto para pruebas rápidas y demostraciones

### 📊 Google Sheets (RECOMENDADO)
- **Archivo**: `ConsoleAssigner.gs`
- **Ventajas**: Integración completa con base de datos, persistencia, backup automático
- **Uso**: Ideal para uso en producción y gestión de equipos

## 🆕 Nueva Estructura de Base de Datos

### Hoja "Personas" (Columnas A-L)
```
A: ID          | Identificador único de la persona
B: Ubicación   | Ciudad/oficina donde trabaja
C: Equipo      | Equipo al que pertenece (QA, Dev, etc.)
D: Nombre      | Nombre completo (OBLIGATORIO)
E: Usuario EPAM| Username en el sistema EPAM
F: PC          | 1 = puede usar, 0 = no puede usar
G: PS4         | 1 = puede usar, 0 = no puede usar
H: PS5         | 1 = puede usar, 0 = no puede usar
I: Xbox        | 1 = puede usar, 0 = no puede usar
J: Switch      | 1 = puede usar, 0 = no puede usar
K: iOS         | 1 = puede usar, 0 = no puede usar
L: Android     | 1 = puede usar, 0 = no puede usar
```

### Hoja "ConsolasNecesarias" (Columnas A-F)
```
A: Consola     | Tipo de consola a asignar (PC, PS4, etc.)
B: ID          | [AUTO] ID de la persona asignada
C: Ubicación   | [AUTO] Ubicación de la persona asignada
D: Equipo      | [AUTO] Equipo de la persona asignada
E: Nombre      | [AUTO] Nombre de la persona asignada
F: Usuario EPAM| [AUTO] Usuario EPAM de la persona asignada
```

## 🔧 Configuración en Google Sheets

### 1. Crear el Documento
1. Crea un nuevo Google Sheet
2. Ve a `Extensiones > Apps Script`
3. Copia y pega el contenido de `ConsoleAssigner.gs`
4. Guarda el proyecto

### 2. Configurar las Hojas

#### Hoja "Personas"
1. Crea una hoja llamada "Personas"
2. En la fila 1, agrega los encabezados: `ID`, `Ubicación`, `Equipo`, `Nombre`, `Usuario EPAM`, `PC`, `PS4`, `PS5`, `Xbox`, `Switch`, `iOS`, `Android`
3. Llena los datos de las personas (ver ejemplo en `estructura-personas-ejemplo.md`)

#### Hoja "ConsolasNecesarias"
1. Crea una hoja llamada "ConsolasNecesarias"
2. En la columna A, lista las consolas que necesitas (una por fila)
3. Ejemplo:
   ```
   PC
   PC
   PS4
   PS5
   Xbox
   ```

### 3. Ejecutar la Asignación
1. Recarga el Google Sheet para que aparezca el menú personalizado
2. Ve a `🎮 Console Assigner > 🎲 Randomizar Asignación`
3. Los resultados se escribirán automáticamente en las columnas B-F de "ConsolasNecesarias"

## ✨ Características Principales

### 🧠 Algoritmo Inteligente
- **Priorización**: Asigna primero las consolas con menos candidatos disponibles
- **Sin Repeticiones**: Una persona solo puede ser asignada a una consola por ejecución
- **Validación**: Verifica que hay suficientes personas para todas las asignaciones

### 📊 Resultados Completos
- **Asignación Directa**: Los datos se escriben directamente en la hoja de destino
- **Información Completa**: Incluye todos los campos de la persona asignada
- **Backup Automático**: Personas no asignadas en hoja "PersonasNoAsignadas"

### 🎮 Consolas Soportadas
- PC
- PlayStation 4 (PS4)
- PlayStation 5 (PS5)
- Xbox (Series X/S, One)
- Nintendo Switch
- iOS (iPhone/iPad)
- Android

## 📋 Menú de Opciones

### 🎲 Randomizar Asignación
Ejecuta la asignación aleatoria completa:
1. Lee las personas de la hoja "Personas"
2. Lee las consolas necesarias de "ConsolasNecesarias"
3. Asigna personas de forma inteligente
4. Escribe los resultados en las columnas B-F
5. Crea backup de personas no asignadas

### 🗑️ Limpiar Resultados
Borra todos los resultados previos:
- Limpia columnas B-F de "ConsolasNecesarias"
- Limpia hoja "PersonasNoAsignadas"
- Mantiene intacta la configuración de consolas

### 📊 Actualizar Contadores
Recalcula los límites máximos basado en las personas disponibles por consola.

## 🔍 Validaciones y Errores

El sistema incluye validaciones completas:

- ✅ Verifica que existan las hojas necesarias
- ✅ Valida que hay suficientes personas para cada consola
- ✅ Confirma que cada persona tiene al menos una consola disponible
- ✅ Detecta configuraciones imposibles antes de empezar
- ✅ Proporciona mensajes de error claros

## 📈 Casos de Uso

### 🎯 Testing de Videojuegos
- Asignar testers a diferentes plataformas
- Distribuir workload entre equipos
- Optimizar cobertura de testing

### 🏢 Gestión de Recursos
- Asignar equipos físicos limitados
- Planificar turnos de trabajo
- Distribuir tareas por especialización

### 📊 Análisis y Reportes
- Exportar asignaciones a otros sistemas
- Generar reportes de utilización
- Trackear disponibilidad de personal

## 🔄 Migración desde Versión Anterior

Si tienes datos en el formato anterior (con columna "Activo"):

1. **Backup**: Haz una copia de tus datos actuales
2. **Agregar Columnas**: Inserta las nuevas columnas A-D (ID, Ubicación, Equipo, Usuario EPAM)
3. **Reorganizar**: Mueve la columna "Nombre" a la posición D
4. **Completar Datos**: Llena los nuevos campos según dispongas de información
5. **Actualizar Script**: Copia la nueva versión de `ConsoleAssigner.gs`

## 🐛 Troubleshooting

### Error: "No se encontró la hoja..."
- Verifica que las hojas se llamen exactamente "Personas" y "ConsolasNecesarias"
- Asegúrate de que las hojas no estén ocultas

### Error: "No hay suficientes personas..."
- Revisa que las personas tengan marcadas las consolas correctas (1 = sí, 0 = no)
- Verifica que hay suficientes personas activas para las consolas solicitadas

### Error: "La hoja está vacía..."
- Confirma que la hoja "ConsolasNecesarias" tiene al menos una consola en la columna A
- Verifica que la hoja "Personas" tiene datos desde la fila 2

## 🚀 Próximas Mejoras

- [ ] Soporte para restricciones por ubicación
- [ ] Asignación por turnos/horarios
- [ ] Integración con APIs externas
- [ ] Dashboard de visualización
- [ ] Historial de asignaciones

## 📝 Licencia

Este proyecto está disponible bajo licencia MIT. Úsalo libremente para tus proyectos personales y comerciales.

---

**Desarrollado para optimizar la asignación de recursos en equipos de testing y desarrollo de videojuegos** 🎮✨
