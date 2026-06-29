// =====================================================
// CollisionDetector.js
// Detecta colisiones entre partículas.
//
// Implementa dos estrategias:
//
// 1. Fuerza Bruta
// 2. QuadTree
//
// Ambas son utilizadas durante el benchmark.
// =====================================================

import NeighborSearch from "./NeighborSearch.js";
import { distanceSquared } from "../utils/MathUtils.js";

class CollisionDetector {

    /*
        Detecta colisiones mediante fuerza bruta.

        Complejidad:
        O(n²)
    */
    static detectBruteForce(
        particles,
        markCollision = true
    ){

        let comparisons = 0;

        for(let i=0;i<particles.length;i++){

            for(let j=i+1;j<particles.length;j++){

                comparisons++;

                const p1 = particles[i];
                const p2 = particles[j];

                const limit =
                    p1.radius + p2.radius;

                const dist2 = distanceSquared(

                    p1.x,
                    p1.y,

                    p2.x,
                    p2.y

                );

                if(dist2 <= limit*limit){

                    if(markCollision){

                        p1.setCollision();
                        p2.setCollision();

                    }

                }

            }

        }

        return comparisons;

    }

    /*
        Detecta colisiones utilizando QuadTree.

        Complejidad promedio:
        O(n log n)
    */
    static detectQuadTree(
        quadTree,
        particles,
        markCollision = true
    ){

        let comparisons = 0;

        let totalCandidates = 0;

        for(const particle of particles){

            const candidates =

                NeighborSearch.queryCircle(

                    quadTree,

                    particle,

                    particle.radius * 2

                );

            totalCandidates += candidates.length;

            for(const other of candidates){

                // Evita comparar dos veces.
                if(other.id <= particle.id){

                    continue;

                }

                comparisons++;

                const limit =

                    particle.radius +

                    other.radius;

                const dist2 = distanceSquared(

                    particle.x,
                    particle.y,

                    other.x,
                    other.y

                );

                if(dist2 <= limit*limit){

                    if(markCollision){

                        particle.setCollision();

                        other.setCollision();

                    }

                }

            }

        }

        return{

            comparisons,

            averageCandidates:

                totalCandidates /

                particles.length,

            visitedNodes:

                quadTree.getStats()

                    .visitedNodes

        };

    }

}

export default CollisionDetector;
