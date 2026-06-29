// =====================================================
// MathUtils.js
// Funciones matemáticas reutilizables.
// =====================================================

/*
    Limita un valor entre un mínimo y un máximo.
*/
export function clamp(value, min, max){
    return Math.max(min, Math.min(max, value));
}

/*
    Calcula la distancia al cuadrado entre dos puntos.

    Se usa porque evita calcular la raíz cuadrada
    cuando solo queremos comparar distancias.
*/
export function distanceSquared(x1, y1, x2, y2){

    // Diferencia en X.
    const dx = x2 - x1;

    // Diferencia en Y.
    const dy = y2 - y1;

    // Distancia².
    return dx * dx + dy * dy;
}

/*
    Calcula la distancia real entre dos puntos.
*/
export function distance(x1, y1, x2, y2){

    return Math.sqrt(
        distanceSquared(x1, y1, x2, y2)
    );

}

/*
    Genera un número aleatorio dentro de un rango.
*/
export function randomRange(min, max){

    return min + Math.random() * (max - min);

}
