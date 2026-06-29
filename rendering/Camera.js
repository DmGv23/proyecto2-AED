// =====================================================
// Camera.js
// Administra el canvas donde se dibuja la simulación.
//
// Centraliza el acceso al contexto gráfico para evitar
// código repetido dentro del Renderer.
// =====================================================

class Camera {

    /*
        Constructor.

        canvasId : id del canvas en el HTML.
    */
    constructor(canvasId){

        // Canvas principal.
        this.canvas = document.getElementById(canvasId);

        // Contexto 2D.
        this.ctx = this.canvas.getContext("2d");

        // Dimensiones.
        this.width = this.canvas.width;
        this.height = this.canvas.height;

    }

    /*
        Limpia completamente el canvas.

        Complejidad:
        O(1)
    */
    clear(){

        this.ctx.clearRect(

            0,

            0,

            this.width,

            this.height

        );

    }

}

export default Camera;
