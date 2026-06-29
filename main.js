//==================================================
// main.js
// Punto de entrada del proyecto.
//
// Inicializa todos los módulos y ejecuta
// el ciclo principal de la simulación.
//==================================================

import Camera from "./rendering/Camera.js";
import Renderer from "./rendering/Renderer.js";

import Simulation from "./simulation/Simulation.js";

import Metrics from "./benchmark/Metrics.js";
import Benchmark from "./benchmark/Benchmark.js";

import {
    DEFAULT_PARTICLES,
    DEFAULT_RADIUS,
    DEFAULT_SPEED
} from "./utils/Constants.js";

import CollisionDetection from "./algorithms/CollisionDetection.js";

//------------------------------------------
// Inicialización
//------------------------------------------

const camera = new Camera("cv");

const renderer = new Renderer(camera);

const simulation = new Simulation();

const metrics = new Metrics();

const benchmark = new Benchmark(metrics);

//------------------------------------------
// Crear partículas iniciales
//------------------------------------------

simulation.createParticles(

    DEFAULT_PARTICLES,

    DEFAULT_RADIUS,

    DEFAULT_SPEED

);

//------------------------------------------
// Variables para FPS
//------------------------------------------

let lastFrame = performance.now();

//------------------------------------------
// Ciclo principal
//------------------------------------------

function gameLoop(){

    const now = performance.now();

    //----------------------------------
    // FPS
    //----------------------------------

    metrics.fps =

        1000 /

        (now-lastFrame);

    lastFrame = now;

    //----------------------------------
    // Actualizar simulación
    //----------------------------------

    simulation.update();

    //----------------------------------
    // Reconstruir QuadTree
    //----------------------------------

    simulation.rebuildQuadTree();

    //----------------------------------
    // Detectar colisiones
    //----------------------------------

    const result =

        CollisionDetection.detectQuadTree(

            simulation.quadTree,

            simulation.particles

        );

    metrics.qtComparisons =

        result.comparisons;

    metrics.averageCandidates =

        result.averageCandidates;

    metrics.visitedNodes =

        result.visitedNodes;

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

    requestAnimationFrame(

        gameLoop

    );

}

//------------------------------------------
// Iniciar simulación
//------------------------------------------

gameLoop();

//------------------------------------------
// Exportar benchmark
//------------------------------------------

window.runBenchmark = ()=>{

    benchmark.clear();

    benchmark.run(simulation);

    console.table(

        benchmark.getResults()

    );

};
