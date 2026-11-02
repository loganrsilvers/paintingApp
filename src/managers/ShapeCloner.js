import { Container, Graphics, Sprite } from "pixi.js";
import { attachShapeStyle } from "./ShapeStyle.js";

function copyTransform(source, target) {
    target.position.set(source.position.x, source.position.y);
    target.scale.set(source.scale.x, source.scale.y);
    target.pivot.set(source.pivot.x, source.pivot.y);
    target.skew.set(source.skew.x, source.skew.y);
    target.rotation = source.rotation;
    target.alpha = source.alpha;
    target.visible = source.visible;
    target.renderable = source.renderable;
    target.zIndex = source.zIndex;
}

function cloneDisplayObject(source, clones) {
    let clone;
    if (source instanceof Graphics) {
        clone = source.clone(true);
    } else if (source instanceof Sprite) {
        clone = new Sprite(source.texture);
        clone.anchor.set(source.anchor.x, source.anchor.y);
        clone.tint = source.tint;
    } else if (source instanceof Container) {
        clone = new Container();
        for (const child of source.children) {
            clone.addChild(cloneDisplayObject(child, clones));
        }
    } else {
        throw new TypeError("Cannot duplicate an unsupported shape display object.");
    }

    copyTransform(source, clone);
    clone.label = source.label;
    clone.eventMode = source.eventMode;
    clones.set(source, clone);
    return clone;
}

function restoreMasks(clones) {
    for (const [source, clone] of clones) {
        if (source.mask && clones.has(source.mask)) {
            clone.mask = clones.get(source.mask);
        }
    }
}

class ShapeCloner {
    clone(shape) {
        const clones = new Map();
        const clonedShape = cloneDisplayObject(shape, clones);
        restoreMasks(clones);
        clonedShape.selectionBounds = { ...shape.selectionBounds };

        if (shape.styleConfig) {
            const config = shape.styleConfig;
            attachShapeStyle(clonedShape, {
                ...config,
                ...shape.styleState,
                fillGraphic: clones.get(config.fillGraphic) ?? null,
                strokeGraphic: clones.get(config.strokeGraphic)
            });
        }

        if (shape.fillGraphic) {
            clonedShape.fillGraphic = clones.get(shape.fillGraphic);
            clonedShape.maskGraphic = clones.get(shape.maskGraphic);
            clonedShape.overlaySprite = clones.get(shape.overlaySprite);
            clonedShape.strokeGraphic = clones.get(shape.strokeGraphic);
        }

        return clonedShape;
    }
}

export default new ShapeCloner();
