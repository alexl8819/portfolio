import { useStore } from '@nanostores/react';
import { LightbulbIcon } from 'lucide-react';

import { Button } from './ui/Button';
import { Theme } from '../constants';
import { settings, toggleMode } from '../stores/page';

export const ThemeToggle = () => {
    const { mode } = useStore(settings);
    return (
        <Button onPress={() => toggleMode()} disabled={false}>
            <LightbulbIcon className={`w-8 h-6 ${mode === Theme.Light ? 'fill-amber-300 hover:fill-white': 'hover:fill-amber-300' }`} />
            <span className='sr-only'>Lightbulb</span>
        </Button>
    )
} 