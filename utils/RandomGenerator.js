// =====================================================
// RandomGenerator.js
// Funciones para generar distribuciones de partículas.
// =====================================================

/*
    Genera un número aleatorio con distribución normal
    utilizando el método Box-Muller.

    Se utiliza para crear clusters de partículas.
*/
export function gaussianRandom(){

    // Variables auxiliares.
    let u = 0;
    let v = 0;

    // Evita valores iguales a cero.
    while(u === 0){
        u = Math.random();
    }

    // Evita valores iguales a cero.
    while(v === 0){
        v = Math.random();
    }

    // Fórmula de Box-Muller.
    return Math.sqrt(
        -2 * Math.log(u)
    ) * Math.cos(
        2 * Math.PI * v
    );

}

/*
    Genera una posición uniforme en el espacio.
*/
export function generateUniform(width, height, radius){

    return{

        x: radius + Math.random() * (width - 2 * radius),

        y: radius + Math.random() * (height - 2 * radius)

    };

}

/*
    Genera una posición agrupada en clusters.
*/
export function generateCluster(width, height, radius){

    // Centros posibles para los clusters.
    const centers = [

        {x: width*0.25, y: height*0.25},

        {x: width*0.75, y: height*0.25},

        {x: width*0.50, y: height*0.50},

        {x: width*0.25, y: height*0.75},

        {x: width*0.75, y: height*0.75}

    ];

    // Escoge un centro al azar.
    const center =
        centers[Math.floor(Math.random()*centers.length)];

    // Genera una posición cercana al centro.
    return{

        x: Math.max(
            radius,
            Math.min(
                width-radius,
                center.x + gaussianRandom()*50
            )
        ),

        y: Math.max(
            radius,
            Math.min(
                height-radius,
                center.y + gaussianRandom()*50
            )
        )

    };

}

/*
    Genera una distribución con una zona de alta densidad.
*/
export function generateDense(width, height, radius){

    // 75% de probabilidad de aparecer en la zona densa.
    if(Math.random() < 0.75){

        return{

            x: width*0.65 + Math.random()*width*0.30,

            y: Math.random()*height*0.35

        };

    }

    // El resto se distribuye uniformemente.
    return generateUniform(width, height, radius);

}
