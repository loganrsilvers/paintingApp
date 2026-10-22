import { Assets, Container, Sprite } from "pixi.js";

const textureUrls = Object.entries(
    import.meta.glob("../../textures/*.png", {
        eager: true,
        import: "default",
        query: "?url"
    })
)
    .sort(([pathA], [pathB]) => {
        const numberA = Number(pathA.match(/(\d+)\.png$/)?.[1]);
        const numberB = Number(pathB.match(/(\d+)\.png$/)?.[1]);
        return numberA - numberB;
    })
    .map(([, url]) => url);

class BackgroundTexture {
    static textures = [];

    static async initialize() {
        if (textureUrls.length !== 10) {
            throw new Error(`Expected 10 background textures, found ${textureUrls.length}.`);
        }

        if (this.textures.length === 0) {
            this.textures = await Promise.all(
                textureUrls.map((url) => Assets.load(url))
            );
        }
    }

    static addToShape(stage, { fill, mask, outline, bounds }) {
        if (this.textures.length === 0) {
            throw new Error("Background textures must be initialized before drawing.");
        }

        const shape = new Container();
        const texture = this.textures[
            Math.floor(Math.random() * this.textures.length)
        ];
        const overlay = new Sprite(texture);

        overlay.position.set(bounds.x, bounds.y);
        overlay.width = bounds.width;
        overlay.height = bounds.height;
        overlay.mask = mask;

        shape.addChild(fill, mask, overlay, outline);
        stage.addChild(shape);
    }
}

export default BackgroundTexture;
