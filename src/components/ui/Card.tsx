import { type FC, type PropsWithChildren, type Ref } from 'react';

interface CardProps {
    className?: string
    ref?: Ref<HTMLElement>
}

export const Card: FC<PropsWithChildren<CardProps>> = ({ children, className, ref }) => {
    return (
        <article ref={ref} className={className || "block"}>{ children }</article>
    );
}

export const CardHeader: FC<PropsWithChildren<CardProps>> = ({ children, className }) => {
    return (
        <header className={className}>
            { children }
        </header>
    );
}

export const CardTitle: FC<PropsWithChildren<CardProps>> = ({ children, className }) => {
    return (
        <h2 className={className}>
            { children }
        </h2>
    );
}

export const CardDescription: FC<PropsWithChildren<CardProps>> = ({ children, className }) => {
    return (
        <p className={className}>
            { children }
        </p>
    );
}

export const CardContent: FC<PropsWithChildren<CardProps>> = ({ children, className }) => {
    return (
        <div className={className}>
            { children }
        </div>
    );
}