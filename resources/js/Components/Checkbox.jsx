export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={[
                'w-4 h-4 rounded-md border-gray-300',
                'text-blue-600 accent-blue-600',
                'shadow-sm transition-all duration-150',
                'focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                'cursor-pointer',
                className,
            ].join(' ')}
        />
    );
}