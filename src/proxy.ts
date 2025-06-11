import * as Comlink from 'comlink';

const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
const imageProcessor = Comlink.wrap<{ 
    convert(rawImage: ArrayBuffer, offscreenCanvas: OffscreenCanvas): Promise<ArrayBuffer>
}>(worker);

export default imageProcessor;