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
import Rectangle from "../structures/Rectangle.js";

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

                const dist2 = p1.distanceSquared(p2);

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

            const candidates = this.queryCircle(
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

                const dist2 = particle.distanceSquared(other);

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

        /*
        Busca los candidatos dentro del área
        alrededor de una partícula.
    */
    static queryRectangle(quadTree, particle) {

    const range = new Rectangle(
        particle.x,
        particle.y,
        particle.radius * 2,
        particle.radius * 2
    );

    return quadTree.queryRectangle(range);

}

    /*
        Filtra únicamente los vecinos
        realmente cercanos.
    */
    static queryCircle(quadTree, particle, radius) {

        const candidates = this.queryRectangle(
            quadTree,
            particle
        );

        const neighbors = [];

        const limit = radius * radius;

        for (const candidate of candidates) {

            if (candidate.id === particle.id) {
                continue;
            }

            if (particle.distanceSquared(candidate) <= limit) {
                neighbors.push(candidate);
            }

        }

        return neighbors;

    }
    
}

export default CollisionDetector;
