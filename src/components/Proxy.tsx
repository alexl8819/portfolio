import { 
    forwardRef,
    Suspense, 
    useEffect,
    useState,
    type PropsWithChildren, 
} from 'react';
import { SectionLoaderSkeleton } from './Skeleton';

interface ProxyProps {
    isVisible: boolean,
    sectionAnchor: string
}

const ProxyStub = forwardRef<HTMLElement, PropsWithChildren<ProxyProps>>(({ children, isVisible, sectionAnchor }, ref) => {
    const [visibilityEnabled, setVisibilityEnabled] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setVisibilityEnabled(true);
        }
    }, [isVisible]);

    return (
        <div
            id={sectionAnchor && sectionAnchor.length ? sectionAnchor : undefined}
            ref={ref}
            className="proxy min-h-screen bg-[var(--fg)] px-4 md:px-0 py-16 md:py-24 opacity-0 transition-opacity duration-[1.5s] ease-in-out translate-y-20 will-change-transform"
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

export default ProxyStub;