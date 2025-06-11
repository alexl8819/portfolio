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
} from '@icons-pack/react-simple-icons';

import { type SkillLike } from './constants';

export const isURLActive = async (url: string) => {
    let response;

    try {
        response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    } catch (err) {
        console.error(err);
        return false;
    }

    return response.ok;
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
        default:
            return null;
    }
}