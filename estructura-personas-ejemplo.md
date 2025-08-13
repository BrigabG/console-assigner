# Estructura de la Hoja "Personas" - Nueva Versión

## Columnas Requeridas

La hoja "Personas" debe tener las siguientes columnas en este orden exacto:

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **ID** | **Ubicación** | **Equipo** | **Nombre** | **Usuario EPAM** | **PC** | **PS4** | **PS5** | **Xbox** | **Switch** | **iOS** | **Android** |

## Ejemplo de Datos

```
ID     | Ubicación | Equipo    | Nombre          | Usuario EPAM | PC | PS4 | PS5 | Xbox | Switch | iOS | Android
-------|-----------|-----------|-----------------|--------------|----|----|-----|------|--------|----|--------
001    | Madrid    | QA Team   | Juan Pérez      | juan.perez   | 1  | 1   | 0   | 1    | 0      | 1   | 0
002    | Barcelona | Dev Team  | María García    | maria.garcia | 1  | 0   | 1   | 0    | 1      | 0   | 1
003    | Valencia  | QA Team   | Carlos López    | carlos.lopez | 0  | 1   | 1   | 1    | 0      | 0   | 0
004    | Madrid    | Dev Team  | Ana Martín      | ana.martin   | 1  | 1   | 1   | 1    | 1      | 1   | 1
```

## Notas Importantes

1. **Valores de Consolas**: Usar `1` para indicar que la persona puede usar esa consola, `0` para indicar que no.
2. **Campos Opcionales**: Los campos ID, Ubicación, Equipo y Usuario EPAM pueden estar vacíos, pero es recomendable completarlos.
3. **Nombre Obligatorio**: El campo Nombre es obligatorio para que la persona sea considerada en las asignaciones.
4. **Al menos una consola**: Cada persona debe tener al menos una consola marcada con `1`.

## Cambios Principales

- ✅ Agregadas columnas: ID, Ubicación, Equipo, Usuario EPAM
- ✅ Eliminada columna "Activo" (todas las personas con nombre son consideradas activas)
- ✅ Los resultados se escriben directamente en la hoja "ConsolasNecesarias"
- ✅ Nueva hoja "PersonasNoAsignadas" para backup automático
- ✅ Compatibilidad con estructura extendida de base de datos
