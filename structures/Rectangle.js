// =====================================================
// Rectangle.js
// Representa una región rectangular del espacio 2D.
// Se utiliza para delimitar los nodos del QuadTree y
// realizar consultas espaciales.
// =====================================================

class Rectangle {

    /*
        Constructor del rectángulo.

        (x,y) representan el centro.
        w y h representan la mitad del ancho y alto.
    */
    constructor(x, y, w, h) {

        // Coordenada X del centro.
        this.x = x;

        // Coordenada Y del centro.
        this.y = y;

        // Mitad del ancho.
        this.w = w;

        // Mitad del alto.
        this.h = h;
    }

    /*
        Verifica si un punto pertenece al rectángulo.

        Complejidad:
        O(1)
    */
    contains(point) {

        return (

            point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h

        );

    }

    /*
        Verifica si dos rectángulos se intersectan.

        Si no existe separación entre ambos,
        entonces existe intersección.

        Complejidad:
        O(1)
    */
    intersects(other) {

        return !(

            other.x - other.w > this.x + this.w ||

            other.x + other.w < this.x - this.w ||

            other.y - other.h > this.y + this.h ||

            other.y + other.h < this.y - this.h

        );

    }

}

// Exporta la clase para ser utilizada
// por QuadTree y otros módulos.
export default Rectangle;
