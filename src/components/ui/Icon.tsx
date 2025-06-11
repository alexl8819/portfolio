import { useState, useEffect, type FC } from 'react';
import type { IconType } from '@icons-pack/react-simple-icons';

interface IconProps {
    name: string
    icon: IconType
    className?: string
}

const SkillIcon: FC<IconProps> = ({ name, icon, className = '' }) => {
    const [IconComponent, setIconComponent] = useState<IconType | null>(null);
    
    useEffect(() => {
        const loadIcon = () => {
            if (icon) {
                setIconComponent(() => icon);
            } else {
                setIconComponent(null);
            }
        };

        loadIcon();
    }, []);
    
    if (!IconComponent) {
        return <div>Loading...</div>;
    }

    return <IconComponent title={name} className={className} />;
}

export default SkillIcon;
