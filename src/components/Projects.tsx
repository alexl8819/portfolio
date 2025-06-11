import { useEffect, useState, memo, type FC } from 'react';
import { useKeenSlider, type KeenSliderOptions, type KeenSliderPlugin } from 'keen-slider/react';
import debounce from 'debounce';

import Project from './Project';
import { Button } from './ui/Button';
import { updatePosition } from '../stores/page';
import { type BaseProps, DEFAULT_SLIDER_OPTIONS, DEFAULT_VERTICAL_PERVIEW, DESKTOP_BREAKPOINT_VALUE } from '../constants';

import 'keen-slider/keen-slider.min.css';

interface ProjectProps extends BaseProps {
	owner: string
	repositories: Array<string>
}

const Projects: FC<ProjectProps> = ({ owner, repositories, anchor }) => {
	const [showHover, setShowHover] = useState<boolean>(false);
	const [loaded, setLoaded] = useState<boolean>(false);
	const [isVertical, setIsVertical] = useState<boolean>(false);
	const [curSlide, setCurSlide] = useState<number>(DEFAULT_SLIDER_OPTIONS.initial);

	const trackChange: KeenSliderPlugin = (slider) => {
		slider.on('slideChanged', () => {
			setCurSlide(slider.track.details.rel);
		});
	}

	const mergedOptions = Object.assign(DEFAULT_SLIDER_OPTIONS, {
		vertical: window.innerWidth >= DESKTOP_BREAKPOINT_VALUE,
		created () {
			setLoaded(true);
		}
	}) as KeenSliderOptions;

	const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(mergedOptions, [trackChange]);

	const simulateHover = (dismiss: boolean) => {
		return () => {
			setShowHover(dismiss ? false : true);
		}
	}

	const adjustViewCount = () => {
		const breakpoints = mergedOptions['breakpoints'];

		if (breakpoints && repositories.length < DEFAULT_VERTICAL_PERVIEW) {
			breakpoints[isVertical ? '(min-width: 1280px)' : '(min-width: 768px)'] = {
				slides: {
					perView: repositories.length
				}
			}
		}

		const options = Object.assign({}, mergedOptions, { breakpoints });
				
		if (!instanceRef.current) {
			return;
		}
		
		instanceRef.current.update(options);
	}

	const resizeHandler = () => {
		const vertical = window.innerWidth >= DESKTOP_BREAKPOINT_VALUE;

		const options = Object.assign({}, mergedOptions, { vertical });
		
		if (!instanceRef.current) {
			return;
		}
		
		instanceRef.current.update(options);

		setIsVertical(vertical);
	}

	useEffect(() => {
		const debouncedHoverOn = debounce(simulateHover(true), 100);
		const debouncedHoverOff = debounce(simulateHover(false), 100);

		if (instanceRef && instanceRef.current) {
			instanceRef.current.container.addEventListener('touchstart', debouncedHoverOff);
			instanceRef.current.container.addEventListener('touchend', debouncedHoverOn);
		}

		const debouncedResizeHandler = debounce(resizeHandler, 600);

		window.addEventListener('resize', debouncedResizeHandler);
		updatePosition(`#${anchor}`);

		console.log('projects loaded');
		
		return () => {
			window.removeEventListener('resize', debouncedResizeHandler);

			if (instanceRef && instanceRef.current) {
				instanceRef.current.container.removeEventListener('touchstart', debouncedHoverOff);
				instanceRef.current.container.removeEventListener('touchend', debouncedHoverOn);
				
				instanceRef.current.destroy();
			}
		}
	}, []);
	
	// When slider has loaded, trigger resize to detect if viewport inVertical state
	useEffect(() => {
		if (loaded && instanceRef.current) {
			resizeHandler();
		}
	}, [loaded]);

	// When is inVertical state changes, adjust project view count accordingly
	useEffect(() => {
		if (instanceRef.current) {
			adjustViewCount();
		}
	}, [isVertical])
	
	return (
        <div className="px-4 md:px-6">
          	<div className="max-w-4xl mx-auto">
            	<h2 className="text-3xl font-playfair-display font-bold tracking-tight mb-6 flex justify-center items-center text-center">
              		Featured Projects
            	</h2>
            	<div className="flex flex-col-reverse xl:flex-col relative group py-3">
					{loaded && instanceRef.current && (
						<div className="flex justify-center mb-4 p-2.5 w-full space-x-3">
          					{[
            					...Array(instanceRef.current.track.details.slides.length).keys(),
          					].map((id) => {
            					return (
              						<Button
                						key={id}
                						onClick={() => {
                  							instanceRef.current?.moveToIdx(id)
                						}}
                						className={`border-none w-3 h-3 p-1 rounded-full cursor-pointer ${curSlide === id ? 'bg-black' : 'bg-zinc-300'}`}
										label={`dot for card ${id}`}
									></Button>
            					)
          					})}
        				</div>
					)}
    				<div ref={sliderRef} className="keen-slider">
						{
							repositories.map((repo, index) => 
								<div key={index} className='keen-slider__slide scroll-smooth'>
									<Project repo={repo} owner={owner} shouldDim={isVertical} isInitial={index === curSlide} />
								</div>
							)
            			}
    				</div>
					{loaded && instanceRef.current && (
						<div className={`${!showHover ? 'hidden' : 'group-hover:flex' } justify-center items-end absolute bottom-0 left-20 sm:left-30 text-center pointer-events-none bg-transparent z-20`}>
							<span className='text-sm/relaxed opacity-70 underline underline-offset-4'>Swipe to see next card ⟶</span>
						</div>
        			)}
				</div>
          	</div>
      </div>
	)
};

export default memo(Projects);