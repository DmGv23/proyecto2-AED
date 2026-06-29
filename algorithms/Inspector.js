// =====================================================
// Inspector.js
// Maneja el modo de inspección de región.
// =====================================================

import Rectangle from "../structures/Rectangle.js";

class Inspector {

    constructor() {
        this.x = 330;   // centro por defecto
        this.y = 210;
        this.pinned = false;
        this.rectCandidates = [];
        this.circleCandidates = [];
        this.neighborRadius = 40;
        this.active = false;  // true cuando inspect mode está ON
    }

    setActive(val) { this.active = val; }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    pin(x, y) {
        this.x = x;
        this.y = y;
        this.pinned = true;
    }

    unpin() {
        this.pinned = false;
    }

    isPinned() { return this.pinned; }

    compute(quadTree, particles, neighborRadius) {

        this.neighborRadius = neighborRadius;

        // La región rectangular usa el mismo radio que el círculo.
        const hw = neighborRadius;
        const qr = new Rectangle(this.x, this.y, hw, hw);

        if (quadTree) {

            this.rectCandidates = quadTree.queryRectangle(qr);

            const bigR = new Rectangle(this.x, this.y, neighborRadius, neighborRadius);
            const rough = quadTree.queryRectangle(bigR);

            this.circleCandidates = rough.filter(p => {
                const dx = p.x - this.x;
                const dy = p.y - this.y;
                return dx * dx + dy * dy <= neighborRadius * neighborRadius;
            });

        } else {

            this.rectCandidates = particles.filter(p => qr.contains(p));

            this.circleCandidates = particles.filter(p => {
                const dx = p.x - this.x;
                const dy = p.y - this.y;
                return dx * dx + dy * dy <= neighborRadius * neighborRadius;
            });

        }

        // Marcar flags en partículas.
        const rectSet  = new Set(this.rectCandidates.map(p => p.id));
        const circSet  = new Set(this.circleCandidates.map(p => p.id));

        for (const p of particles) {
            p.isRectCandidate   = rectSet.has(p.id);
            p.isCircleCandidate = circSet.has(p.id);
        }

    }

    clear(particles = []) {
        this.rectCandidates  = [];
        this.circleCandidates = [];
        for (const p of particles) {
            p.isRectCandidate   = false;
            p.isCircleCandidate = false;
        }
    }

    getDrawData() {
        return {
            x: this.x,
            y: this.y,
            pinned: this.pinned,
            neighborRadius: this.neighborRadius,
            rectCount:   this.rectCandidates.length,
            circleCount: this.circleCandidates.length
        };
    }

}

export default Inspector;
