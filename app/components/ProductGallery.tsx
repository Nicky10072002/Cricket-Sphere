import { Image } from "@shopify/hydrogen";
import { useState } from "react";

type ImgNode = {
    id: string;
    url: string;
    altText: string | null;
    width: number | null;
    height: number | null;
};

export default function ProductGallery({
    images,
}: {
    images: ImgNode[];
}) {
    const [index, setIndex] = useState(0);
    
    if (images.length === 0) {
        return <div className="product-gallery-placeholder">No Images Available</div>;
    }

    const mainImage = images[index];

    return (
        <div className="product-gallery grid grid-rows-[1fr_auto] gap-4">
            {/* <div className="main-image">
                <Image 
                data={mainImage}
                alt={mainImage?.altText ?? 'Product Image'}
                className="w-full h-[400px] object-contain"
                />
            </div>
            {images.length > 1 && (
                <div className="thumbnail-container grid grid-cols-5 gap-2 border-t pt-2 border-gray-200">
                    {images.map((img, idx) => (
                        <button 
                        key={img.id}
                        onClick={() => setIndex(idx)}
                        className="overflow-hidden hover:opacity-75 transition-opacity rounded border border-gray-200 bg-white"
                        >
                            <Image 
                            data={img}
                            alt={img?.altText ?? 'Product Thumbnail'}
                            className="w-full object-contain aspect-[4/3] border border-gray-200"
                            />
                        </button>
                    ))}
                </div>
            )} */}

            {images.length == 1 ? 
                <div className="main-image">
                    {images[0] && <Image data={images[0]} alt={images[0].altText || 'Product Image'} className="w-full h-[400px] object-contain" />}
                </div>
                : images.length > 1 ? (
                    <div className="thumbnail-container grid grid-cols-2 gap-4 border-t p-4 border-gray-200">
                        {images.map((img, idx) => (
                            <button 
                            key={img.id}
                            onClick={() => setIndex(idx)}
                            className="overflow-hidden rounded border border-gray-200 bg-white p-4"
                            >
                                <Image 
                                data={img}
                                alt={img?.altText ?? 'Product Thumbnail'}
                                className="w-full object-contain"
                                />
                            </button>
                        ))}
                    </div>
                ) : null
            }
        </div>
    )
}