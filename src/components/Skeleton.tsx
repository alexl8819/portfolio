import { memo } from 'react';

import { Card, CardHeader, CardContent } from './ui/Card';

export const SectionLoaderSkeleton = memo(({}) => (<div className="min-h-screen flex justify-center items-center text-center">Loading...</div>));

export const ProjectCardSkeleton = memo(({ tags = 8 }: { tags?: number }) => {
    return (
        <Card className='min-h-64 flex flex-col xl:flex-row bg-white'>
            <div className='h-64 xl:h-84 animate-pulse bg-zinc-600 xl:w-1/3'></div>
            <div className='flex flex-col w-full xl:w-3/4'>
                <CardHeader className='mt-3 mb-6 px-6 h-28'>
                    <div className='w-40 h-6 animate-pulse bg-zinc-600 my-2'></div>
                    <p className='h-6 xl:mr-28 line-clamp-3 animate-pulse bg-zinc-600'></p>
                </CardHeader>
                <CardContent className='h-40 px-6 pb-2'>
                    <div className='flex flex-col justify-between h-full'>
                            <div className="flex flex-wrap gap-2">
                            {
						        Array.from({ length: tags }).map((_, i) => (
                        	        <span
                          		        key={i}
                          		        className="h-5 w-10 px-2.5 py-0.5 rounded-full animate-pulse bg-gray-600"
                        	        >
                        	        </span>
                      	        ))
					        }
                            </div>
                            <div className="mt-4 flex justify-evenly xl:justify-start items-center xl:space-x-3">
                                {
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className='rounded-lg w-36 h-8 animate-pulse bg-zinc-600'></div>
                                    ))
                                }
                            </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
});

/*const CertificationSkeleton = memo(({}) => {
    return (<></>);
});*/