/**
 * Console Assigner para Google Sheets
 * Sistema de asignación aleatoria de personas a consolas
 */

// ==========================================================================
// CONFIGURACIÓN PRINCIPAL
// ==========================================================================

function onOpen() {
  // Crear menú personalizado al abrir el sheet
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎮 Console Assigner')
    .addItem('🎲 Randomizar Asignación', 'randomizeAssignments')
    .addItem('� Asignar Backups', 'assignBackupsToRange')
    .addSeparator()
    .addItem('�🗑️ Limpiar Resultados', 'clearResults')
    .addItem('📊 Actualizar Contadores', 'updateCounters')
    .addItem('✅ Configurar Presentismo', 'setupAttendanceColumn')
    .addSeparator()
    .addItem('⚙️ Configurar Columnas', 'setupConfigurationSheet')
    .addToUi();
}

/**
 * Configurar la columna de presentismo (columna S) en la hoja Personas
 */
function setupAttendanceColumn() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    // Obtener configuración de columnas
    const config = getColumnConfiguration();
    const personasSheet = ss.getSheetByName(config.personasSheetName);
    
    if (!personasSheet) {
      throw new Error(`No se encontró la hoja "${config.personasSheetName}".`);
    }
    
    const presenteColumn = config.personasPresente;
    
    // Configurar header usando configuración dinámica
    personasSheet.getRange(`${presenteColumn}1`).setValue('✅ Presente');
    personasSheet.getRange(`${presenteColumn}1`).setFontWeight('bold');
    personasSheet.getRange(`${presenteColumn}1`).setBackground('#e8f5e8');
    
    // Obtener la última fila con datos
    const lastRow = personasSheet.getLastRow();
    
    if (lastRow > 1) {
      // Configurar checkboxes para todas las filas de personas
      const checkboxRange = personasSheet.getRange(`${presenteColumn}2:${presenteColumn}${lastRow}`);
      checkboxRange.insertCheckboxes();
      
      // Por defecto, marcar todos como presentes (true)
      const defaultValues = Array(lastRow - 1).fill([true]);
      checkboxRange.setValues(defaultValues);
    }
    
    // Formatear la columna usando configuración dinámica
    personasSheet.getRange(`${presenteColumn}:${presenteColumn}`).setHorizontalAlignment('center');
    
    SpreadsheetApp.getUi().alert(
      '✅ Presentismo Configurado', 
      `Se ha configurado la columna de presentismo en la columna ${presenteColumn}.\n\n` +
      `• Los checkboxes están marcados por defecto (todos presentes)\n` +
      `• Desmarca los checkboxes de las personas que no estén presentes\n` +
      `• Solo las personas con ✅ serán consideradas para asignación`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    
  } catch (error) {
    Logger.log(`Error al configurar presentismo: ${error.toString()}`);
    SpreadsheetApp.getUi().alert('Error', `No se pudo configurar el presentismo: ${error.toString()}`, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Configurar la hoja de configuraciones de columnas
 */
function setupConfigurationSheet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let configSheet = ss.getSheetByName('Configuracion');
    
    // Crear la hoja si no existe
    if (!configSheet) {
      configSheet = ss.insertSheet('Configuracion');
    }
    
    // Limpiar contenido existente
    configSheet.clear();
    
    // Configurar headers
    const headers = [
      ['⚙️ CONFIGURACIÓN DE COLUMNAS', ''],
      ['', ''],
      ['📋 CONFIGURACIÓN', 'COLUMNA'],
      ['', ''],
      ['🎯 CONSOLAS NECESARIAS:', ''],
      ['Primary (Tipo de consola)', 'A'],
      ['Model (Modelo específico)', 'B'],
      ['', ''],
      ['📤 SALIDA DE ASIGNACIONES:', ''],
      ['Station (salida)', 'C'],
      ['Location (salida)', 'D'],
      ['POD (salida)', 'E'],
      ['Name (salida)', 'F'],
      ['Username (salida)', 'G'],
      ['', ''],
      ['👥 PERSONAS:', ''],
      ['Station (entrada)', 'A'],
      ['Location (entrada)', 'B'],
      ['POD (entrada)', 'C'],
      ['Name (entrada)', 'D'],
      ['Username (entrada)', 'E'],
      ['Stash (consolas disponibles)', 'F'],
      ['Presente (checkbox)', 'S'],
      ['', ''],
      ['� NOMBRES DE HOJAS:', ''],
      ['Hoja de Consolas Necesarias', 'ConsolasNecesarias'],
      ['Hoja de Personas', 'Personas'],
      ['Hoja de Backup (Personas No Asignadas)', 'PersonasNoAsignadas'],
      ['', ''],
      ['�🔄 ASIGNACIÓN DE BACKUPS:', ''],
      ['Rango de filas (ej: 2-5 o 3)', '']
    ];
    
    // Escribir datos
    configSheet.getRange(1, 1, headers.length, 2).setValues(headers);
    
    // Formatear la hoja
    // Header principal
    configSheet.getRange('A1:B1').merge();
    configSheet.getRange('A1').setFontSize(14).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
    
    // Subheaders
    configSheet.getRange('A3:B3').setFontWeight('bold').setBackground('#e8f5e8');
    configSheet.getRange('A5').setFontWeight('bold').setBackground('#fff2cc');
    configSheet.getRange('A9').setFontWeight('bold').setBackground('#fff2cc');
    configSheet.getRange('A16').setFontWeight('bold').setBackground('#fff2cc');
    configSheet.getRange('A25').setFontWeight('bold').setBackground('#fff2cc');
    configSheet.getRange('A29').setFontWeight('bold').setBackground('#fff2cc');
    
    // Columnas de configuración (columna B)
    const configRanges = ['B6:B7', 'B10:B14', 'B17:B23', 'B26:B28', 'B30'];
    configRanges.forEach(range => {
      configSheet.getRange(range).setBackground('#f0f0f0').setHorizontalAlignment('center').setFontWeight('bold');
    });
    
    // Ajustar anchos de columna
    configSheet.setColumnWidth(1, 250);
    configSheet.setColumnWidth(2, 100);
    
    // Proteger las celdas de descripción, solo permitir editar las columnas
    const protection = configSheet.protect();
    protection.setDescription('Configuración de columnas');
    
    // Permitir editar solo las celdas de configuración
    const editableRanges = [];
    configRanges.forEach(range => {
      editableRanges.push(configSheet.getRange(range));
    });
    protection.setUnprotectedRanges(editableRanges);
    
    SpreadsheetApp.getUi().alert(
      '⚙️ Configuración Creada', 
      `Se ha creado la hoja "Configuracion".\n\n` +
      `📋 CONFIGURACIONES:\n` +
      `• Modifica las columnas según tus necesidades\n` +
      `• Solo las celdas de la columna "COLUMNA" son editables\n` +
      `• Usa letras de columna (A, B, C, etc.)\n\n` +
      `🔄 ASIGNACIÓN DE BACKUPS:\n` +
      `• Configura rango de filas para re-asignar automáticamente\n` +
      `• Ejemplos: "5", "3-8", "2,5,9-12"\n` +
      `• Si está vacío, se mostrará un diálogo\n\n` +
      `Los cambios se aplicarán automáticamente`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    
  } catch (error) {
    Logger.log(`Error al configurar hoja de configuración: ${error.toString()}`);
    SpreadsheetApp.getUi().alert('Error', `No se pudo crear la configuración: ${error.toString()}`, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Obtener la configuración de columnas desde la hoja Configuracion
 */
function getColumnConfiguration() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = ss.getSheetByName('Configuracion');
  
  // Configuración por defecto si no existe la hoja
  const defaultConfig = {
    // ConsolasNecesarias - entrada
    consolasPrimary: 'A',
    consolasModel: 'B',
    
    // ConsolasNecesarias - salida
    consolasStationOut: 'C',
    consolasLocationOut: 'D',
    consolasPodOut: 'E',
    consolasNameOut: 'F',
    consolasUsernameOut: 'G',
    
    // Personas - entrada
    personasStation: 'A',
    personasLocation: 'B',
    personasPod: 'C',
    personasName: 'D',
    personasUsername: 'E',
    personasStash: 'F',
    personasPresente: 'S',
    
    // Configuración de backup
    backupRange: '',
    
    // Configuración de PersonasNoAsignadas sheet
    personasNoAsignadasSheet: 'A',
    personasNoAsignadasName: 'B',
    
    // Configuración de nombres de hojas
    consolasNecesariasSheetName: 'ConsolasNecesarias',
    personasSheetName: 'Personas',
    personasNoAsignadasSheetName: 'PersonasNoAsignadas'
  };
  
  if (!configSheet) {
    Logger.log('⚠️ No se encontró la hoja de configuración. Usando valores por defecto.');
    return defaultConfig;
  }
  
  try {
    // Leer todas las configuraciones - ajustado a la estructura actual
    const data = configSheet.getRange('B6:B25').getValues();
    
    return {
      // ConsolasNecesarias - entrada
      consolasPrimary: data[0][0] || defaultConfig.consolasPrimary,
      consolasModel: data[1][0] || defaultConfig.consolasModel,
      
      // ConsolasNecesarias - salida
      consolasStationOut: data[4][0] || defaultConfig.consolasStationOut,
      consolasLocationOut: data[5][0] || defaultConfig.consolasLocationOut,
      consolasPodOut: data[6][0] || defaultConfig.consolasPodOut,
      consolasNameOut: data[7][0] || defaultConfig.consolasNameOut,
      consolasUsernameOut: data[8][0] || defaultConfig.consolasUsernameOut,
      
      // Personas - entrada
      personasStation: data[11][0] || defaultConfig.personasStation,
      personasLocation: data[12][0] || defaultConfig.personasLocation,
      personasPod: data[13][0] || defaultConfig.personasPod,
      personasName: data[14][0] || defaultConfig.personasName,
      personasUsername: data[15][0] || defaultConfig.personasUsername,
      personasStash: data[16][0] || defaultConfig.personasStash,
      personasPresente: data[17][0] || defaultConfig.personasPresente,
      
      // Configuración de backup - usando valores por defecto temporalmente
      backupRange: data[19][0] || defaultConfig.backupRange,
      
      // Configuración de PersonasNoAsignadas sheet - usando valores por defecto
      personasNoAsignadasSheet: defaultConfig.personasNoAsignadasSheet,
      personasNoAsignadasName: defaultConfig.personasNoAsignadasName,
      
      // Configuración de nombres de hojas - usando valores por defecto
      consolasNecesariasSheetName: defaultConfig.consolasNecesariasSheetName,
      personasSheetName: defaultConfig.personasSheetName,
      personasNoAsignadasSheetName: defaultConfig.personasNoAsignadasSheetName
    };
    
  } catch (error) {
    Logger.log(`⚠️ Error al leer configuración: ${error.toString()}. Usando valores por defecto.`);
    return defaultConfig;
  }
}

/**
 * Convertir letra de columna a número (A=1, B=2, etc.)
 */
function columnLetterToNumber(letter) {
  if (!letter || typeof letter !== 'string') {
    return 1; // Default a columna A
  }
  
  const upperLetter = letter.toString().toUpperCase().trim();
  let result = 0;
  
  for (let i = 0; i < upperLetter.length; i++) {
    result = result * 26 + (upperLetter.charCodeAt(i) - 64);
  }
  
  return result;
}

/**
 * Crear rango dinámico basado en configuración
 */
function createDynamicRange(startRow, endRow, columns) {
  if (!Array.isArray(columns)) {
    columns = [columns];
  }
  
  const columnNumbers = columns.map(col => columnLetterToNumber(col));
  const minCol = Math.min(...columnNumbers);
  const maxCol = Math.max(...columnNumbers);
  
  return {
    range: `${String.fromCharCode(64 + minCol)}${startRow}:${String.fromCharCode(64 + maxCol)}${endRow}`,
    columnMap: columns.reduce((map, col, index) => {
      map[col] = columnLetterToNumber(col) - minCol;
      return map;
    }, {})
  };
}

/**
 * Asignar personas backup a rangos específicos de filas
 */
function assignBackupsToRange() {
  try {
    Logger.log('=== INICIANDO ASIGNACIÓN DE BACKUPS ===');
    
    // Intentar obtener rango desde configuración primero
    const config = getColumnConfiguration();
    let rangeInput = config.backupRange;
    
    Logger.log(`📋 Configuración backup obtenida: ${typeof rangeInput} = "${rangeInput}"`);
    Logger.log(`🔧 Columnas de output configuradas: Station=${config.consolasStationOut}, Location=${config.consolasLocationOut}, POD=${config.consolasPodOut}, Name=${config.consolasNameOut}, Username=${config.consolasUsernameOut}`);
    
    // Si no hay configuración, mostrar diálogo
    if (!rangeInput || rangeInput.toString().trim() === '') {
      const ui = SpreadsheetApp.getUi();
      const response = ui.prompt(
        '🔄 Asignar Backups',
        'Ingresa el rango de filas a re-asignar:\n\n' +
        'Ejemplos:\n' +
        '• Una fila: 5\n' +
        '• Rango: 3-8\n' +
        '• Múltiples: 2,5,9-12\n\n' +
        'Filas:',
        ui.ButtonSet.OK_CANCEL
      );
      
      if (response.getSelectedButton() === ui.Button.CANCEL) {
        return;
      }
      
      rangeInput = response.getResponseText().trim();
    }
    
    // Convertir a string por seguridad
    rangeInput = rangeInput ? rangeInput.toString().trim() : '';
    
    Logger.log(`RangeInput después de conversión: "${rangeInput}"`);
    
    if (!rangeInput || rangeInput === '') {
      throw new Error('Debes especificar un rango de filas válido.');
    }
    
    // Parsear rango de filas
    const targetRows = parseRowRange(rangeInput);
    if (targetRows.length === 0) {
      throw new Error(`Rango de filas inválido: "${rangeInput}". Usa formatos como: 5, 3-8, o 2,5,9-12`);
    }
    
    Logger.log(`Filas objetivo para backup: ${targetRows.join(', ')}`);
    
    // Obtener datos base
    const personas = getPersonas();
    const consolasArray = getConfigurationForAssignment();
    
    // Procesar personas con las consolas requeridas
    const personasProcessed = processPersonasWithRequiredConsoles(personas, consolasArray);
    const personasElegibles = personasProcessed.filter(p => p.consolas.length > 0);
    
    // Obtener personas ya asignadas
    const personasAsignadas = getAssignedPersons();
    
    // Filtrar solo personas NO asignadas
    const personasBackup = personasElegibles.filter(persona => 
      !personasAsignadas.has(persona.nombre)
    );
    
    Logger.log(`Total personas elegibles: ${personasElegibles.length}`);
    Logger.log(`Personas ya asignadas: ${personasAsignadas.size}`);
    Logger.log(`Personas backup disponibles: ${personasBackup.length}`);
    
    if (personasBackup.length === 0) {
      throw new Error('No hay personas de backup disponibles (todas las personas elegibles ya están asignadas).');
    }
    
    // Ejecutar asignación de backup
    const resultado = executeBackupAssignment(targetRows, personasBackup, consolasArray);
    
    // Mostrar resultados
    showBackupResults(resultado, targetRows);
    
  } catch (error) {
    Logger.log(`Error en asignación de backup: ${error.toString()}`);
    SpreadsheetApp.getUi().alert('Error', error.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Parsear rango de filas desde string (ej: "2-5", "3", "2,5,7-10")
 */
function parseRowRange(rangeInput) {
  const rows = [];
  
  Logger.log(`parseRowRange recibió: ${typeof rangeInput} = "${rangeInput}"`);
  
  // Convertir a string y validar
  const rangeStr = rangeInput ? rangeInput.toString().trim() : '';
  if (!rangeStr || rangeStr === '') {
    Logger.log('parseRowRange: rango vacío, devolviendo array vacío');
    return rows;
  }
  
  Logger.log(`parseRowRange procesando: "${rangeStr}"`);
  
  // Dividir por comas para múltiples rangos
  const parts = rangeStr.split(',');
  
  for (const part of parts) {
    const trimmed = part.trim();
    
    if (trimmed.includes('-')) {
      // Rango (ej: "3-8")
      const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
      if (!isNaN(start) && !isNaN(end) && start <= end && start >= 2) {
        for (let i = start; i <= end; i++) {
          if (!rows.includes(i)) {
            rows.push(i);
          }
        }
      }
    } else {
      // Número único (ej: "5")
      const num = parseInt(trimmed);
      if (!isNaN(num) && num >= 2 && !rows.includes(num)) {
        rows.push(num);
      }
    }
  }
  
  return rows.sort((a, b) => a - b);
}

/**
 * Obtener set de personas ya asignadas en ConsolasNecesarias
 */
function getAssignedPersons() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const config = getColumnConfiguration();
  const consolasSheet = ss.getSheetByName(config.consolasNecesariasSheetName);
  const personasAsignadas = new Set();
  
  if (!consolasSheet) {
    return personasAsignadas;
  }
  const lastRow = consolasSheet.getLastRow();
  
  if (lastRow < 2) {
    return personasAsignadas;
  }
  
  // Leer columna de nombres asignados
  const columnNumber = columnLetterToNumber(config.consolasNameOut);
  const names = consolasSheet.getRange(2, columnNumber, lastRow - 1, 1).getValues();
  
  names.forEach(row => {
    const name = row[0];
    if (name && name.toString().trim() !== '') {
      personasAsignadas.add(name.toString().trim());
    }
  });
  
  return personasAsignadas;
}

/**
 * Ejecutar asignación de backup para filas específicas
 */
function executeBackupAssignment(targetRows, personasBackup, consolasArray) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const config = getColumnConfiguration();
  const consolasSheet = ss.getSheetByName(config.consolasNecesariasSheetName);
  
  const resultado = {
    asignadas: 0,
    noAsignadas: 0,
    filasProcessadas: [],
    errores: []
  };
  
  for (const rowNumber of targetRows) {
    try {
      // Encontrar la configuración de consola para esta fila
      const consolaConfig = consolasArray.find(c => c.fila === rowNumber);
      
      if (!consolaConfig) {
        resultado.errores.push(`Fila ${rowNumber}: No se encontró configuración de consola`);
        resultado.noAsignadas++;
        continue;
      }
      
      // Buscar personas backup compatibles con esta consola
      const candidatos = personasBackup.filter(persona => 
        canPersonUseConsole(persona.modelosDisponibles, consolaConfig.primary, consolaConfig.model)
      );
      
      if (candidatos.length === 0) {
        resultado.errores.push(`Fila ${rowNumber}: No hay personas backup compatibles con ${consolaConfig.primary} - ${consolaConfig.model}`);
        resultado.noAsignadas++;
        continue;
      }
      
      // Seleccionar persona aleatoria
      const personaSeleccionada = candidatos[Math.floor(Math.random() * candidatos.length)];
      
      // Escribir asignación usando configuración dinámica
      Logger.log(`🔧 Configuración de columnas: Station=${config.consolasStationOut}, Location=${config.consolasLocationOut}, POD=${config.consolasPodOut}, Name=${config.consolasNameOut}, Username=${config.consolasUsernameOut}`);
      
      const outputData = [
        [personaSeleccionada.id],           // Station
        [personaSeleccionada.ubicacion],    // Location  
        [personaSeleccionada.equipo],       // POD
        [personaSeleccionada.nombre],       // Name
        [personaSeleccionada.usuarioEPAM]   // Username
      ];
      
      const outputColumns = [
        config.consolasStationOut,
        config.consolasLocationOut,
        config.consolasPodOut,
        config.consolasNameOut,
        config.consolasUsernameOut
      ];
      
      Logger.log(`📝 Escribiendo en fila ${rowNumber} con columnas: ${outputColumns.join(', ')}`);
      
      // Escribir cada columna individualmente
      outputColumns.forEach((column, index) => {
        const columnNumber = columnLetterToNumber(column);
        Logger.log(`   Columna ${column} (número ${columnNumber}): ${outputData[index][0]}`);
        consolasSheet.getRange(rowNumber, columnNumber, 1, 1).setValues([outputData[index]]);
      });
      
      // Remover persona del pool de backup para evitar duplicados
      const personaIndex = personasBackup.indexOf(personaSeleccionada);
      if (personaIndex > -1) {
        personasBackup.splice(personaIndex, 1);
      }
      
      resultado.filasProcessadas.push({
        fila: rowNumber,
        consola: `${consolaConfig.primary} - ${consolaConfig.model}`,
        persona: personaSeleccionada.nombre
      });
      
      resultado.asignadas++;
      
      Logger.log(`✅ Fila ${rowNumber}: ${personaSeleccionada.nombre} → ${consolaConfig.primary} - ${consolaConfig.model}`);
      
    } catch (error) {
      resultado.errores.push(`Fila ${rowNumber}: ${error.toString()}`);
      resultado.noAsignadas++;
      Logger.log(`❌ Error en fila ${rowNumber}: ${error.toString()}`);
    }
  }
  
  return resultado;
}

/**
 * Mostrar resultados de asignación de backup
 */
function showBackupResults(resultado, targetRows) {
  try {
    // Validar parámetros de entrada
    if (!resultado) {
      Logger.log('Error: resultado es null o undefined');
      SpreadsheetApp.getUi().alert('Error', 'Error interno: resultado no disponible', SpreadsheetApp.getUi().ButtonSet.OK);
      return;
    }
    
    if (!targetRows || !Array.isArray(targetRows)) {
      Logger.log('Error: targetRows es inválido');
      SpreadsheetApp.getUi().alert('Error', 'Error interno: filas objetivo no válidas', SpreadsheetApp.getUi().ButtonSet.OK);
      return;
    }
    
    const porcentajeExito = targetRows.length > 0 ? ((resultado.asignadas / targetRows.length) * 100).toFixed(1) : 0;
  
  let message = `🔄 Asignación de Backups Completada\n\n`;
  message += `📊 ESTADÍSTICAS:\n`;
  message += `• Filas procesadas: ${targetRows.length}\n`;
  message += `• Asignaciones exitosas: ${resultado.asignadas}\n`;
  message += `• Filas no asignadas: ${resultado.noAsignadas}\n`;
  message += `• Porcentaje de éxito: ${porcentajeExito}%\n\n`;
  
  if (resultado.asignadas > 0) {
    message += `✅ ASIGNACIONES REALIZADAS:\n`;
    resultado.filasProcessadas.forEach(item => {
      message += `• Fila ${item.fila}: ${item.persona} → ${item.consola}\n`;
    });
    message += '\n';
  }
  
  if (resultado.errores.length > 0) {
    message += `⚠️ PROBLEMAS ENCONTRADOS:\n`;
    resultado.errores.forEach(error => {
      message += `• ${error}\n`;
    });
    message += '\n';
  }
  
  message += `🔍 Revisa los logs de ejecución para más detalles.`;
  
  const titulo = resultado.noAsignadas === 0 ? 'Backup Completo' : 'Backup Parcial';
  
  // Validar parámetros antes de mostrar alert
  if (!titulo || typeof titulo !== 'string') {
    Logger.log('Error: título inválido para alert');
    return;
  }
  
  if (!message || typeof message !== 'string') {
    Logger.log('Error: mensaje inválido para alert');
    return;
  }
  
  SpreadsheetApp.getUi().alert(titulo, message, SpreadsheetApp.getUi().ButtonSet.OK);
  
  } catch (error) {
    Logger.log(`Error en showBackupResults: ${error.toString()}`);
    SpreadsheetApp.getUi().alert('Error', `Error al mostrar resultados: ${error.toString()}`, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

// ==========================================================================
// FUNCIONES PRINCIPALES
// ==========================================================================

/**
 * Función principal para randomizar asignaciones
 */
function randomizeAssignments() {
  try {
    Logger.log('=== INICIANDO RANDOMIZACIÓN DE ASIGNACIONES ===');
    
    // Limpiar resultados previos
    clearResults();
    
    // Obtener datos base
    const personas = getPersonas();
    const consolasArray = getConfigurationForAssignment();
    
    // Contar total de personas vs presentes
    const totalPersonasEnHoja = getTotalPersonasCount();
    const personasPresentes = personas.length;
    const personasAusentes = totalPersonasEnHoja - personasPresentes;
    
    Logger.log(`Total de personas en la hoja: ${totalPersonasEnHoja}`);
    Logger.log(`Personas presentes (✅): ${personasPresentes}`);
    if (personasAusentes > 0) {
      Logger.log(`Personas ausentes (no marcadas): ${personasAusentes}`);
    }
    Logger.log(`Configuraciones de consolas: ${consolasArray.length}`);
    
    if (consolasArray.length === 0) {
      throw new Error('No se encontraron filas válidas para asignar en ConsolasNecesarias. Verifica que las columnas A (Primary) y B (Model) tengan datos.');
    }
    
    // Procesar personas con las consolas requeridas
    const personasProcessed = processPersonasWithRequiredConsoles(personas, consolasArray);
    
    // Mostrar estadísticas de matching (solo personas presentes)
    Logger.log('\n=== ESTADÍSTICAS DE MATCHING (SOLO PERSONAS PRESENTES) ===');
    const personasConConsolas = personasProcessed.filter(p => p.consolas.length > 0);
    const personasSinConsolas = personasProcessed.filter(p => p.consolas.length === 0);
    
    Logger.log(`Personas presentes con al menos una consola compatible: ${personasConConsolas.length}`);
    Logger.log(`Personas presentes sin consolas compatibles: ${personasSinConsolas.length}`);
    
    if (personasSinConsolas.length > 0) {
      Logger.log('\n=== PERSONAS PRESENTES SIN CONSOLAS COMPATIBLES ===');
      personasSinConsolas.forEach(persona => {
        Logger.log(`${persona.nombre}: Stash=[${persona.modelosDisponibles.join(', ')}]`);
      });
    }
    
    // Validar que hay personas elegibles
    const personasElegibles = personasConConsolas;
    if (personasElegibles.length === 0) {
      const config = getColumnConfiguration();
      throw new Error(`No hay personas presentes y elegibles que tengan las consolas requeridas en su Stash. Verifica que:\n1) Las personas estén marcadas como presentes (✅ en columna ${config.personasPresente})\n2) Los modelos en el Stash coincidan exactamente con los modelos en ConsolasNecesarias.`);
    }
    
    Logger.log(`Personas elegibles para asignación: ${personasElegibles.length}`);
    
    // Mostrar estadísticas por consola
    Logger.log('\n=== DISPONIBILIDAD POR CONSOLA ===');
    const consolaStats = {};
    consolasArray.forEach(item => {
      if (!consolaStats[item.consolaKey]) {
        consolaStats[item.consolaKey] = {
          filas: 0,
          candidatos: 0
        };
      }
      consolaStats[item.consolaKey].filas++;
    });
    
    Object.keys(consolaStats).forEach(key => {
      const candidatos = personasElegibles.filter(p => p.consolas.includes(key));
      consolaStats[key].candidatos = candidatos.length;
      Logger.log(`${key}: ${consolaStats[key].filas} filas, ${consolaStats[key].candidatos} candidatos`);
    });
    
    // Crear asignaciones directamente en ConsolasNecesarias
    const result = assignDirectlyToSheet(personasElegibles, consolasArray);
    
    // Crear hoja de backup con personas no asignadas
    createBackupSummaryNew(result.personasUsadas, personasElegibles);
    
    // Mostrar resultados
    showResultsInline(result);
    
  } catch (error) {
    Logger.log(`Error en randomizeAssignments: ${error.message}`);
    SpreadsheetApp.getUi().alert('Error', `Error: ${error.message}`, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Crear asignaciones inteligentes con nuevo sistema de Stash
 */
function createSmartAssignmentsNew(personasElegibles, consolasArray) {
  const asignaciones = [];
  const asignacionesBackup = [];
  const personasUsadas = new Set();
  
  // Agrupar consolas por cantidad (las más limitadas primero)
  const consolasOrdenadas = [...consolasArray].sort((a, b) => a.cantidad - b.cantidad);
  
  Logger.log('=== INICIANDO ASIGNACIONES ===');
  
  for (const consolaConfig of consolasOrdenadas) {
    const consolaKey = consolaConfig.consolaKey;
    const cantidadRequerida = consolaConfig.cantidad;
    
    Logger.log(`\n--- Procesando ${consolaKey} (${cantidadRequerida} unidades) ---`);
    
    // Encontrar candidatos disponibles para esta consola específica
    const candidatos = personasElegibles.filter(persona => 
      persona.consolas.includes(consolaKey) && !personasUsadas.has(persona.nombre)
    );
    
    Logger.log(`Candidatos disponibles: ${candidatos.length}`);
    
    if (candidatos.length === 0) {
      Logger.log(`⚠️ No hay candidatos disponibles para ${consolaKey}`);
      continue;
    }
    
    if (candidatos.length < cantidadRequerida) {
      Logger.log(`⚠️ Solo ${candidatos.length} candidatos disponibles para ${consolaKey}, pero se requieren ${cantidadRequerida}`);
    }
    
    // Calcular distribución equitativa por ubicación
    const distribuciones = calculateLocationDistributionNew(candidatos, cantidadRequerida);
    Logger.log('Distribuciones calculadas:', distribuciones);
    
    // Asignar según distribución por ubicación
    for (const [ubicacion, cantidadUbicacion] of Object.entries(distribuciones)) {
      if (cantidadUbicacion === 0) continue;
      
      const candidatosUbicacion = candidatos.filter(p => p.ubicacion === ubicacion);
      const seleccionados = shuffleArray([...candidatosUbicacion]).slice(0, cantidadUbicacion);
      
      Logger.log(`Seleccionando ${seleccionados.length} de ${ubicacion} para ${consolaKey}`);
      
      seleccionados.forEach(persona => {
        asignaciones.push({
          consola: `${consolaConfig.primary} - ${consolaConfig.model}`,
          primary: consolaConfig.primary,
          model: consolaConfig.model,
          nombre: persona.nombre,
          ubicacion: persona.ubicacion,
          equipo: persona.equipo,
          usuarioEPAM: persona.usuarioEPAM,
          orden: asignaciones.length + 1,
          modelosDisponibles: persona.modelosDisponibles.join(', ')
        });
        personasUsadas.add(persona.nombre);
      });
    }
  }
  
  // Crear lista de backup con personas no utilizadas
  const personasNoUsadas = personasElegibles.filter(p => !personasUsadas.has(p.nombre));
  Logger.log(`\n--- Creando lista de backup ---`);
  Logger.log(`Personas no utilizadas: ${personasNoUsadas.length}`);
  
  personasNoUsadas.forEach((persona, index) => {
    // Para backup, mostrar todas las consolas que puede usar
    const consolasDisponibles = persona.consolas
      .map(key => {
        const config = consolasArray.find(c => c.consolaKey === key);
        return config ? `${config.primary} - ${config.model}` : key;
      })
      .join(', ');
    
    asignacionesBackup.push({
      consola: consolasDisponibles,
      primary: '',
      model: '',
      nombre: persona.nombre,
      ubicacion: persona.ubicacion,
      equipo: persona.equipo,
      usuarioEPAM: persona.usuarioEPAM,
      orden: index + 1,
      modelosDisponibles: persona.modelosDisponibles.join(', ')
    });
  });
  
  Logger.log(`\n=== RESULTADO FINAL ===`);
  Logger.log(`Asignaciones principales: ${asignaciones.length}`);
  Logger.log(`Asignaciones backup: ${asignacionesBackup.length}`);
  
  // Escribir resultados en las hojas
  writeResultsNew(asignaciones, asignacionesBackup);
  
  return {
    success: true,
    asignaciones: asignaciones.length,
    backup: asignacionesBackup.length,
    data: { asignaciones, asignacionesBackup }
  };
}

/**
 * Limpiar todos los resultados
 */
function clearResults() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Obtener configuración de columnas
  const config = getColumnConfiguration();
  
  // Limpiar columnas de asignación en ConsolasNecesarias usando configuración dinámica
  const consolasSheet = ss.getSheetByName(config.consolasNecesariasSheetName);
  if (consolasSheet) {
    const lastRow = consolasSheet.getLastRow();
    if (lastRow > 1) {
      // Crear rango dinámico para las columnas de salida
      const outputColumns = [
        config.consolasStationOut,
        config.consolasLocationOut,
        config.consolasPodOut,
        config.consolasNameOut,
        config.consolasUsernameOut
      ];
      
      // Limpiar cada columna individualmente para manejar columnas no contiguas
      outputColumns.forEach(column => {
        const columnNumber = columnLetterToNumber(column);
        consolasSheet.getRange(2, columnNumber, lastRow - 1, 1).clearContent();
      });
      
      Logger.log(`Columnas de asignación limpiadas: ${outputColumns.join(', ')}`);
    }
  }
  
  // Limpiar hoja de backup si existe
  const backupSheet = ss.getSheetByName(config.personasNoAsignadasSheetName);
  if (backupSheet) {
    backupSheet.clear();
    Logger.log(`Hoja ${config.personasNoAsignadasSheetName} limpiada`);
  }
  
  // Limpiar hojas adicionales si existen (compatibilidad)
  const asignacionesSheet = ss.getSheetByName('Asignaciones');
  if (asignacionesSheet) {
    asignacionesSheet.clear();
  }
  
  const resultSheet = ss.getSheetByName('Resultados');
  if (resultSheet) {
    resultSheet.clear();
  }
  
  const oldBackupSheet = ss.getSheetByName('Backup');
  if (oldBackupSheet) {
    oldBackupSheet.clear();
  }
  
  Logger.log('Resultados limpiados exitosamente');
}

/**
 * Actualizar contadores máximos en la configuración
 */
function updateCounters() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const config = getColumnConfiguration();
  const consolasSheet = ss.getSheetByName(config.consolasNecesariasSheetName);
  
  if (!consolasSheet) {
    SpreadsheetApp.getUi().alert('❌ Error', `No se encontró la hoja "${config.consolasNecesariasSheetName}"`, SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  
  try {
    const consolasArray = getConfigurationForAssignment();
    
    // Contar por tipo
    const consolaCount = {};
    consolasArray.forEach(config => {
      const key = `${config.primary} - ${config.model}`;
      consolaCount[key] = (consolaCount[key] || 0) + 1;
    });
    
    let mensaje = 'Filas detectadas para asignar:\n\n';
    Object.entries(consolaCount).forEach(([consola, cantidad], index) => {
      mensaje += `${index + 1}. ${consola}: ${cantidad} filas\n`;
    });
    mensaje += `\nTotal de filas: ${consolasArray.length}`;
    
    SpreadsheetApp.getUi().alert('📊 Resumen de Configuración', mensaje, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (error) {
    SpreadsheetApp.getUi().alert('❌ Error', error.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

// ==========================================================================
// FUNCIONES DE CONFIGURACIÓN
// ==========================================================================

/**
 * Obtener configuración para asignación directa (cada fila = una asignación)
 * Lee Primary y Model de columnas A y B, devuelve array de filas para asignar
 */
function getConfigurationForAssignment() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const config = getColumnConfiguration();
  const consolasSheet = ss.getSheetByName(config.consolasNecesariasSheetName);
  
  if (!consolasSheet) {
    throw new Error(`No se encontró la hoja "${config.consolasNecesariasSheetName}". Asegúrate de crearla.`);
  }
  
  // Obtener configuración de columnas
  
  // Leer todas las consolas usando configuración dinámica
  const lastRow = consolasSheet.getLastRow();
  Logger.log(`Última fila detectada en ConsolasNecesarias: ${lastRow}`);
  
  if (lastRow < 2) {
    throw new Error(`La hoja "ConsolasNecesarias" está vacía. Agrega las consolas que necesitas en las columnas ${config.consolasPrimary} (Primary) y ${config.consolasModel} (Model).`);
  }
  
  // Crear rango dinámico para las columnas Primary y Model
  const dynamicRange = createDynamicRange(2, lastRow, [config.consolasPrimary, config.consolasModel]);
  const data = consolasSheet.getRange(dynamicRange.range).getValues();
  const consolasArray = [];
  
  Logger.log(`Leyendo datos desde ${dynamicRange.range} (${config.consolasPrimary}=${dynamicRange.columnMap[config.consolasPrimary]}, ${config.consolasModel}=${dynamicRange.columnMap[config.consolasModel]})`);
  
  // Cada fila representa una asignación individual
  data.forEach((row, index) => {
    const primary = row[dynamicRange.columnMap[config.consolasPrimary]] ? row[dynamicRange.columnMap[config.consolasPrimary]].toString().trim() : '';
    const model = row[dynamicRange.columnMap[config.consolasModel]] ? row[dynamicRange.columnMap[config.consolasModel]].toString().trim() : '';
    
    Logger.log(`Fila ${index + 2}: Primary="${primary}", Model="${model}"`);
    
    if (primary !== '' && model !== '') {
      consolasArray.push({
        primary: primary,
        model: model,
        consolaKey: `${primary}-${model}`,
        fila: index + 2, // Número de fila en la hoja (para escribir asignación)
        asignada: false // Marcador para saber si ya fue asignada
      });
    } else {
      Logger.log(`⚠️ Fila ${index + 2} omitida por estar vacía`);
    }
  });
  
  Logger.log(`Filas válidas para asignar cargadas: ${consolasArray.length}`);
  
  // Mostrar resumen por tipo de consola
  const conteoTipos = {};
  consolasArray.forEach(item => {
    const key = `${item.primary} - ${item.model}`;
    conteoTipos[key] = (conteoTipos[key] || 0) + 1;
  });
  
  Logger.log('=== RESUMEN DE CONSOLAS A ASIGNAR ===');
  Object.entries(conteoTipos).forEach(([tipo, cantidad]) => {
    Logger.log(`${tipo}: ${cantidad} unidades`);
  });
  
  return consolasArray;
}

/**
 * Contar el total de personas en la hoja (presentes y ausentes)
 */
function getTotalPersonasCount() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const config = getColumnConfiguration();
  const personasSheet = ss.getSheetByName(config.personasSheetName);
  
  if (!personasSheet) {
    return 0;
  }
  
  const lastRow = personasSheet.getLastRow();
  if (lastRow < 2) {
    return 0;
  }
  
  // Leer solo la columna de nombres usando configuración dinámica
  const columnNumber = columnLetterToNumber(config.personasName);
  const nombres = personasSheet.getRange(2, columnNumber, lastRow - 1, 1).getValues();
  return nombres.filter(row => row[0] && row[0].toString().trim() !== '').length;
}

/**
 * Obtener personas y sus consolas/modelos disponibles desde Stash
 * Nueva estructura: Station, Location, POD, Name, Username, Stash
 */
function getPersonas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const config = getColumnConfiguration();
  const personasSheet = ss.getSheetByName(config.personasSheetName);
  
  if (!personasSheet) {
    throw new Error(`No se encontró la hoja "${config.personasSheetName}". Asegúrate de crearla y configurar las columnas.`);
  }
  
  const lastRow = personasSheet.getLastRow();
  if (lastRow < 2) {
    throw new Error(`La hoja "${config.personasSheetName}" está vacía. Agrega al menos una persona.`);
  }
  
  // Crear rango dinámico para todas las columnas necesarias
  const columns = [
    config.personasStation,
    config.personasLocation, 
    config.personasPod,
    config.personasName,
    config.personasUsername,
    config.personasStash,
    config.personasPresente
  ];
  
  const dynamicRange = createDynamicRange(2, lastRow, columns);
  const data = personasSheet.getRange(dynamicRange.range).getValues();
  const personas = [];
  
  Logger.log(`Leyendo personas desde ${dynamicRange.range}`);
  Logger.log(`Mapeo de columnas: Station=${config.personasStation}, Name=${config.personasName}, Stash=${config.personasStash}, Presente=${config.personasPresente}`);
  
  data.forEach(row => {
    const station = row[dynamicRange.columnMap[config.personasStation]] || '';
    const ubicacion = row[dynamicRange.columnMap[config.personasLocation]] || '';
    const pod = row[dynamicRange.columnMap[config.personasPod]] || '';
    const nombre = row[dynamicRange.columnMap[config.personasName]] || '';
    const usuarioEPAM = row[dynamicRange.columnMap[config.personasUsername]] || '';
    const stash = row[dynamicRange.columnMap[config.personasStash]] || '';
    const presente = row[dynamicRange.columnMap[config.personasPresente]];
    
    // Solo incluir personas que tienen nombre Y están presentes
    if (nombre && nombre.toString().trim() !== '' && presente === true) {
      // Procesar el campo Stash para extraer los modelos disponibles
      const modelosDisponibles = [];
      if (stash && stash.toString().trim() !== '') {
        const stashItems = stash.toString().split(',');
        stashItems.forEach(item => {
          const modelo = item.trim();
          if (modelo !== '') {
            modelosDisponibles.push(modelo);
          }
        });
      }
      
      personas.push({
        id: station.toString().trim(),
        ubicacion: ubicacion || '',
        equipo: pod || '',
        nombre: nombre.toString().trim(),
        usuarioEPAM: usuarioEPAM || '',
        modelosDisponibles: modelosDisponibles, // Lista de modelos específicos
        consolas: [] // Se llenará después según las consolas requeridas
      });
    }
  });
  
  return personas;
}

/**
 * Procesar personas para determinar qué consolas pueden usar basado en su Stash
 */
function processPersonasWithRequiredConsoles(personas, consolasArray) {
  // Obtener lista única de todas las combinaciones Primary-Model requeridas
  const requiredConsoles = {};
  consolasArray.forEach(item => {
    const key = item.consolaKey;
    if (!requiredConsoles[key]) {
      requiredConsoles[key] = {
        primary: item.primary,
        model: item.model,
        key: key
      };
    }
  });
  
  // Para cada persona, verificar qué consolas puede usar
  const processedPersonas = personas.map(persona => {
    const consolasQueUsuede = [];
    
    // Revisar cada consola requerida
    Object.values(requiredConsoles).forEach(consola => {
      // Verificar si la persona puede usar esta consola usando matching inteligente
      const puedeUsar = canPersonUseConsole(persona.modelosDisponibles, consola.primary, consola.model);
      
      if (puedeUsar) {
        consolasQueUsuede.push(consola.key);
      }
    });
    
    return {
      ...persona,
      consolas: consolasQueUsuede // Lista de claves de consolas que puede usar
    };
  });
  
  return processedPersonas;
}

/**
 * Determinar si una persona puede usar una consola específica basado en matching inteligente
 */
function canPersonUseConsole(stashItems, primaryConsole, modelConsole) {
  // Normalizar strings para comparación
  const normalize = (str) => str.toLowerCase().trim().replace(/[-_\s]+/g, '');
  const normalizedPrimary = normalize(primaryConsole);
  const normalizedModel = normalize(modelConsole);
  
  Logger.log(`Checking if stash [${stashItems.join(', ')}] can use ${primaryConsole} - ${modelConsole}`);
  
  // === PS4 MATCHING ESPECÍFICO ===
  if (normalizedPrimary === 'ps4') {
    for (const stashItem of stashItems) {
      const normalizedStash = normalize(stashItem);
      
      // PS4 Base Kit: PS4 Base Kit exacto
      if (normalizedModel.includes('basekit')) {
        if (stashItem.toLowerCase().includes('ps4 base kit') || 
            normalizedStash === 'ps4basekit') {
          Logger.log(`✅ PS4 Base Kit match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
      
      // PS4 Pro Kit o PS4 Pro Test Kit: PS4 Pro Kit exacto
      if (normalizedModel.includes('prokit') || (normalizedModel.includes('protestkit'))) {
        if (stashItem.toLowerCase().includes('ps4 pro kit') || 
            normalizedStash === 'ps4prokit') {
          Logger.log(`✅ PS4 Pro Kit match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
      
      // PS4 Dev Kit: PS4 Dev Kit exacto
      if (normalizedModel.includes('devkit')) {
        if (stashItem.toLowerCase().includes('ps4 dev kit') || 
            normalizedStash === 'ps4devkit') {
          Logger.log(`✅ PS4 Dev Kit match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
    }
  }
  
  // === PS5 MATCHING ESPECÍFICO ===
  if (normalizedPrimary === 'ps5') {
    for (const stashItem of stashItems) {
      const normalizedStash = normalize(stashItem);
      
      // PS5 Pro Kit: PS5 Pro Kit exacto
      if (normalizedModel.includes('prokit')) {
        if (stashItem.toLowerCase().includes('ps5 pro kit') || 
            normalizedStash === 'ps5prokit') {
          Logger.log(`✅ PS5 Pro Kit match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
      
      // PS5 Base Kit o PS5 Test Kit: PS5 Base Kit exacto
      if (normalizedModel.includes('testkit') || normalizedModel.includes('basekit')) {
        if (stashItem.toLowerCase().includes('ps5 base kit') || 
            normalizedStash === 'ps5basekit') {
          Logger.log(`✅ PS5 Base/Test Kit match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
      
      // PS5 Dev Kit: PS5 Dev Kit exacto
      if (normalizedModel.includes('devkit')) {
        if (stashItem.toLowerCase().includes('ps5 dev kit') || 
            normalizedStash === 'ps5devkit') {
          Logger.log(`✅ PS5 Dev Kit match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
    }
  }
  
  // === XBOX MATCHING ESPECÍFICO ===
  if (normalizedPrimary === 'xb1') {
    for (const stashItem of stashItems) {
      const normalizedStash = normalize(stashItem);
      
      // XB1 Base Test Kit / S Test Kit (Base Mode): Xbox genérico (preparación futura)
      if (normalizedModel.includes('basetestkit') || normalizedModel.includes('stestkit') || 
          (normalizedModel.includes('testkit') && normalizedModel.includes('base'))) {
        // Cualquier Xbox genérico puede cubrir Base Test Kit
        if (normalizedStash === 'xbox' || normalizedStash === 'xboxone' || 
            (stashItem.toLowerCase().includes('xbox') && !stashItem.toLowerCase().includes('anaconda') && 
             !stashItem.toLowerCase().includes('lockhart') && !stashItem.toLowerCase().includes('x'))) {
          Logger.log(`✅ XB1 Base Test Kit match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
      
      // XB1 Xbox1 X: Xbox One X específico (preparación futura)
      if (normalizedModel.includes('xbox1x') || normalizedModel.includes('xboxonex')) {
        if (stashItem.toLowerCase().includes('xbox1 x') || stashItem.toLowerCase().includes('xbox one x') ||
            stashItem.toLowerCase().includes('xboxonex')) {
          Logger.log(`✅ XB1 Xbox1 X match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
    }
  }
  
  // === XSX MATCHING ESPECÍFICO ===
  if (normalizedPrimary === 'xsx') {
    for (const stashItem of stashItems) {
      const normalizedStash = normalize(stashItem);
      
      // XSX Anaconda: Anaconda específico
      if (normalizedModel.includes('anaconda')) {
        if (normalizedStash === 'anaconda' || stashItem.toLowerCase().includes('anaconda')) {
          Logger.log(`✅ XSX Anaconda match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
      
      // XSX Lockhart: Lockhart específico
      if (normalizedModel.includes('lockhart')) {
        if (normalizedStash === 'lockhart' || stashItem.toLowerCase().includes('lockhart')) {
          Logger.log(`✅ XSX Lockhart match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
    }
  }
  
  // === SWITCH MATCHING ESPECÍFICO ===
  if (normalizedPrimary === 'switch') {
    for (const stashItem of stashItems) {
      const normalizedStash = normalize(stashItem);
      
      // Switch Docked (NO OLED): SOLO Switch normal puede cubrir
      if (normalizedModel.includes('docked') && !normalizedModel.includes('oled')) {
        if (normalizedStash === 'switch' && !stashItem.toLowerCase().includes('oled')) {
          Logger.log(`✅ Switch Docked match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
      
      // Switch Docked - OLED: SOLO Switch Oled puede cubrir esto
      if (normalizedModel.includes('docked') && normalizedModel.includes('oled')) {
        if (normalizedStash === 'switcholed' || stashItem.toLowerCase().includes('switch oled')) {
          Logger.log(`✅ Switch Docked OLED match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
      
      // Switch Undocked (NO OLED): SOLO Switch normal puede cubrir
      if (normalizedModel.includes('undocked') && !normalizedModel.includes('oled')) {
        if (normalizedStash === 'switch' && !stashItem.toLowerCase().includes('oled')) {
          Logger.log(`✅ Switch Undocked match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
      
      // Switch Undocked - OLED: SOLO Switch Oled puede cubrir esto
      if (normalizedModel.includes('undocked') && normalizedModel.includes('oled')) {
        if (normalizedStash === 'switcholed' || stashItem.toLowerCase().includes('switch oled')) {
          Logger.log(`✅ Switch Undocked OLED match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
      
      // Switch Dev Kit: SOLO Switch Dev puede cubrir (preparación futura)
      if (normalizedModel.includes('devkit') || normalizedModel.includes('dev')) {
        if (normalizedStash === 'switchdev' || stashItem.toLowerCase().includes('switch dev')) {
          Logger.log(`✅ Switch Dev Kit match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
    }
  }
  
  // === PC MATCHING ESPECÍFICO ===
  if (normalizedPrimary === 'pc') {
    for (const stashItem of stashItems) {
      const normalizedStash = normalize(stashItem);
      
      // PC Desktop Epic-1: Desktop-Epic (cualquier número)
      if (normalizedModel.includes('desktopepic')) {
        if (normalizedStash.includes('desktopepic') || stashItem.toLowerCase().includes('desktop-epic')) {
          Logger.log(`✅ PC Desktop Epic match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
      
      // PC Desktop Recommended: Desktop-Recommended (cualquier número)
      if (normalizedModel.includes('desktoprecommended')) {
        if (normalizedStash.includes('desktoprecommended') || stashItem.toLowerCase().includes('desktop-recommended')) {
          Logger.log(`✅ PC Desktop Recommended match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
      
      // PC Laptop Recommended -1: Laptop-Recommended 1
      if (normalizedModel.includes('laptoprecommended') && normalizedModel.includes('1')) {
        if (normalizedStash.includes('laptoprecommended1') || stashItem.toLowerCase().includes('laptop-recommended 1')) {
          Logger.log(`✅ PC Laptop Recommended-1 match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
      
      // PC Laptop Recommended -2: Laptop-Recommended 2
      if (normalizedModel.includes('laptoprecommended') && normalizedModel.includes('2')) {
        if (normalizedStash.includes('laptoprecommended2') || stashItem.toLowerCase().includes('laptop-recommended 2')) {
          Logger.log(`✅ PC Laptop Recommended-2 match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
          return true;
        }
      }
    }
  }
  
  // === MOBILE/TABLET MATCHING EXACTO ===
  if (normalizedPrimary === 'android' || normalizedPrimary === 'ios' || normalizedPrimary === 'ipad') {
    for (const stashItem of stashItems) {
      // Matching exacto por nombre de modelo
      const stashLower = stashItem.toLowerCase();
      const modelLower = modelConsole.toLowerCase();
      
      // Casos especiales de normalización
      let normalizedModelForComparison = modelLower;
      
      // iPhone 12 mini → iPhone 12 (unificar)
      if (stashLower.includes('iphone 12 mini') && modelLower.includes('iphone 12') && !modelLower.includes('mini')) {
        Logger.log(`✅ iOS unified match: ${stashItem} → ${primaryConsole} - ${modelConsole} (iPhone 12 mini → iPhone 12)`);
        return true;
      }
      
      // Matching directo
      if (stashLower.includes(modelLower) || modelLower.includes(stashLower)) {
        Logger.log(`✅ Mobile/Tablet exact match: ${stashItem} → ${primaryConsole} - ${modelConsole}`);
        return true;
      }
    }
  }
  
  Logger.log(`❌ No specific match found for ${primaryConsole} - ${modelConsole}`);
  return false;
}

/**
 * Asignar personas directamente a cada fila en ConsolasNecesarias
 */
function assignDirectlyToSheet(personasElegibles, consolasArray) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const config = getColumnConfiguration();
  const consolasSheet = ss.getSheetByName(config.consolasNecesariasSheetName);
  
  if (!consolasSheet) {
    throw new Error(`No se encontró la hoja "${config.consolasNecesariasSheetName}".`);
  }
  
  const personasUsadas = new Set();
  const asignaciones = [];
  let totalAsignadas = 0;
  
  Logger.log(`=== INICIANDO ASIGNACIÓN DE ${consolasArray.length} FILAS ===`);
  
  // Nota: No se crean headers automáticamente - deben estar configurados manualmente
  
  // Agrupar consolas por tipo para priorizar las más limitadas
  const consolasPorTipo = {};
  consolasArray.forEach(consola => {
    if (!consolasPorTipo[consola.consolaKey]) {
      consolasPorTipo[consola.consolaKey] = [];
    }
    consolasPorTipo[consola.consolaKey].push(consola);
  });
  
  // Calcular disponibilidad y ordenar por limitación (menos candidatos primero)
  const tiposOrdenados = Object.keys(consolasPorTipo)
    .map(key => {
      const candidatos = personasElegibles.filter(p => p.consolas.includes(key));
      return {
        key: key,
        filas: consolasPorTipo[key],
        candidatos: candidatos.length
      };
    })
    .sort((a, b) => a.candidatos - b.candidatos); // Menos candidatos primero
  
  Logger.log('=== ORDEN DE PRIORIDAD POR LIMITACIÓN ===');
  tiposOrdenados.forEach(tipo => {
    Logger.log(`${tipo.key}: ${tipo.candidatos} candidatos para ${tipo.filas.length} filas`);
  });
  
  // Procesar cada tipo de consola en orden de prioridad
  for (const tipo of tiposOrdenados) {
    const consolaKey = tipo.key;
    const filasDelTipo = tipo.filas;
    
    Logger.log(`\n--- Procesando ${consolaKey} (${filasDelTipo.length} filas) ---`);
    
    // Obtener candidatos disponibles para esta consola
    const candidatos = personasElegibles.filter(persona => 
      persona.consolas.includes(consolaKey) && !personasUsadas.has(persona.nombre)
    );
    
    Logger.log(`Candidatos disponibles: ${candidatos.length}`);
    
    if (candidatos.length === 0) {
      Logger.log(`⚠️ No hay candidatos disponibles para ${consolaKey}`);
      continue;
    }
    
    // Si hay menos candidatos que filas, intentar asignar los disponibles
    const filasAAsignar = Math.min(filasDelTipo.length, candidatos.length);
    
    if (filasDelTipo.length > candidatos.length) {
      Logger.log(`⚠️ Solo ${candidatos.length} candidatos disponibles para ${filasDelTipo.length} filas de ${consolaKey}`);
      Logger.log(`Se asignarán ${filasAAsignar} filas, quedarán ${filasDelTipo.length - filasAAsignar} sin asignar`);
    }
    
    // Calcular distribución equitativa por ubicación para las filas disponibles
    const distribuciones = calculateLocationDistributionNew(candidatos, filasAAsignar);
    Logger.log('Distribuciones calculadas:', distribuciones);
    
    // Crear lista final de personas seleccionadas respetando distribución geográfica
    const personasSeleccionadas = [];
    
    for (const [ubicacion, cantidad] of Object.entries(distribuciones)) {
      if (cantidad === 0) continue;
      
      const candidatosUbicacion = candidatos.filter(p => p.ubicacion === ubicacion);
      const seleccionados = shuffleArray([...candidatosUbicacion]).slice(0, cantidad);
      
      Logger.log(`Seleccionando ${seleccionados.length} de ${ubicacion} para ${consolaKey}`);
      personasSeleccionadas.push(...seleccionados);
    }
    
    // Asignar a cada fila de este tipo de consola (hasta donde tengamos personas)
    const filasAsignadas = Math.min(filasDelTipo.length, personasSeleccionadas.length);
    
    // Obtener configuración para escribir resultados
    const config = getColumnConfiguration();
    
    for (let i = 0; i < filasAsignadas; i++) {
      const consolaFila = filasDelTipo[i];
      const persona = personasSeleccionadas[i];
      
      // Escribir asignación usando configuración dinámica
      const outputData = [
        [persona.id],           // Station
        [persona.ubicacion],    // Location  
        [persona.equipo],       // POD
        [persona.nombre],       // Name
        [persona.usuarioEPAM]   // Username
      ];
      
      const outputColumns = [
        config.consolasStationOut,
        config.consolasLocationOut,
        config.consolasPodOut,
        config.consolasNameOut,
        config.consolasUsernameOut
      ];
      
      // Escribir cada columna individualmente para manejar columnas no contiguas
      outputColumns.forEach((column, index) => {
        const columnNumber = columnLetterToNumber(column);
        consolasSheet.getRange(consolaFila.fila, columnNumber, 1, 1).setValues([outputData[index]]);
      });
      
      // Marcar persona como usada
      personasUsadas.add(persona.nombre);
      consolaFila.asignada = true;
      totalAsignadas++;
      
      asignaciones.push({
        fila: consolaFila.fila,
        consola: `${consolaFila.primary} - ${consolaFila.model}`,
        persona: persona
      });
      
      Logger.log(`✅ Fila ${consolaFila.fila}: ${persona.nombre} → ${consolaFila.primary} - ${consolaFila.model}`);
    }
    
    // Reportar filas no asignadas de este tipo
    const filasNoAsignadas = filasDelTipo.length - filasAsignadas;
    if (filasNoAsignadas > 0) {
      Logger.log(`⚠️ ${filasNoAsignadas} filas de ${consolaKey} quedaron sin asignar por falta de candidatos`);
    }
  }
  
  // Contar filas totales sin asignar
  const filasNoAsignadas = consolasArray.filter(c => !c.asignada);
  
  Logger.log(`\n=== RESULTADO FINAL ===`);
  Logger.log(`Total filas en ConsolasNecesarias: ${consolasArray.length}`);
  Logger.log(`Filas asignadas exitosamente: ${totalAsignadas}`);
  Logger.log(`Filas sin asignar: ${filasNoAsignadas.length}`);
  Logger.log(`Personas utilizadas: ${personasUsadas.size}`);
  Logger.log(`Personas disponibles sin usar: ${personasElegibles.length - personasUsadas.size}`);
  
  if (filasNoAsignadas.length > 0) {
    Logger.log('\n=== FILAS SIN ASIGNAR ===');
    filasNoAsignadas.forEach(fila => {
      Logger.log(`Fila ${fila.fila}: ${fila.primary} - ${fila.model} (sin candidatos disponibles)`);
    });
  }
  
  return {
    totalAsignadas: totalAsignadas,
    totalFilas: consolasArray.length,
    filasNoAsignadas: filasNoAsignadas.length,
    personasUsadas: personasUsadas,
    asignaciones: asignaciones
  };
}

/**
 * Configurar headers en ConsolasNecesarias si no existen
 */
function setupHeaders(consolasSheet) {
  // Verificar si ya existen headers en la fila 1
  const headerRange = consolasSheet.getRange('A1:G1');
  const headers = headerRange.getValues()[0];
  
  // Si no hay headers completos, configurarlos
  if (!headers[2] || !headers[3] || !headers[4] || !headers[5] || !headers[6]) {
    const newHeaders = ['Primary', 'Model', 'Station', 'Location', 'POD', 'Name', 'Username'];
    consolasSheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
    
    // Formatear headers
    const headerRange = consolasSheet.getRange(1, 1, 1, newHeaders.length);
    headerRange.setBackground('#4CAF50');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    
    Logger.log('Headers configurados en ConsolasNecesarias');
  }
}

/**
 * Crear resumen de backup con personas no asignadas
 */
function createBackupSummaryNew(personasUsadas, personasElegibles) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const config = getColumnConfiguration();
  let backupSheet = ss.getSheetByName(config.personasNoAsignadasSheetName);
  
  // Crear hoja si no existe
  if (!backupSheet) {
    backupSheet = ss.insertSheet(config.personasNoAsignadasSheetName);
  } else {
    backupSheet.clear();
  }
  
  // Headers para backup
  const headers = ['Nombre', 'Ubicación', 'Equipo', 'Usuario EPAM', 'Consolas Disponibles'];
  backupSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatear headers
  const headerRange = backupSheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#FF9800');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  
  // Encontrar personas no asignadas
  const personasNoAsignadas = personasElegibles.filter(p => !personasUsadas.has(p.nombre));
  
  if (personasNoAsignadas.length > 0) {
    // Preparar datos de backup
    const backupData = personasNoAsignadas.map(persona => [
      persona.nombre,
      persona.ubicacion,
      persona.equipo,
      persona.usuarioEPAM,
      persona.modelosDisponibles.join(', ')
    ]);
    
    // Escribir datos
    backupSheet.getRange(2, 1, backupData.length, headers.length).setValues(backupData);
    
    // Alternar colores de filas
    for (let i = 2; i <= backupData.length + 1; i++) {
      if (i % 2 === 0) {
        backupSheet.getRange(i, 1, 1, headers.length).setBackground('#FFF3E0');
      }
    }
  } else {
    backupSheet.getRange(2, 1, 1, headers.length).setValues([['🎉 ¡Todas las personas elegibles han sido asignadas!', '', '', '', '']]);
  }
  
  // Autoajustar columnas
  backupSheet.autoResizeColumns(1, headers.length);
  
  Logger.log(`Hoja de backup creada con ${personasNoAsignadas.length} personas no asignadas`);
}

/**
 * Mostrar resultados de asignación directa
 */
function showResultsInline(result) {
  const porcentajeAsignado = result.totalFilas > 0 ? ((result.totalAsignadas / result.totalFilas) * 100).toFixed(1) : 0;
  
  let message = `✅ ¡Proceso de asignación completado!\n\n`;
  message += `📊 ESTADÍSTICAS:\n`;
  message += `• Total de filas en ConsolasNecesarias: ${result.totalFilas}\n`;
  message += `• Filas asignadas exitosamente: ${result.totalAsignadas}\n`;
  message += `• Filas sin asignar: ${result.filasNoAsignadas}\n`;
  message += `• Porcentaje de éxito: ${porcentajeAsignado}%\n\n`;
  message += `👥 PERSONAS (SOLO PRESENTES):\n`;
  message += `• Personas presentes utilizadas: ${result.personasUsadas.size}\n`;
  message += `• Personas presentes disponibles en backup: disponibles en hoja "PersonasNoAsignadas"\n\n`;
  
  if (result.filasNoAsignadas > 0) {
    message += `⚠️ ATENCIÓN:\n`;
    message += `${result.filasNoAsignadas} filas no pudieron ser asignadas porque no hay personas presentes con las consolas requeridas en su Stash.\n\n`;
  }
  
  // Obtener configuración para mostrar en el mensaje
  const config = getColumnConfiguration();
  const outputColumns = [
    config.consolasStationOut,
    config.consolasLocationOut,
    config.consolasPodOut,
    config.consolasNameOut,
    config.consolasUsernameOut
  ].join(', ');
  
  message += `📋 Las asignaciones se han escrito en ConsolasNecesarias (columnas ${outputColumns}).\n`;
  message += `🔍 Revisa los logs de ejecución para detalles específicos.\n\n`;
  
  // Obtener configuración para mostrar columna de presentismo
  const configPresente = getColumnConfiguration();
  message += `✅ PRESENTISMO: Solo se consideraron personas marcadas como presentes en la columna ${configPresente.personasPresente} de la hoja Personas.`;
  
  const titulo = result.filasNoAsignadas === 0 ? 'Asignación Completa' : 'Asignación Parcial';
  
  SpreadsheetApp.getUi().alert(titulo, message, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Validar que la configuración sea válida
 */
function validateConfiguration(config, personas) {
  const totalConsolas = Object.values(config).reduce((sum, count) => sum + count, 0);
  
  if (totalConsolas === 0) {
    throw new Error('Debes agregar al menos una consola en la hoja "ConsolasNecesarias".');
  }
  
  if (totalConsolas > personas.length) {
    throw new Error(`No puedes asignar ${totalConsolas} consolas. Solo hay ${personas.length} personas disponibles.`);
  }
  
  // Validar límites por consola
  for (const [consola, cantidad] of Object.entries(config)) {
    if (cantidad > 0) {
      const personasParaConsola = personas.filter(p => p.consolas.includes(consola));
      if (personasParaConsola.length < cantidad) {
        throw new Error(`Solo ${personasParaConsola.length} personas pueden usar ${consola}, pero necesitas asignar ${cantidad}.`);
      }
    }
  }
}

// ==========================================================================
// ALGORITMO DE ASIGNACIÓN INTELIGENTE
// ==========================================================================

/**
 * Crear asignaciones inteligentes con distribución equitativa por ubicación
 */
function createSmartAssignments(config, personas, consolasArray) {
  const assignments = {};
  const usedPeople = new Set();
  const usedSlots = new Set();
  
  // Calcular distribución por ubicación
  const locationDistribution = calculateLocationDistribution(personas, consolasArray.length);
  
  // Obtener orden inteligente: consolas con menos personas disponibles primero
  const consoleOrder = getSmartConsoleOrder(config, personas);
  
  // Procesar cada consola en orden de prioridad
  for (const consoleName of consoleOrder) {
    const neededCount = config[consoleName] || 0;
    if (neededCount === 0) continue;
    
    assignments[consoleName] = [];
    
    // Obtener personas disponibles para esta consola que no han sido usadas
    const availablePeople = personas
      .filter(persona => persona.consolas.includes(consoleName))
      .filter(persona => !usedPeople.has(persona.nombre));
    
    // Verificar que hay suficientes personas disponibles
    if (availablePeople.length < neededCount) {
      throw new Error(`No hay suficientes personas disponibles para ${consoleName}. Necesitas ${neededCount}, pero solo hay ${availablePeople.length} disponibles.`);
    }
    
    // Seleccionar personas con distribución equitativa por ubicación
    const selectedPeople = selectPeopleWithLocationBalance(availablePeople, neededCount, locationDistribution, usedPeople);
    
    // Asignar personas a esta consola
    let assignmentCount = 0;
    for (const consolaItem of consolasArray) {
      if (consolaItem.consola === consoleName && !usedSlots.has(consolaItem.fila)) {
        if (assignmentCount < selectedPeople.length) {
          const persona = selectedPeople[assignmentCount];
          
          assignments[consoleName].push({
            consola: consoleName,
            persona: persona,
            numero: assignmentCount + 1,
            fila: consolaItem.fila,
            consolasDisponibles: persona.consolas.join(', ')
          });
          
          usedPeople.add(persona.nombre);
          usedSlots.add(consolaItem.fila);
          assignmentCount++;
        }
      }
    }
  }
  
  return assignments;
}

/**
 * Calcular distribución equitativa por ubicación para nuevo sistema
 */
function calculateLocationDistributionNew(candidatos, cantidadTotal) {
  // Contar candidatos por ubicación
  const ubicacionCounts = {};
  candidatos.forEach(candidato => {
    const ubicacion = candidato.ubicacion || 'Sin Ubicación';
    ubicacionCounts[ubicacion] = (ubicacionCounts[ubicacion] || 0) + 1;
  });
  
  const totalCandidatos = candidatos.length;
  const distribuciones = {};
  
  // Calcular proporción ideal para cada ubicación
  Object.keys(ubicacionCounts).forEach(ubicacion => {
    const candidatosUbicacion = ubicacionCounts[ubicacion];
    const proporcion = candidatosUbicacion / totalCandidatos;
    const cantidadIdeal = Math.round(cantidadTotal * proporcion);
    
    distribuciones[ubicacion] = Math.min(cantidadIdeal, candidatosUbicacion, cantidadTotal);
  });
  
  // Ajustar para que la suma sea exacta
  let totalAsignado = Object.values(distribuciones).reduce((sum, val) => sum + val, 0);
  
  while (totalAsignado !== cantidadTotal && totalAsignado < cantidadTotal) {
    // Necesitamos más asignaciones: agregar a ubicaciones que tienen capacidad
    const ubicacionesConCapacidad = Object.keys(distribuciones)
      .filter(ubicacion => distribuciones[ubicacion] < ubicacionCounts[ubicacion])
      .sort((a, b) => ubicacionCounts[b] - ubicacionCounts[a]); // Mayor capacidad primero
    
    if (ubicacionesConCapacidad.length === 0) break;
    
    distribuciones[ubicacionesConCapacidad[0]]++;
    totalAsignado++;
  }
  
  while (totalAsignado > cantidadTotal) {
    // Necesitamos menos asignaciones: quitar de ubicaciones con más asignaciones
    const ubicacionesConAsignaciones = Object.keys(distribuciones)
      .filter(ubicacion => distribuciones[ubicacion] > 0)
      .sort((a, b) => distribuciones[b] - distribuciones[a]); // Mayor cantidad primero
    
    if (ubicacionesConAsignaciones.length === 0) break;
    
    distribuciones[ubicacionesConAsignaciones[0]]--;
    totalAsignado--;
  }
  
  return distribuciones;
}

/**
 * Escribir resultados en las hojas de Google Sheets
 */
function writeResultsNew(asignaciones, asignacionesBackup) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Escribir asignaciones principales
  writeMainAssignments(ss, asignaciones);
  
  // Escribir asignaciones de backup
  writeBackupAssignments(ss, asignacionesBackup);
  
  Logger.log('Resultados escritos exitosamente en las hojas');
}

/**
 * Escribir asignaciones principales
 */
function writeMainAssignments(ss, asignaciones) {
  let resultSheet = ss.getSheetByName('Asignaciones');
  
  if (!resultSheet) {
    resultSheet = ss.insertSheet('Asignaciones');
  } else {
    resultSheet.clear();
  }
  
  // Headers
  const headers = ['Orden', 'Consola', 'Primary', 'Model', 'Nombre', 'Ubicación', 'Equipo', 'Usuario EPAM', 'Modelos Disponibles'];
  resultSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatear headers
  const headerRange = resultSheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4CAF50');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  
  if (asignaciones.length > 0) {
    // Datos
    const data = asignaciones.map(asignacion => [
      asignacion.orden,
      asignacion.consola,
      asignacion.primary,
      asignacion.model,
      asignacion.nombre,
      asignacion.ubicacion,
      asignacion.equipo,
      asignacion.usuarioEPAM,
      asignacion.modelosDisponibles || ''
    ]);
    
    resultSheet.getRange(2, 1, data.length, headers.length).setValues(data);
    
    // Alternar colores de filas
    for (let i = 2; i <= data.length + 1; i++) {
      if (i % 2 === 0) {
        resultSheet.getRange(i, 1, 1, headers.length).setBackground('#F5F5F5');
      }
    }
  }
  
  // Autoajustar columnas
  resultSheet.autoResizeColumns(1, headers.length);
}

/**
 * Escribir asignaciones de backup
 */
function writeBackupAssignments(ss, asignacionesBackup) {
  let backupSheet = ss.getSheetByName('Backup');
  
  if (!backupSheet) {
    backupSheet = ss.insertSheet('Backup');
  } else {
    backupSheet.clear();
  }
  
  // Headers
  const headers = ['Orden', 'Consolas Disponibles', 'Nombre', 'Ubicación', 'Equipo', 'Usuario EPAM', 'Modelos en Stash'];
  backupSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatear headers
  const headerRange = backupSheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#FF9800');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  
  if (asignacionesBackup.length > 0) {
    // Datos
    const data = asignacionesBackup.map(backup => [
      backup.orden,
      backup.consola,
      backup.nombre,
      backup.ubicacion,
      backup.equipo,
      backup.usuarioEPAM,
      backup.modelosDisponibles || ''
    ]);
    
    backupSheet.getRange(2, 1, data.length, headers.length).setValues(data);
    
    // Alternar colores de filas
    for (let i = 2; i <= data.length + 1; i++) {
      if (i % 2 === 0) {
        backupSheet.getRange(i, 1, 1, headers.length).setBackground('#FFF3E0');
      }
    }
  }
  
  // Autoajustar columnas
  backupSheet.autoResizeColumns(1, headers.length);
}

/**
 * Mostrar resultados al usuario
 */
function showResults(result) {
  if (result.success) {
    const message = `✅ ¡Asignación completada!\n\n` +
                   `📋 Asignaciones principales: ${result.asignaciones}\n` +
                   `🔄 Lista de backup: ${result.backup}\n\n` +
                   `Revisa las hojas "Asignaciones" y "Backup" para ver los detalles.`;
    
    SpreadsheetApp.getUi().alert('Asignación Exitosa', message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Seleccionar personas manteniendo balance por ubicación con mismo porcentaje de participación
 */
function selectPeopleWithLocationBalance(availablePeople, neededCount, locationDistribution, usedPeople) {
  const selectedPeople = [];
  const peopleByLocation = {};
  
  // Agrupar personas disponibles por ubicación
  availablePeople.forEach(persona => {
    const location = persona.ubicacion || 'Sin Ubicación';
    if (!peopleByLocation[location]) {
      peopleByLocation[location] = [];
    }
    peopleByLocation[location].push(persona);
  });
  
  // Randomizar personas dentro de cada ubicación
  Object.keys(peopleByLocation).forEach(location => {
    peopleByLocation[location] = shuffleArray(peopleByLocation[location]);
  });
  
  // Calcular cuántas personas ya han sido asignadas por ubicación
  const currentAssignedByLocation = {};
  Object.keys(locationDistribution).forEach(location => {
    currentAssignedByLocation[location] = 0;
  });
  
  // Contar personas ya asignadas por ubicación
  Array.from(usedPeople).forEach(personName => {
    // Buscar la ubicación de esta persona en availablePeople o en todas las personas
    const foundPerson = availablePeople.find(p => p.nombre === personName);
    if (foundPerson) {
      const location = foundPerson.ubicacion || 'Sin Ubicación';
      currentAssignedByLocation[location] = (currentAssignedByLocation[location] || 0) + 1;
    }
  });
  
  // Calcular cuántas personas necesitamos de cada ubicación para esta consola
  const locationNeeds = {};
  let totalNeeded = 0;
  
  Object.keys(locationDistribution).forEach(location => {
    const dist = locationDistribution[location];
    const alreadyAssigned = currentAssignedByLocation[location] || 0;
    const stillNeeded = Math.max(0, dist.idealSlots - alreadyAssigned);
    
    // Para esta consola específica, calcular proporcionalmente
    const proportion = neededCount / Object.values(locationDistribution).reduce((sum, d) => sum + Math.max(0, d.idealSlots - (currentAssignedByLocation[d] || 0)), 0);
    
    locationNeeds[location] = Math.min(
      Math.round(stillNeeded * proportion),
      peopleByLocation[location] ? peopleByLocation[location].length : 0
    );
    
    totalNeeded += locationNeeds[location];
  });
  
  // Ajustar si la suma no coincide exactamente
  let diff = neededCount - totalNeeded;
  const availableLocations = Object.keys(peopleByLocation).filter(loc => 
    peopleByLocation[loc].length > locationNeeds[loc]
  );
  
  // Distribuir la diferencia priorizando ubicaciones que están por debajo de su objetivo
  while (diff !== 0 && availableLocations.length > 0) {
    for (const location of availableLocations) {
      if (diff === 0) break;
      
      const currentAssigned = currentAssignedByLocation[location] || 0;
      const target = locationDistribution[location].idealSlots;
      const isUnderTarget = (currentAssigned + locationNeeds[location]) < target;
      
      if (diff > 0 && peopleByLocation[location].length > locationNeeds[location]) {
        // Priorizar ubicaciones que están por debajo de su objetivo
        if (isUnderTarget || availableLocations.every(loc => {
          const locAssigned = currentAssignedByLocation[loc] || 0;
          const locTarget = locationDistribution[loc].idealSlots;
          return (locAssigned + locationNeeds[loc]) >= locTarget;
        })) {
          locationNeeds[location]++;
          diff--;
        }
      } else if (diff < 0 && locationNeeds[location] > 0) {
        locationNeeds[location]--;
        diff++;
      }
    }
    
    // Evitar bucle infinito
    if (availableLocations.every(loc => peopleByLocation[loc].length <= locationNeeds[loc])) {
      break;
    }
  }
  
  // Seleccionar personas según las necesidades calculadas
  Object.keys(locationNeeds).forEach(location => {
    if (peopleByLocation[location]) {
      const needed = Math.min(locationNeeds[location], peopleByLocation[location].length);
      selectedPeople.push(...peopleByLocation[location].slice(0, needed));
    }
  });
  
  // Si aún necesitamos más personas, tomar de cualquier ubicación disponible
  while (selectedPeople.length < neededCount) {
    let personaAdded = false;
    for (const location of Object.keys(peopleByLocation)) {
      if (selectedPeople.length >= neededCount) break;
      
      const available = peopleByLocation[location].filter(p => !selectedPeople.includes(p));
      if (available.length > 0) {
        selectedPeople.push(available[0]);
        personaAdded = true;
        break;
      }
    }
    
    if (!personaAdded) break; // No hay más personas disponibles
  }
  
  return shuffleArray(selectedPeople.slice(0, neededCount));
}

/**
 * Obtener orden inteligente de consolas (limitadas primero)
 */
function getSmartConsoleOrder(config, personas) {
  const consolasConCantidad = Object.entries(config)
    .filter(([consola, cantidad]) => cantidad > 0)
    .map(([consola, cantidad]) => {
      const personasDisponibles = personas.filter(p => p.consolas.includes(consola)).length;
      return {
        nombre: consola,
        cantidad: cantidad,
        personasDisponibles: personasDisponibles
      };
    });
  
  // Ordenar por menos personas disponibles (más limitadas primero)
  consolasConCantidad.sort((a, b) => a.personasDisponibles - b.personasDisponibles);
  
  return consolasConCantidad.map(c => c.nombre);
}

/**
 * Mezclar array aleatoriamente (Fisher-Yates)
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
// FUNCIONES DE ESCRITURA DE RESULTADOS
// ==========================================================================

/**
 * Escribir resultados directamente en la hoja ConsolasNecesarias
 * Estructura: Plataforma, Kit/Modelo, Perfil, ID, Ubicación, Equipo, Nombre, Usuario EPAM
 * Escribimos en columnas D-I (ID, Ubicación, Equipo, Nombre, Usuario EPAM)
 */
function writeResults(assignments, personas) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const config = getColumnConfiguration();
  const consolasSheet = ss.getSheetByName(config.consolasNecesariasSheetName);
  
  if (!consolasSheet) {
    throw new Error(`No se encontró la hoja "${config.consolasNecesariasSheetName}".`);
  }
  
  // Procesar todas las asignaciones
  Object.values(assignments).forEach(consoleAssignments => {
    consoleAssignments.forEach(assignment => {
      const persona = assignment.persona;
      const fila = assignment.fila;
      
      // Escribir los datos de la persona en las columnas D-I (ID, Ubicación, Equipo, Nombre, Usuario EPAM)
      consolasSheet.getRange(fila, 4, 1, 5).setValues([[
        persona.id,
        persona.ubicacion,
        persona.equipo,
        persona.nombre,
        persona.usuarioEPAM
      ]]);
    });
  });
  
  // Crear resumen de backup en una nueva hoja o al final
  createBackupSummary(assignments, personas);
}

/**
 * Crear resumen de personas no asignadas con distribución por ubicación
 */
function createBackupSummary(assignments, personas) { 
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const config = getColumnConfiguration();
  let backupSheet = ss.getSheetByName(config.personasNoAsignadasSheetName);
  
  // Crear hoja si no existe
  if (!backupSheet) {
    backupSheet = ss.insertSheet(config.personasNoAsignadasSheetName);
    // Nota: No se crean headers automáticamente - deben estar configurados manualmente
  } else {
    // Limpiar contenido previo manteniendo headers si existen
    const lastRow = backupSheet.getLastRow();
    if (lastRow > 1) {
      const columnsToCheck = [config.personasNoAsignadasSheet, config.personasNoAsignadasName];
      const maxColumn = Math.max(...columnsToCheck.map(col => columnLetterToNumber(col)));
      backupSheet.getRange(2, 1, lastRow - 1, maxColumn).clearContent();
    }
  }
  
  // Obtener personas asignadas
  const assignedPeople = new Set();
  Object.values(assignments).forEach(consoleAssignments => {
    consoleAssignments.forEach(assignment => {
      assignedPeople.add(assignment.persona.nombre);
    });
  });
  
  // Encontrar personas no asignadas
  const backupPeople = personas.filter(persona => !assignedPeople.has(persona.nombre));
  
  // Preparar datos para escribir
  const backupData = [];
  
  if (backupPeople.length > 0) {
    // Agrupar por ubicación para mejor visualización
    const peopleByLocation = {};
    backupPeople.forEach(persona => {
      const location = persona.ubicacion || 'Sin Ubicación';
      if (!peopleByLocation[location]) {
        peopleByLocation[location] = [];
      }
      peopleByLocation[location].push(persona);
    });
    
    // Ordenar por ubicación y agregar datos
    Object.keys(peopleByLocation).sort().forEach(location => {
      peopleByLocation[location].forEach(persona => {
        backupData.push([
          persona.nombre,
          persona.ubicacion || 'Sin Ubicación',
          persona.usuarioEPAM,
          persona.consolas.join(', ')
        ]);
      });
    });
    
    // Escribir backup
    backupSheet.getRange(2, 1, backupData.length, 4).setValues(backupData);
  } else {
    backupSheet.getRange(2, 1, 1, 4).setValues([['🎉 ¡Todas las personas han sido asignadas!', '', '', '']]);
  }
}

/**
 * Mostrar estadísticas de distribución por ubicación con porcentaje de participación uniforme
 */
function showLocationStatistics(assignments, personas) {
  const locationStats = {};
  const totalAssigned = Object.values(assignments).reduce((count, consoleAssignments) => count + consoleAssignments.length, 0);
  const totalPeople = personas.length;
  const globalParticipationRate = ((totalAssigned / totalPeople) * 100).toFixed(1);
  
  // Inicializar contadores
  personas.forEach(persona => {
    const location = persona.ubicacion || 'Sin Ubicación';
    if (!locationStats[location]) {
      locationStats[location] = { total: 0, assigned: 0 };
    }
    locationStats[location].total++;
  });
  
  // Contar asignados por ubicación
  Object.values(assignments).forEach(consoleAssignments => {
    consoleAssignments.forEach(assignment => {
      const location = assignment.persona.ubicacion || 'Sin Ubicación';
      if (locationStats[location]) {
        locationStats[location].assigned++;
      }
    });
  });
  
  // Crear mensaje de estadísticas
  let mensaje = `📊 Distribución Equitativa por Ubicación\n`;
  mensaje += `🎯 Objetivo: ${globalParticipationRate}% de participación por ubicación\n\n`;
  
  Object.keys(locationStats).sort().forEach(location => {
    const stats = locationStats[location];
    const locationParticipationRate = stats.total > 0 ? ((stats.assigned / stats.total) * 100).toFixed(1) : 0;
    const globalPercentage = totalAssigned > 0 ? ((stats.assigned / totalAssigned) * 100).toFixed(1) : 0;
    const variance = Math.abs(locationParticipationRate - globalParticipationRate).toFixed(1);
    
    mensaje += `📍 ${location}:\n`;
    mensaje += `   • ${stats.assigned}/${stats.total} personas\n`;
    mensaje += `   • ${locationParticipationRate}% de participación (objetivo: ${globalParticipationRate}%)\n`;
    mensaje += `   • Variación: ${variance}%\n`;
    mensaje += `   • ${globalPercentage}% del total de asignaciones\n\n`;
  });
  
  // Calcular variación promedio
  const variations = Object.keys(locationStats).map(location => {
    const stats = locationStats[location];
    const locationRate = stats.total > 0 ? (stats.assigned / stats.total) * 100 : 0;
    return Math.abs(locationRate - parseFloat(globalParticipationRate));
  });
  
  const avgVariation = variations.length > 0 ? (variations.reduce((sum, v) => sum + v, 0) / variations.length).toFixed(1) : 0;
  mensaje += `📈 Variación promedio: ${avgVariation}%\n`;
  mensaje += `${avgVariation <= 5 ? '✅ Distribución muy equilibrada' : avgVariation <= 10 ? '⚠️ Distribución aceptable' : '❌ Distribución desbalanceada'}`;
  
  SpreadsheetApp.getUi().alert('📊 Estadísticas de Participación Equitativa', mensaje, SpreadsheetApp.getUi().ButtonSet.OK);
}

// ==========================================================================
// FUNCIONES DE ESCRITURA DE RESULTADOS
// ==========================================================================
