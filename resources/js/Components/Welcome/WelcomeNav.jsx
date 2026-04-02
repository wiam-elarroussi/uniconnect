// resources/js/Components/Welcome/WelcomeNav.jsx

import { Link } from '@inertiajs/react';
import { IconArrow } from './constants';

export default function WelcomeNav({ auth, scrolled }) {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'glass shadow-md border-b border-white/50 py-3' : 'py-5'
    }`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden shadow-md border-2 border-white">
            <img src="/logo_transparent.png" alt="UniConnect" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-slate-900 text-lg tracking-tight">
            Uni<span className="gradient-text">Connect</span>
          </span>
        </div>

        {/* Liens */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
          {[
            { label: 'Fonctionnalités', anchor: 'features' },
            { label: 'Éthique',         anchor: 'ethique' },
            { label: 'Communauté',      anchor: 'community' },
          ].map(({ label, anchor }) => (
            <a key={anchor} href={`#${anchor}`}
              className="hover:text-blue-600 transition-colors duration-200">
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2">
          {auth.user ? (
            <Link href={route('dashboard')}
              className="btn-primary px-5 py-2 text-sm font-semibold text-white rounded-full flex items-center gap-2">
              Dashboard <IconArrow />
            </Link>
          ) : (
            <>
              <Link href={route('login')}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors rounded-full">
                Connexion
              </Link>
              <Link href={route('register')}
                className="btn-primary px-5 py-2 text-sm font-semibold text-white rounded-full flex items-center gap-2">
                Rejoindre <IconArrow />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}