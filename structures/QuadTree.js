// =====================================================
// QuadTree.js
// Implementación del QuadTree.
//
// Esta estructura organiza partículas en un espacio
// bidimensional para acelerar consultas espaciales.
//
// Complejidades esperadas:
//
// Inserción:
// O(log n) promedio
//
// Consulta:
// O(log n + k)
//
// Reconstrucción:
// O(n log n)
// =====================================================

import QuadNode from "./QuadNode.js";

class QuadTree {

    /*
        Constructor del QuadTree.

        boundary : Región total del espacio.

        capacity : Máximo de partículas por nodo.
    */
    constructor(boundary, capacity){

        // Nodo raíz.
        this.root = new QuadNode(
            boundary,
            capacity
        );

        // Estadísticas utilizadas durante
        // el benchmark.
        this.stats = {

            // Cantidad de nodos recorridos.
            visitedNodes: 0,

            // Número de consultas realizadas.
            totalQueries: 0

        };

    }

    /*
        Inserta una partícula en el árbol.

        Complejidad promedio:
        O(log n)
    */
    insert(particle){

        return this.insertRecursive(
            this.root,
            particle
        );

    }

    /*
        Inserción recursiva.

        Si el nodo supera la capacidad,
        se subdivide automáticamente.
    */
    insertRecursive(node, particle){

        // La partícula no pertenece
        // a esta región.
        if(
            !node.boundary.contains(particle)
        ){

            return false;

        }

        // Si el nodo todavía tiene espacio.
        if(

            node.particles.length < node.capacity &&

            !node.divided

        ){

            node.particles.push(particle);

            return true;

        }

        // Si aún no fue dividido.
        if(!node.divided){

            node.subdivide();

        }

        // Intentar insertar
        // en alguno de los hijos.
        return(

            this.insertRecursive(
                node.northWest,
                particle
            )

            ||

            this.insertRecursive(
                node.northEast,
                particle
            )

            ||

            this.insertRecursive(
                node.southWest,
                particle
            )

            ||

            this.insertRecursive(
                node.southEast,
                particle
            )

        );

    }

    /*
        Consulta rectangular.

        Devuelve todas las partículas
        dentro de una región.

        Complejidad promedio:
        O(log n + k)
    */
    queryRectangle(range){

        // Reiniciar estadísticas.
        this.resetStats();

        this.stats.totalQueries++;

        const found = [];

        this.queryRecursive(

            this.root,

            range,

            found

        );

        return found;

    }

    /*
        Consulta recursiva.

        Recorre únicamente
        las regiones necesarias.
    */
    queryRecursive(node, range, found){

        // Registrar nodo visitado.
        this.stats.visitedNodes++;

        // No existe intersección.
        if(

            !node.boundary.intersects(range)

        ){

            return;

        }

        // Revisar partículas
        // almacenadas en este nodo.
        for(const particle of node.particles){

            if(

                range.contains(particle)

            ){

                found.push(particle);

            }

        }

        // Si es hoja,
        // termina el recorrido.
        if(

            !node.divided

        ){

            return;

        }

        // Continuar búsqueda.
        this.queryRecursive(

            node.northWest,

            range,

            found

        );

        this.queryRecursive(

            node.northEast,

            range,

            found

        );

        this.queryRecursive(

            node.southWest,

            range,

            found

        );

        this.queryRecursive(

            node.southEast,

            range,

            found

        );

    }

    /*
        Vacía completamente
        el árbol.

        Complejidad:
        O(1)
    */
    clear(boundary, capacity){

        this.root = new QuadNode(

            boundary,

            capacity

        );

    }

    /*
        Reconstruye el árbol
        utilizando una nueva lista
        de partículas.

        Complejidad:
        O(n log n)
    */
    rebuild(boundary, capacity, particles){

        this.clear(

            boundary,

            capacity

        );

        for(const particle of particles){

            this.insert(

                particle

            );

        }

    }

    /*
        Reinicia las estadísticas.

        Se ejecuta antes
        de cada consulta.
    */
    resetStats(){

        this.stats.visitedNodes = 0;

        this.stats.totalQueries = 0;

    }

    /*
        Devuelve las estadísticas
        del último recorrido.
    */
    getStats(){

        return this.stats;

    }

}
export default QuadTree;
