import { memo, useEffect, useState, type FC } from 'react';
import dayjs from 'dayjs';
import { ExternalLink } from 'lucide-react';

import { LinkButton, Button, VariantType } from './ui/Button';
import { updatePosition } from '../stores/page';
import { CertificationSkeleton } from './Skeleton';
import { type BaseProps } from '../constants';

interface Certification {
	name: string
	issuer: string
	logo: string
	date: string
	description?: string
	link?: string
}

interface CertificationProps extends BaseProps {
	earned: Array<Certification>
}

const Certifications: FC<CertificationProps> = ({ earned, anchor }) => {
	const [sorted, setSorted] = useState<Array<Certification>>([]);
	const [isHovered, setIsHovered] = useState<number>(-1);

	useEffect(() => {
		const loadLogos = async (certs: Array<Certification>) => {
			const initializedCerts = [];
			
			for (const cert of certs) {
				// Skip if logo is missing/null
				if (!cert.logo) {
				    continue;
				}

				const logoImg = await import(`../assets/logos/${cert.logo}.png`);
				initializedCerts.push(Object.assign({}, cert, {
					logo: logoImg.default.src
				}));
			}
			
			return initializedCerts;
		}

		const sortByDate = (certs: Array<Certification>) => certs.sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));

		const createCerts = async () => {
			const certs = await loadLogos(earned);
			setSorted(sortByDate(certs));
		}

		createCerts();
		updatePosition(`#${anchor}`);

		console.log('certs loaded');
	}, []);

	return (
		<div className="px-4 md:px-6">
			<section className="max-w-4xl mx-auto">
				<h2 className="text-3xl font-playfair-display font-bold tracking-tight mb-4 flex justify-center items-center text-center">
					Certifications
				</h2>
				<p className='mb-8 text-md text-zinc-600 dark:text-stone-400 font-light text-center'>Newer certifications without links are scheduled for examination at a later date</p>
				<div className="space-y-6">
					{
						!sorted.length ? 
							Array.from({ length: 4 }).map((_, index) => <CertificationSkeleton key={index} />) :
							sorted.map((cert: Certification, index) => (
								<div
									key={index}
									style={{ opacity: isHovered === index ? 1 : 1 - ((index + 1) * 0.15) }}
									onMouseEnter={() => setIsHovered(index)}
									onMouseLeave={() => setIsHovered(-1)}
									className="bg-white dark:bg-stone-900 text-zinc-100 dark:text-neutral-900 2xl:h-40 flex flex-col lg:flex-row justify-center rounded-lg select-none border border-zinc-100 dark:border-neutral-700 shadow-sm hover:shadow-md transition duration-300"
								>
									<div className='p-6 2xl:p-8 w-full'>
										<div className="flex flex-col md:flex-row md:items-center md:justify-left lg:justify-between">
											<div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4">
												<div className={`rounded-full ${sorted.length ? 'shadow-none': 'shadow-sm md:shadow-md'} w-12 h-12`}>
													<img src={cert.logo} className="rounded object-cover object-center" alt="issuer" />
												</div>
												<div className='mt-3 lg:mt-0'>
													<h3 className="text-lg text-center md:text-left text-stone-900 dark:text-white font-semibold">{cert.name}</h3>
													<p className="text-zinc-600 dark:text-zinc-400 text-center md:text-left">
														{cert.issuer} • {dayjs(cert.date).format('YYYY')}
													</p>
												</div>
											</div>
										</div>
										<p className="mt-2 text-center md:text-start text-zinc-800 dark:text-zinc-400">{cert.description}</p> {/*text-zinc-600*/}
									</div>
									<div className='flex flex-col justify-center py-2'>
										{
											cert.link && cert.link.length ? 
												<LinkButton variant={VariantType.Outline} className="flex flex-row justify-center items-center text-center mt-2 md:mt-0 p-6 border-none" href={cert.link} target='_blank'>
													<ExternalLink className="lg:mr-0 mr-2 h-5 w-5 text-stone-600" />
													<span className="lg:hidden text-stone-600 dark:text-stone-400 font-light">View Certificate</span>
												</LinkButton> : 
												<Button variant={VariantType.Outline} className="flex flex-row justify-center items-center text-center border-none p-6 w-full" disabled={true}>
													<ExternalLink className="lg:mr-0 mr-2 h-5 w-5 text-stone-600/30" />
													<span className="lg:hidden text-stone-600/30 dark:text-stone-400/30 font-light">View Certificate</span>
												</Button>
										}
										</div>
							</div>
						))
					}
				</div>
			</section>
		</div>
	);
}

export default memo(Certifications);
