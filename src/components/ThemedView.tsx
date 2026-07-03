import { memo, useEffect, type FC, type PropsWithChildren } from 'react';

import { setInitial } from '../stores/page';
import { Theme } from '../constants';

const ThemedProvider: FC<PropsWithChildren> = ({ children }) => {
    useEffect(() => {
        setInitial(document.documentElement.classList.contains('dark') ? Theme.Dark : Theme.Light);
    }, []);

    return (
        <div className='min-h-screen bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300'>
            { children }
        </div>
    )
}

export default memo(ThemedProvider);