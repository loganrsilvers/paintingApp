export default {
    matches(event) {
        return (event.ctrlKey || event.metaKey) &&
            !event.shiftKey &&
            event.key.toLowerCase() === "c";
    },
    run(_event, { clipboardManager }) {
        clipboardManager.copySelected();
    }
};
