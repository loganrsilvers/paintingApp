import CloneShapesAction from "../actions/CloneShapesAction.js";
import HistoryManager from "../managers/HistoryManager.js";

export default {
    matches(event) {
        return (event.ctrlKey || event.metaKey) &&
            !event.shiftKey &&
            event.key.toLowerCase() === "d";
    },
    run(_event, { selectManager }) {
        if (selectManager.Selected.length > 0) {
            HistoryManager.execute(
                new CloneShapesAction(selectManager, selectManager.Selected)
            );
        }
    }
};
