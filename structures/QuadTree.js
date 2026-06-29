// =====================================================
// QuadTree.js
// Implementación del QuadTree.
//
// Esta estructura permite organizar partículas en un
// espacio bidimensional para realizar consultas
// espaciales de manera eficiente.
// =====================================================

import QuadNode from "./QuadNode.js";
import Rectangle from "./Rectangle.js";

class QuadTree {

    /*
        Constructor del QuadTree.

        boundary : Región total del espacio.

        capacity : Máximo de partículas por nodo.
    */
    constructor(boundary, capacity) {

        // Nodo raíz del árbol.
        this.root = new QuadNode(boundary, capacity);

    }

    /*
        Inserta una partícula dentro del árbol.

        Complejidad promedio:
        O(log n)
    */
    insert(particle) {

        return this.insertRecursive(this.root, particle);

    }

    /*
        Inserta recursivamente una partícula.

        Esta función realiza toda la lógica de
        subdivisión del QuadTree.
    */
    insertRecursive(node, particle) {

        // Si la partícula no pertenece al nodo,
        // no puede insertarse aquí.
        if (!node.boundary.contains(particle)) {

            return false;

        }

        // Si todavía hay espacio, simplemente se inserta.
        if (
            node.particles.length < node.capacity &&
            !node.divided
        ) {

            node.particles.push(particle);

            return true;

        }

        // Si el nodo todavía no fue dividido,
        // se crean los cuatro hijos.
        if (!node.divided) {

            node.subdivide();

        }

        // Intentar insertar en alguno de los hijos.
        return (

            this.insertRecursive(node.northWest, particle) ||

            this.insertRecursive(node.northEast, particle) ||

            this.insertRecursive(node.southWest, particle) ||

            this.insertRecursive(node.southEast, particle)

        );

    }

    /*
        Consulta todas las partículas contenidas
        dentro de un rectángulo.

        Complejidad promedio:
        O(log n + k)
    */
    queryRectangle(range) {

        const found = [];

        this.queryRecursive(this.root, range, found);

        return found;

    }

    /*
        Recorre el árbol buscando partículas
        dentro del área consultada.
    */
    queryRecursive(node, range, found) {

        // Si el área consultada no intersecta
        // este nodo, se descarta completamente.
        if (!node.boundary.intersects(range)) {

            return;

        }

        // Revisar las partículas del nodo.
        for (const particle of node.particles) {

            if (range.contains(particle)) {

                found.push(particle);

            }

        }

        // Si es hoja ya terminó.
        if (!node.divided) {

            return;

        }

        // Continuar con los hijos.
        this.queryRecursive(node.northWest, range, found);

        this.queryRecursive(node.northEast, range, found);

        this.queryRecursive(node.southWest, range, found);

        this.queryRecursive(node.southEast, range, found);

    }

    /*
        Elimina todo el contenido del árbol.

        Se utiliza para reconstruir el QuadTree
        en cada frame de la simulación.
    */
    clear(boundary, capacity) {

        this.root = new QuadNode(boundary, capacity);

    }

    /*
        Reconstruye completamente el árbol
        utilizando una nueva lista de partículas.
    */
    rebuild(boundary, capacity, particles) {

        this.clear(boundary, capacity);

        for (const particle of particles) {

            this.insert(particle);

        }

    }

}

export default QuadTree;
