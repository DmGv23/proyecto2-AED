// =====================================================
// NeighborSearch.js
// Implementa los algoritmos de búsqueda de vecinos.
//
// Utiliza el QuadTree para obtener únicamente los
// candidatos cercanos a una partícula.
//
// Posteriormente aplica un filtro circular para
// eliminar falsos positivos.
// =====================================================

import Rectangle from "../structures/Rectangle.js";
import { distanceSquared } from "../utils/MathUtils.js";

class NeighborSearch {

    /*
        Busca candidatos utilizando una consulta
        rectangular sobre el QuadTree.

        Complejidad promedio:
        O(log n + k)
    */
    static queryRectangle(quadTree, particle){

        // Región rectangular alrededor de la partícula.
        const range = new Rectangle(

            particle.x,

            particle.y,

            particle.radius * 2,

            particle.radius * 2

        );

        return quadTree.queryRectangle(range);

    }

    /*
        Busca vecinos reales utilizando un radio.

        Primero obtiene candidatos mediante el QuadTree
        y luego elimina aquellos fuera del círculo.

        Complejidad promedio:
        O(log n + k)
    */
    static queryCircle(quadTree, particle, radius){

        // Obtener candidatos rectangulares.
        const candidates =
            this.queryRectangle(quadTree, particle);

        const neighbors = [];

        // Distancia máxima permitida.
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

            // Solo conservar vecinos reales.
            if(dist2 <= limit){

                neighbors.push(candidate);

            }

        }

        return neighbors;

    }

    /*
        Devuelve todos los vecinos de una lista
        de partículas.

        Se utiliza durante los experimentos.

        Complejidad aproximada:
        O(n log n)
    */
    static findAllNeighbors(quadTree, particles){

        const result = new Map();

        for(const particle of particles){

            const neighbors =
                this.queryCircle(

                    quadTree,

                    particle,

                    particle.radius * 2

                );

            result.set(

                particle.id,

                neighbors

            );

        }

        return result;

    }

}

export default NeighborSearch;
