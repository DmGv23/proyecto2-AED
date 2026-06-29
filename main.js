//==================================================
// main.js
// Punto de entrada del proyecto.
//
// Inicializa todos los módulos y ejecuta
// el ciclo principal de la simulación.
//==================================================

import Renderer from "./rendering/Renderer.js";
import Simulation from "./simulation/Simulation.js";
import Benchmark from "./benchmark/Benchmark.js";
import CollisionDetector from "./algorithms/CollisionDetector.js";

import {
    DEFAULT_PARTICLES,
    DEFAULT_RADIUS,
    DEFAULT_SPEED
} from "./utils/Constants.js";

//------------------------------------------
// Canvas
//------------------------------------------

const canvas = document.getElementById("cv");

//------------------------------------------
// Inicialización
//------------------------------------------

const renderer = new Renderer(canvas);

const simulation = new Simulation();

const benchmark = new Benchmark();

//------------------------------------------
// Crear partículas iniciales
//------------------------------------------

simulation.createParticles(

    DEFAULT_PARTICLES,

    DEFAULT_RADIUS,

    DEFAULT_SPEED

);

//------------------------------------------
// Objeto de métricas
//------------------------------------------

const metrics = {

    fps: 0,

    buildTime: 0,

    queryTime: 0,

    bruteComparisons: 0,

    qtComparisons: 0,

    visitedNodes: 0,

    averageCandidates: 0,

    speedup: 0

};

//------------------------------------------
// Variables FPS
//------------------------------------------

let lastFrame = performance.now();}

//------------------------------------------
// Ciclo principal
//------------------------------------------

function gameLoop() {

    const now = performance.now();

    //----------------------------------
    // FPS
    //----------------------------------

    metrics.fps = 1000 / (now - lastFrame);

    lastFrame = now;

    //----------------------------------
    // Actualizar simulación
    //----------------------------------

    simulation.update();

    //----------------------------------
    // Reconstruir QuadTree
    //----------------------------------

    simulation.rebuildQuadTree();

    metrics.buildTime = simulation.getBuildTime();

    //----------------------------------
    // Detectar colisiones
    //----------------------------------

    const startQuery = performance.now();

    const result = CollisionDetector.detectQuadTree(

        simulation.getQuadTree(),

        simulation.getParticles()

    );

    metrics.queryTime = performance.now() - startQuery;

    metrics.qtComparisons = result.comparisons;

    metrics.averageCandidates = result.averageCandidates;

    metrics.visitedNodes = result.visitedNodes;

    //----------------------------------
    // Comparación con fuerza bruta
    //----------------------------------

    metrics.bruteComparisons =

        CollisionDetector.detectBruteForce(

            simulation.getParticles(),

            false

        );

    //----------------------------------
    // Speedup
    //----------------------------------

    metrics.speedup =

        metrics.bruteComparisons /

        Math.max(metrics.qtComparisons, 1);

    //----------------------------------
    // Dibujar
    //----------------------------------

    renderer.render(

        simulation,

        metrics

    );

    //----------------------------------
    // Siguiente frame
    //----------------------------------

    requestAnimationFrame(gameLoop);

}

//------------------------------------------
// Iniciar simulación
//------------------------------------------

gameLoop();

//------------------------------------------
// Benchmark manual
//------------------------------------------

window.runBenchmark = function () {

    benchmark.clear();

    benchmark.run(simulation);

    console.table(

        benchmark.getResults()

    );

};

//------------------------------------------
// Acceso desde la consola
//------------------------------------------

window.simulation = simulation;

window.renderer = renderer;

window.metrics = metrics;
