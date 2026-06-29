//==================================================
// Renderer.js
// Encargado de representar visualmente
// toda la simulación.
//==================================================

class Renderer {

    /*
        Constructor.
    */
    constructor(canvas) {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

    }

    /*
        Dibuja un frame completo.
    */
    render(simulation, metrics) {

        // Limpiar canvas.
        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        // Dibujar QuadTree.
        this.drawQuadTree(simulation.getQuadTree().root);

        // Dibujar partículas.
        this.drawParticles(simulation.getParticles());

        // Dibujar métricas.
        this.drawMetrics(metrics);

    }

    /*
        Dibuja todas las partículas.
    */
    drawParticles(particles) {

        for (const particle of particles) {

            this.ctx.beginPath();

            this.ctx.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            this.ctx.fillStyle = particle.colliding
                ? "#ff3b30"
                : "#3fa9f5";

            this.ctx.fill();

        }

    }

    /*
        Dibuja recursivamente el QuadTree.
    */
    drawQuadTree(node) {

        if (!node) {
            return;
        }

        const boundary = node.boundary;

        this.ctx.strokeStyle = "#66bbff";
        this.ctx.lineWidth = 1;

        this.ctx.strokeRect(
            boundary.x - boundary.w,
            boundary.y - boundary.h,
            boundary.w * 2,
            boundary.h * 2
        );

        if (node.divided) {

            this.drawQuadTree(node.northWest);
            this.drawQuadTree(node.northEast);
            this.drawQuadTree(node.southWest);
            this.drawQuadTree(node.southEast);

        }

    }

    /*
        Dibuja las métricas de la simulación.
    */
    drawMetrics(metrics) {

        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "14px Arial";

        let y = 20;

        this.ctx.fillText(`FPS: ${metrics.fps.toFixed(0)}`, 10, y);
        y += 20;

        this.ctx.fillText(`Build: ${metrics.buildTime.toFixed(2)} ms`, 10, y);
        y += 20;

        this.ctx.fillText(`Query: ${metrics.queryTime.toFixed(2)} ms`, 10, y);
        y += 20;

        this.ctx.fillText(`QT Comparisons: ${metrics.qtComparisons}`, 10, y);
        y += 20;

        this.ctx.fillText(`Brute Comparisons: ${metrics.bruteComparisons}`, 10, y);
        y += 20;

        this.ctx.fillText(`Visited Nodes: ${metrics.visitedNodes}`, 10, y);
        y += 20;

        this.ctx.fillText(
            `Candidates: ${metrics.averageCandidates.toFixed(2)}`,
            10,
            y
        );
        y += 20;

        this.ctx.fillText(
            `Speedup: ${metrics.speedup.toFixed(2)}x`,
            10,
            y
        );

    }

}

export default Renderer;
