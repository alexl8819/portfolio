import { memo, type FC } from 'react';
import { 
  User,
  FileUser,
  FolderGit,
  ShieldUser,
  Send
} from 'lucide-react';
import { Button } from './ui/Button';
import { updatePosition } from '../stores/page';
import { scrollTo } from '../util';

interface NavbarProps {
	shouldOpen: boolean
	toggle?: Function
	anchors: Array<string>
}

const Navbar: FC<NavbarProps> = ({ shouldOpen, toggle, anchors }) => {
	const scroll = (section: string) => {
		return () => {
			scrollTo(section);
			updatePosition(section);

			if (typeof toggle === 'function') {
				toggle();
			}
		}
	}

	return (
		<nav className={`${shouldOpen ? 'flex mt-20 xl:mt-24' : 'hidden'} items-start my-4 md:flex flex-col w-full`}>
			<ol className='list-none mb-8 w-full flex flex-col xl:justify-center items-start xl:items-center space-y-12'>
			{
				anchors.indexOf('projects') > -1 ? (<li>
					<Button className={`group flex flex-row xl:flex-col items-start xl:items-center font-dm-sans text-sm md:text-base font-medium text-zinc-700/80 dark:text-zinc-100/80 hover:text-zinc-800 dark:hover:text-zinc-50 transition-colors px-3 py-1.5 rounded-lg`} onPress={scroll('#projects')}>
              			<FolderGit className='stroke-[1.5] group-hover:fill-neutral-400 dark:group-hover:fill-neutral-900 inline-block mr-3 xl:mr-0 xl:mb-1.5' /> Projects
            		</Button>
				</li>) : null
			}
			{
				anchors.indexOf('skills') > -1 ? (<li>
					<Button className={`group flex flex-row xl:flex-col items-start xl:items-center font-dm-sans text-sm md:text-base font-medium text-zinc-700/80 dark:text-zinc-100/80 hover:text-zinc-800 dark:hover:text-zinc-50 transition-colors px-3 py-1.5 rounded-lg`} onPress={scroll('#skills')}>
              			<FileUser className='stroke-[1.5] group-hover:fill-neutral-400 dark:group-hover:fill-neutral-900 inline-block mr-3 xl:mr-0 xl:mb-1.5' /> Skills
            		</Button>
				</li>) : null
			}
			{
				anchors.indexOf('certifications') > -1 ? (<li>
					<Button className={`group flex flex-row xl:flex-col items-start xl:items-center font-dm-sans text-sm md:text-base font-medium text-zinc-700/80 dark:text-zinc-100/80 hover:text-zinc-800 dark:hover:text-zinc-50 transition-colors px-3 py-1.5 rounded-lg`} onPress={scroll('#certifications')}>
              			<ShieldUser className='stroke-[1.5] group-hover:fill-neutral-400 dark:group-hover:fill-neutral-900 inline-block mr-3 xl:mr-0 xl:mb-1.5' /> Certifications
            		</Button>
				</li>) : null
			}
			{
				anchors.indexOf('about') > -1 ? (<li>
					<Button className={`group flex flex-row xl:flex-col items-start xl:items-center font-dm-sans text-sm md:text-base font-medium text-zinc-700/80 dark:text-zinc-100/80 hover:text-zinc-800 dark:hover:text-zinc-50 transition-colors px-3 py-1.5 rounded-lg`} onPress={scroll('#about')}>
              			<User className='stroke-[1.5] group-hover:fill-neutral-400 dark:group-hover:fill-neutral-900 inline-block mr-3 xl:mr-0 xl:mb-1.5' /> About
            		</Button>
				</li>) : null
			}
			{
				anchors.indexOf('contact') > -1 ? (<li>
					<Button className={`flex flex-row xl:flex-col items-start xl:items-center font-dm-sans text-sm md:text-base justify-center text-black dark:text-stone-100 font-bold hover:animate-pulse px-3 py-1.5`} onPress={scroll('#contact')}>
            			<Send className='stroke-[1.5] fill-neutral-400 dark:fill-neutral-900 inline-block mr-3 xl:mr-0 xl:mb-1.5' /> Contact Me
          			</Button>
				</li>) : null
			}
			</ol>
        </nav>
	)
}

export default memo(Navbar);
