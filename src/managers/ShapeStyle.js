function parseColor(color) {
    return Number.parseInt(color.slice(1), 16);
}

export function attachShapeStyle(shape, {
    fillGraphic = null,
    strokeGraphic,
    fillPath = null,
    strokePath,
    fillColor,
    strokeColor,
    strokeWidth,
    onStrokeWidthChange = null
}) {
    shape.styleState = { fillColor, strokeColor, strokeWidth };
    shape.styleConfig = {
        fillGraphic,
        strokeGraphic,
        fillPath,
        strokePath,
        onStrokeWidthChange
    };
    shape.applyStyle = (property, value) => {
        if (property === "fillColor") {
            if (!fillGraphic || !fillPath) {
                return false;
            }

            fillGraphic.clear();
            fillPath(fillGraphic).fill({
                color: parseColor(value),
                alpha: 0.5
            });
        } else if (property === "strokeColor" || property === "strokeWidth") {
            const previousWidth = shape.styleState.strokeWidth;
            shape.styleState[property] = value;
            strokeGraphic.clear();
            strokePath(strokeGraphic).stroke({
                color: parseColor(shape.styleState.strokeColor),
                width: shape.styleState.strokeWidth
            });
            if (property === "strokeWidth") {
                onStrokeWidthChange?.(previousWidth, value, shape);
            }
            return true;
        } else {
            return false;
        }

        shape.styleState[property] = value;
        return true;
    };
}
