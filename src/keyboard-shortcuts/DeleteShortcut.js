import DeleteManager from "../managers/DeleteManager.js";

export default {
    matches(event) {
        return event.key === "Backspace" || event.key === "Delete";
    },
    run() {
        DeleteManager.deleteSelected();
    }
};
