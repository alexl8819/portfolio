import { type FC, type PropsWithChildren } from 'react';
import { Button as AriaButton, Link, type PressEvent } from 'react-aria-components';

export enum VariantType {
    Outline = 'outline',
    Ghost = 'ghost'
}

type ButtonType = 'submit' | 'button';

interface ButtonProps {
    type?: ButtonType
    className?: string,
    variant?: VariantType
    disabled?: boolean
    onPress?: (e: PressEvent) => void
    label?: string | undefined
}

interface LinkButtonProps extends ButtonProps {
    href: string
    target?: string
}

const noop = () => {};

const Button: FC<PropsWithChildren<ButtonProps>> = ({ children, variant, className = '', disabled, type = 'button', onPress = noop, label = undefined }) => {
    className += className.concat(` cursor-${disabled ? 'not-allowed' : 'pointer'} ${disabled ? 'opacity-30' : ''} `);

    if (variant === VariantType.Outline) {
        className = className.concat('py-3 px-5 rounded-lg border border-zinc-600/40');
    } else if (variant === VariantType.Ghost) {
        className = className.concat('p-6 rounded-lg border border-zinc-100 shadow-sm hover:shadow-md transition-shadow');
    }
    
    return (<AriaButton type={type} className={className} isDisabled={disabled} onPress={onPress} aria-label={label}>{ children }</AriaButton>);
}

const LinkButton: FC<PropsWithChildren<LinkButtonProps>> = ({ children, href, variant, className = '', target = '_self', onPress = noop}) => {
    className += className.concat(' ');

    if (variant === VariantType.Outline) {
        className = className.concat('py-3 px-5 rounded-lg border border-zinc-600/30');
    } else if (variant === VariantType.Ghost) {
        className = className.concat('p-6 rounded-lg border border-zinc-100 shadow-sm hover:shadow-md transition-shadow');
    }

    return (<Link href={href} className={className} onPress={onPress} target={target}>{ children }</Link>);
}

export {
    LinkButton,
    Button
};