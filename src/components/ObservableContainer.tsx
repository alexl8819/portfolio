import {
    useEffect,
    useState,
    useRef,
    Children,
    type FC,
    type PropsWithChildren,
} from 'react';
import { useStore } from '@nanostores/react';
import { settings } from '../stores/page';

import Fragment from './Fragment';
import { scrollTo, getElement } from '../util';

const ObservableContainer: FC<PropsWithChildren> = ({ children }) => {
    const { fragment } = useStore(settings);
    const componentRefs = useRef<Array<HTMLElement | null>>([]);
    const [refsReady, setRefsReady] = useState(false);
    const [obsrvReady, setObsrvReady] = useState(false);
    // experimental: notify each ref when observer intersects with proxy
    const [notifiedRef, setNotifiedRef] = useState<Element | null>(null);

    useEffect(() => {
        const childrenArray = Children.toArray(children);
        componentRefs.current.length = childrenArray.length;

        if (componentRefs.current.length === Children.count(children) && componentRefs.current.every(ref => ref !== null)) {
            setRefsReady(true);
        }
    }, [children]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setNotifiedRef(entry.target);
                    entry.target.classList.remove("opacity-0");
                    entry.target.classList.remove("translate-y-20");
                }
            })
        }, { threshold: 0.1 });

        for (const ref of componentRefs.current) {
            if (ref) {
                observer.observe(ref);
            }
        }

        setObsrvReady(true);
        
        return () => {
            componentRefs.current.forEach((ref) => {
                if (ref) {
                  observer.unobserve(ref);
                }
            });
        }
    }, [refsReady]);

    useEffect(() => {
        if (fragment && fragment.length && getElement(fragment) !== null) {
            scrollTo(fragment);
        }
    }, [obsrvReady]);

    return (
        <div className='w-full xl:w-2/3'>
            { 
                children ? Children.map(Array.prototype.filter.call(children, (child) => child !== null), (child: any, index) => (
                    <Fragment 
                        key={index} 
                        ref={(el: any) => (componentRefs.current[index] = el)}
                        anchor={child.props.anchor}
                        isVisible={componentRefs.current[index] === notifiedRef}>
                        <child.type {...child.props} />
                    </Fragment>
                )) : null
            }
        </div>
    );
}

export default ObservableContainer;
