export default {
    matches(event) {
        return (event.ctrlKey || event.metaKey) &&
            !event.shiftKey &&
            event.key.toLowerCase() === "v";
    },
    run(_event, { clipboardManager }) {
        clipboardManager.paste();
    }
};
