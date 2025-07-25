import { memo, useEffect, useState, type FC, } from 'react';
import dayjs from 'dayjs';
import * as Comlink from 'comlink';

import assetLoader from '../asset';
import imageProcessor from '../proxy';
import { GH_ASSET_URL, HOURS_STALE_CONTENT, MAIN_BRANCH, SCREENSHOT_ASSETS_DIRECTORY } from '../constants';

interface ScreenshotDisplayProps {
    owner: string
    repo: string
}

type Breakpoint = 'Desktop' | 'Mobile'; // | 'Tablet';

const ScreenshotDisplay: FC<ScreenshotDisplayProps> = ({ owner, repo }) => {
    const [mobileScreenshot, setMobileScreenshot] = useState<string | null>(null);
    const [desktopScreenshot, setDesktopScreenshot] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchScreenshot = async (breakpoint: Breakpoint) => {
            const headers: HeadersInit = {};
            const breakpointKey = `${repo}_${breakpoint.toLowerCase()}`;

            const cached = await assetLoader.getItem(breakpointKey);

            // Check once every 24-hr period (no reliable method to check if data has changed since its cached by gh)
            if (cached && cached.timestamp && cached.timestamp.length) {
                const lastCheck = dayjs(cached.timestamp);

                if (lastCheck && dayjs().diff(lastCheck, 'h') <= HOURS_STALE_CONTENT) {
                    console.log('restoring cached version');

                    if (cached.data && cached.data instanceof Blob) {
                        const objectUrl = URL.createObjectURL(cached.data);
                    
                        if (breakpoint === 'Mobile') {
                            setMobileScreenshot(objectUrl)
                        } else if (breakpoint === 'Desktop') {
                            setDesktopScreenshot(objectUrl);
                        }
                    }

                    return;
                }
            }

            const res = await fetch(
                `${GH_ASSET_URL.replace('OWNER', owner).replace('REPO', repo).replace('BRANCH', MAIN_BRANCH)}/${SCREENSHOT_ASSETS_DIRECTORY}/${breakpoint.toLowerCase()}-screenshot.png`, 
                { headers }
            );

            const timestamp = dayjs().toISOString();
            
            if (!res.ok) {
                console.log(res.statusText);
                await assetLoader.setItem(breakpointKey, { timestamp });
                return;
            }
        
            const data = await res.blob();
            const arrBuf = await data.arrayBuffer();

            const offscreenCanvas = document.createElement('canvas').transferControlToOffscreen();

            // console.log(`original size: ` + arrBuf.byteLength);

            let ci: ArrayBuffer | null = null;

            try {
                ci = await imageProcessor.convert(arrBuf, Comlink.transfer(offscreenCanvas, [offscreenCanvas]));
            } catch (err) {
                console.error(err);
            }

            if (!ci) {
                return;
            }

            // console.log(`compressed size: ${ci.byteLength}`);
            
            const blob = new Blob([ci as ArrayBuffer], { type: 'image/webp' });
            await assetLoader.setItem(breakpointKey, { data: blob, timestamp });
            
            const objectUrl = URL.createObjectURL(blob);

            if (breakpoint === 'Desktop') {
                setDesktopScreenshot(objectUrl);
            } else if (breakpoint === 'Mobile') {
                setMobileScreenshot(objectUrl);
            }
        }

        fetchScreenshot('Mobile');
        fetchScreenshot('Desktop');
        
        return () => {
            if (mobileScreenshot && mobileScreenshot.length) {
                URL.revokeObjectURL(mobileScreenshot);
            }

            if (desktopScreenshot && desktopScreenshot.length) {
                URL.revokeObjectURL(desktopScreenshot);
            }
        }
    }, []);

    return (
        <picture>
            {
                desktopScreenshot ? <source srcSet={desktopScreenshot} media='(min-width: 1280px)' /> : null
            }
            {
                mobileScreenshot ? <source srcSet={mobileScreenshot} media='(max-width: 1279px)' /> : null
            }
            <img
                src={`https://placehold.co/225x200?text=${repo}`}
                alt={repo}
                className="w-full h-full object-top object-cover"
            />
        </picture>
    );
}

export default memo(ScreenshotDisplay);