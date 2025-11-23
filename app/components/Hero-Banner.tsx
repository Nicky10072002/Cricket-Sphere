import {Image} from '@shopify/hydrogen';
import {Link} from 'react-router';

interface HeroBannerProps {
    image: {
        id: string;
        url: string;
        altText: string | null;
        width: number;
        height: number;
    } | null;
    title: string;
    subtitle: string;
    buttonLabel: string;
    buttonUrl: string;
}
    
export function HeroBanner({image, title, subtitle, buttonLabel, buttonUrl}: HeroBannerProps){
    return(
        <section>
            <div className='relative'>
                <Image data={image} sizes="100vw"  />
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm bg-white/50 p-8 text-center'>
                    <h2 className='text-4xl font-bold mt-2 mb-4'>{title}</h2>
                    <p className='mt-2 mb-4 text-3xl'>{subtitle}</p>
                    <Link to="/collections/Equipments" className='mt-2 mb-2 inline-block w-fit mx-auto text-2xl font-bold bg-amber-200 px-6 py-2 rounded-full hover:bg-amber-300 transition-colors duration-300 no-underline'>{buttonLabel}</Link>
                </div>
            </div>
        </section>
    )
}