"use client"

import React from 'react'
import Link from 'next/link'
import { Menu, X, ChevronRight } from 'lucide-react'

export function PageHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    function onClickOutside(e: MouseEvent) {
      if (!menuRef.current) return
      if (menuRef.current.contains(e.target as Node)) return
      setMenuOpen(false)
    }
    if (menuOpen) {
      document.addEventListener('keydown', onKey)
      document.addEventListener('click', onClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClickOutside)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <nav className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-6 w-full border-b border-gray-200 bg-white">
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
        <Link href="/jobs" className="hover:text-gray-600" onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
        <Link href="/opleidingen" className="hover:text-gray-600" onClick={() => setMenuOpen(false)}>Study Abroad</Link>
        <Link href="/contact" className="hover:text-gray-600" onClick={() => setMenuOpen(false)}>Contact</Link>
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
  )
}

