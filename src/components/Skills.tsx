import { useEffect, useState, memo, type FC } from 'react';
import { type IconType } from '@icons-pack/react-simple-icons';

import SkillIcon from "./ui/Icon";
import { updatePosition } from '../stores/page';
import { type BaseProps } from '../constants';

interface Skill {
	name: string,
	icon: IconType,
	highlight?: boolean
}

interface SkillsProps extends BaseProps {
	languages: Array<Skill>
	frameworks: Array<Skill>
	databases: Array<Skill>
	tools: Array<Skill>,
	platforms: Array<Skill>
}

const Skills: FC<SkillsProps> = ({ anchor, languages, frameworks, tools, databases, platforms }) => {
	const [skills, setSkills] = useState<Set<Skill>>();

	useEffect(() => {
		const createVisibleSkills = () => {
			setSkills(
				new Set<Skill>()
				.union(new Set(languages))
				.union(new Set(frameworks))
				.union(new Set(databases))
				.union(new Set(tools))
				.union(new Set(platforms))
			);
		}

		createVisibleSkills();
		updatePosition(`#${anchor}`);
		console.log('skills loaded');
	}, []);

  	return (
    	<div className="px-4 md:px-6">
      		<div className="max-w-4xl mx-auto">
        		<h2 className="text-3xl font-playfair-display font-bold tracking-tight mb-4 flex items-center justify-center text-center">
          			Skills / Tools
        		</h2>
				<p className="mb-8 text-md text-center text-gray-600">This is a brief overview of languages, frameworks/libraries, databases and tools used over the years.</p>
				<div className={`flex flex-col`}>
					<ol className="list-none grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{ 
							skills ?
								(
									Array.from(skills?.values()).map(({ name, icon, highlight }) => (
										<li key={name} className={`bg-white ${highlight ? 'opacity-100': 'opacity-50 hover:opacity-100'} p-5 rounded-lg border border-zinc-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center transform hover:scale-110 hover:transition-transform duration-300 ease-out`}>
              								<SkillIcon name={name} icon={icon} className={`h-8 w-8 mb-2 ${highlight ? 'fill-black' : ''}`} /> {/* fill-yellow-500 */}
											<span className={`line-clamp-1 text-center ${highlight ? 'font-semibold' : 'font-medium'} select-none`}>{ name }</span> {/* text-yellow-500 */}
            							</li>
								)
							)) : null
						}
					</ol>
				</div>
      		</div>
    	</div>
	);
}

export default memo(Skills);