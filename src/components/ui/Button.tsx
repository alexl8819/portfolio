import { type FC, type PropsWithChildren, type MouseEventHandler } from 'react';

export enum VariantType {
    Outline = 'outline',
    Ghost = 'ghost'
}

interface ButtonProps {
    className?: string,
    variant?: VariantType
    disabled?: boolean
    onClick?: MouseEventHandler<HTMLElement>
    label?: string | undefined
}

interface LinkButtonProps extends ButtonProps {
    href: string
    target?: string
}

const noop = () => {};

const Button: FC<PropsWithChildren<ButtonProps>> = ({ children, variant, className = '', disabled, onClick = noop, label = undefined }) => {
    className += className.concat(` cursor-${disabled ? 'not-allowed' : 'pointer'} ${disabled ? 'opacity-30' : ''} `);

    if (variant === VariantType.Outline) {
        className = className.concat('py-3 px-5 rounded-lg border border-zinc-600/40');
    } else if (variant === VariantType.Ghost) {
        className = className.concat('p-6 rounded-lg border border-zinc-100 shadow-sm hover:shadow-md transition-shadow');
    }
    
    return (<button className={className} disabled={disabled} onClick={onClick} aria-label={label}>{ children }</button>);
}

const LinkButton: FC<PropsWithChildren<LinkButtonProps>> = ({ children, href, variant, className = '', target = '_self', onClick = noop}) => {
    className += className.concat(' ');

    if (variant === VariantType.Outline) {
        className = className.concat('py-3 px-5 rounded-lg border border-zinc-600/30');
    } else if (variant === VariantType.Ghost) {
        className = className.concat('p-6 rounded-lg border border-zinc-100 shadow-sm hover:shadow-md transition-shadow');
    }

    return (<a href={href} className={className} onClick={onClick} target={target}>{ children }</a>);
}

export {
    LinkButton,
    Button
};