const MIN_SIZE = 32;
const MAX_SIZE = 96;

export function getRandomSize() {
    return MIN_SIZE + Math.floor(Math.random() * (MAX_SIZE - MIN_SIZE + 1));
}

export function getCenteredPlacement(position, aspectWidth = 1, aspectHeight = 1) {
    if (
        !Number.isFinite(aspectWidth) ||
        !Number.isFinite(aspectHeight) ||
        aspectWidth <= 0 ||
        aspectHeight <= 0
    ) {
        throw new RangeError("Placement dimensions must be positive finite numbers.");
    }

    const scale = getRandomSize() / Math.max(aspectWidth, aspectHeight);
    const width = aspectWidth * scale;
    const height = aspectHeight * scale;

    return {
        start: {
            x: position.x - width / 2,
            y: position.y - height / 2
        },
        end: {
            x: position.x + width / 2,
            y: position.y + height / 2
        }
    };
}

export function isClickPlacement(start, end) {
    return Math.hypot(end.x - start.x, end.y - start.y) <= 1;
}
