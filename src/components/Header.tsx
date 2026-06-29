import { Menu } from 'lucide-react';
import debounce from 'debounce';
import { useState, useEffect, memo, type FC } from 'react';

import { Button } from './ui/Button';
import Navbar from './Navbar';
import { ThemeToggle } from './Toggle';

interface HeaderProps {
	enabledAnchors: Array<string>
}

const Header: FC<HeaderProps> = ({ enabledAnchors }) => {
	const [open, setOpen] = useState<boolean>(false);

	const toggle = () => setOpen(open ? false : true);
	
	useEffect(() => {
		const forceClose = () => setOpen(false);

		const debouncedForceClose = debounce(forceClose, 100);

		window.addEventListener('resize', debouncedForceClose);

		return () => {
			window.removeEventListener('resize', debouncedForceClose);
		}
	}, []);
    
	return (
        <header className="xl:hidden fixed top-0 left-0 right-0 z-50 bg-white/40 dark:bg-neutral-800/40 backdrop-blur-sm"> {/*border-zinc-100*/}
        	<div className="flex items-center justify-between h-16 xl:h-20 pl-2 pr-4 md:pl-6 md:pr-12">
				<ThemeToggle />
				<div className="w-3/4 md:w-0 xl:w-28 flex justify-end md:justify-start">
					{
						enabledAnchors.length ? (
							<Button className='cursor-pointer xl:hidden z-20' onPress={toggle} label="navigation menu">
								<Menu />
							</Button>
						) : null
					}
					{
						open ? (
							<div className='min-h-screen w-full py-8 px-8 fixed top-0 left-0 bg-white dark:bg-neutral-800 z-0'>
								<Navbar toggle={toggle} shouldOpen={open} anchors={enabledAnchors} />
							</div>
						) : null
					}
				</div>
			</div>
    	</header>
	)
};

export default memo(Header);