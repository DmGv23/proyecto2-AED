# Proyecto 2 – QuadTree: Simulador de Partículas 2D

**CS2023 – Algoritmos y Estructuras de Datos**

## Descripción

Simulador 2D de partículas en movimiento que utiliza un **QuadTree implementado desde cero** para detectar colisiones y consultar vecinos de forma eficiente, comparado contra una solución de **fuerza bruta O(n²)**.

## Estructura del proyecto

```
proyecto2-AED-main/
├── index.html                  # Interfaz principal
├── style.css                   # Estilos
├── main.js                     # Punto de entrada y ciclo principal
├── structures/
│   ├── QuadTree.js             # Implementación del QuadTree
│   ├── QuadNode.js             # Nodo del QuadTree
│   └── Rectangle.js            # Región rectangular (AABB)
├── simulation/
│   ├── Simulation.js           # Control de la simulación
│   └── Particle.js             # Modelo de partícula
├── algorithms/
│   ├── CollisionDetector.js    # Detección de colisiones (QT y bruta)
│   └── Inspector.js            # Modo de inspección de región
├── benchmark/
│   └── Benchmark.js            # Comparación experimental
├── rendering/
│   └── Renderer.js             # Dibujado en canvas
└── utils/
    ├── Constants.js            # Constantes globales
    ├── MathUtils.js            # Utilidades matemáticas
    └── RandomGenerator.js      # Generadores de distribuciones
```

## Cómo ejecutar

El proyecto es una aplicación web que usa **ES Modules** (`type="module"`), por lo que **no puede abrirse directamente con doble clic** en el archivo HTML — el navegador bloquea los módulos en `file://`. Se necesita un servidor local:

### Opción 1: Node.js (recomendada)

```bash
# Instalar una vez si no lo tienes
npm install -g serve

# Desde la carpeta del proyecto
serve .
```

Luego abrir `http://localhost:3000` en el navegador.

### Opción 2: Python

```bash
# Python 3
python -m http.server 8080
```

Luego abrir `http://localhost:8080`.

### Opción 3: VS Code Live Server

Instalar la extensión **Live Server** de Ritwick Dey, hacer clic derecho en `index.html` → *Open with Live Server*.

## Uso de la interfaz

| Control | Descripción |
|---|---|
| Slider **Partículas** | Cambia el número de partículas (50 – 10 000) |
| Slider **Velocidad** | Ajusta la velocidad de movimiento |
| Slider **Capacidad QT** | Máximo de partículas por nodo antes de subdividir |
| Slider **Radio partícula** | Tamaño de cada partícula |
| **Uniforme / Clusters / Alta densidad** | Cambia la distribución espacial inicial |
| **Inspeccionar región** | Activa el modo de consulta visual (ver abajo) |
| **↺ Reiniciar** | Regenera las partículas con la configuración actual |
| **Benchmark ↗** | Ejecuta la comparación experimental con 3 tamaños |

### Modo de inspección

Con el botón **Inspeccionar región** activo:

- **Mover el cursor** sobre el canvas muestra en tiempo real los candidatos de la consulta rectangular (amarillo) y los vecinos circulares (verde).
- **Clic** fija el punto de consulta.
- **Doble clic** libera el punto fijado.
- El **slider de radio** controla el radio de la consulta circular.

### Benchmark

Al pulsar **Benchmark ↗** se ejecuta una comparación automática con:

- **3 tamaños**: 1 000 (pequeño), 5 000 (mediano), 10 000 (grande)
- **3 distribuciones**: Uniforme, Clusters, Alta densidad
- **60 frames promediados** por configuración

Los resultados se muestran en una tabla con: tiempo de construcción del QuadTree, comparaciones de fuerza bruta, comparaciones del QuadTree, speedup y candidatos promedio por objeto.

## Colores en el canvas

| Color | Significado |
|---|---|
| Azul | Partícula normal |
| Rojo | Partícula colisionando |
| Amarillo | Candidato de consulta rectangular |
| Verde claro | Vecino dentro del radio circular |
| Líneas verdes tenues | Subdivisiones del QuadTree |

## Tecnologías

- JavaScript (ES Modules, sin frameworks)
- Canvas API (HTML5)
- Sin dependencias externas
