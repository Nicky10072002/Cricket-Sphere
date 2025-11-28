type ProductQuantityProps = {
    quantity: number,
    min: number,
    max: number,
    disabled?: boolean,
    onChange: (newQuantity: number) => void,
}

export function ProductQuantity({
    quantity = 1,
    min = 1,
    max = 10,
    disabled = false,
    onChange
}: ProductQuantityProps) {

    const decrement = () => {
        if (quantity > min) {
            onChange(quantity - 1);
        }
    };

    const increment = () => {
        if (quantity < max) {
            onChange(quantity + 1);
        }
    };

    return (
        <div className="product-quantity flex gap-4">
            <label htmlFor="quantity" className="self-center text-gray-700">Quantity</label>
            <div className="flex items-center gap-2 border-2 border-amber-700 rounded-4xl overflow-hidden">
                <button className="text-lg font-bold text-amber-700 px-2 py-1 bg-amber-200 rounded-l-full hover:bg-amber-300 cursor-pointer" onClick={decrement} disabled={quantity <= min || disabled}>-</button>
                <input
                    type="string"
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    min={min}
                    max={max}
                    disabled={disabled}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="font-extrabold rounded px-2 py-1 w-10 text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                    aria-label="Product quantity"
                />
                <button className="text-lg font-bold text-amber-700 bg-amber-200 px-2 py-1 rounded-r-full hover:bg-amber-300 cursor-pointer" onClick={increment} disabled={quantity >= max || disabled}>+</button>
            </div>
        </div>

    )
}