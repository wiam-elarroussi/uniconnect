export default function InputLabel({ value, className = '', children, ...props }) {
    return (
        <label
            {...props}
            className={[
                'block text-xs font-bold text-slate-500',
                'uppercase tracking-wider mb-2',
                className,
            ].join(' ')}
        >
            {value ?? children}
        </label>
    );
}