class Utils {
  removeFromArray(arr, obj) {
    const index = arr.indexOf(obj);
    if (index > -1) {
      arr.splice(index, 1);
    }

    return arr;
  }

  existsInArray(arr, obj) {
    return arr.indexOf(obj) > -1;
  }

  degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  radiansToDegrees(radians) {
    return (radians * 180) / Math.PI;
  }

  angleBetweenPoints(center, point) {
    return Math.atan2(point.y - center.y, point.x - center.x);
  }

  angleDelta(from, to) {
    return Math.atan2(Math.sin(to - from), Math.cos(to - from));
  }

  rotatePoint(point, center, radians) {
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);
    const offsetX = point.x - center.x;
    const offsetY = point.y - center.y;

    return {
      x: center.x + offsetX * cosine - offsetY * sine,
      y: center.y + offsetX * sine + offsetY * cosine,
    };
  }

  checkAABB(rect1, rect2) {
    const rect1HalfWidth = rect1.width / 2;
    const rect1HalfHeight = rect1.height / 2;
    const rect2HalfWidth = rect2.width / 2;
    const rect2HalfHeight = rect2.height / 2;

    return (
      rect1.x - rect1HalfWidth < rect2.x + rect2HalfWidth &&
      rect1.x + rect1HalfWidth > rect2.x - rect2HalfWidth &&
      rect1.y - rect1HalfHeight < rect2.y + rect2HalfHeight &&
      rect1.y + rect1HalfHeight > rect2.y - rect2HalfHeight
    );
  }
}

export default new Utils();
