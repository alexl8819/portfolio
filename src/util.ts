import {
    SiPython,
    SiGnubash,
    SiTypescript,
    SiJavascript,
    SiRust,
    SiHtml5,
    SiCss,
    SiSass,
    SiAstro,
    SiNextdotjs,
    SiDjango,
    SiReact,
    SiVuedotjs,
    SiSvelte,
    SiExpress,
    SiFastify,
    SiVitest,
    SiSelenium,
    SiBootstrap,
    SiBulma,
    SiTailwindcss,
    SiPostgresql,
    SiSqlite,
    SiRedis,
    SiFauna,
    SiAmazondynamodb,
    SiGit,
    SiFigma,
    SiDocker,
    SiTraefikproxy,
    SiTerraform,
    SiGithubactions,
    SiAmazonwebservices,
    SiGooglecloud,
    SiDebian,
    SiVultr,
    SiSplunk,
    SiSnort,
    SiWireshark,
    SiVirustotal,
    SiGitforwindows,
    SiParrotsecurity,
    SiKalilinux,
    SiTryhackme,
    SiHackthebox,
    SiKibana,
    SiOpnsense,
    SiProxmox
} from '@icons-pack/react-simple-icons';
import count from 'word-count';
import { twMerge } from 'tailwind-merge';
import { tv } from 'tailwind-variants';
import { composeRenderProps } from 'react-aria-components';

import { type SkillLike } from './constants';

export const getElement = (selector: string, container?: HTMLElement) => {
    const element: Element | null = (container || document).querySelector(selector);
    
    if (!element) {
    	return null;
    }
    
    return element;
}

export const scrollTo = (selector: string, container?: HTMLElement) => {
    const element: Element | null = (container || document).querySelector(selector);

    if (!element) {
        throw new Error(`selector: ${selector} not found`);
    }
    
    element.scrollIntoView({ behavior: 'instant' });
}

export const transformIntoSkill = (skillType: Array<SkillLike>) => {
    return skillType.map((skill: SkillLike) => ({
        name: skill.display || skill.name,
        icon: getCommonIcon(skill.name),
        highlight: skill.highlight || false
    }));
}

export const getShortName = (role: string) => {
    return role.split('-')[0];
}

export const getCommonIcon = (language: string) => {
    switch (language.toLowerCase()) {
        case 'python':
            return SiPython;
        case 'bash':
            return SiGnubash;
        case 'typescript':
            return SiTypescript;
        case 'javascript':
            return SiJavascript;
        case 'rust':
            return SiRust;
        case 'html5':
            return SiHtml5;
        case 'css3':
            return SiCss;
        case 'scss':
            return SiSass;
        case 'astro':
            return SiAstro;
        case 'nextjs':
            return SiNextdotjs;
        case 'django':
            return SiDjango;
        case 'react':
            return SiReact;
        case 'vue':
            return SiVuedotjs;
        case 'svelte':
            return SiSvelte;
        case 'express':
            return SiExpress;
        case 'fastify':
            return SiFastify;
        case 'vitest':
            return SiVitest;
        case 'selenium':
            return SiSelenium;
        case 'bulma':
            return SiBulma;
        case 'bootstrap':
            return SiBootstrap;
        case 'tailwindcss':
            return SiTailwindcss;
        case 'postgresql':
            return SiPostgresql;
        case 'sqlite':
            return SiSqlite;
        case 'redis':
            return SiRedis;
        case 'faunadb':
            return SiFauna;
        case 'dynamodb':
            return SiAmazondynamodb;
        case 'git':
            return SiGit;
        case 'figma':
            return SiFigma;
        case 'docker':
            return SiDocker;
        case 'traefik':
            return SiTraefikproxy;
        case 'terraform':
            return SiTerraform;
        case 'githubactions':
            return SiGithubactions;
        case 'aws':
            return SiAmazonwebservices;
        case 'googlecloud':
            return SiGooglecloud;
        case 'vultr':
            return SiVultr;
        case 'debian':
            return SiDebian;
        case 'splunk':
	        return SiSplunk;
	    case 'kibana':
	        return SiKibana;
	    case 'snort':
	        return SiSnort;
	    case 'wireshark':
	        return SiWireshark;
        case 'virustotal':
            return SiVirustotal;
	    case 'gitforwindows':
	        return SiGitforwindows;
	    case 'parrotsecurity':
	        return SiParrotsecurity;
	    case 'kalilinux':
	        return SiKalilinux;
        case 'tryhackme':
            return SiTryhackme;
        case 'hackthebox':
            return SiHackthebox;
	    case 'opnsense':
	        return SiOpnsense;
	    case 'proxmox':
	        return SiProxmox;
	    default:
            return null;
    }
}

export function getApproxTimeToRead (content: string, wordsPerMinute: number = 200) {
    const minutes = count(content) / wordsPerMinute;
    return Math.ceil(parseFloat(minutes.toFixed(2)));
}

export function invertCase (input: string, snakeCase: boolean) {
    return snakeCase ? input.replaceAll(/\-/g, '_') : input.replaceAll(/\_/g, '-');
}

export namespace Tailwind {
    export const merge = twMerge;
    export const variants = tv;
    export function composeTailwindRenderProps<T>(className: string | ((v: T) => string) | undefined, tw: string): string | ((v: T) => string) {
        return composeRenderProps(className, (className) => twMerge(tw, className));
    };
    export const focusRing = tv({
        base: 'outline outline-blue-600 dark:outline-blue-500 forced-colors:outline-[Highlight] outline-offset-2',
        variants: {
            isFocusVisible: {
                false: 'outline-0',
                true: 'outline-2'
            }
        }
    });
}