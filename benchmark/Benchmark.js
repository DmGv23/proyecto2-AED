//==================================================
// Benchmark.js
// Ejecuta los experimentos del proyecto.
//
// Compara el rendimiento del QuadTree contra
// la fuerza bruta.
//==================================================

import CollisionDetector from "../algorithms/CollisionDetector.js";

class Benchmark {

    /*
        Constructor.
    */
    constructor() {

        this.results = [];

    }

    /*
        Ejecuta un benchmark.
    */
    run(simulation) {

        const metrics = {};

        //----------------------------------
        // Construcción del QuadTree
        //----------------------------------

        simulation.rebuildQuadTree();

        metrics.buildTime = simulation.getBuildTime();

        //----------------------------------
        // QuadTree
        //----------------------------------

        const startQuery = performance.now();

        const qtResult = CollisionDetector.detectQuadTree(

            simulation.getQuadTree(),

            simulation.getParticles(),

            false

        );

        metrics.queryTime = performance.now() - startQuery;

        metrics.qtComparisons = qtResult.comparisons;
        metrics.averageCandidates = qtResult.averageCandidates;
        metrics.visitedNodes = qtResult.visitedNodes;

        //----------------------------------
        // Fuerza Bruta
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
        // Guardar resultado
        //----------------------------------

        this.results.push({

            particles: simulation.getParticles().length,

            buildTime: metrics.buildTime,

            queryTime: metrics.queryTime,

            bruteComparisons: metrics.bruteComparisons,

            qtComparisons: metrics.qtComparisons,

            visitedNodes: metrics.visitedNodes,

            averageCandidates: metrics.averageCandidates,

            speedup: metrics.speedup

        });

    }

    /*
        Devuelve todos los resultados.
    */
    getResults() {

        return this.results;

    }

    /*
        Elimina resultados anteriores.
    */
    clear() {

        this.results = [];

    }

}

export default Benchmark;
