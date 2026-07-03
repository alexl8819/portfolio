import { 
    forwardRef,
    Suspense, 
    useEffect,
    useState,
    type PropsWithChildren, 
} from 'react';
import { SectionLoaderSkeleton } from './Skeleton';

interface FragmentProps {
    isVisible: boolean,
    anchor: string
}

const Fragment = forwardRef<HTMLElement, PropsWithChildren<FragmentProps>>(({ children, isVisible, anchor }, ref) => {
    const [visibilityEnabled, setVisibilityEnabled] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setVisibilityEnabled(true);
        }
    }, [isVisible]);

    return (
        <div
            id={anchor && anchor.length ? anchor : undefined}
            ref={ref}
            className="proxy min-h-screen bg-[var(--color-custom-light-fg)] dark:bg-zinc-700 px-4 md:px-0 py-16 md:py-24 opacity-0 transition-opacity duration-[1.5s] ease-in-out translate-y-20 will-change-transform"
        >
            {
                visibilityEnabled ? 
                <Suspense fallback={<SectionLoaderSkeleton />}>
                    { children }
                </Suspense> : null
            }
        </div>
    )
});

export default Fragment;