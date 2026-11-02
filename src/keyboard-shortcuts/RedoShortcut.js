import HistoryManager from "../managers/HistoryManager.js";

export default {
    matches(event) {
        const command = event.ctrlKey || event.metaKey;
        const key = event.key.toLowerCase();
        return command &&
            ((event.shiftKey && key === "z") || (!event.shiftKey && key === "y"));
    },
    run() {
        HistoryManager.redo();
    }
};
