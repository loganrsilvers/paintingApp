import DeleteManager from "../managers/DeleteManager.js";

export default {
    matches(event) {
        return (event.ctrlKey || event.metaKey) &&
            !event.shiftKey &&
            event.key.toLowerCase() === "x";
    },
    run(_event, { clipboardManager }) {
        clipboardManager.copySelected();
        DeleteManager.deleteSelected();
    }
};
