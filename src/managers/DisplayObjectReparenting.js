import { Matrix } from "pixi.js";

function reparentChildAtPreservingWorldTransform(parent, child, index) {
    const worldTransform = child.getGlobalTransform();
    const parentTransform = parent.getGlobalTransform(new Matrix()).invert();
    parent.addChildAt(child, index);
    worldTransform.prepend(parentTransform);
    child.setFromMatrix(worldTransform);
}

export default reparentChildAtPreservingWorldTransform;
