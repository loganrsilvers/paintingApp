import MoveManager from "../managers/MoveManager.js";

const keyDeltas = {
    ArrowUp: [0, -1],
    w: [0, -1],
    ArrowDown: [0, 1],
    s: [0, 1],
    ArrowLeft: [-1, 0],
    a: [-1, 0],
    ArrowRight: [1, 0],
    d: [1, 0]
};

function getKey(event) {
    return event.key.length === 1 ? event.key.toLowerCase() : event.key;
}

export default {
    matches(event, { drawManager }) {
        return drawManager.currentState === MoveManager &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey &&
            Object.hasOwn(keyDeltas, getKey(event));
    },
    run(event) {
        const [deltaX, deltaY] = keyDeltas[getKey(event)];
        const distance = event.shiftKey ? 10 : 1;
        MoveManager.moveSelectedByKeyboard(
            deltaX * distance,
            deltaY * distance
        );
    }
};
