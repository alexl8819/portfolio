import { Menu } from 'lucide-react';
import debounce from 'debounce';
import { useState, useEffect, memo } from 'react';

import { Button } from './ui/Button';
import Navbar from './Navbar';

const Header = () => {
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
        <header className="xl:hidden fixed top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-sm border-b border-zinc-100">
        	<div className="flex items-center justify-end h-16 xl:h-20 px-4 md:px-12">
				<div className="w-full md:w-0 xl:w-28 flex justify-end md:justify-start">
					<Button className='cursor-pointer xl:hidden z-20' onPress={toggle} label="navigation menu">
						<Menu />
					</Button>
					{
						open ? (
							<div className='min-h-screen w-full py-8 px-8 fixed top-0 left-0 bg-white z-0'>
								<Navbar toggle={toggle} shouldOpen={open} />
							</div>
						) : null
					}
				</div>
			</div>
    	</header>
	)
};

export default memo(Header);