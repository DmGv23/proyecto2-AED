// =====================================================
// Simulation.js
// Controla toda la simulación.
//
// Responsabilidades:
// - Crear partículas.
// - Actualizar posiciones.
// - Reconstruir el QuadTree.
// - Mantener la configuración actual.
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
        Constructor.
    */
    constructor() {

        // Lista de partículas.
        this.particles = [];

        // QuadTree actual.
        this.quadTree = null;

        // Capacidad máxima por nodo.
        this.capacity = DEFAULT_CAPACITY;

        // Distribución utilizada.
        this.distribution = "uniform";

        // Configuración actual.
        this.totalParticles = 0;
        this.radius = 4;
        this.speed = 1.5;

        // Tiempo empleado al construir el QuadTree.
        this.buildTime = 0;

    }

    /*
        Genera un nuevo conjunto de partículas.

        Complejidad:
        O(n)
    */
    createParticles(total, radius, speed){

        // Guardar configuración actual.
        this.totalParticles = total;
        this.radius = radius;
        this.speed = speed;

        // Eliminar partículas anteriores.
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

            this.particles.push(

                new Particle(

                    i,

                    position.x,

                    position.y,

                    Math.cos(angle)*speed,

                    Math.sin(angle)*speed,

                    radius

                )

            );

        }

    }

    /*
        Actualiza todas las partículas.

        Complejidad:
        O(n)
    */
    update(){

        for(const particle of this.particles){

            particle.resetCollision();

            particle.move();

            particle.bounce(

                WIDTH,

                HEIGHT

            );

        }

    }

    /*
        Reconstruye completamente
        el QuadTree.

        Complejidad aproximada:
        O(n log n)
    */
    rebuildQuadTree(){

        const start = performance.now();

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

        for(const particle of this.particles){

            this.quadTree.insert(

                particle

            );

        }

        this.buildTime =

            performance.now() - start;

    }

    /*
        Reinicia completamente
        la simulación.
    */
    reset(){

        this.createParticles(

            this.totalParticles,

            this.radius,

            this.speed

        );

    }

    /*
        Cambia la distribución.
    */
    setDistribution(type){

    this.distribution = type;

    // Regenerar automáticamente
    // las partículas con la nueva distribución.
    this.reset();

}

    /*
        Cambia la capacidad
        del QuadTree.
    */
    setCapacity(capacity){

    this.capacity = capacity;

    // Si ya existen partículas,
    // reconstruir inmediatamente el árbol.
    if(this.particles.length > 0){

        this.rebuildQuadTree();

    }

}


    /*
        Devuelve la lista
        de partículas.
    */
    getParticles(){

        return this.particles;

    }

    /*
        Devuelve el QuadTree.
    */
    getQuadTree(){

        return this.quadTree;

    }

    /*
        Devuelve el tiempo
        de construcción.
    */
    getBuildTime(){

        return this.buildTime;

    }

}

export default Simulation;
