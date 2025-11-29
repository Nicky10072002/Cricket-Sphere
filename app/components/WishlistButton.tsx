type WishlistButtonProps = {
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
};

export function WishlistButton({
    onClick,
    children,
    disabled = false,
    className = '',
}: WishlistButtonProps) {
    return (
        <button
        onClick={onClick}
        disabled={disabled}
        className={`wishlist-button mt-4 bg-amber-700 flex-1 text-white font-bold py-3 px-6 rounded-4xl hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`.trim()}
        >
            {children}
        </button>
    )
}