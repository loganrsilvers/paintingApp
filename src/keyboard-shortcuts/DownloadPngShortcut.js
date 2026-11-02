export default {
    matches(event) {
        return (event.ctrlKey || event.metaKey) &&
            !event.shiftKey &&
            event.key.toLowerCase() === "p";
    },
    run(_event, { downloadPng }) {
        downloadPng();
    }
};
