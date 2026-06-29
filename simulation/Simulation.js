// =====================================================
// Simulation.js
// Controla toda la simulación.
//
// Se encarga de:
// - Crear partículas.
// - Actualizar posiciones.
// - Reconstruir el QuadTree.
// - Reiniciar la simulación.
// =====================================================

import Particle from "./Particle.js";

import QuadTree from "../structures/QuadTree.js";
import Rectangle from "../structures/Rectangle.js";

import {
    WIDTH,
    HEIGHT,
    DEFAULT_CAPACITY
} from "../utils/Constants.js";

import {
    generateUniform,
    generateCluster,
    generateDense
} from "../utils/RandomGenerator.js";

class Simulation {

    /*
        Constructor de la simulación.
    */
    constructor() {

        // Lista de partículas.
        this.particles = [];

        // Capacidad máxima por nodo.
        this.capacity = DEFAULT_CAPACITY;

        // Distribución inicial.
        this.distribution = "uniform";

        // QuadTree utilizado en el frame actual.
        this.quadTree = null;

    }

    /*
        Genera todas las partículas.

        Complejidad:
        O(n)
    */
    createParticles(total, radius, speed) {

        // Vaciar lista anterior.
        this.particles = [];

        for(let i=0;i<total;i++){

            let position;

            switch(this.distribution){

                case "cluster":
                    position = generateCluster(
                        WIDTH,
                        HEIGHT,
                        radius
                    );
                    break;

                case "dense":
                    position = generateDense(
                        WIDTH,
                        HEIGHT,
                        radius
                    );
                    break;

                default:
                    position = generateUniform(
                        WIDTH,
                        HEIGHT,
                        radius
                    );

            }

            // Dirección aleatoria.
            const angle = Math.random()*Math.PI*2;

            // Crear partícula.
            const particle = new Particle(

                i,

                position.x,

                position.y,

                Math.cos(angle)*speed,

                Math.sin(angle)*speed,

                radius

            );

            this.particles.push(particle);

        }

    }

    /*
        Actualiza todas las partículas.

        Complejidad:
        O(n)
    */
    update() {

        for(const particle of this.particles){

            // Reiniciar colisión.
            particle.resetCollision();

            // Actualizar posición.
            particle.move();

            // Rebotar en los bordes.
            particle.bounce(
                WIDTH,
                HEIGHT
            );

        }

    }

    /*
        Reconstruye completamente
        el QuadTree.

        Complejidad:
        O(n log n)
    */
    rebuildQuadTree(){

        const boundary = new Rectangle(

            WIDTH/2,

            HEIGHT/2,

            WIDTH/2,

            HEIGHT/2

        );

        this.quadTree = new QuadTree(

            boundary,

            this.capacity

        );

        // Insertar todas las partículas.
        for(const particle of this.particles){

            this.quadTree.insert(particle);

        }

    }

    /*
        Cambia la distribución
        utilizada para generar partículas.
    */
    setDistribution(type){

        this.distribution = type;

    }

    /*
        Cambia la capacidad
        máxima del QuadTree.
    */
    setCapacity(capacity){

        this.capacity = capacity;

    }

}

export default Simulation;
