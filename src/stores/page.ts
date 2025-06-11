import { persistentAtom } from '@nanostores/persistent';
import { Theme } from '../constants';

// https://github.com/nanostores/persistent/issues/54

/*let listeners: Array<Function> = [];

function onChange (key: string, newValue: string) {
	const event = { key, newValue };
	for (const listener of listeners) {
		listener(event);
	}
}

const storage = new Proxy({}, {
	set(_, name: string, value: string) {
		if (typeof window !== 'undefined') {
			window.sessionStorage.setItem(name, value);
		}
		onChange(name, value);
		return true;
  	},
	get(_, name: string) {
		if (typeof window !== 'undefined') {
			return window.sessionStorage.getItem(name);
		}
		return '';
	},
	deleteProperty(_, name: string) {
		if (typeof window !== 'undefined') {
			window.sessionStorage.removeItem(name);
		}
		onChange(name, '');
		return true;
	}
});

setPersistentEngine(storage, {
	addEventListener (_, callback: Function) {
		listeners.push(callback);
	},
	removeEventListener (_, callback: Function) {
		listeners = listeners.filter((listener) => listener !== callback);
	},
	// window dispatches "storage" events for any key change
	// => One listener for all map keys is enough
	perKey: true
});*/

interface Settings {
	mode: Theme
    section: string
}

export const settings = persistentAtom<Settings>('settings', { section: '', mode: Theme.Light }, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export function updatePosition (section: string) {
    settings.set(Object.assign({}, settings.get(), { section }));
}

export function toggleMode () {
	const { mode } = settings.get();
	settings.set(Object.assign({}, settings.get(), {
		mode: mode ? false : true
	}));
}