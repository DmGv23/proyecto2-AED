// =====================================================
// Metrics.js
// Almacena todas las métricas generadas durante
// la simulación y los experimentos.
//
// Centralizar esta información evita tener
// variables globales repartidas por el proyecto.
// =====================================================

class Metrics{

    constructor(){

        this.reset();

    }

    /*
        Reinicia todas las métricas.

        Se ejecuta al iniciar un nuevo frame
        o un nuevo benchmark.
    */
    reset(){

        // Tiempo para construir el QuadTree.
        this.buildTime = 0;

        // Tiempo utilizado en consultas.
        this.queryTime = 0;

        // Comparaciones fuerza bruta.
        this.bruteComparisons = 0;

        // Comparaciones utilizando QuadTree.
        this.qtComparisons = 0;

        // Candidatos promedio encontrados.
        this.averageCandidates = 0;

        // Cantidad de nodos recorridos.
        this.visitedNodes = 0;

        // FPS de la simulación.
        this.fps = 0;

        // Speedup.
        this.speedup = 0;

    }

    /*
        Calcula el speedup del QuadTree
        respecto a fuerza bruta.
    */
    calculateSpeedup(){

        if(this.qtComparisons===0){

            this.speedup=0;

            return;

        }

        this.speedup=
            this.bruteComparisons/
            this.qtComparisons;

    }

}

export default Metrics;
