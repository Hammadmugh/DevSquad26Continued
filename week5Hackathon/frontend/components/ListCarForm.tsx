'use client';

import { useRef, useState } from "react";
import { api } from "@/lib/api";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '';

interface ListCarFormProps {
  onSuccess: () => void;
}

const inputClass =
  "w-full h-10 border border-[#EAECF3] rounded-[5px] px-3 font-['Lato'] text-[14px] text-[#2E3D83] outline-none focus:border-[#2E3D83] transition-colors";

const selectClass =
  "w-full h-10 border border-[#EAECF3] rounded-[5px] px-3 font-['Lato'] text-[14px] text-[#2E3D83] outline-none focus:border-[#2E3D83] bg-white";

const Label = ({ text }: { text: string }) => (
  <label className="font-['Lato'] font-normal text-[14px] text-[#2E3D83]">{text}</label>
);

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'car-auction');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData },
  );
  if (!res.ok) throw new Error('Image upload failed');
  const data = await res.json() as { secure_url: string };
  return data.secure_url;
}

export default function ListCarForm({ onSuccess }: ListCarFormProps) {
  const [carName, setCarName] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [type, setType] = useState('');
  const [style, setStyle] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [endTime, setEndTime] = useState('');
  const [review, setReview] = useState('');
  const [isLive, setIsLive] = useState(false);

  /* image upload */
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10 MB'); return; }
    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage(e: React.MouseEvent) {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!carName.trim()) { setError('Car name is required'); return; }
    if (!startingBid || isNaN(Number(startingBid))) { setError('Valid starting bid is required'); return; }
    if (!endTime) { setError('End time is required'); return; }
    if (new Date(endTime) <= new Date()) { setError('Auction end date & time must be in the future'); return; }

    setError('');
    setLoading(true);
    try {
      let carImage: string | undefined;
      if (imageFile) {
        setUploading(true);
        carImage = await uploadToCloudinary(imageFile);
        setUploading(false);
      }

      await api.auctions.create({
        carName,
        carImage,
        make: make || undefined,
        model: model || undefined,
        year: year || undefined,
        color: color || undefined,
        type: type || undefined,
        style: style || undefined,
        startingBid: Number(startingBid),
        endTime,
        review: review || undefined,
        isLive,
      });
      onSuccess();
    } catch (err: unknown) {
      setUploading(false);
      setError(err instanceof Error ? err.message : 'Failed to list car');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#F1F2FF] rounded-[5px] overflow-hidden">
      {/* Header */}
      <div className="bg-[#2E3D83] rounded-t-[5px] px-5 py-2.5">
        <span className="font-['Lato'] font-semibold text-[18px] text-white">
          List Your Car for Auction
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">

        {/* ── Image Upload ─────────────────────────────── */}
        <div className="flex flex-col gap-1">
          <Label text="Car Image" />

          {/* drop zone */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            className="relative w-full h-44 border-2 border-dashed border-[#2E3D83] rounded-[5px] flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors overflow-hidden"
          >
            {imagePreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Car preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="font-['Lato'] font-semibold text-white text-sm">
                    Click to change
                  </span>
                </div>
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 48 48"
                  className="w-12 h-12 text-[#2E3D83] mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-['Lato'] font-medium text-[14px] text-[#2E3D83]">
                  Click to upload image
                </span>
                <span className="font-['Lato'] text-[12px] text-[#939393] mt-1">
                  PNG, JPG, WEBP — max 10 MB
                </span>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {imageFile && (
            <div className="flex items-center justify-between bg-white border border-[#EAECF3] rounded-[5px] px-3 py-2">
              <span className="font-['Lato'] text-[12px] text-[#2E3D83] truncate max-w-[80%]">
                {imageFile.name}
              </span>
              <button
                type="button"
                onClick={removeImage}
                className="font-['Lato'] text-[12px] text-red-500 hover:text-red-700 shrink-0 ml-2"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* ── Car Name ─────────────────────────────────── */}
        <div className="flex flex-col gap-1">
          <Label text="Car Name*" />
          <input
            type="text"
            placeholder="e.g. Toyota Camry 2022"
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* ── Make + Model ─────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label text="Make" />
            <input
              type="text"
              placeholder="e.g. Toyota"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label text="Model" />
            <input
              type="text"
              placeholder="e.g. Camry"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* ── Year + Color ─────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label text="Year" />
            <input
              type="text"
              placeholder="e.g. 2022"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label text="Color" />
            <input
              type="text"
              placeholder="e.g. White"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* ── Type + Style (Transmission) ───────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label text="Car Type" />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={selectClass}
            >
              <option value="">Any</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="hatchback">Hatchback</option>
              <option value="coupe">Coupe</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <Label text="Transmission" />
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className={selectClass}
            >
              <option value="">Any</option>
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
              <option value="hybrid">Hybrid</option>
              <option value="electric">Electric</option>
            </select>
          </div>
        </div>

        {/* ── Starting Bid + End Time ───────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label text="Starting Bid ($)*" />
            <input
              type="number"
              min="0"
              placeholder="e.g. 5000"
              value={startingBid}
              onChange={(e) => setStartingBid(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label text="Auction End Date & Time*" />
            <input
              type="datetime-local"
              value={endTime}
              min={new Date(Date.now() + 60_000).toISOString().slice(0, 16)}
              onChange={(e) => setEndTime(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* ── Description ──────────────────────────────── */}
        <div className="flex flex-col gap-1">
          <Label text="Description" />
          <textarea
            rows={3}
            placeholder="Describe your car..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full border border-[#EAECF3] rounded-[5px] px-3 py-2 font-['Lato'] text-[14px] text-[#2E3D83] outline-none focus:border-[#2E3D83] transition-colors resize-none"
          />
        </div>

        {/* ── Live toggle ───────────────────────────────── */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            onClick={() => setIsLive(!isLive)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              isLive ? 'bg-[#2E3D83]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                isLive ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </div>
          <span className="font-['Lato'] font-medium text-[14px] text-[#2E3D83]">
            {isLive ? 'List as Live Auction' : 'List as Upcoming Auction'}
          </span>
        </label>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* ── Submit ────────────────────────────────────── */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full h-11 bg-[#2E3D83] text-white font-['Lato'] font-bold text-[16px] rounded-[5px] hover:bg-[#1e2d6b] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="white" strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="white"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Uploading Image...
            </>
          ) : loading ? 'Submitting...' : 'List My Car'}
        </button>
      </form>
    </div>
  );
}
