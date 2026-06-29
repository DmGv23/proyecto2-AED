// =====================================================
// Renderer.js
// Responsable de dibujar toda la simulación.
//
// NO realiza cálculos.
// NO detecta colisiones.
// NO construye el QuadTree.
//
// Únicamente representa visualmente el estado
// actual de la simulación.
// =====================================================

class Renderer{

    /*
        Constructor.

        camera : objeto Camera que administra
        el canvas.
    */
    constructor(camera){

        // Cámara utilizada para dibujar.
        this.camera = camera;

        // Contexto gráfico.
        this.ctx = camera.ctx;

    }

    /*
        Función principal de dibujo.

        Se ejecuta una vez por frame.
    */
    render(

        particles,

        quadTree,

        metrics,

        inspectData = null

    ){

        // Limpiar pantalla.
        this.camera.clear();

        // Dibujar subdivisiones.
        this.drawQuadTree(

            quadTree.root

        );

        // Dibujar partículas.
        this.drawParticles(

            particles

        );

        // Dibujar modo inspección.
        if(inspectData){

            this.drawInspect(

                inspectData

            );

        }

        // Dibujar métricas.
        this.drawMetrics(

            metrics

        );

    }

    /*
        Dibuja todas las partículas.
    */
    drawParticles(particles){

        for(const particle of particles){

            this.ctx.beginPath();

            this.ctx.arc(

                particle.x,

                particle.y,

                particle.radius,

                0,

                Math.PI*2

            );

            // Color según colisión.
            if(

                particle.colliding

            ){

                this.ctx.fillStyle =
                    "#ff5f5f";

            }

            else{

                this.ctx.fillStyle =
                    "#4e9eff";

            }

            this.ctx.fill();

        }

    }

    /*
        Dibuja recursivamente
        todos los nodos del QuadTree.
    */
    drawQuadTree(node){

        if(!node){

            return;

        }

        const b = node.boundary;

        this.ctx.strokeStyle =
            "rgba(100,255,180,0.25)";

        this.ctx.lineWidth = 1;

        this.ctx.strokeRect(

            b.x-b.w,

            b.y-b.h,

            b.w*2,

            b.h*2

        );

        if(node.divided){

            this.drawQuadTree(

                node.northWest

            );

            this.drawQuadTree(

                node.northEast

            );

            this.drawQuadTree(

                node.southWest

            );

            this.drawQuadTree(

                node.southEast

            );

        }

    }

    /*
        Dibuja la región
        actualmente inspeccionada.
    */
    drawInspect(data){

        this.ctx.strokeStyle =
            "#ffe066";

        this.ctx.lineWidth = 2;

        this.ctx.strokeRect(

            data.x-data.w,

            data.y-data.h,

            data.w*2,

            data.h*2

        );

    }


    /*
        Dibuja las métricas
        principales sobre el canvas.
    */
    drawMetrics(metrics){

        this.ctx.fillStyle =
            "white";

        this.ctx.font =
            "14px Arial";

        this.ctx.fillText(

            `FPS: ${metrics.fps.toFixed(0)}`,

            10,

            20

        );

        this.ctx.fillText(

            `Build: ${metrics.buildTime.toFixed(2)} ms`,

            10,

            40

        );

        this.ctx.fillText(

            `QT Comparisons: ${metrics.qtComparisons}`,

            10,

            60

        );

        this.ctx.fillText(

            `Brute Comparisons: ${metrics.bruteComparisons}`,

            10,

            80

        );

        this.ctx.fillText(

            `Visited Nodes: ${metrics.visitedNodes}`,

            10,

            100

        );

        this.ctx.fillText(

            `Candidates: ${metrics.averageCandidates.toFixed(2)}`,

            10,

            120

        );

        this.ctx.fillText(

            `Speedup: ${metrics.speedup.toFixed(1)}x`,

            10,

            140

        );

    }

}

export default Renderer;
