//==================================================
// Renderer.js
// Encargado de representar visualmente la simulación.
//
// No realiza cálculos.
// No modifica partículas.
// Solo dibuja.
//==================================================

import{

PARTICLE_COLOR,
COLLISION_COLOR,
QT_COLOR,
INSPECT_COLOR,
TEXT_COLOR

}from"./Colors.js";

class Renderer{

    constructor(camera){

        this.camera=camera;

        this.ctx=camera.ctx;

    }

    /*
        Dibuja todo un frame.
    */
    render(

        simulation,

        metrics,

        inspect=null

    ){

        this.camera.clear();

        this.drawQuadTree(

            simulation.quadTree.root

        );

        this.drawParticles(

            simulation.particles

        );

        if(inspect){

            this.drawInspect(inspect);

        }

        this.drawMetrics(metrics);

    }

    /*
        Dibuja todas las partículas.
    */
    drawParticles(particles){

        for(const p of particles){

            this.ctx.beginPath();

            this.ctx.arc(

                p.x,

                p.y,

                p.radius,

                0,

                Math.PI*2

            );

            this.ctx.fillStyle=

                p.colliding

                ?

                COLLISION_COLOR

                :

                PARTICLE_COLOR;

            this.ctx.fill();

        }

    }

    /*
        Dibuja recursivamente
        el QuadTree.
    */
    drawQuadTree(node){

        if(!node){

            return;

        }

        const b=node.boundary;

        this.ctx.strokeStyle=QT_COLOR;

        this.ctx.strokeRect(

            b.x-b.w,

            b.y-b.h,

            b.w*2,

            b.h*2

        );

        if(node.divided){

            this.drawQuadTree(node.northWest);

            this.drawQuadTree(node.northEast);

            this.drawQuadTree(node.southWest);

            this.drawQuadTree(node.southEast);

        }

    }

    /*
        Dibuja la región inspeccionada.
    */
    drawInspect(region){

        this.ctx.strokeStyle=

            INSPECT_COLOR;

        this.ctx.lineWidth=2;

        this.ctx.strokeRect(

            region.x-region.w,

            region.y-region.h,

            region.w*2,

            region.h*2

        );

    }

    /*
        Dibuja las métricas.
    */
    drawMetrics(metrics){

        this.ctx.fillStyle=TEXT_COLOR;

        this.ctx.font="14px Arial";

        let y=20;

        this.ctx.fillText(

            `FPS: ${metrics.fps.toFixed(0)}`,

            10,

            y

        );

        y+=20;

        this.ctx.fillText(

            `Build: ${metrics.buildTime.toFixed(2)} ms`,

            10,

            y

        );

        y+=20;

        this.ctx.fillText(

            `Query: ${metrics.queryTime.toFixed(2)} ms`,

            10,

            y

        );

        y+=20;

        this.ctx.fillText(

            `QT Comparisons: ${metrics.qtComparisons}`,

            10,

            y

        );

        y+=20;

        this.ctx.fillText(

            `Brute Comparisons: ${metrics.bruteComparisons}`,

            10,

            y

        );

        y+=20;

        this.ctx.fillText(

            `Visited Nodes: ${metrics.visitedNodes}`,

            10,

            y

        );

        y+=20;

        this.ctx.fillText(

            `Candidates: ${metrics.averageCandidates.toFixed(2)}`,

            10,

            y

        );

        y+=20;

        this.ctx.fillText(

            `Speedup: ${metrics.speedup.toFixed(2)}x`,

            10,

            y

        );

    }

}

export default Renderer;
