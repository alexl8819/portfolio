import { useEffect, useState, useRef, memo, type FC } from 'react';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import { Github } from 'lucide-react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useForm } from 'react-hook-form';
import debounce from 'debounce';

import { LinkButton, Button, VariantType } from './ui/Button';
import Bluesky from '../assets/bluesky.svg';
import { type BaseProps } from '../constants';
import { updatePosition } from '../stores/page';

import 'react-toastify/ReactToastify.css';

interface ContactProps extends BaseProps {
	sitekey: string
	endpoint: string
}

const Contact: FC<ContactProps> = ({ sitekey, endpoint, anchor }) => {
	const [requestCaptcha, setRequestCaptcha] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const captchaRef = useRef<HCaptcha>(null);
	const {
		register,
		handleSubmit,
		reset,
		setError,
		setValue,
		getValues,
		formState: { errors },
	} = useForm();

	const onSubmit = handleSubmit(debounce(({ captchaToken }) => {
		if (!requestCaptcha || !captchaToken) {
			setRequestCaptcha(true);
			return;
		}

		setSubmitted(true);
	}, 1000, { immediate: true }));

	const handleToken = (token: string) => setValue('captchaToken', token, { shouldValidate: true });

	useEffect(() => {
		console.log('contact loaded');

		updatePosition(`#${anchor}`);
	}, []);

	useEffect(() => {
		const sendMessage = async () => {
			const name = getValues('name');
			const email = getValues('email');
			const message = getValues('message');
			const captchaToken = getValues('captchaToken');

			let response;

			try {
				response = await fetch(endpoint, {
					method: 'POST',
					body: JSON.stringify({
						name,
						email,
						message,
						captchaToken 
					})
				});
			} catch (err) {
				console.error(err);
			} finally {
				setSubmitted(false);
			}

			if (!response) {
				toast.error('Something unexpected happened. Try again later.');
				return;
			}

			const data = await response.json();

			if (!response.ok) {
				console.log(response.status);
				console.log(response.statusText);

				if (response.status >= 400) {
					if (response.status >= 500) {
						toast.error('Something unexpected happened. Try again later.');
						return;
					}

					if (data.field && data.field.length) {
						switch (data.field) {
							case 'name':
								setError('name', { type: 'string', message: data.error }, { shouldFocus: true });
								break;
							case 'email':
								setError('email', { type: 'string', message: data.error }, { shouldFocus: true });
								break;
							case 'message':
								setError('message', { type: 'string', message: data.error }, { shouldFocus: true });
								break;
							case 'captchaToken':
								setError('captchaToken', { type: 'string', message: data.error }, { shouldFocus: true });
								break;
						}
					}
				}

				return;
			}

			toast.success(data.message);
	
			setRequestCaptcha(false);
			reset();
		};

		if (submitted) {
			sendMessage();
		}
	}, [submitted]);
	
	return (
        <div className="px-4 md:px-6">
			<div className="max-w-4xl mx-auto text-center">
            	<h2 className="text-3xl font-playfair-display font-bold tracking-tight mb-4">Get In Touch</h2>
            	<p className="text-zinc-600 mb-8">
              		I'm currently available for freelance work and <span className="font-bold">full-time</span> positions.
            	</p>
            	<div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
					<LinkButton href="https://bsky.app/profile/alexl8819.bsky.social" target="_blank" variant={VariantType.Outline} className="flex justify-center items-center">
						<img src={Bluesky.src} className='mr-2 w-4 h-4' alt='bluesky logo' />
                		BlueSky
              		</LinkButton>
					<LinkButton href="https://github.com/alexl8819" target='_blank' variant={VariantType.Outline} className="flex justify-center items-center">
                		<Github className="mr-2 h-4 w-4" />
                		GitHub
            		</LinkButton>
            	</div>
            	<div className="bg-zinc-50 p-6 rounded-lg border border-zinc-100">
              		<h3 className="text-lg font-semibold mb-4">Write a Message</h3>
              		<form className="space-y-4" onSubmit={onSubmit}>
                		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  			<div className="space-y-2">
                    			<label htmlFor="name" className="text-sm font-medium text-zinc-700">
                      				Name
                    			</label>
                    			<input
                      				id="name"
                      				className="w-full px-3 py-2 border border-zinc-300 rounded-md"
                      				placeholder="Your name"
									aria-invalid={errors.name ? "true" : "false"}
									{...register('name', { required: true })} 
                    			/>
								{ errors.name && <p role="alert" className='mx-2 text-red-500'>{ (errors.name.message as string) || 'Name is required.' }</p> }
                  			</div>
                  			<div className="space-y-2">
                    			<label htmlFor="email" className="text-sm font-medium text-zinc-700">
                      				Email
                    			</label>
                    			<input
                      				id="email"
                      				className="w-full px-3 py-2 border border-zinc-300 rounded-md"
                      				type="email"
                      				placeholder="Your email"
									aria-invalid={errors.name ? "true" : "false"}
									{...register('email', { required: true })} 
                    			/>
								{ errors.email && <p role="alert" className='mx-2 text-red-500'>{ (errors.email.message as string) || 'Email is required.' }</p> }
                  			</div>
                		</div>
                		<div className="space-y-2">
                  			<label htmlFor="message" className="text-sm font-medium text-zinc-700">
                    			Message
                  			</label>
                  			<textarea
                    			id="message"
                    			className="w-full px-3 py-2 border border-zinc-300 rounded-md resize-none"
                    			rows={4}
                    			placeholder="Your message"
								aria-invalid={errors.name ? "true" : "false"}
								{...register('message', { required: true, minLength: 25 })}
                  			></textarea>
							{ errors.message && <p role="alert" className='mx-2 text-red-500'>{ (errors.message.message as string) || 'Message is required (minimum 25 characters.' }</p> }
                		</div>
						<div className="flex flex-col justify-center items-center space-y-2 min-h-8">
							{ 
								requestCaptcha ? 
									<>
										<input 
											type="hidden" 
											{...register('captchaToken', { required: true })} 
										/>
										<HCaptcha sitekey={sitekey} onVerify={handleToken} ref={captchaRef} />
										{ errors.captchaToken && <p role="alert" className='mx-2 text-red-500'>{ (errors.captchaToken.message as string) || 'Captcha must be solved first.' }</p> }
									</> : null 
							}
						</div>
                		<Button className="py-3 w-full border border-zinc-400/40 rounded-lg">Send Message</Button>
              		</form>
            	</div>
          	</div>
			<ToastContainer 
				position='top-center'
				autoClose={3000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable={false}
				pauseOnHover={false}
				theme='light'
				transition={Zoom}
			/>
        </div>
    )
}

export default memo(Contact);