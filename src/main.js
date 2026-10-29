import { Application, Assets, Rectangle, TilingSprite } from "pixi.js";
import ToolsManager from "./managers/ToolsManager.js";
import InputManager from "./managers/InputManager.js";
import DrawManager from "./managers/DrawManager.js";
import BackgroundTexture from "./managers/BackgroundTexture.js";
import HistoryManager from "./managers/HistoryManager.js";
import PickColorAction from "./actions/PickColorAction.js";
import PickStrokeColorAction from "./actions/PickStrokeColorAction.js";
import PickStrokeWidthAction from "./actions/PickStrokeWidthAction.js";
import SelectCanvasBackgroundAction from "./actions/SelectCanvasBackgroundAction.js";

import "../style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

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
    DrawManager.initialize(app, colorState);

    fillColorPicker.addEventListener("change", () => {
        if (fillColorPicker.value !== colorState.fillColor) {
            HistoryManager.execute(
                new PickColorAction(fillColorPicker, colorState)
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
                new PickStrokeColorAction(strokeColorPicker, colorState)
            );
        }
    });

    ToolsManager.addToolGroup("Shapes",["fa-solid","fa-shapes"], [
        ToolsManager.getTool("Ellipse",["fa-regular","fa-circle"], () => {
            DrawManager.selectCircle();
        }),
        ToolsManager.getTool("Rectangle",["fa-regular","fa-square"], () => {
            DrawManager.selectRectangle();
            
        }),
        ToolsManager.getTool("Line",["fa-solid","fa-lines-leaning"], () => {
            DrawManager.selectLine();

        }),
        ToolsManager.getTool("Star",["fa-regular","fa-star"], () => {
            DrawManager.selectStar();

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
                new PickStrokeWidthAction(strokeInput, colorState)
            );
        }
    });

    ToolsManager.addTool(fillColorPicker);
    ToolsManager.addTool(canvasBackgroundPicker);
    ToolsManager.addTool(strokeColorPicker);
    
    ToolsManager.addTool(ToolsManager.getTool("Select Tool",["fa-solid","fa-arrow-pointer"], () => {
        
    }));
    
    ToolsManager.addTool(ToolsManager.getTool("Move Tool",["fa-solid","fa-up-down-left-right"], () => {
        
    }));
    
    ToolsManager.addTool(ToolsManager.getTool("Scale Tool",["fa-solid","fa-up-right-and-down-left-from-center"], () => {
        
    }));
    
    ToolsManager.addTool(ToolsManager.getTool("Delete Tool",["fa-solid","fa-trash-can"], () => {        
        
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

    downloadOptions.addEventListener("click", async (event) => {
        const option = event.target.closest("[data-format]");
        if (!option) {
            return;
        }

        const requestedFormat = option.dataset.format;
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
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".download-menu")) {
            downloadOptions.classList.remove("open");
            downloadButton.setAttribute("aria-expanded", "false");
        }
    });
    
    console.log(app);
})();
