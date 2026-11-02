import CopyShortcut from "./CopyShortcut.js";
import CutShortcut from "./CutShortcut.js";
import DeleteShortcut from "./DeleteShortcut.js";
import DownloadPngShortcut from "./DownloadPngShortcut.js";
import DuplicateShortcut from "./DuplicateShortcut.js";
import MoveSelectionShortcut from "./MoveSelectionShortcut.js";
import PasteShortcut from "./PasteShortcut.js";
import RedoShortcut from "./RedoShortcut.js";
import UndoShortcut from "./UndoShortcut.js";

const shortcuts = [
    UndoShortcut,
    RedoShortcut,
    DuplicateShortcut,
    CopyShortcut,
    CutShortcut,
    PasteShortcut,
    DownloadPngShortcut,
    DeleteShortcut,
    MoveSelectionShortcut
];

function isEditableTarget(target) {
    return target instanceof Element &&
        (target.isContentEditable ||
            target.closest("input, textarea, select, [contenteditable='true']"));
}

class KeyboardShortcuts {
    initialize(context) {
        document.addEventListener("keydown", (event) => {
            if (isEditableTarget(event.target)) {
                return;
            }

            const shortcut = shortcuts.find((item) =>
                item.matches(event, context)
            );
            if (!shortcut) {
                return;
            }

            event.preventDefault();
            shortcut.run(event, context);
        });
    }
}

export default new KeyboardShortcuts();
