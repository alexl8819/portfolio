export const GH_REPO_API = 'https://api.github.com/repos/OWNER/REPO';
export const MAIN_GH_URL = 'https://github.com/OWNER/REPO';
export const GH_ASSET_URL = `https://raw.githubusercontent.com/OWNER/REPO/BRANCH/`;
export const MAIN_BRANCH = 'main';
export const SCREENSHOT_ASSETS_DIRECTORY = 'screenshots';

export interface BaseProps {
    anchor: string
}

export interface SkillLike {
    name: string
    display?: string
    highlight?: boolean
}

export enum Theme {
    Light = 'light',
    Dark = 'dark'
}

export const HOURS_STALE_CONTENT = 24; // update once a day

export interface GH_REPO_RESPONSE_SCHEMA {
    name: string
    language: string
    description: string
    homepage: string
    topics: Array<string>
}

export const DEFAULT_VERTICAL_PERVIEW = 5;
export const DEFAULT_HORIZONTAL_PERVIEW = 2;

export const DESKTOP_BREAKPOINT_VALUE = 1280;

export const DEFAULT_SLIDER_OPTIONS = {
    loop: true,
    initial: 0,
    breakpoints: {
        "(max-width: 767px)": {
            slides: { perView: 1, spacing: 5 },
        },
        "(min-width: 768px)": {
            slides: { perView: DEFAULT_HORIZONTAL_PERVIEW, spacing: 10 },
        },
        "(min-width: 1280px)": {
            slides: { perView: DEFAULT_VERTICAL_PERVIEW, spacing: 20 }
        },
    }
};