import { get, set } from 'idb-keyval';

interface StorageEngine {
    getItem: (key: string) => Promise<any>,
    setItem: (key: string, value: any) => Promise<void>
}

class IndexedDbEngine implements StorageEngine {
    async getItem (key: string) {
        const item = await get(key);
        return item;
    }

    async setItem (key: string, value: any) {
        await set(key, value);
    }
}

const assetLoader = new IndexedDbEngine();

export default assetLoader;