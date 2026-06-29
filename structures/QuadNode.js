// =====================================================
// QuadNode.js
// Representa un nodo del QuadTree.
//
// Cada nodo almacena una región rectangular,
// las partículas que pertenecen a dicha región y,
// cuando supera su capacidad, se divide en cuatro hijos.
// =====================================================

import Rectangle from "./Rectangle.js";

class QuadNode {

    /*
        Constructor del nodo.

        boundary : Región rectangular que representa.

        capacity : Máximo número de partículas antes
                   de subdividir el nodo.
    */
    constructor(boundary, capacity) {

        // Región del espacio que representa el nodo.
        this.boundary = boundary;

        // Cantidad máxima de partículas permitidas.
        this.capacity = capacity;

        // Partículas almacenadas en este nodo.
        this.particles = [];

        // Indica si el nodo ya fue subdividido.
        this.divided = false;

        // Hijos del QuadTree.
        this.northWest = null;
        this.northEast = null;
        this.southWest = null;
        this.southEast = null;

    }

    /*
        Indica si el nodo es hoja.

        Complejidad:
        O(1)
    */
    isLeaf() {

        return !this.divided;

    }

    /*
        Divide el nodo en cuatro cuadrantes.

        Cada hijo recibe una cuarta parte del área.

        Complejidad:
        O(1)
    */
    subdivide() {

        // Centro del nodo.
        const x = this.boundary.x;
        const y = this.boundary.y;

        // Mitad del ancho y alto.
        const w = this.boundary.w / 2;
        const h = this.boundary.h / 2;

        // Cuadrante superior izquierdo.
        this.northWest = new QuadNode(

            new Rectangle(
                x - w,
                y - h,
                w,
                h
            ),

            this.capacity

        );

        // Cuadrante superior derecho.
        this.northEast = new QuadNode(

            new Rectangle(
                x + w,
                y - h,
                w,
                h
            ),

            this.capacity

        );

        // Cuadrante inferior izquierdo.
        this.southWest = new QuadNode(

            new Rectangle(
                x - w,
                y + h,
                w,
                h
            ),

            this.capacity

        );

        // Cuadrante inferior derecho.
        this.southEast = new QuadNode(

            new Rectangle(
                x + w,
                y + h,
                w,
                h
            ),

            this.capacity

        );

        // El nodo deja de ser hoja.
        this.divided = true;

    }

}

export default QuadNode;
