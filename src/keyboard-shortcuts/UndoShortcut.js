import HistoryManager from "../managers/HistoryManager.js";

export default {
    matches(event) {
        return (event.ctrlKey || event.metaKey) &&
            !event.shiftKey &&
            event.key.toLowerCase() === "z";
    },
    run() {
        HistoryManager.undo();
    }
};
