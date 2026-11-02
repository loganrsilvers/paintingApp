class SelectState {
    constructor(selectManager) {
        this.selectManager = selectManager;
        this.pointerDownPosition = null;
        this.hasMoved = false;
    }

    onPointerDown(position) {
        this.pointerDownPosition = position;
        this.hasMoved = false;
    }

    onPointerMove(position) {
        if (
            this.pointerDownPosition &&
            Math.hypot(
                position.x - this.pointerDownPosition.x,
                position.y - this.pointerDownPosition.y
            ) > 1
        ) {
            this.hasMoved = true;
        }

        if (this.pointerDownPosition && this.hasMoved) {
            this.selectManager.updateSelectionRectangle(
                this.pointerDownPosition,
                position
            );
        }
    }

    onPointerUp(position) {
        if (!this.pointerDownPosition) {
            return;
        }

        const distance = Math.hypot(
            position.x - this.pointerDownPosition.x,
            position.y - this.pointerDownPosition.y
        );
        if (distance > 1) {
            this.hasMoved = true;
        }

        const isClick = !this.hasMoved && distance <= 1;
        const startPosition = this.pointerDownPosition;
        this.pointerDownPosition = null;

        if (isClick) {
            this.selectManager.selectAt(position.x, position.y);
        } else if (this.hasMoved) {
            this.selectManager.updateSelectionRectangle(startPosition, position);
            this.selectManager.selectInBounds(startPosition, position);
        }

        this.hasMoved = false;
    }
}

export default SelectState;
