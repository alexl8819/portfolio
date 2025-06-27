import { useEffect, useState, useRef, memo, type FC } from 'react';
import { Form, Input, Label, TextArea, TextField } from 'react-aria-components';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import { Github } from 'lucide-react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useForm } from 'react-hook-form';
import debounce from 'debounce';

import { LinkButton, Button, VariantType } from './ui/Button';
import { type BaseProps } from '../constants';
import { updatePosition } from '../stores/page';

import 'react-toastify/ReactToastify.css';

const VALID_NAME_SEQ = /^(?!\s*$)(?!^(.)\1+$)[A-Za-z]+(?: [A-Za-z]+)+$/;
const VALID_MESSAGE_SEQ = /^(?!\s*$)(?!^(.)\1+$)( {0,2}[A-Za-z0-9,!$#@%&-()]+(?: [A-Za-z0-9,!$#@%&-()]+)* {0,2})$/;

interface ContactProps extends BaseProps {
	sitekey: string
	endpoint: string
	links: {
		github: string
	}
}

const Contact: FC<ContactProps> = ({ anchor, sitekey, endpoint, links }) => {
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
						name: name.trim(),
						email: email.trim(),
						message: message.trim(),
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
            	<p className="text-md text-zinc-600 font-light mb-8">
              		I'm currently available for freelance work and <span className="font-bold">full-time</span> positions.
            	</p>
            	<div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
					<LinkButton href={links.github} target='_blank' variant={VariantType.Outline} className="flex justify-center items-center">
                		<Github className="mr-2 h-4 w-4" />
                		GitHub
            		</LinkButton>
            	</div>
            	<div className="bg-zinc-50 shadow-lg p-6 rounded-lg border border-zinc-100">
              		<h3 className="text-lg font-semibold mb-4">Write a Message</h3>
              		<Form className="space-y-4" onSubmit={onSubmit}>
                		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  			<TextField className="space-y-2">
                    			<Label htmlFor="name" className="text-sm font-medium text-zinc-700">
                      				Full Name
                    			</Label>
                    			<Input
                      				id="name"
                      				className={`w-full px-3 py-2 outline-none border ${errors.name ? 'border-red-500' : 'border-zinc-300'} rounded-md`}
                      				placeholder="Your name"
									aria-invalid={errors.name ? "true" : "false"}
									{...register('name', { required: true, pattern: VALID_NAME_SEQ })} 
                    			/>
								{ errors.name && <p role="alert" className='mx-2 text-red-500'>{ (errors.name.message as string) || 'Name is required.' }</p> }
                  			</TextField>
                  			<TextField className="space-y-2">
                    			<Label htmlFor="email" className="text-sm font-medium text-zinc-700">
                      				Email
                    			</Label>
                    			<Input
                      				id="email"
                      				className={`w-full px-3 py-2 outline-none border ${errors.name ? 'border-red-500' : 'border-zinc-300'} rounded-md`}
                      				type="email"
                      				placeholder="Your email"
									aria-invalid={errors.name ? "true" : "false"}
									{...register('email', { required: true })} 
                    			/>
								{ errors.email && <p role="alert" className='mx-2 text-red-500'>{ (errors.email.message as string) || 'Email is required.' }</p> }
                  			</TextField>
                		</div>
                		<TextField className="space-y-2">
                  			<Label htmlFor="message" className="text-sm font-medium text-zinc-700">
                    			Message
                  			</Label>
                  			<TextArea
                    			id="message"
                    			className={`w-full px-3 py-2 outline-none border ${errors.name ? 'border-red-500' : 'border-zinc-300'} rounded-md resize-none`}
                    			rows={4}
                    			placeholder="Your message"
								aria-invalid={errors.name ? "true" : "false"}
								{...register('message', { required: true, minLength: 25, pattern: VALID_MESSAGE_SEQ })}
                  			></TextArea>
							{ errors.message && <p role="alert" className='mx-2 text-red-500'>{ (errors.message.message as string) || 'Message is required (minimum 25 characters).' }</p> }
                		</TextField>
						<div className="flex flex-col justify-center items-center min-h-10">
							{ 
								requestCaptcha ? 
									<>
										<Label htmlFor='captchaToken' className='sr-only'>Captcha</Label>
										<Input
											id="captchaToken"
											type="hidden" 
											{...register('captchaToken', { required: true })} 
										/>
										{ errors.captchaToken && <p role="alert" className='mx-2 text-red-500'>{ (errors.captchaToken.message as string) || 'Captcha must be solved first.' }</p> }
										<HCaptcha sitekey={sitekey} onVerify={handleToken} ref={captchaRef} />
									</> : null 
							}
						</div>
                		<Button type='submit' className="py-3 w-full hover:bg-neutral-800 hover:text-white border border-zinc-400/40 rounded-lg">Send Message</Button>
              		</Form>
            	</div>
          	</div>
			<ToastContainer 
				position='bottom-center'
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