import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
}) {
    const close = () => { if (closeable) onClose(); };

    const maxWidthClass = {
        sm:  'sm:max-w-sm',
        md:  'sm:max-w-md',
        lg:  'sm:max-w-lg',
        xl:  'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth] ?? 'sm:max-w-2xl';

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6 sm:px-0"
                onClose={close}
            >
                {/* Backdrop */}
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                </TransitionChild>

                {/* Panel */}
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-6 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-6 sm:translate-y-0 sm:scale-95"
                >
                    <DialogPanel
                        className={[
                            'relative z-10 w-full',
                            'bg-white rounded-3xl shadow-2xl',
                            'overflow-hidden',
                            'sm:mx-auto',
                            maxWidthClass,
                        ].join(' ')}
                    >
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}