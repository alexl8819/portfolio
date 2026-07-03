import { persistentAtom } from '@nanostores/persistent';
import { atom } from 'nanostores';
import { Theme } from '../constants';
import { setTheme } from '../util';

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
    fragment: string
}

export const theme = atom<Theme>(Theme.Light);

export const settings = persistentAtom<Settings>('settings', { fragment: '' }, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export function updatePosition (fragment: string) {
    settings.set(Object.assign({}, settings.get(), { fragment }));
}

export function setInitial (initial: Theme) {
	theme.set(initial);
}

export function toggleMode () {
	const nextTheme = theme.get() === Theme.Light ? Theme.Dark : Theme.Light;
	setTheme(nextTheme);
	theme.set(nextTheme);
}