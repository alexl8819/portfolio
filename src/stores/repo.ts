import { persistentAtom } from '@nanostores/persistent';
import dayjs from 'dayjs';
import { GH_REPO_API, HOURS_STALE_CONTENT, type GH_REPO_RESPONSE_SCHEMA } from '../constants';

interface Response {
    etag: string | null,
    lastModified: string | null
}

interface MetadataResponse extends Response {
    data: GH_REPO_RESPONSE_SCHEMA | null
}

interface Repositories {
    [index: string]: MetadataResponse
}

export const repositories = persistentAtom<Repositories>('projects', {}, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export async function fetchAndRevalidate (repo: string, owner: string) {
    const repos = repositories.get();
    const headers: HeadersInit = {};
    
    const current = repos[repo];

    if (current) {
        const curLastModified = dayjs(current.lastModified) || null;
    
        if (current && current.etag) {
            headers['If-None-Match'] = current.etag;
        } else if (current && current.lastModified) {
            headers['If-Modified-Since'] = current.lastModified;
        }

        if (current && curLastModified && curLastModified.diff(dayjs(), 'h') <= HOURS_STALE_CONTENT) {
            console.log('content not stale');
            return;
        }
    }

    // TODO: handle ratelimiting errors (x-ratelimit-remaining)
    const url = `${GH_REPO_API}`.replace('REPO', repo).replace('OWNER', owner);
    const res = await fetch(url, { headers });
  
    if (res.status === 304) {
        console.log(`${url} not modified`);
        return;
    }
  
    if (!res.ok) {
        console.error(`Failed to fetch ${url}: ${res.statusText}`);
        return;
    }
  
    const data = await res.json();
    const etag = res.headers.get('ETag');
    const lastModified = res.headers.get('Last-Modified');
    
    repos[repo] = { 
        data: {
            name: data.name,
            language: data.language,
            description: data.description,
            homepage: data.homepage,
            topics: data.topics
        },
        etag, 
        lastModified 
    };

    repositories.set(repos);
}