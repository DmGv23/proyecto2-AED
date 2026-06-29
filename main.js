//==================================================
// main.js
//==================================================

import Renderer    from "./rendering/Renderer.js";
import Simulation  from "./simulation/Simulation.js";
import Benchmark   from "./benchmark/Benchmark.js";
import CollisionDetector from "./algorithms/CollisionDetector.js";
import Inspector   from "./algorithms/Inspector.js";

import {
    DEFAULT_PARTICLES,
    DEFAULT_RADIUS,
    DEFAULT_SPEED,
    DEFAULT_NEIGHBOR_RADIUS
} from "./utils/Constants.js";

// ── Canvas ────────────────────────────────────────
const canvas = document.getElementById("cv");

// ── Módulos ───────────────────────────────────────
const renderer  = new Renderer(canvas);
const simulation = new Simulation();
const benchmark  = new Benchmark();
const inspector  = new Inspector();

// ── Estado de UI ──────────────────────────────────
let inspectMode    = false;
let neighborRadius = DEFAULT_NEIGHBOR_RADIUS;

// ── Partículas iniciales ──────────────────────────
simulation.createParticles(DEFAULT_PARTICLES, DEFAULT_RADIUS, DEFAULT_SPEED);

// ── Métricas ──────────────────────────────────────
const metrics = {
    fps: 0, buildTime: 0, queryTime: 0,
    bruteComparisons: 0, qtComparisons: 0,
    visitedNodes: 0, averageCandidates: 0, speedup: 0
};

let lastFrame  = performance.now();
let fpsArr     = [];
let frameCount = 0;

// ── Game loop ─────────────────────────────────────
function gameLoop(now) {

    const dt = now - lastFrame;
    lastFrame = now;
    fpsArr.push(1000 / Math.max(dt, 1));
    if (fpsArr.length > 30) fpsArr.shift();

    // 1. Mover partículas
    simulation.update();

    // 2. Reconstruir QuadTree
    simulation.rebuildQuadTree();
    metrics.buildTime = simulation.getBuildTime();

    // 3. Colisiones QT
    const startQ = performance.now();
    const result = CollisionDetector.detectQuadTree(
        simulation.getQuadTree(),
        simulation.getParticles()
    );
    metrics.queryTime       = performance.now() - startQ;
    metrics.qtComparisons   = result.comparisons;
    metrics.averageCandidates = result.averageCandidates;
    metrics.visitedNodes    = result.visitedNodes;

    // 4. Comparaciones bruta (sin marcar)
    metrics.bruteComparisons = CollisionDetector.detectBruteForce(
        simulation.getParticles(), false
    );

    metrics.speedup = metrics.bruteComparisons /
        Math.max(metrics.qtComparisons, 1);

    // 5. Inspección
    if (inspectMode) {
        inspector.compute(
            simulation.getQuadTree(),
            simulation.getParticles(),
            neighborRadius
        );
    } else {
        inspector.clear(simulation.getParticles());
    }

    // 6. Benchmark tick
    benchmark.tick(metrics, simulation);

    // 7. UI cada 10 frames
    frameCount++;
    if (frameCount % 10 === 0) updateUI();

    // 8. Dibujar
    renderer.render(simulation, metrics, inspectMode ? inspector : null);

    requestAnimationFrame(gameLoop);
}

function updateUI() {
    const fps = Math.round(fpsArr.reduce((a,b)=>a+b,0)/fpsArr.length);
    document.getElementById("mfps").textContent    = fps;
    document.getElementById("mbuild").textContent  = metrics.buildTime.toFixed(2) + " ms";
    const n  = simulation.getParticles().length;
    const bc = Math.round(n * (n-1) / 2);
    document.getElementById("mbrute").textContent  = bc.toLocaleString();
    document.getElementById("mqt").textContent     = metrics.qtComparisons.toLocaleString();
    document.getElementById("mspeedup").textContent = (bc / Math.max(metrics.qtComparisons,1)).toFixed(1) + "×";
    document.getElementById("mcands").textContent  = metrics.averageCandidates.toFixed(1);
}

// ── Helpers de coordenadas ────────────────────────
function canvasCoords(e) {
    const r  = canvas.getBoundingClientRect();
    const sx = canvas.width  / r.width;
    const sy = canvas.height / r.height;
    return {
        x: (e.clientX - r.left) * sx,
        y: (e.clientY - r.top)  * sy
    };
}

// ── Eventos canvas ────────────────────────────────
canvas.addEventListener("mousemove", e => {
    if (!inspectMode || inspector.isPinned()) return;
    const c = canvasCoords(e);
    inspector.moveTo(c.x, c.y);
});

canvas.addEventListener("click", e => {
    if (!inspectMode) return;
    const c = canvasCoords(e);
    inspector.pin(c.x, c.y);
});

canvas.addEventListener("dblclick", () => {
    if (!inspectMode) return;
    inspector.unpin();
});

// ── Controles globales ────────────────────────────
window.setDist = function(d) {
    simulation.setDistribution(d);
    document.querySelectorAll(".btn-dist").forEach(b => b.className = "btn-dist");
    const map = { uniform:"active-uniform", cluster:"active-cluster", dense:"active-dense" };
    document.getElementById("b" + d[0].toUpperCase() + d.slice(1))
            .classList.add(map[d]);
};

window.toggleInspect = function() {
    inspectMode = !inspectMode;
    if (!inspectMode) inspector.clear(simulation.getParticles());

    document.getElementById("bInspect")
            .classList.toggle("inspect-on", inspectMode);
    document.getElementById("inspectHint").style.display =
        inspectMode ? "block" : "none";
};

window.resetParticles = function() { simulation.reset(); };

window.runBenchmark = function() { benchmark.start(simulation); };

// ── Sliders ───────────────────────────────────────
document.getElementById("nslider").oninput = function() {
    const n = +this.value;
    document.getElementById("nout").textContent = n;
    simulation.createParticles(n, simulation.radius, simulation.speed);
};

document.getElementById("vslider").oninput = function() {
    const s = +this.value;
    document.getElementById("vout").textContent = s.toFixed(1);
    simulation.speed = s;
    simulation.getParticles().forEach(p => {
        const a = Math.atan2(p.vy, p.vx);
        p.vx = Math.cos(a) * s;
        p.vy = Math.sin(a) * s;
    });
};

document.getElementById("cslider").oninput = function() {
    const c = +this.value;
    document.getElementById("cout").textContent = c;
    simulation.setCapacity(c);
};

document.getElementById("rslider").oninput = function() {
    const r = +this.value;
    document.getElementById("rout").textContent = r;
    simulation.radius = r;
    simulation.getParticles().forEach(p => p.radius = r);
};

document.getElementById("rneigh").oninput = function() {
    neighborRadius = +this.value;
    document.getElementById("rneighout").textContent = neighborRadius + " px";
};

// ── Arrancar ──────────────────────────────────────
requestAnimationFrame(gameLoop);
