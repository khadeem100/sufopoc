'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase, GraduationCap, Menu, X, ChevronRight, Play } from 'lucide-react';

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  // Close on ESC & click outside (mobile overlay)
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    function onClickOutside(e: MouseEvent) {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target as Node)) return;
      setMenuOpen(false);
    }
    if (menuOpen) {
      document.addEventListener('keydown', onKey);
      document.addEventListener('click', onClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClickOutside);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        * { font-family: 'Poppins', sans-serif; }
      `}</style>
      <section className="bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gridBackground.png')] w-full bg-no-repeat bg-cover bg-center text-sm pb-44 min-h-screen">
        <nav className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-6 w-full">
          <Link href="/" aria-label="Job Platform home" className="flex items-center">
            <div className="h-10 w-10 bg-black rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
            <span className="ml-2 text-xl font-semibold text-black">JobPlatform</span>
          </Link>

          <div
            id="menu"
            ref={menuRef}
            className={[
              'max-md:absolute max-md:top-0 max-md:left-0 max-md:transition-all max-md:duration-300 max-md:overflow-hidden max-md:h-full max-md:bg-white/50 max-md:backdrop-blur',
              'flex items-center gap-8 font-medium',
              'max-md:flex-col max-md:justify-center',
              menuOpen ? 'max-md:w-full' : 'max-md:w-0',
            ].join(' ')}
            aria-hidden={!menuOpen}
          >
            <Link href="/" className="hover:text-gray-600" onClick={() => setMenuOpen(false)}>Home</Link>
            <div className="relative group flex items-center gap-1 cursor-pointer">
              <span>Opportunities</span>
              <ChevronRight className="h-4 w-4 rotate-90" />
              <div className="absolute bg-white font-normal flex flex-col gap-2 w-max rounded-lg p-4 top-36 left-0 opacity-0 -translate-y-full group-hover:top-44 group-hover:opacity-100 transition-all duration-300 shadow-sm z-50">
                <Link href="/jobs" className="hover:translate-x-1 hover:text-slate-500 transition-all">Jobs</Link>
                <Link href="/opleidingen" className="hover:translate-x-1 hover:text-slate-500 transition-all">Opleidingen</Link>
              </div>
            </div>
            <Link href="/jobs" className="hover:text-gray-600" onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
            <Link href="/opleidingen" className="hover:text-gray-600" onClick={() => setMenuOpen(false)}>Study Abroad</Link>
            <Link href="/auth/signin" className="hover:text-gray-600" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="md:hidden bg-gray-800 hover:bg-black text-white p-2 rounded-md aspect-square font-medium transition"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <Link href="/auth/signup" className="hidden md:block bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-full font-medium transition">
            Get Started
          </Link>

          <button
            id="open-menu"
            onClick={() => setMenuOpen(true)}
            className="md:hidden bg-gray-800 hover:bg-black text-white p-2 rounded-md aspect-square font-medium transition"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>

        <div className="flex items-center gap-2 border border-slate-300 hover:border-slate-400/70 rounded-full w-max mx-auto px-4 py-2 mt-40 md:mt-32">
          <span>New opportunities available</span>
          <Link href="/jobs" className="flex items-center gap-1 font-medium">
            <span>Explore now</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <h5 className="text-4xl md:text-7xl font-medium max-w-[850px] text-center mx-auto mt-8 text-black">
          Find your dream job or study abroad opportunity
        </h5>

        <p className="text-sm md:text-base mx-auto max-w-2xl text-center mt-6 max-md:px-2 text-gray-600">
          Connect with job opportunities and study abroad programs that match your skills and ambitions. Whether you're a student looking to study internationally or an expert seeking new opportunities, we've got you covered.
        </p>

        <div className="mx-auto w-full flex items-center justify-center gap-3 mt-8">
          <Link href="/auth/signup" className="bg-slate-800 hover:bg-black text-white px-6 py-3 rounded-full font-medium transition">
            Get Started
          </Link>
          <Link href="/jobs" className="flex items-center gap-2 border border-slate-300 hover:bg-slate-200/30 rounded-full px-6 py-3">
            <span>Browse Jobs</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

