import { useEffect, useState, type FC } from 'react';
import { useStore } from '@nanostores/react';
import { ArrowRight, FolderGit } from 'lucide-react';

import { Button, LinkButton, VariantType } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { ProjectCardSkeleton } from './Skeleton';
import ScreenshotDisplay from './Display';
import {
    repositories,
    fetchAndRevalidate 
} from '../stores/repo';
import { getCommonIcon, isURLActive } from '../util';
import { MAIN_GH_URL } from '../constants';

interface ProjectProps { 
    repo: string
    owner: string
    shouldDim?: boolean
    isInitial?: boolean
}
const Project: FC<ProjectProps> = ({ repo, owner, shouldDim, isInitial }) => {
    const [canUseCaseStudy, setCanUseCaseStudy] = useState<boolean | null>(null);
    const repos = useStore(repositories);

    const caseStudyUrl = `${MAIN_GH_URL.replace('OWNER', owner).replace('REPO', repo)}/main/CASE_STUDY.md`;

    useEffect(() => {
        const fetchActiveUrl = async () => {
            const result = await isURLActive(caseStudyUrl);
            setCanUseCaseStudy(result);
        };

        fetchAndRevalidate(repo, owner);
        fetchActiveUrl();
    }, []);

    const curProject = Object.keys(repos).length ? repos[repo] : null;

    if (!curProject || !curProject.data || canUseCaseStudy === null) {
        return (<ProjectCardSkeleton />);
    }

    let Icon;

    if (curProject && curProject.data.language) {
        Icon = getCommonIcon(curProject.data.language.toLowerCase());  
    }

    return (
		<Card className={`flex flex-col xl:flex-row xl:min-h-72 my-4 xl:my-0 bg-white ${!shouldDim || isInitial ? 'opacity-100' : 'opacity-40 pointer-events-none'} overflow-hidden hover:shadow-lg border-1 border-zinc-500/20 transition-shadow z-0`}>
			<div className="h-64 xl:h-84 overflow-hidden w-full xl:w-1/3">
				<ScreenshotDisplay owner={owner} repo={repo} />
			</div>
            <div className='flex flex-col w-full xl:w-3/4'>
                <CardHeader className='mt-3 mb-6 px-6 h-28'>
				    <CardTitle className='font-bold font-source-sans text-xl uppercase my-2'>{repo}</CardTitle>
				    <CardDescription className='xl:mr-28 font-medium text-zinc-600 line-clamp-3 overflow-hidden'>
                        {
                            curProject.data?.description
                        }
                    </CardDescription>
                </CardHeader>
			    <CardContent className="group h-40 px-6 pb-2">
                    <div className='h-full z-0'>
                        {
                            curProject && Icon ? (<Icon className='absolute top-90 xl:-top-1 -right-5 w-28 h-28 opacity-20' />) : null
                        }
                        <div className='flex flex-col justify-between h-full z-10'>
                            <div className="flex flex-wrap gap-2">
                            {
						        curProject.data?.topics.map((topic) => (
                        	        <span
                          		        key={topic}
                          		        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-600 text-white"
                        	        >
                          		        {topic}
                        	        </span>
                      	        ))
					        }
                            </div>
                            <div className="mt-4 flex justify-evenly xl:justify-start items-center xl:space-x-3">
                                <LinkButton href={`https://github.com/${owner}/${repo}`} target='_blank' variant={VariantType.Outline} className="hidden lg:flex items-center text-xs">
                                    <FolderGit className="mr-2 h-4 w-4" />
                                    View Code
                                </LinkButton>
                                {
                                    canUseCaseStudy ? (
                                        <LinkButton href={caseStudyUrl} target='_blank' variant={VariantType.Outline} className="text-xs flex items-center">
                                            <FolderGit className="mr-2 h-4 w-4" />
                                            Case Study
                                        </LinkButton>
                                    ) : (
                                        <Button variant={VariantType.Outline} className="text-xs flex items-center" disabled={true}>
                                            <FolderGit className="mr-2 h-4 w-4" />
                                            Case Study
                                        </Button>
                                    )
                                }
                                {
                                    curProject && curProject.data?.homepage && curProject.data?.homepage.length ? 
                                        (
                                            <LinkButton href={curProject.data.homepage} target='_blank' variant={VariantType.Outline} className='text-xs flex items-center bg-black text-white'>
                                                <ArrowRight className="mr-2 h-4 w-4" />
                                                Live Demo
                                            </LinkButton>
                                        ) : (
                                            <Button variant={VariantType.Outline} className='text-xs flex items-center bg-black text-white' disabled={true}>
                                                <ArrowRight className="mr-2 h-4 w-4" />
                                                Live Demo
                                            </Button>
                                        )
                                }
                            </div>
                        </div>
                    </div>
                </CardContent>
            </div>
    	</Card>
	);
}

export default Project;