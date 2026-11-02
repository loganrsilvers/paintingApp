import { Application, Assets, Container, Rectangle, TilingSprite } from "pixi.js";
import ToolsManager from "./managers/ToolsManager.js";
import InputManager from "./managers/InputManager.js";
import DrawManager from "./managers/DrawManager.js";
import SelectManager from "./managers/SelectManager.js";
import MoveManager from "./managers/MoveManager.js";
import ScaleManager from "./managers/ScaleManager.js";
import DeleteManager from "./managers/DeleteManager.js";
import RotateManager from "./managers/RotateManager.js";
import ClipboardManager from "./managers/ClipboardManager.js";
import BackgroundTexture from "./managers/BackgroundTexture.js";
import HistoryManager from "./managers/HistoryManager.js";
import PickColorAction from "./actions/PickColorAction.js";
import PickStrokeColorAction from "./actions/PickStrokeColorAction.js";
import PickStrokeWidthAction from "./actions/PickStrokeWidthAction.js";
import SelectCanvasBackgroundAction from "./actions/SelectCanvasBackgroundAction.js";
import KeyboardShortcuts from "./keyboard-shortcuts/KeyboardShortcuts.js";

import "../style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// const toolCursors = {
//     select: {
//         image: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M5 2 L5 25 L11 19 L16 29 L20 27 L15 17 L24 17 Z" fill="#000" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M5 2 L5 25 L11 19 L16 29 L20 27 L15 17 L24 17 Z" fill="#000" stroke="#111" stroke-width="1" stroke-linejoin="round"/></svg>`,
//         x: 4,
//         y: 3
//     },
//     move: {
//         image: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M16 2 L11 7 H14 V13 H8 V10 L3 15 L8 20 V17 H14 V23 H11 L16 28 L21 23 H18 V17 H24 V20 L29 15 L24 10 V13 H18 V7 H21 Z" fill="#000" stroke="#fff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><path d="M16 2 L11 7 H14 V13 H8 V10 L3 15 L8 20 V17 H14 V23 H11 L16 28 L21 23 H18 V17 H24 V20 L29 15 L24 10 V13 H18 V7 H21 Z" fill="#000" stroke="#111" stroke-width="1" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
//         x: 16,
//         y: 15
//     },
//     scale: {
//         image: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M11 3 H3 V11 L6 8 L12 14 L14 12 L8 6 Z M21 29 H29 V21 L26 24 L20 18 L18 20 L24 26 Z" fill="#000" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M11 3 H3 V11 L6 8 L12 14 L14 12 L8 6 Z M21 29 H29 V21 L26 24 L20 18 L18 20 L24 26 Z" fill="#000" stroke="#111" stroke-width="1" stroke-linejoin="round"/></svg>`,
//         x: 16,
//         y: 16
//     }
// };

// function setCanvasCursor(canvas, cursor) {
//     canvas.style.cursor =
//         `url("data:image/svg+xml,${encodeURIComponent(cursor.image)}") ` +
//         `${cursor.x} ${cursor.y}, auto`;
// }

