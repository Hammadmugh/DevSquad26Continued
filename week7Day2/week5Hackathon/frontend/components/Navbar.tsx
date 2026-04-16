'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Car Auction', href: '/car-auction' },
  { label: 'Sell Your Car', href: '/sell-your-car' },
  { label: 'About us', href: '/about-us' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="w-full bg-transparent" style={{ minHeight: '82px' }}>
      <div style={{ padding: '0 40px', maxWidth: '1440px', margin: '0 auto', height: '82px' }}
        className="flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/car-deposite.png"
            alt="Car Deposit"
            width={165}
            height={42}
            priority
          />
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label} className="relative flex flex-col items-center">
              <Link
                href={link.href}
                style={{ fontFamily: 'Lato, sans-serif', fontSize: '16px', lineHeight: '19px' }}
                className={`whitespace-nowrap transition-colors hover:text-[#2E3D83] ${
                  pathname === link.href
                    ? 'font-bold text-white'
                    : 'font-medium text-white'
                }`}
              >
                {link.label}
              </Link>
              {/* Active indicator dot */}
              {pathname === link.href && (
                <span
                  className="absolute -bottom-2 rounded-full"
                  style={{ width: '16px', height: '3px', background: '#FFCB23' }}
                />
              )}
            </li>
          ))}
        </ul>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/auth/login"
            style={{ fontFamily: 'Lato, sans-serif', fontSize: '16px', lineHeight: '19px' }}
            className="font-bold text-white hover:text-gray-200 transition-colors"
          >
            Sign in
          </Link>
          <span
            style={{ fontFamily: 'Lato, sans-serif', fontSize: '16px', lineHeight: '19px', color: '#898989' }}
            className="font-medium"
          >
            or
          </span>
          <Link
            href="/auth/register"
            style={{
              fontFamily: 'Lato, sans-serif',
              fontSize: '16px',
              lineHeight: '19px',
              background: '#2E3D83',
              borderRadius: '5px',
              padding: '8px 15px',
            }}
            className="font-medium text-white hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Register now
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden text-[#2E3D83] text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#2E3D83] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ fontFamily: 'Lato, sans-serif', fontSize: '16px' }}
              className={`text-white hover:text-[#FFCB23] transition-colors ${pathname === link.href ? 'font-bold' : 'font-medium'}`}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-white/20" />
          <div className="flex items-center gap-3">
            <Link href="/auth/login" style={{ fontFamily: 'Lato, sans-serif', fontSize: '16px' }} className="font-bold text-white">
              Sign in
            </Link>
            <span style={{ color: '#898989', fontSize: '16px' }}>or</span>
            <Link
              href="/auth/register"
              style={{ fontFamily: 'Lato, sans-serif', fontSize: '16px', background: '#2E3D83', borderRadius: '5px', padding: '8px 15px', border: '1px solid white' }}
              className="font-medium text-white"
            >
              Register now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
