// =====================================================
// Benchmark.js
// Ejecuta los experimentos del proyecto.
//
// Compara el rendimiento del QuadTree contra
// la solución de fuerza bruta.
//
// Este módulo NO dibuja resultados.
// Únicamente calcula y almacena métricas.
// =====================================================

import CollisionDetector from "../algorithms/CollisionDetector.js";

class Benchmark {

    /*
        Constructor.
    */
    constructor(metrics){

        // Objeto donde se almacenan
        // todas las métricas.
        this.metrics = metrics;

        // Resultados obtenidos.
        this.results = [];

    }

    /*
        Ejecuta un benchmark para un
        tamaño determinado.

        Complejidad aproximada:
        O(n log n)
    */
    run(simulation){

        // Reiniciar métricas.
        this.metrics.reset();

        //------------------------------------------------
        // Tiempo de construcción del QuadTree.
        //------------------------------------------------

        simulation.rebuildQuadTree();

        this.metrics.buildTime =
            simulation.getBuildTime();

        //------------------------------------------------
        // Detección usando QuadTree.
        //------------------------------------------------

        const startQT = performance.now();

        const qtResult =
            CollisionDetection.detectQuadTree(

                simulation.quadTree,

                simulation.particles

            );

        this.metrics.queryTime =
            performance.now() - startQT;

        this.metrics.qtComparisons =
            qtResult.comparisons;

        this.metrics.averageCandidates =
            qtResult.averageCandidates;

        this.metrics.visitedNodes =
            qtResult.visitedNodes;

        //------------------------------------------------
        // Fuerza Bruta.
        //------------------------------------------------

        this.metrics.bruteComparisons =
            CollisionDetection.detectBruteForce(

                simulation.particles

            );

        //------------------------------------------------
        // Calcular Speedup.
        //------------------------------------------------

        this.metrics.calculateSpeedup();

        //------------------------------------------------
        // Guardar resultado.
        //------------------------------------------------

        this.results.push({

            particles:

                simulation.particles.length,

            buildTime:

                this.metrics.buildTime,

            queryTime:

                this.metrics.queryTime,

            bruteComparisons:

                this.metrics.bruteComparisons,

            qtComparisons:

                this.metrics.qtComparisons,

            visitedNodes:

                this.metrics.visitedNodes,

            averageCandidates:

                this.metrics.averageCandidates,

            speedup:

                this.metrics.speedup

        });

    }

    /*
        Devuelve todos los resultados
        obtenidos hasta el momento.
    */
    getResults(){

        return this.results;

    }

    /*
        Borra los resultados anteriores.

        Se utiliza antes de iniciar
        un nuevo benchmark.
    */
    clear(){

        this.results = [];

    }

}

export default Benchmark;