(async () => {
    // Create a new application
    const app = new Application();

    // Initialize the application
    const container = document.getElementById("pixi-container");
    
    await app.init({
        background: "#aaaaaa",
        resizeTo: container
    });

    await BackgroundTexture.initialize();
    InputManager.initialize(app);

    const artworkLayer = new Container();
    const selectionLayer = new Container();
    app.stage.addChild(artworkLayer, selectionLayer);
    SelectManager.initialize(artworkLayer, selectionLayer);
    MoveManager.initialize(SelectManager);
    ScaleManager.initialize(SelectManager);
    DeleteManager.initialize(SelectManager);
    RotateManager.initialize(SelectManager);
    ClipboardManager.initialize(SelectManager);

    const { default: colorPallete } = await import(
        /* @vite-ignore */ `${import.meta.env.BASE_URL}assets/colorPallete.js`
    );
    const canvasBackgrounds = await Promise.all(
        Array.from({ length: 10 }, async (_, index) => {
            const id = String(index + 1);
            const src = `${import.meta.env.BASE_URL}assets/canvas-backgrounds/${id}.png`;
            const texture = await Assets.load(src);
            return { id, name: `Background ${id}`, src, texture };
        })
    );
    const fillColorPicker = ToolsManager.getColorPicker(
        "Fill Color",
        colorPallete,
        "#fdfbf7"
    );
    const canvasBackgroundPicker = ToolsManager.getImagePicker(
        "Canvas Background",
        canvasBackgrounds
    );
    const canvasBackgroundLayer = new TilingSprite({
        texture: canvasBackgrounds[0].texture,
        width: app.screen.width,
        height: app.screen.height
    });
    const canvasBackgroundState = { selectedBackground: null };
    const resizeCanvasBackground = () => {
        canvasBackgroundLayer.width = app.screen.width;
        canvasBackgroundLayer.height = app.screen.height;
    };
    const canvasResizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(resizeCanvasBackground);
    });
    canvasResizeObserver.observe(container);

    const strokeColorPicker = ToolsManager.getColorPicker(
        "Stroke Color",
        colorPallete,
        "#1e1e24"
    );
    const colorState = {
        fillColor: fillColorPicker.value,
        strokeColor: strokeColorPicker.value,
        strokeWidth: Number(document.getElementById("stroke").value)
    };
    DrawManager.initialize(app, colorState, artworkLayer);

    fillColorPicker.addEventListener("change", () => {
        if (fillColorPicker.value !== colorState.fillColor) {
            HistoryManager.execute(
                new PickColorAction(fillColorPicker, colorState, SelectManager)
            );
        }
    });

    canvasBackgroundPicker.addEventListener("change", () => {
        if (
            canvasBackgroundPicker.selection ===
            canvasBackgroundState.selectedBackground
        ) {
            return;
        }

        HistoryManager.execute(
            new SelectCanvasBackgroundAction(
                app.stage,
                canvasBackgroundLayer,
                canvasBackgroundPicker,
                canvasBackgroundState
            )
        );
    });

    strokeColorPicker.addEventListener("change", () => {
        if (strokeColorPicker.value !== colorState.strokeColor) {
            HistoryManager.execute(
                new PickStrokeColorAction(strokeColorPicker, colorState, SelectManager)
            );
        }
    });

    ToolsManager.addToolGroup("Shapes",["fa-solid","fa-shapes"], [
        ToolsManager.getTool("Ellipse",["fa-regular","fa-circle"], () => {
            DrawManager.selectCircle();
            app.canvas.style.cursor = "crosshair";
        }),
        ToolsManager.getTool("Rectangle",["fa-regular","fa-square"], () => {
            DrawManager.selectRectangle();
            app.canvas.style.cursor = "crosshair";
            
        }),
        ToolsManager.getTool("Line",["fa-solid","fa-lines-leaning"], () => {
            DrawManager.selectLine();
            app.canvas.style.cursor = "crosshair";

        }),
        ToolsManager.getTool("Star",["fa-regular","fa-star"], () => {
            DrawManager.selectStar();
            app.canvas.style.cursor = "crosshair";

        })
    ]);
    
    const strokeInput = document.getElementById("stroke");
    strokeInput.addEventListener("change", () => {
        if (!strokeInput.checkValidity()) {
            strokeInput.reportValidity();
            strokeInput.value = String(colorState.strokeWidth);
            return;
        }

        const strokeWidth = Number(strokeInput.value);
        if (strokeWidth !== colorState.strokeWidth) {
            HistoryManager.execute(
                new PickStrokeWidthAction(strokeInput, colorState, SelectManager)
            );
        }
    });

    ToolsManager.addTool(fillColorPicker);
    ToolsManager.addTool(canvasBackgroundPicker);
    ToolsManager.addTool(strokeColorPicker);
    
    ToolsManager.addTool(ToolsManager.getTool("Select Tool",["fa-solid","fa-arrow-pointer"], () => {
        DrawManager.selectTool();
        setCanvasCursor(app.canvas, toolCursors.select);
    }));
    
    ToolsManager.addTool(ToolsManager.getTool("Move Tool",["fa-solid","fa-up-down-left-right"], () => {
        DrawManager.selectMoveTool();
        setCanvasCursor(app.canvas, toolCursors.move);
    }));
    
    ToolsManager.addTool(ToolsManager.getTool("Scale Tool",["fa-solid","fa-up-right-and-down-left-from-center"], () => {
        DrawManager.selectScaleTool();
        setCanvasCursor(app.canvas, toolCursors.scale);
    }));

    ToolsManager.addTool(ToolsManager.getTool("Rotate Tool",["fa-solid","fa-rotate"], () => {
        DrawManager.selectRotateTool();
    }));
    
    ToolsManager.addTool(ToolsManager.getTool("Delete Tool",["fa-solid","fa-trash-can"], () => {
        DeleteManager.deleteSelected();
    }));
    
    ToolsManager.addTool(ToolsManager.getTool("Group Tool",["fa-solid","fa-object-group"], () => {        
       
    }));
    
    ToolsManager.addTool(ToolsManager.getTool("Ungroup Tool",["fa-regular","fa-object-group"], () => {        
        
    }));
    
    container.appendChild(app.canvas);

    let undoBtn = document.getElementById("undo");
    let redoBtn = document.getElementById("redo");
        
    undoBtn.addEventListener("click",() => {
        HistoryManager.undo();
    });
    
    redoBtn.addEventListener("click",() => {
        HistoryManager.redo();
    });

    const downloadButton = document.getElementById("download-canvas");
    const downloadOptions = document.getElementById("download-options");
    downloadButton.addEventListener("click", () => {
        const isOpen = downloadOptions.classList.toggle("open");
        downloadButton.setAttribute("aria-expanded", String(isOpen));
    });

    const downloadCanvas = async (requestedFormat) => {
        const format = requestedFormat === "png" ? "png" : "jpg";
        const filename = `painting-app.${requestedFormat}`;
        downloadOptions.classList.remove("open");
        downloadButton.setAttribute("aria-expanded", "false");

        try {
            const dataUrl = await app.renderer.extract.base64({
                target: app.stage,
                format,
                quality: 0.92,
                clearColor: "#aaaaaa"
            });
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = filename;
            link.click();
        } catch (error) {
            console.error("Canvas export failed.", error);
            window.alert("Could not download the canvas. Please try again.");
        }
    };

    downloadOptions.addEventListener("click", async (event) => {
        const option = event.target.closest("[data-format]");
        if (!option) {
            return;
        }

        const requestedFormat = option.dataset.format;
        await downloadCanvas(requestedFormat);
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".download-menu")) {
            downloadOptions.classList.remove("open");
            downloadButton.setAttribute("aria-expanded", "false");
        }
    });

    KeyboardShortcuts.initialize({
        selectManager: SelectManager,
        clipboardManager: ClipboardManager,
        drawManager: DrawManager,
        downloadPng: () => downloadCanvas("png")
    });
    
    console.log(app);
})();
