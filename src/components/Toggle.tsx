import { useStore } from '@nanostores/react';
import { LightbulbIcon } from 'lucide-react';

import { Button } from './ui/Button';
import { Theme } from '../constants';
import { theme, toggleMode } from '../stores/page';

const ThemeToggle = () => {
    const th = useStore(theme, { ssr: 'initial' });
    return (
        <Button onPress={() => toggleMode()} disabled={false}>
            <LightbulbIcon className={`w-8 h-6 ${th === Theme.Light ? 'fill-amber-300 hover:fill-white': 'hover:fill-amber-300' }`} />
            <span className='sr-only'>Lightbulb</span>
        </Button>
    )
};

export default ThemeToggle;