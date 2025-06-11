import { memo, useEffect, useState, type FC } from 'react';
import dayjs from 'dayjs';
import { ExternalLink } from 'lucide-react';

import { LinkButton, Button, VariantType } from './ui/Button';
import { updatePosition } from '../stores/page';
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

	useEffect(() => {
		const loadLogos = async (certs: Array<Certification>) => {
			const initializedCerts = [];

			for (const cert of certs) {
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
			<div className="max-w-4xl mx-auto">
				<h2 className="text-3xl font-playfair-display font-bold tracking-tight mb-8 flex justify-center items-center text-center">
					Certifications
				</h2>
				<div className="space-y-6">
					{sorted.map((cert: Certification, index) => (
						<div
							key={index}
							className="bg-white p-6 rounded-lg select-none border border-zinc-100 opacity-80 hover:opacity-100 shadow-sm hover:shadow-md transition-shadow"
						>
							<div className="flex flex-col md:flex-row md:items-center justify-between">
								<div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4">
									<div className='rounded-full shadow-sm md:shadow-md w-12 h-12'>
										<img src={cert.logo} className="rounded object-cover object-center" alt="issuer" />
									</div>
									<div className='mt-3 lg:mt-0'>
										<h3 className="text-lg text-center md:text-left font-semibold">{cert.name}</h3>
										<p className="text-zinc-500 text-center lg:text-left">
											{cert.issuer} • {dayjs(cert.date).format('YYYY')}
										</p>
									</div>
								</div>
								{
									cert.link && cert.link.length ? 
										<LinkButton variant={VariantType.Ghost} className="flex flex-row justify-center items-center mt-2 md:mt-0 text-center" href={cert.link} target='_blank'>
											<ExternalLink className="mr-2 h-5 w-5" />
											View Certificate
										</LinkButton> : 
										<Button variant={VariantType.Ghost} className="flex flex-row justify-center items-center mt-2 md:mt-0" disabled={true}>
											<ExternalLink className="mr-2 h-5 w-5" />
											View Certificate
										</Button>
								}
							</div>
							<p className="mt-2 text-zinc-600 text-center lg:text-start">{cert.description}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default memo(Certifications);