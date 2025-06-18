import { lazy, memo, type FC } from 'react';

import ObservableContainer from './ObservableContainer';
import Hero from './Hero';
import Profile from './Profile';
import { transformIntoSkill } from '../util';

const About = lazy(() => import('./About'));
const Skills = lazy(() => import('./Skills'));
const Projects = lazy(() => import('./Projects'));
const Certifications = lazy(() => import('./Certifications'));
const Contact = lazy(() => import('./Contact'));

interface PortfolioProps {
    name: string
    author: string
    description: string
    links: string
    repos: string
    skills: string
    certs: string
    aboutMe: string,
    contact: {
        sitekey: string
        endpoint: string
    }
}

const Portfolio: FC<PortfolioProps> = ({ name, author, description, links, repos, skills, certs, aboutMe, contact }) => {
    const externalLinks = JSON.parse(links);
    const repositories = JSON.parse(repos);
    const certifications= JSON.parse(certs);
    const aboutBlocks = JSON.parse(aboutMe);
    const { languages, frameworks, databases, tools, platforms } = JSON.parse(skills);
    return (
        <main>
            <Hero name={name.split(' ')[0]} introduction={description} />
            <div className='relative flex flex-row w-full'>
                <Profile name={name} description={description} links={externalLinks} />
                <ObservableContainer>
                    {
                        repositories && repositories.length && author && author.length ? <Projects anchor='projects' owner={author} repositories={repositories} /> : null 
                    }
                    {
                        languages && languages.length || frameworks && frameworks.length || databases && databases.length || tools && tools.length || platforms && platforms.length ? 
                            <Skills
                                anchor='skills' 
                                languages={transformIntoSkill(languages)}
                                frameworks={transformIntoSkill(frameworks)}
                                databases={transformIntoSkill(databases)}
                                tools={transformIntoSkill(tools)}
                                platforms={transformIntoSkill(platforms)}
                            /> : null
                    }
                    {
                        certifications && certifications.length ? <Certifications anchor='certifications' earned={certifications} /> : null
                    }
                    {
                        aboutBlocks && aboutBlocks.length ? <About anchor='about' blocks={aboutBlocks} /> : null
                    }
                    <Contact anchor='contact' sitekey={contact.sitekey} endpoint={contact.endpoint} links={externalLinks} />
		        </ObservableContainer>
            </div>
        </main>
    )
}

export default memo(Portfolio);