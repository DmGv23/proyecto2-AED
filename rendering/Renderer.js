//==================================================
// Renderer.js
// Encargado de representar visualmente
// toda la simulación.
//
// Dibuja:
//   - Subdivisiones del QuadTree
//   - Partículas (coloreadas por estado)
//   - Región de inspección (rect + círculo)
//   - Métricas en canvas (fallback)
//==================================================

class Renderer {

    constructor(canvas) {

        this.canvas = canvas;
        this.ctx    = canvas.getContext("2d");

    }

    /*
        Dibuja un frame completo.

        simulation : instancia de Simulation
        metrics    : objeto con las métricas actuales
        inspector  : instancia de Inspector (puede ser null)
    */
    render(simulation, metrics, inspector = null) {

        const ctx = this.ctx;

        // Limpiar canvas.
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 1. Dibujar subdivisiones del QuadTree.
        if (simulation.getQuadTree()) {
            this.drawQuadTree(simulation.getQuadTree().root);
        }

        // 2. Dibujar partículas.
        this.drawParticles(simulation.getParticles());

        // 3. Dibujar región de inspección encima.
        if (inspector) {
            this.drawInspectRegion(inspector.getDrawData());
        }

    }

    // ----------------------------------------
    // QuadTree
    // ----------------------------------------

    /*
        Dibuja recursivamente los límites de los nodos.
    */
    drawQuadTree(node) {

        if (!node) return;

        const ctx = this.ctx;
        const b   = node.boundary;

        ctx.strokeStyle = "rgba(100,255,180,0.2)";
        ctx.lineWidth   = 0.5;

        ctx.strokeRect(
            b.x - b.w,
            b.y - b.h,
            b.w * 2,
            b.h * 2
        );

        if (node.divided) {

            this.drawQuadTree(node.northWest);
            this.drawQuadTree(node.northEast);
            this.drawQuadTree(node.southWest);
            this.drawQuadTree(node.southEast);

        }

    }

    // ----------------------------------------
    // Partículas
    // ----------------------------------------

    drawParticles(particles) {

        const ctx = this.ctx;

        for (const p of particles) {

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

            // Prioridad de color:
            // vecino circular > candidato rect > colisionando > normal
            if (p.isCircleCandidate) {

                ctx.fillStyle = "rgba(196,255,160,0.95)";

            } else if (p.isRectCandidate) {

                ctx.fillStyle = "rgba(255,220,50,0.95)";

            } else if (p.colliding) {

                ctx.fillStyle = "rgba(255,95,95,0.9)";

            } else {

                ctx.fillStyle = "rgba(78,158,255,0.85)";

            }

            ctx.fill();

            // Borde para candidatos.
            if (p.isCircleCandidate || p.isRectCandidate) {

                ctx.strokeStyle = p.isCircleCandidate
                    ? "#c4ffa0"
                    : "#ffe066";

                ctx.lineWidth = 1.5;
                ctx.stroke();

            }

        }

    }

    // ----------------------------------------
    // Región de inspección
    // ----------------------------------------

    drawInspectRegion(data) {

        if (!data) return;

        const ctx = this.ctx;
        const { x, y, pinned, neighborRadius, rectCount, circleCount } = data;

        const hw = neighborRadius; // coincide con Inspector.js

        // --- Rectángulo de consulta ---
        ctx.fillStyle = "rgba(255,220,50,0.08)";
        ctx.fillRect(x - hw, y - hw, hw * 2, hw * 2);

        ctx.strokeStyle = pinned
            ? "#ffe066"
            : "rgba(255,220,50,0.6)";
        ctx.lineWidth   = pinned ? 2 : 1.5;
        ctx.setLineDash(pinned ? [] : [5, 4]);
        ctx.strokeRect(x - hw, y - hw, hw * 2, hw * 2);
        ctx.setLineDash([]);

        // --- Círculo de vecindad ---
        ctx.beginPath();
        ctx.arc(x, y, neighborRadius, 0, Math.PI * 2);
        ctx.fillStyle   = "rgba(196,255,160,0.05)";
        ctx.fill();

        ctx.strokeStyle = pinned
            ? "#c4ffa0"
            : "rgba(196,255,160,0.5)";
        ctx.lineWidth   = pinned ? 2 : 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // --- Crosshair ---
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth   = 0.8;
        ctx.beginPath();
        ctx.moveTo(x - 8, y); ctx.lineTo(x + 8, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y - 8); ctx.lineTo(x, y + 8);
        ctx.stroke();

        // --- Etiquetas de conteo ---
        const lbl1 = `rect: ${rectCount} cands`;
        const lbl2 = `radio: ${circleCount} vecinos`;

        ctx.font = "500 12px sans-serif";

        const W  = this.canvas.width;
        const tw = Math.max(
            ctx.measureText(lbl1).width,
            ctx.measureText(lbl2).width
        );

        let lx = x + neighborRadius + 8;
        let ly = y - 20;

        if (lx + tw + 14 > W) lx = x - neighborRadius - tw - 16;
        if (ly < 14)          ly = 14;

        ctx.fillStyle = "rgba(10,10,15,0.85)";
        ctx.fillRect(lx - 4, ly - 13, tw + 12, pinned ? 50 : 38);

        ctx.fillStyle = "#ffe066";
        ctx.fillText(lbl1, lx + 2, ly);

        ctx.fillStyle = "#c4ffa0";
        ctx.fillText(lbl2, lx + 2, ly + 18);

        if (pinned) {

            ctx.font      = "11px sans-serif";
            ctx.fillStyle = "rgba(255,255,255,0.3)";
            ctx.fillText("dbl clic para soltar", lx + 2, ly + 34);

        }

    }

}

export default Renderer;
