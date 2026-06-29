import { memo, useEffect, type FC, type PropsWithChildren } from 'react';
import { useStore } from '@nanostores/react';

import { settings, toggleMode } from '../stores/page';
import { Theme } from '../constants';

const ThemedPageView: FC<PropsWithChildren> = ({ children }) => {
    const { mode } = useStore(settings);

    useEffect(() => {
        const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
        if (prefersDarkTheme.matches && mode === Theme.Light) {
            toggleMode();
        }
    }, []);

    return (
        <div className={mode == Theme.Dark ? 'dark' : 'light'}>
            { children }
        </div>
    )
}

export default memo(ThemedPageView);