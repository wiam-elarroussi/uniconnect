import { Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { createContext, useContext, useState } from 'react';

const DropDownContext = createContext();

// ── Root ─────────────────────────────────────────────────────────────────
const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => setOpen(v => !v);

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

// ── Trigger ───────────────────────────────────────────────────────────────
const Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);
    return (
        <>
            <div onClick={toggleOpen}>{children}</div>
            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    );
};

// ── Content ───────────────────────────────────────────────────────────────
const Content = ({
    align = 'right',
    width = '48',
    contentClasses = 'py-1.5 bg-white',
    children,
}) => {
    const { open, setOpen } = useContext(DropDownContext);

    const alignClass = {
        left:   'ltr:origin-top-left rtl:origin-top-right start-0',
        right:  'ltr:origin-top-right rtl:origin-top-left end-0',
        center: 'origin-top left-1/2 -translate-x-1/2',
    }[align] ?? 'ltr:origin-top-right end-0';

    const widthClass = {
        '40': 'w-40', '48': 'w-48', '52': 'w-52',
        '56': 'w-56', '64': 'w-64',
    }[width] ?? 'w-48';

    return (
        <Transition
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95 -translate-y-1"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
        >
            <div
                className={`absolute z-50 mt-2 ${alignClass} ${widthClass}`}
                onClick={() => setOpen(false)}
            >
                <div className={[
                    'rounded-2xl shadow-xl',
                    'border border-gray-100',
                    'ring-0 overflow-hidden',
                    contentClasses,
                ].join(' ')}>
                    {children}
                </div>
            </div>
        </Transition>
    );
};

// ── Link ──────────────────────────────────────────────────────────────────
const DropdownLink = ({ className = '', children, ...props }) => {
    return (
        <Link
            {...props}
            className={[
                'flex items-center w-full px-4 py-2.5',
                'text-sm font-medium text-slate-700 leading-5',
                'hover:bg-slate-50 hover:text-slate-900',
                'transition-colors duration-150',
                'focus:bg-slate-50 focus:outline-none',
                className,
            ].join(' ')}
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link    = DropdownLink;

export default Dropdown;