'use client';

import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const makes = ['Audi', 'BMW', 'Ford', 'Honda', 'Toyota', 'Mercedes'];
const models = ['Model S', 'Model X', 'Civic', 'Corolla', 'A4', 'X5'];
const years = ['2024', '2023', '2022', '2021', '2020', '2019'];
const prices = ['$5k-$10k', '$10k-$20k', '$20k-$40k', '$40k+'];

export default function HeroSection() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');

  return (
    <section className="w-full px-4 md:px-8 lg:px-[116px] pt-12 md:pt-16 pb-16 md:pb-20">
      {/* Welcome Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'flex-start',
          padding: '13px',
          background: '#BBD0F6',
          borderRadius: '5px',
          marginBottom: '20px',
        }}
      >
        <span
          style={{
            fontFamily: 'Lato, sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '19px',
            color: '#2E3D83',
            whiteSpace: 'nowrap',
          }}
        >
          WELCOME TO AUCTION
        </span>
      </div>

      {/* Main Heading */}
      <h1
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 400,
          fontSize: 'clamp(40px, 6vw, 74px)',
          lineHeight: '1',
          color: '#FFFFFF',
          marginBottom: '20px',
          maxWidth: '488px',
        }}
      >
        Find Your<br />Dream Car
      </h1>

      {/* Description */}
      <p
        style={{
          fontFamily: 'Lato, sans-serif',
          fontWeight: 500,
          fontSize: '16px',
          lineHeight: '19px',
          color: '#C0C0C0',
          maxWidth: '447px',
          marginBottom: '40px',
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tellus elementum cursus
        tincidunt sagittis elementum suspendisse velit arcu.
      </p>

      {/* Search Bar */}
      <div
        className="flex w-2/3 mx-auto flex-col sm:flex-row items-stretch sm:items-center gap-0"
        style={{
          background: '#FFFFFF',
          borderRadius: '8px',
          padding: '12px 16px',
          maxWidth: '680px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        {/* Make */}
        <div className="flex flex-col flex-1 border-r border-gray-200 pr-3 mr-3 min-w-0">
          <label style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontFamily: 'Lato, sans-serif' }}>Make</label>
          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="outline-none text-sm text-gray-700 bg-transparent cursor-pointer"
            style={{ fontFamily: 'Lato, sans-serif', fontSize: '14px' }}
          >
            <option value="">Audi</option>
            {makes.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Model */}
        <div className="flex flex-col flex-1 border-r border-gray-200 pr-3 mr-3 min-w-0">
          <label style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontFamily: 'Lato, sans-serif' }}>Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="outline-none text-sm text-gray-700 bg-transparent cursor-pointer"
            style={{ fontFamily: 'Lato, sans-serif', fontSize: '14px' }}
          >
            <option value="">Model</option>
            {models.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Year */}
        <div className="flex flex-col flex-1 border-r border-gray-200 pr-3 mr-3 min-w-0">
          <label style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontFamily: 'Lato, sans-serif' }}>Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="outline-none text-sm text-gray-700 bg-transparent cursor-pointer"
            style={{ fontFamily: 'Lato, sans-serif', fontSize: '14px' }}
          >
            <option value="">Year</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Price */}
        <div className="flex flex-col flex-1 pr-3 mr-3 min-w-0">
          <label style={{ fontSize: '11px', color: '#888', marginBottom: '4px', fontFamily: 'Lato, sans-serif' }}>Price</label>
          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="outline-none text-sm text-gray-700 bg-transparent cursor-pointer"
            style={{ fontFamily: 'Lato, sans-serif', fontSize: '14px' }}
          >
            <option value="">Price</option>
            {prices.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Search Button */}
        <button
          style={{
            background: '#2E3D83',
            borderRadius: '5px',
            padding: '10px 24px',
            fontFamily: 'Lato, sans-serif',
            fontSize: '16px',
            fontWeight: 500,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
          className="hover:opacity-90 transition-opacity mt-2 sm:mt-0"
        >
          <FaSearch />
          Search
        </button>
      </div>
    </section>
  );
}
