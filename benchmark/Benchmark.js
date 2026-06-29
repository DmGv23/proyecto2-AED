//==================================================
// Benchmark.js
// Ejecuta la comparación experimental obligatoria.
//
// Compara QuadTree contra fuerza bruta en tres
// tamaños de entrada (pequeño, mediano, grande)
// y tres distribuciones, mostrando los resultados
// en una tabla en la UI.
//
// Tamaños elegidos:
//   - 1,000 partículas (pequeño)
//   - 5,000 partículas (mediano)
//   - 10,000 partículas (grande)
//
// Justificación: cubren el rango donde el speedup
// del QuadTree se vuelve apreciable. Con 1,000
// partículas la diferencia ya es visible; con 10,000
// la ventaja es significativa en máquinas típicas.
//==================================================

import CollisionDetector from "../algorithms/CollisionDetector.js";

// Configuraciones del benchmark: 3 tamaños × 3 distribuciones.
const BENCH_CONFIGS = [
    { n: 1000,  dist: "uniform" },
    { n: 1000,  dist: "cluster" },
    { n: 1000,  dist: "dense"   },
    { n: 5000,  dist: "uniform" },
    { n: 5000,  dist: "cluster" },
    { n: 5000,  dist: "dense"   },
    { n: 10000, dist: "uniform" },
    { n: 10000, dist: "cluster" },
    { n: 10000, dist: "dense"   }
];

// Frames promediados por configuración.
const FRAMES_PER_CONFIG = 60;

class Benchmark {

    constructor() {

        this.running = false;
        this.results = [];

        this.step   = 0;
        this.frames = 0;

        this.acc = this._emptyAcc();

        // Referencia a la simulación activa.
        this._sim = null;

    }

    // ----------------------------------------
    // API pública
    // ----------------------------------------

    /*
        Inicia el benchmark.
        Muestra el panel de resultados y comienza
        a acumular frames en la primera configuración.
    */
    start(simulation) {

        if (this.running) return;

        this._sim    = simulation;
        this.running = true;
        this.results = [];
        this.step    = 0;
        this.frames  = 0;
        this.acc     = this._emptyAcc();

        document.getElementById("benchResult")
            .classList.add("show");

        document.getElementById("benchBody").innerHTML =
            '<tr><td colspan="7" style="color:var(--text-muted);padding:8px">' +
            'Ejecutando benchmark…</td></tr>';

        const cfg = BENCH_CONFIGS[this.step];
        this._applyConfig(cfg);

    }

    /*
        Se llama una vez por frame desde el game loop.
        Acumula métricas y avanza de configuración.
    */
    tick(metrics, simulation) {

        if (!this.running) return;

        this.frames++;

        this.acc.build  += metrics.buildTime;
        this.acc.qt     += metrics.qtComparisons;
        this.acc.brute  += metrics.bruteComparisons;
        this.acc.cands  += metrics.averageCandidates;

        if (this.frames >= FRAMES_PER_CONFIG) {

            this._saveResult();

            this.step++;
            this.frames = 0;
            this.acc    = this._emptyAcc();

            if (this.step >= BENCH_CONFIGS.length) {

                // Benchmark terminado.
                this.running = false;
                this._sim = null;
                this._renderTable();

            } else {

                const cfg = BENCH_CONFIGS[this.step];
                this._applyConfig(cfg);

            }

        }

    }

    // ----------------------------------------
    // Helpers privados
    // ----------------------------------------

    _emptyAcc() {

        return { build: 0, qt: 0, brute: 0, cands: 0 };

    }

    _applyConfig(cfg) {

        this._sim.setDistribution(cfg.dist);
        this._sim.createParticles(
            cfg.n,
            this._sim.radius,
            this._sim.speed
        );

    }

    _saveResult() {

        const f   = FRAMES_PER_CONFIG;
        const cfg = BENCH_CONFIGS[this.step];

        this.results.push({
            n:       cfg.n,
            dist:    cfg.dist,
            build:   (this.acc.build / f).toFixed(2),
            brute:   Math.round(this.acc.brute / f),
            qt:      Math.round(this.acc.qt    / f),
            speedup: (this.acc.brute / Math.max(this.acc.qt, 1)).toFixed(1),
            cands:   (this.acc.cands / f).toFixed(1)
        });

    }

    _renderTable() {

        const distLabel = {
            uniform: "Uniforme",
            cluster: "Clusters",
            dense:   "Alta densidad"
        };

        const tbody = document.getElementById("benchBody");
        tbody.innerHTML = "";

        this.results.forEach(d => {

            const tr = document.createElement("tr");

            tr.innerHTML =
                `<td>${d.n.toLocaleString()}</td>` +
                `<td>${distLabel[d.dist]}</td>` +
                `<td class="blue">${d.build} ms</td>` +
                `<td>${d.brute.toLocaleString()}</td>` +
                `<td class="yellow">${d.qt.toLocaleString()}</td>` +
                `<td class="green">${d.speedup}×</td>` +
                `<td class="yellow">${d.cands}</td>`;

            tbody.appendChild(tr);

        });

    }

}

export default Benchmark;
