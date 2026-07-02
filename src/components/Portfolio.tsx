import { lazy, memo, type FC } from 'react';

import ObservableContainer from './ObservableContainer';
import Hero from './Hero';
import Profile from './Profile';
import { transformIntoSkill } from '../util';
import ThemeToggle from './Toggle';

const About = lazy(() => import('./About'));
const Skills = lazy(() => import('./Skills'));
const Projects = lazy(() => import('./Projects'));
const Certifications = lazy(() => import('./Certifications'));
const Contact = lazy(() => import('./Contact'));

interface PortfolioProps {
    name: string
    author: string
    description: string
    role: string
    links: { 
        github: string
        codepen?: string
        leetcode?: string
    }
    repos: Array<any>
    skills: {
        languages: Array<any>
        frameworks: Array<any>
        databases: Array<any>
        tools: Array<any>
        platforms: Array<any>
    }
    certs: Array<any>
    aboutMe: Array<string>
    contact: {
        sitekey: string
        endpoint: string
    }
    enabledAnchors: Array<string>
}

const Portfolio: FC<PortfolioProps> = ({ name, author, description, links, repos, skills, certs, aboutMe, contact, role, enabledAnchors }) => {
    const { languages = [], frameworks = [], databases = [], tools = [], platforms = [] } = skills;

    return (
        <main>
            <Hero name={name.split(' ')[0]} introduction={description} nextAnchor={enabledAnchors[0]} />
            <div className='relative flex flex-row w-full font-[var(--default-font)]'>
                <div className='hidden lg:flex fixed w-auto z-3 top-5 left-5'>
                    <ThemeToggle/>
                </div>
                <Profile name={name} role={role} description={description} anchors={enabledAnchors} links={links} />
		        <ObservableContainer>
                    {
                        enabledAnchors.indexOf('projects') > -1 && author && author.length ? <Projects anchor='projects' owner={author} repositories={repos} /> : null 
                    }
		            {
			            enabledAnchors.indexOf('skills') > -1 ?  
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
                        enabledAnchors.indexOf('certifications') > -1 ? <Certifications anchor='certifications' earned={certs} /> : null
                    }
                    {
			            enabledAnchors.indexOf('about') > -1 ? <About anchor='about' blocks={aboutMe} /> : null
                    }
		            {
			            enabledAnchors.indexOf('contact') > -1 ? <Contact anchor='contact' sitekey={contact.sitekey} endpoint={contact.endpoint} /> : null
		            }
		        </ObservableContainer>
            </div>
        </main>
    )
}

export default memo(Portfolio);
