import DrawAsciiAction from "../actions/DrawAsciiAction.js";
import HistoryManager from "../managers/HistoryManager.js";

const graphemeSegmenter = typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

function getGraphemes(text) {
    return graphemeSegmenter
        ? Array.from(graphemeSegmenter.segment(text), ({ segment }) => segment)
        : Array.from(text);
}

class DrawAsciiState {
    constructor(stage, pattern, colorState, drawingOptions, canvasBounds) {
        this.stage = stage;
        this.pattern = getGraphemes(pattern);
        this.colorState = colorState;
        this.drawingOptions = drawingOptions;
        this.canvasBounds = canvasBounds;
        this.isDrawing = false;
        this.action = null;
        this.lastPosition = null;
        this.nextGlyphDistance = 0;
        this.glyphIndex = 0;
        this.fontSize = 14;
        this.spacing = 12.6;
        this.style = null;
        this.fillColor = null;
        this.rainbowEnabled = false;
    }

    onPointerDown(position) {
        this.isDrawing = true;
        this.lastPosition = this.clampPosition(position);
        this.glyphIndex = 0;
        this.fontSize = Math.min(
            64,
            Math.max(14, Number(this.colorState.strokeWidth) * 4)
        );
        this.spacing = this.fontSize * 0.9;
        this.nextGlyphDistance = this.spacing;
        this.fillColor = this.colorState.fillColor;
        this.rainbowEnabled = this.drawingOptions.rainbowEnabled;
        this.style = {
            fontFamily: "monospace",
            fontSize: this.fontSize
        };
        this.action = new DrawAsciiAction(this.stage);
        this.drawNextGlyph(this.lastPosition);
    }

    onPointerMove(position) {
        if (!this.isDrawing) {
            return;
        }

        const end = this.clampPosition(position);
        const deltaX = end.x - this.lastPosition.x;
        const deltaY = end.y - this.lastPosition.y;
        const distance = Math.hypot(deltaX, deltaY);
        if (distance === 0) {
            return;
        }

        let traveled = 0;
        while (traveled + this.nextGlyphDistance <= distance) {
            traveled += this.nextGlyphDistance;
            const ratio = traveled / distance;
            this.drawNextGlyph({
                x: this.lastPosition.x + deltaX * ratio,
                y: this.lastPosition.y + deltaY * ratio
            });
            this.nextGlyphDistance = this.spacing;
        }

        this.nextGlyphDistance -= distance - traveled;
        this.lastPosition = end;
    }

    onPointerUp(position) {
        if (!this.isDrawing) {
            return;
        }

        this.onPointerMove(position);
        this.isDrawing = false;
        HistoryManager.recordExecuted(this.action);
        this.action = null;
        this.lastPosition = null;
    }

    clampPosition(position) {
        return {
            x: Math.min(this.canvasBounds.width, Math.max(0, position.x)),
            y: Math.min(this.canvasBounds.height, Math.max(0, position.y))
        };
    }

    drawNextGlyph(position) {
        const character = this.pattern[this.glyphIndex];
        this.glyphIndex = (this.glyphIndex + 1) % this.pattern.length;
        if (/^\s+$/u.test(character)) {
            return;
        }

        this.action.addGlyph(
            character,
            position,
            {
                ...this.style,
                fill: this.rainbowEnabled
                    ? this.drawingOptions.getRainbowColor()
                    : this.fillColor
            },
            this.canvasBounds
        );
    }
}

export default DrawAsciiState;
