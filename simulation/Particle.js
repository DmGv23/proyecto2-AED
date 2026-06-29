// =====================================================
// Particle.js
// Representa una partícula dentro de la simulación.
//
// Cada partícula almacena su posición, velocidad,
// radio y estado de colisión.
// =====================================================

class Particle {

    /*
        Constructor de la partícula.
    */
    constructor(id, x, y, vx, vy, radius) {

        // Identificador único.
        this.id = id;

        // Posición en el eje X.
        this.x = x;

        // Posición en el eje Y.
        this.y = y;

        // Velocidad horizontal.
        this.vx = vx;

        // Velocidad vertical.
        this.vy = vy;

        // Radio de la partícula.
        this.radius = radius;

        // Indica si está colisionando.
        this.colliding = false;

        // Indica si es candidato de una consulta de inspección.
        this.isRectCandidate = false;

        // Indica si es vecino circular en una consulta de inspección.
        this.isCircleCandidate = false;

    }

    /*
        Actualiza la posición según la velocidad.

        Complejidad:
        O(1)
    */
    move() {

        this.x += this.vx;
        this.y += this.vy;

    }

    /*
        Reinicia el estado de colisión y candidatura.

        Se ejecuta al inicio de cada frame.

        Complejidad:
        O(1)
    */
    resetCollision() {

        this.colliding = false;
        this.isRectCandidate = false;
        this.isCircleCandidate = false;

    }

    /*
        Marca la partícula como colisionando.

        Complejidad:
        O(1)
    */
    setCollision() {

        this.colliding = true;

    }

    /*
        Hace rebotar la partícula cuando
        toca los límites del canvas.

        Complejidad:
        O(1)
    */
    bounce(width, height) {

        // Límite izquierdo.
        if (this.x - this.radius < 0) {

            this.x = this.radius;
            this.vx *= -1;

        }

        // Límite derecho.
        if (this.x + this.radius > width) {

            this.x = width - this.radius;
            this.vx *= -1;

        }

        // Límite superior.
        if (this.y - this.radius < 0) {

            this.y = this.radius;
            this.vy *= -1;

        }

        // Límite inferior.
        if (this.y + this.radius > height) {

            this.y = height - this.radius;
            this.vy *= -1;

        }

    }

    /*
        Calcula la distancia al cuadrado
        hacia otra partícula.

        Se utiliza para evitar calcular
        raíces cuadradas durante la
        detección de colisiones.

        Complejidad:
        O(1)
    */
    distanceSquared(other) {

        const dx = this.x - other.x;
        const dy = this.y - other.y;

        return dx * dx + dy * dy;

    }

}

export default Particle;
