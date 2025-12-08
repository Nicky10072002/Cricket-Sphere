'use client';

import { useState } from 'react';

type QuickCartProps = {
    selectedProduct: any;
    handleCloseCart: () => void;
};
    export function QuickCart({product, handleCloseCart}: QuickCartProps) {
        const varient = product?.nodes?.[0]?.variants?.nodes?.[0];
        const [quantity, setQuantity] = useState(1);
        const [image, setImage] = useState(product?.nodes?.[0]?.image);
        const [title, setTitle] = useState(product?.nodes?.[0]?.title);
        const [price, setPrice] = useState(product?.nodes?.[0]?.variants?.nodes?.[0]?.price);
        const [add, setAdd] = useState(false);
        const [error, setError] = useState('');

        async function addtoCart() {
            if(!varient?.id) return;
            setAdd(true);
            try {
                const res = await fetch('/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: varient?.id,
                        quantity: quantity,
                    }),
                });
            } catch (error) {
                console.error(error);
                setError("Unable to add to cart. Please try again.");
            }
        }
        return (
            <div className='fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full flex items-center justify-center bg-gray-900 bg-opacity-50'>
                <div className='relative w-full max-w-md p-4 mx-auto h-full md:h-auto'>
                    <div className='flex justify-end'>
                        <button onClick={handleCloseCart} className='text-gray-400 hover:text-gray-500'>
                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12'></path></svg>
                        </button>
                        <div className='flex gap-4'>
                            <div className='rounded overflow-hidden'>
                                <Image data={image} />
                            </div>
                            <div>
                                <h2 className='text-lg font-semibold'>{title}</h2>
                                <p className='text-gray-600'>{price}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }