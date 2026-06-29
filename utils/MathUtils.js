// utils/MathUtils.js

export function clamp(value, min, max){
    return Math.max(min, Math.min(max, value));
}

export function distanceSquared(x1,y1,x2,y2){

    const dx = x2-x1;
    const dy = y2-y1;

    return dx*dx + dy*dy;

}

export function distance(x1,y1,x2,y2){

    return Math.sqrt(distanceSquared(x1,y1,x2,y2));

}

export function randomRange(min,max){

    return min + Math.random()*(max-min);

}
