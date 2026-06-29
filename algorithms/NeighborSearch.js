// =====================================================
// NeighborSearch.js
// Realiza búsquedas espaciales utilizando el QuadTree.
//
// Esta clase permite buscar:
// - Candidatos mediante un rectángulo.
// - Vecinos reales mediante un círculo.
//
// Complejidad promedio:
// O(log n + k)
// =====================================================

import Rectangle from "../structures/Rectangle.js";
import { distanceSquared } from "../utils/MathUtils.js";

class NeighborSearch {

    /*
        Devuelve todos los candidatos encontrados
        dentro de un rectángulo.

        Complejidad promedio:
        O(log n + k)
    */
    static queryRectangle(quadTree, particle){

        const range = new Rectangle(

            particle.x,

            particle.y,

            particle.radius * 2,

            particle.radius * 2

        );

        return quadTree.queryRectangle(range);

    }

    /*
        Devuelve únicamente los vecinos
        que realmente están dentro
        del radio indicado.

        Complejidad promedio:
        O(log n + k)
    */
    static queryCircle(

        quadTree,

        particle,

        radius

    ){

        const candidates =

            this.queryRectangle(

                quadTree,

                particle

            );

        const neighbors = [];

        const limit = radius * radius;

        for(const candidate of candidates){

            // Ignorar la misma partícula.
            if(candidate.id === particle.id){

                continue;

            }

            const dist2 = distanceSquared(

                particle.x,

                particle.y,

                candidate.x,

                candidate.y

            );

            if(dist2 <= limit){

                neighbors.push(candidate);

            }

        }

        return neighbors;

    }

    /*
        Devuelve un Map donde cada
        partícula está asociada
        con sus vecinos.

        Se utiliza principalmente
        durante el benchmark.
    */
    static findAllNeighbors(

        quadTree,

        particles

    ){

        const result = new Map();

        for(const particle of particles){

            result.set(

                particle.id,

                this.queryCircle(

                    quadTree,

                    particle,

                    particle.radius * 2

                )

            );

        }

        return result;

    }

    /*
        Cuenta el número promedio
        de vecinos por partícula.

        Se utiliza para obtener
        estadísticas del benchmark.
    */
    static averageNeighbors(

        quadTree,

        particles

    ){

        let total = 0;

        for(const particle of particles){

            total +=

                this.queryCircle(

                    quadTree,

                    particle,

                    particle.radius * 2

                ).length;

        }

        if(particles.length === 0){

            return 0;

        }

        return total / particles.length;

    }

}

export default NeighborSearch;
