import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);
    const [focused, setFocused] = useState(false);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) localRef.current?.focus();
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            ref={localRef}
            onFocus={e => { setFocused(true);  props.onFocus?.(e); }}
            onBlur={e  => { setFocused(false); props.onBlur?.(e);  }}
            className={[
                'block w-full rounded-xl',
                'bg-slate-50 border border-gray-200',
                'px-3.5 py-3 text-sm text-slate-800',
                'placeholder-slate-300',
                'transition-all duration-200',
                'hover:border-gray-300',
                focused
                    ? 'border-blue-300 bg-white shadow-[0_0_0_3px_rgba(37,99,235,0.10)] outline-none'
                    : 'outline-none',
                'focus:border-blue-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,0.10)] focus:outline-none focus:ring-0',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                className,
            ].join(' ')}
        />
    );
});