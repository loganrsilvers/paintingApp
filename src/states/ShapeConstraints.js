export function constrainToSquare(start, position) {
    const deltaX = position.x - start.x;
    const deltaY = position.y - start.y;
    const size = Math.max(Math.abs(deltaX), Math.abs(deltaY));

    return {
        x: start.x + (Math.sign(deltaX) || 1) * size,
        y: start.y + (Math.sign(deltaY) || 1) * size
    };
}

export function constrainLineAngle(start, position) {
    const deltaX = position.x - start.x;
    const deltaY = position.y - start.y;
    const length = Math.hypot(deltaX, deltaY);
    const angle = Math.round(Math.atan2(deltaY, deltaX) / (Math.PI / 4)) * (Math.PI / 4);

    return {
        x: start.x + Math.cos(angle) * length,
        y: start.y + Math.sin(angle) * length
    };
}
