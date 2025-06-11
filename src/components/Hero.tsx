import { type FC, useState, memo } from 'react';
import TypeIt from 'typeit-react';

import { Button } from './ui/Button';
import { scrollTo } from '../util';

interface HeroProps {
    name?: string
    introduction: string
}

const Hero: FC<HeroProps> = ({ name = 'John Doe', introduction }) => {
    const [showWork, setShowWork] = useState<Boolean>(false);

    return (
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-24 md:py-32">
            <h1 className="text-4xl font-playfair-display font-bold tracking-tight sm:text-5xl md:text-6xl text-center">Hello, I'm <span className="text-neutral-800">{ name }</span></h1>
            <div className="mt-6 h-8 max-w-2xl text-center text-lg text-neutral-600">
                <TypeIt options={{
                    speed: 50,
                    startDelay: 10,
                    waitUntilVisible: true,
                    afterComplete: (instance: any) => {
                        instance.destroy();
                        setShowWork(true);
                    }
                }}>
                    { introduction }
                </TypeIt>
                <span className="sr-only">{ introduction }</span>
            </div>
            {
                showWork ? (
                    <Button className="flex flex-col items-center justify-center mt-24 md:mt-8" onClick={() => scrollTo('#projects')}>
                        <div className="mt-8 animate-bounce" aria-label="Scroll to projects">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down h-6 w-6 text-neutral-400"><path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path></svg>
                        </div>
                    </Button>
                ) : null
            }
        </section>
    )   
}

export default memo(Hero);