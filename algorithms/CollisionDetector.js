// =====================================================
// CollisionDetection.js
// Implementa los algoritmos de detección de colisiones.
//
// Se comparan dos enfoques:
//
// 1. Fuerza Bruta (O(n²))
// 2. QuadTree (Optimizado)
//
// Este archivo es utilizado durante los experimentos
// para demostrar la mejora del QuadTree.
// =====================================================

import Rectangle from "../structures/Rectangle.js";
import { distanceSquared } from "../utils/MathUtils.js";

class CollisionDetection {

    /*
        Detecta colisiones utilizando fuerza bruta.

        Compara cada partícula contra todas las demás.

        Complejidad:
        O(n²)
    */
    static detectBruteForce(particles){

        // Número de comparaciones realizadas.
        let comparisons = 0;

        // Comparar todas contra todas.
        for(let i=0;i<particles.length;i++){

            for(let j=i+1;j<particles.length;j++){

                comparisons++;

                const p1 = particles[i];
                const p2 = particles[j];

                // Distancia entre ambas partículas.
                const dist2 = distanceSquared(

                    p1.x,
                    p1.y,

                    p2.x,
                    p2.y

                );

                // Distancia mínima para colisionar.
                const limit = p1.radius + p2.radius;

                if(dist2 <= limit*limit){

                    p1.setCollision();
                    p2.setCollision();

                }

            }

        }

        return comparisons;

    }

    /*
        Detecta colisiones utilizando QuadTree.

        Solo compara partículas cercanas.

        Complejidad promedio:
        O(n log n)
    */
    static detectQuadTree(quadTree, particles){

        let comparisons = 0;

        let totalCandidates = 0;

        // Revisar cada partícula.
        for(const particle of particles){

            // Región donde buscar vecinos.
            const range = new Rectangle(

                particle.x,

                particle.y,

                particle.radius * 2,

                particle.radius * 2

            );

            // Obtener candidatos del QuadTree.
            const candidates = quadTree.queryRectangle(range);

            totalCandidates += candidates.length;

            // Comparar únicamente candidatos.
            for(const other of candidates){

                // Evita comparar dos veces.
                if(other.id <= particle.id){

                    continue;

                }

                comparisons++;

                const dist2 = distanceSquared(

                    particle.x,
                    particle.y,

                    other.x,
                    other.y

                );

                const limit = particle.radius + other.radius;

                if(dist2 <= limit*limit){

                    particle.setCollision();
                    other.setCollision();

                }

            }

        }

        return{

            comparisons,

            averageCandidates:
                totalCandidates / particles.length

        };

    }

}

export default CollisionDetection;
