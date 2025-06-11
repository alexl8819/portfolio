import * as Comlink from 'comlink';
import { encode } from '@jsquash/webp';

const convert = async (rawImage: ArrayBuffer, offscreenCanvas: OffscreenCanvas) => {
    const img = await createImageBitmap(new Blob([new Uint8Array(rawImage)]));
    const context = offscreenCanvas.getContext('2d');

    offscreenCanvas.width = img.width;
    offscreenCanvas.height = img.height;

    context?.drawImage(img, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

    const imgData = context?.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    
    if (!imgData) {
        return null;
    }
    
    const arrBuf = await encode(imgData);
    return arrBuf;
}

Comlink.expose({
    convert
});