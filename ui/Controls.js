//==================================================
// Controls.js
// Administra todos los controles de la interfaz.
//
// Se encarga de:
//
// - Leer sliders.
// - Leer botones.
// - Actualizar la simulación.
// - Ejecutar benchmark.
//
// De esta forma main.js permanece limpio.
//==================================================

class Controls{

    /*
        Constructor.

        simulation : motor de simulación.

        benchmark : ejecuta experimentos.
    */
    constructor(simulation, benchmark){

        this.simulation = simulation;

        this.benchmark = benchmark;

    }

    /*
        Inicializa todos los eventos
        de la interfaz.
    */
    initialize(){

        this.initializeSliders();

        this.initializeButtons();

    }

    /*
        Configura todos los sliders.
    */
    initializeSliders(){

        //-------------------------
        // Cantidad de partículas
        //-------------------------

        const particlesSlider =
            document.getElementById("particles");

        particlesSlider.addEventListener(

            "input",

            ()=>{

                const total =
                    Number(particlesSlider.value);

                document.getElementById(

                    "particlesValue"

                ).textContent = total;

                this.simulation.createParticles(

                    total,

                    this.simulation.radius,

                    this.simulation.speed

                );

            }

        );

        //-------------------------
        // Velocidad
        //-------------------------

        const speedSlider =
            document.getElementById("speed");

        speedSlider.addEventListener(

            "input",

            ()=>{

                const value =
                    Number(speedSlider.value);

                document.getElementById(

                    "speedValue"

                ).textContent = value;

                this.simulation.speed = value;

            }

        );

        //-------------------------
        // Radio
        //-------------------------

        const radiusSlider =
            document.getElementById("radius");

        radiusSlider.addEventListener(

            "input",

            ()=>{

                const value =
                    Number(radiusSlider.value);

                document.getElementById(

                    "radiusValue"

                ).textContent = value;

                this.simulation.radius = value;

            }

        );

        //-------------------------
        // Capacidad QuadTree
        //-------------------------

        const capacitySlider =
            document.getElementById("capacity");

        capacitySlider.addEventListener(

            "input",

            ()=>{

                const value =
                    Number(capacitySlider.value);

                document.getElementById(

                    "capacityValue"

                ).textContent = value;

                this.simulation.setCapacity(value);

            }

        );

    }

    /*
        Configura todos los botones.
    */
    initializeButtons(){

        //-------------------------
        // Distribución uniforme
        //-------------------------

        document.getElementById(

            "btnUniform"

        ).onclick = ()=>{

            this.simulation.setDistribution(

                "uniform"

            );

        };

        //-------------------------
        // Clusters
        //-------------------------

        document.getElementById(

            "btnCluster"

        ).onclick = ()=>{

            this.simulation.setDistribution(

                "cluster"

            );

        };

        //-------------------------
        // Alta densidad
        //-------------------------

        document.getElementById(

            "btnDense"

        ).onclick = ()=>{

            this.simulation.setDistribution(

                "dense"

            );

        };

        //-------------------------
        // Benchmark
        //-------------------------

        document.getElementById(

            "btnBenchmark"

        ).onclick = ()=>{

            this.benchmark.clear();

            this.benchmark.run(

                this.simulation

            );

            console.table(

                this.benchmark.getResults()

            );

        };

        //-------------------------
        // Reiniciar
        //-------------------------

        document.getElementById(

            "btnReset"

        ).onclick = ()=>{

            this.simulation.createParticles(

                this.simulation.particles.length,

                this.simulation.radius,

                this.simulation.speed

            );

        };

    }

}

export default Controls;
