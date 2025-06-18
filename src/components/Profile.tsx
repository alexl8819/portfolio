import { memo, useState, useEffect, useRef, type FC } from 'react';
import { Github, Codepen } from 'lucide-react';

import Navbar from './Navbar';
import { LinkButton } from './ui/Button';

interface ProfileProps {
    name: string
    description: string
    links: {
        github: string
        codepen: string
    }
}

const Profile: FC<ProfileProps> = ({ name, description, links }) => {
    const profileRef = useRef<HTMLElement | null>(null);
    const [hasIntersected, setHasIntersected] = useState<boolean>(false);

    useEffect(() => {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setHasIntersected(hasIntersected ? false : true);
                }
            })
        }, { threshold: 0.40 });

        if (profileRef.current) {
            io.observe(profileRef.current);
        }

        return () => {
            if (profileRef.current) {
                io.unobserve(profileRef.current);
            }
        }
    }, []);

    return (
        <aside ref={profileRef} className={`${hasIntersected ? 'opacity-70' : 'opacity-0'} hover:opacity-100 transform-opacity duration-1000 ease-in py-4 px-6 hidden xl:flex flex-col justify-center items-center h-screen xl:sticky top-0 w-1/3`}>
            <h2 className="text-4xl font-playfair-display text-neutral-800 font-bold tracking-tight sm:text-5xl md:text-6xl text-center">
                { name }
            </h2>
            <p className='my-4 px-8 2xl:px-16 text-neutral-500 text-center'>{ description }</p>
            <Navbar shouldOpen={false} />
            <div className='flex flex-row justify-evenly items-center space-x-4'>
                <LinkButton href={links.github} target='_blank' className="font-bold my-4">
                    <Github className="h-6 w-6 hover:fill-black" />
                    <span className="sr-only">Github</span>
                </LinkButton>
                <LinkButton href={links.codepen} target='_blank' className="font-bold my-4">
                    <Codepen className="h-6 w-6 hover:fill-amber-950" />
                    <span className="sr-only">Codepen</span>
                </LinkButton>
            </div>
        </aside>
    );
}

export default memo(Profile);