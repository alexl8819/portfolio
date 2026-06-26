import { memo, useEffect, type FC } from 'react';

import { type BaseProps } from '../constants';
import { updatePosition } from '../stores/page';

interface AboutProps extends BaseProps {
	blocks: Array<string>
}

const About: FC<AboutProps> = ({ blocks, anchor }) => {
    useEffect(() => {
        console.log('about loaded');
        updatePosition(`#${anchor}`);
    }, []);

    return (
        <div className="px-4 md:px-6">
            <section className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-playfair-display font-bold tracking-tight mb-4 flex justify-center items-center">
              	    About Me
                </h2>
                <p className='mb-8 text-md text-zinc-600 dark:text-stone-400 font-light text-center'>Staying curious and expanding knowledge</p>
			    {
				    blocks.map((block, index) =>(
					    <p key={index} className={`text-zinc-600 dark:text-zinc-400 ${ index !== (blocks.length - 1) ? 'mb-6' : ''}`}>
                            { block }
                        </p>
				    ))
			    }
            </section>
        </div>
    )
};

export default memo(About);