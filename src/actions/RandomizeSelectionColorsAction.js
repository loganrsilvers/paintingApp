function collectColorTargets(shapes, targets = []) {
    for (const shape of shapes) {
        if (shape.isShapeGroup) {
            collectColorTargets(shape.children, targets);
            continue;
        }

        const property = shape.styleState?.fillColor !== undefined
            ? "fillColor"
            : shape.styleState?.strokeColor !== undefined
                ? "strokeColor"
                : null;
        if (property && typeof shape.applyStyle === "function") {
            targets.push({ shape, property });
        }
    }

    return targets;
}

class RandomizeSelectionColorsAction {
    constructor(shapes, palette) {
        this.targets = collectColorTargets(shapes);
        this.hasTargets = this.targets.length > 0;
        this.previousStyles = this.targets.map(({ shape, property }) => ({
            shape,
            property,
            value: shape.styleState[property]
        }));
        this.nextStyles = this.#createNextStyles(palette);
    }

    execute() {
        this.#applyStyles(this.nextStyles);
    }

    undo() {
        this.#applyStyles(this.previousStyles);
    }

    redo() {
        this.#applyStyles(this.nextStyles);
    }

    #createNextStyles(palette) {
        const colors = [...new Set(palette.map(({ value }) => value))];
        if (this.targets.length > 0 && colors.length === 0) {
            throw new RangeError("Cannot randomize colors from an empty palette.");
        }

        const availableColors = [...colors];
        return this.targets.map(({ shape, property }) => {
            if (availableColors.length === 0) {
                availableColors.push(...colors);
            }

            const colorIndex = Math.floor(
                Math.random() * availableColors.length
            );
            const [value] = availableColors.splice(colorIndex, 1);
            return { shape, property, value };
        });
    }

    #applyStyles(styles) {
        for (const { shape, property, value } of styles) {
            shape.applyStyle(property, value);
        }
    }
}

export default RandomizeSelectionColorsAction;
