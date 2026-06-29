//==================================================
// QuadTree.js
// Implementación del QuadTree.
//
// Responsabilidades:
// - Insertar partículas.
// - Consultar regiones.
// - Reconstruir el árbol.
// - Obtener estadísticas.
//==================================================

import QuadNode from "./QuadNode.js";

class QuadTree {

    /*
        Constructor.

        boundary : región total.

        capacity : máximo de partículas por nodo.
    */
    constructor(boundary, capacity) {

        // Nodo raíz.
        this.root = new QuadNode(boundary, capacity);

        // Estadísticas utilizadas durante el benchmark.
        this.stats = {
    visitedNodes: 0
};

    }

    /*
        Inserta una partícula.

        Complejidad:
        O(log n) promedio.
    */
    insert(particle) {

        return this.insertRecursive(this.root, particle);

    }

    /*
        Inserción recursiva.
    */
    insertRecursive(node, particle) {

        // La partícula no pertenece a este nodo.
        if (!node.boundary.contains(particle)) {
            return false;
        }

        // Si todavía existe espacio.
        if (node.particles.length < node.capacity && !node.divided) {

            node.particles.push(particle);

            return true;

        }

        // Si el nodo aún no está subdividido,
// dividirlo y redistribuir las partículas.
if (!node.divided) {

    node.subdivide();

    // Guardar las partículas actuales.
    const oldParticles = node.particles;

    // Vaciar el nodo padre.
    node.particles = [];

    // Reinsertar las partículas en los hijos.
    for (const oldParticle of oldParticles) {

        this.insertRecursive(node.northWest, oldParticle) ||
        this.insertRecursive(node.northEast, oldParticle) ||
        this.insertRecursive(node.southWest, oldParticle) ||
        this.insertRecursive(node.southEast, oldParticle);

    }

}

// Insertar la nueva partícula en el hijo correspondiente.
return (

    this.insertRecursive(node.northWest, particle) ||

    this.insertRecursive(node.northEast, particle) ||

    this.insertRecursive(node.southWest, particle) ||

    this.insertRecursive(node.southEast, particle)

);

    }

    /*
        Consulta rectangular.

        Complejidad:
        O(log n + k)
    */
    queryRectangle(range) {

    // Reiniciar estadísticas.
    this.resetStats();

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
    */
    queryRecursive(node, range, found) {

        // Registrar visita al nodo.
        this.stats.visitedNodes++;

        // No existe intersección.
        if (!node.boundary.intersects(range)) {
            return;
        }

        // Revisar partículas almacenadas.
        for (const particle of node.particles) {

            if (range.contains(particle)) {
                found.push(particle);
            }

        }

        // Si es hoja, termina aquí.
        if (!node.divided) {
            return;
        }


            // Continuar buscando en los cuatro hijos.
        this.queryRecursive(node.northWest, range, found);
        this.queryRecursive(node.northEast, range, found);
        this.queryRecursive(node.southWest, range, found);
        this.queryRecursive(node.southEast, range, found);

    }

    /*
        Vacía completamente el QuadTree.

        Complejidad:
        O(1)
    */
    clear(boundary, capacity) {

        this.root = new QuadNode(boundary, capacity);

    }

    /*
        Reconstruye completamente el árbol.

        Complejidad aproximada:
        O(n log n)
    */
    rebuild(boundary, capacity, particles) {

        this.clear(boundary, capacity);

        for (const particle of particles) {
            this.insert(particle);
        }

    }

    /*
        Reinicia las estadísticas.
    */
    resetStats() {

    this.stats.visitedNodes = 0;

}

    /*
        Devuelve las estadísticas actuales.
    */
    getStats() {

        return this.stats;

    }

    /*
        Devuelve la altura del árbol.

        Complejidad:
        O(n)
    */
    getHeight() {

        return this.calculateHeight(this.root);

    }

    /*
        Calcula recursivamente la altura.
    */
    calculateHeight(node) {

        if (node === null) {
            return 0;
        }

        if (!node.divided) {
            return 1;
        }

        return 1 + Math.max(

            this.calculateHeight(node.northWest),
            this.calculateHeight(node.northEast),
            this.calculateHeight(node.southWest),
            this.calculateHeight(node.southEast)

        );

    }

    /*
        Cuenta todos los nodos del árbol.

        Complejidad:
        O(n)
    */
    countNodes() {

        return this.countNodesRecursive(this.root);

    }

    /*
        Conteo recursivo de nodos.
    */
    countNodesRecursive(node) {

        if (node === null) {
            return 0;
        }

        let total = 1;

        if (node.divided) {

            total += this.countNodesRecursive(node.northWest);
            total += this.countNodesRecursive(node.northEast);
            total += this.countNodesRecursive(node.southWest);
            total += this.countNodesRecursive(node.southEast);

        }

        return total;

    }

    /*
        Cuenta la cantidad de hojas.

        Complejidad:
        O(n)
    */
    countLeaves() {

        return this.countLeavesRecursive(this.root);

    }

    /*
        Conteo recursivo de hojas.
    */
    countLeavesRecursive(node) {

        if (node === null) {
            return 0;
        }

        if (!node.divided) {
            return 1;
        }

        return (

            this.countLeavesRecursive(node.northWest) +
            this.countLeavesRecursive(node.northEast) +
            this.countLeavesRecursive(node.southWest) +
            this.countLeavesRecursive(node.southEast)

        );

    }

    /*
        Cuenta la cantidad total de partículas
        almacenadas en el árbol.

        Complejidad:
        O(n)
    */
    countParticles() {

        return this.countParticlesRecursive(this.root);

    }

    /*
        Conteo recursivo de partículas.
    */
    countParticlesRecursive(node) {

        if (node === null) {
            return 0;
        }

        let total = node.particles.length;

        if (node.divided) {

            total += this.countParticlesRecursive(node.northWest);
            total += this.countParticlesRecursive(node.northEast);
            total += this.countParticlesRecursive(node.southWest);
            total += this.countParticlesRecursive(node.southEast);

        }

        return total;

    }

}

export default QuadTree;
