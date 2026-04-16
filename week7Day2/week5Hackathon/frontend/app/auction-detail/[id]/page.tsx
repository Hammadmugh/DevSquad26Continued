'use client';

import { useState, use, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Aboutus from "@/components/Aboutus";
import LightNavbar from "@/components/LightNavbar";
import AuctionFooter from "@/components/AuctionFooter";
import { api } from "@/lib/api";
import { FaRegStar } from "react-icons/fa";
import { io, Socket } from "socket.io-client";

/* ── Checkmark icon ─────────────────────────────────────────── */
const Check = () => (
  <svg viewBox="0 0 14 14" className="w-3.5 h-3.5 shrink-0" fill="none">
    <path d="M2 7l3.5 3.5L12 3" stroke="#F9C146" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Feature item ───────────────────────────────────────────── */
const Feature = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2">
    <Check />
    <span className="font-['Lato'] font-normal text-[15px] text-[#838383]">{label}</span>
  </div>
);

/* ── Countdown Tile ─────────────────────────────────────────── */
const TimeTile = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center bg-white rounded-sm px-1.5 pb-0.5 min-w-6">
    <span className="font-['Lato'] font-bold text-[10px] leading-3 text-[#2E3D83]">{value}</span>
    <span className="font-['Lato'] font-medium text-[8px] leading-2.5 tracking-[0.04em] text-[#939393]">{label}</span>
  </div>
);

/* ── Stat column ────────────────────────────────────────────── */
const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col gap-0.5">
    <span className="font-['Lato'] font-bold text-[13px] text-[#2E3D83] whitespace-nowrap">{value}</span>
    <span className="font-['Lato'] font-normal text-[11px] text-[#939393] whitespace-nowrap">{label}</span>
  </div>
);

/* ── Page ───────────────────────────────────────────────────── */
interface BidEntry { userId: string; amount: number; placedAt: string }
interface TopBidderProfile {
  fullName: string;
  email: string;
  mobile: string;
  nationality: string;
  idType: string;
}
interface AuctionDetail {
  _id: string;
  carName: string;
  carImage: string;
  currentBid: number;
  startingBid: number;
  bids: BidEntry[];
  rating: number;
  review: string;
  endTime: string;
  trending: boolean;
  isLive: boolean;
  sold: boolean;
  seller: string | { _id: string };
  winnerId: string | { _id: string } | null;
  soldAt: string | null;
  paymentStatus: string;
  lotNo: string;
}

function getCountdown(endTime: string) {
  const diff = Math.max(0, new Date(endTime).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    secs: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export default function AuctionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [car, setCar] = useState<AuctionDetail | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "entertainment" | "exterior">("description");
  const [bidAmount, setBidAmount] = useState(10000);
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [topBidderProfile, setTopBidderProfile] = useState<TopBidderProfile | null>(null);
  const [bidFlash, setBidFlash] = useState(false);
  const [auctionEndMsg, setAuctionEndMsg] = useState('');
  const [endingBid, setEndingBid] = useState(false);
  const [deletingAuction, setDeletingAuction] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const router = useRouter();

  const myUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  function getSellerId(car: AuctionDetail): string {
    return typeof car.seller === 'object' && car.seller !== null
      ? car.seller._id
      : String(car.seller);
  }

  function getWinnerId(car: AuctionDetail): string | null {
    if (!car.winnerId) return null;
    return typeof car.winnerId === 'object' ? car.winnerId._id : String(car.winnerId);
  }

  async function handleEndBid() {
    if (!confirm('End this auction now? This cannot be undone.')) return;
    setEndingBid(true);
    try {
      await api.auctions.endBid(id);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to end auction');
    } finally {
      setEndingBid(false);
    }
  }

  async function handleDeleteAuction() {
    if (!confirm('Permanently delete this auction? This cannot be undone.')) return;
    setDeletingAuction(true);
    try {
      await api.auctions.delete(id);
      router.push('/sell-your-car');
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to delete auction');
      setDeletingAuction(false);
    }
  }

  async function fetchTopBidderProfile(bids: BidEntry[]) {
    if (bids.length === 0) { setTopBidderProfile(null); return; }
    const topBid = bids.reduce((max, b) => (b.amount > max.amount ? b : max), bids[0]);
    try {
      const profile = await api.users.getPublicProfile(topBid.userId);
      setTopBidderProfile(profile as unknown as TopBidderProfile);
    } catch { setTopBidderProfile(null); }
  }

  async function toggleWishlist() {
    try {
      if (inWishlist) {
        await api.users.removeFromWishlist(id);
        setInWishlist(false);
      } else {
        await api.users.addToWishlist(id);
        setInWishlist(true);
      }
    } catch { /* not logged in */ }
  }

  useEffect(() => {
    api.auctions.getOne(id)
      .then((data) => {
        const auction = data as unknown as AuctionDetail;
        setCar(auction);
        fetchTopBidderProfile(auction.bids);
      })
      .catch(() => {});
  }, [id]);

  /* ── Socket.io: live bid updates ────────────────────────── */
  useEffect(() => {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000';
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.emit('join:auction', id);
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (userId) socket.emit('join:user', userId);

    socket.on('bid:new', (payload: { userId: string; amount: number; totalBids: number; currentBid: number }) => {
      setCar((prev) => {
        if (!prev) return prev;
        const newBid = { userId: payload.userId, amount: payload.amount, placedAt: new Date().toISOString() };
        const updated = { ...prev, currentBid: payload.currentBid, bids: [...prev.bids, newBid] };
        fetchTopBidderProfile(updated.bids);
        return updated;
      });
      // flash the bid card to signal live update
      setBidFlash(true);
      setTimeout(() => setBidFlash(false), 800);
    });

    socket.on('bid:winner', (payload: { auctionId: string; winnerId: string; carName: string; amount: number }) => {
      setCar((prev) => prev ? { ...prev, sold: true, winnerId: payload.winnerId } : prev);
      setAuctionEndMsg(`🏆 You won "${payload.carName}" with $${payload.amount.toLocaleString()}! Go to Payment to complete purchase.`);
    });

    socket.on('auction:ended', (payload: { carName: string }) => {
      api.auctions.getOne(id)
        .then((data) => {
          const auction = data as unknown as AuctionDetail;
          setCar(auction);
          fetchTopBidderProfile(auction.bids);
        })
        .catch(() => {});
      setAuctionEndMsg((prev) => prev || `Auction for "${payload.carName}" has ended.`);
    });

    return () => { socket.disconnect(); };
  }, [id]);

  async function handlePlaceBid() {
    setBidError('');
    setBidSuccess('');
    setSubmitting(true);
    try {
      await api.auctions.placeBid(id, bidAmount);
      setBidSuccess(`Bid of $${bidAmount.toLocaleString()} placed!`);
      // Refresh auction data
      const updated = await api.auctions.getOne(id);
      const updatedAuction = updated as unknown as AuctionDetail;
      setCar(updatedAuction);
      fetchTopBidderProfile(updatedAuction.bids);
    } catch (e: unknown) {
      setBidError(e instanceof Error ? e.message : 'Failed to place bid');
    } finally {
      setSubmitting(false);
    }
  }

  if (!car) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-white">
        <Aboutus />
        <LightNavbar />
        <div className="flex-1 flex items-center justify-center">
          <span className="font-['Lato'] text-[#2E3D83] text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  const countdown = getCountdown(car.endTime);

  const thumbnails = [
    car.carImage,
    "/car auction (1).png",
    "/car auction (2).png",
    "/car auction (3).png",
    "/car auction (4).png",
    car.carImage,
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <Aboutus />
      <LightNavbar />

      {/* ── Live Auction Toast ──────────────────────────────── */}
      {auctionEndMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-9999 flex items-start gap-3 bg-[#2E3D83] text-white px-5 py-4 rounded-lg shadow-xl max-w-sm w-full mx-4">
          <span className="font-['Lato'] text-[14px] leading-5 flex-1">{auctionEndMsg}</span>
          <button onClick={() => setAuctionEndMsg('')} className="shrink-0 text-white/70 hover:text-white text-lg leading-none">&times;</button>
        </div>
      )}

      {/* ── Hero band ─────────────────────────────────────────── */}
      <div className="w-full bg-[#C6D8F9] pt-10 flex flex-col items-center gap-3">
        <h1 className="font-['Josefin_Sans'] font-semibold text-[48px] sm:text-[64px] leading-16 text-[#2E3D83] text-center">
          {car.carName}
        </h1>
        <div className="w-20 h-0.75 bg-[#2E3D83] rounded-full" />
        <p className="font-['Lato'] font-medium text-[16px] sm:text-[18px] text-[#545677] text-center max-w-xl px-4">
          Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.
        </p>
        {/* Breadcrumb */}
        <div className="mt-2 flex items-center gap-1 bg-[#BBD0F6] rounded-t-[3px] px-4 py-2">
          <span className="font-['Lato'] font-medium text-[14px] text-[#545677]">Home</span>
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
            <path d="M6 4l4 4-4 4" stroke="#000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-['Lato'] font-medium text-[14px] text-[#2E3D83]">Auction Detail</span>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* ── Car header bar ──────────────────────────────────── */}
        <div className="w-full bg-[#2E3D83] rounded-[5px] h-15 flex items-center justify-between px-5">
          <span className="font-['Lato'] font-bold text-[20px] leading-6 text-white">{car.carName}</span>
          <button
            onClick={toggleWishlist}
            className="w-7.5 h-7.5 flex items-center justify-center"
            aria-label="Favourite"
          >
            {inWishlist
              ? <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#F9C146"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              : <FaRegStar className="text-white w-6 h-6"/>
            }
          </button>
        </div>

        {/* ── Image gallery + Bid widget ───────────────────────── */}
        <div className="flex flex-col xl:flex-row gap-6">

          {/* Left: image gallery */}
          <div className="flex flex-col lg:flex-row gap-4 flex-1 min-w-0">
            {/* Main image */}
            <div
              className="relative w-full lg:w-[55%] min-h-64 lg:min-h-0 rounded-[5px] overflow-hidden shrink-0"
              style={{ backgroundImage: `url("${encodeURI(car.carImage)}")`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
              {/* Live badge */}
              <div className="absolute top-1.5 left-1.5 bg-[#EF233C] px-1.5 py-0.5 rounded-[4px_2px_2px_0px] flex items-center gap-1">
                <span className="font-['Lato'] font-semibold text-[12px] text-white">Live</span>
              </div>
            </div>

            {/* Thumbnails 2-col grid */}
            <div className="grid grid-cols-2 gap-2 flex-1">
              {thumbnails.map((src, i) => (
                <div
                  key={i}
                  className="rounded-[5px] min-h-28"
                  style={{ backgroundImage: `url("${encodeURI(src)}")`, backgroundSize: "cover", backgroundPosition: "center" }}
                />
              ))}
            </div>
          </div>

          {/* Right: bid widget */}
          <div className="xl:w-72 shrink-0 flex flex-col gap-4">
            {/* Bid card */}
            <div className={`bg-[#F1F2FF] rounded-[5px] overflow-hidden transition-all duration-300 ${bidFlash ? 'ring-2 ring-[#F9C146]' : ''}`}>
              {/* Progress bar */}
              <div className="px-5 pt-5 pb-2">
                <div className="relative w-full h-3.75 bg-white border border-[#C6D8F9] rounded-full">
                  <div className="absolute left-0 top-0 h-full w-[43%] bg-[#2E3D83] rounded-full" />
                  {/* Car icon on slider knob */}
                  <div className="absolute top-1/2 -translate-y-1/2" style={{ left: "calc(43% - 10px)" }}>
                    <div className="w-5 h-5 rounded-full bg-white border border-[#F9C146] flex items-center justify-center">
                      <svg viewBox="0 0 15 10" className="w-3 h-2" fill="#2E3D83">
                        <path d="M13.5 5H12L10.5 2H4.5L3 5H1.5C0.67 5 0 5.67 0 6.5S0.67 8 1.5 8H2a2 2 0 004 0h3a2 2 0 004 0h.5c.83 0 1.5-.67 1.5-1.5S14.33 5 13.5 5zM5 8.5a1 1 0 110-2 1 1 0 010 2zm5 0a1 1 0 110-2 1 1 0 010 2zM4.5 4.5l1-2h4l1 2H4.5z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="px-5 pb-3 flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-['Lato'] font-bold text-[14px] text-[#2E3D83]">${car.startingBid.toLocaleString()}</span>
                    <span className="font-['Lato'] font-normal text-[12px] text-[#939393]">Bid Starts From</span>
                  </div>
                  <div className="flex flex-col gap-0.5 mt-2">
                    <span className="font-['Lato'] font-bold text-[14px] text-[#2E3D83]">{car.bids.length}</span>
                    <span className="font-['Lato'] font-normal text-[12px] text-[#939393]">Bid Placed</span>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 items-end">
                  <span className="font-['Lato'] font-bold text-[14px] text-[#2E3D83]">${car.currentBid.toLocaleString()}</span>
                  <span className="font-['Lato'] font-normal text-[12px] text-[#939393] text-right">Current Bid</span>
                </div>
              </div>

              {/* Bid amount controls */}
              <div className="px-5 pb-4 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => setBidAmount(prev => Math.max(0, prev - 1000))}
                  className="w-6 h-6 border border-[#C6D8F9] rounded-[3px] flex items-center justify-center hover:bg-gray-100"
                >
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
                    <path d="M3 8h10" stroke="#2E3D83" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <div className="border border-[#F9C146] rounded-[3px] px-2 py-1 min-w-16 text-center">
                  <span className="font-['Lato'] font-medium text-[10px] text-[#2E3D83]">${bidAmount.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setBidAmount(prev => prev + 1000)}
                  className="w-6 h-6 border border-[#C6D8F9] rounded-[3px] flex items-center justify-center hover:bg-gray-100"
                >
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
                    <path d="M8 3v10M3 8h10" stroke="#2E3D83" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Submit A Bid / End Auction */}
              <div className="px-5 pb-5 flex flex-col gap-2">
                {car.sold ? (
                  <div className="flex flex-col gap-2">
                    <div className="w-full bg-gray-200 text-[#939393] font-['Lato'] font-bold text-[16px] py-2.5 rounded-[5px] text-center">
                      Auction Ended
                    </div>
                    {myUserId && getWinnerId(car) === myUserId && (
                      <Link
                        href={`/payment/${id}`}
                        className="w-full bg-[#F9C146] text-[#2E3D83] font-['Lato'] font-bold text-[16px] py-2.5 rounded-[5px] text-center hover:bg-[#e8b200] transition-colors block"
                      >
                        Proceed to Payment →
                      </Link>
                    )}
                  </div>
                ) : (
                  <>
                    {bidError && <p className="text-red-500 text-xs">{bidError}</p>}
                    {bidSuccess && <p className="text-green-600 text-xs">{bidSuccess}</p>}
                    {myUserId && getSellerId(car) === myUserId ? (
                      <>
                        <button
                          onClick={handleEndBid}
                          disabled={endingBid}
                          className="w-full bg-[#EF233C] text-white font-['Lato'] font-bold text-[16px] py-2.5 rounded-[5px] hover:bg-red-700 transition-colors disabled:opacity-60"
                        >
                          {endingBid ? 'Ending...' : 'End Auction'}
                        </button>
                        <button
                          onClick={handleDeleteAuction}
                          disabled={deletingAuction}
                          className="w-full border border-[#EF233C] text-[#EF233C] font-['Lato'] font-semibold text-[14px] py-2 rounded-[5px] hover:bg-red-50 transition-colors disabled:opacity-60"
                        >
                          {deletingAuction ? 'Deleting...' : 'Delete Listing'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handlePlaceBid}
                        disabled={submitting}
                        className="w-full bg-[#2E3D83] text-white font-['Lato'] font-bold text-[16px] py-2.5 rounded-[5px] hover:bg-[#243070] transition-colors disabled:opacity-60"
                      >
                        {submitting ? 'Placing...' : 'Submit A Bid'}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Bidders List card */}
            <div className="bg-[#F1F2FF] rounded-[5px] overflow-hidden">
              {/* Header */}
              <div className="bg-[#2E3D83] rounded-t-[5px] px-5 py-3 flex items-center gap-3">
                <div className="w-0.5 h-12 bg-[#FDB94B] shrink-0" />
                <span className="font-['Lato'] font-medium text-[16px] text-white">Bidders List</span>
              </div>
              {/* Bidder rows */}
              <div className="px-5 py-3 flex flex-col divide-y divide-[#CBCBCB]">
                {car.bids.slice(-5).reverse().map((b, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <span className="font-['Lato'] font-normal text-[14px] text-[#545677]">Bidder {i + 1}</span>
                    <span className="font-['Lato'] font-semibold text-[14px] text-[#2E3D83]">${b.amount.toLocaleString()}</span>
                  </div>
                ))}
                {car.bids.length === 0 && (
                  <div className="py-2">
                    <span className="font-['Lato'] font-normal text-[14px] text-[#939393]">No bids yet</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats info bar ───────────────────────────────────── */}
        <div className="w-full bg-[#F1F2FF] rounded-[5px] px-5 py-3 flex flex-wrap items-center gap-x-8 gap-y-3">
          {/* Countdown */}
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-1">
              <TimeTile value={String(countdown.days)} label="Days" />
              <TimeTile value={String(countdown.hours)} label="Hours" />
              <TimeTile value={String(countdown.mins)} label="Mins" />
              <TimeTile value={String(countdown.secs)} label="Secs" />
            </div>
            <span className="font-['Lato'] font-normal text-[10px] text-[#939393]">Time Left</span>
          </div>
          <div className="h-8 w-px bg-gray-300 hidden sm:block" />
          <Stat value={`$${car.currentBid.toLocaleString()}`} label="Current Bid" />
          <div className="h-8 w-px bg-gray-300 hidden sm:block" />
          <Stat value={new Date(car.endTime).toLocaleString()} label="End Time" />
          <div className="h-8 w-px bg-gray-300 hidden sm:block" />
          <Stat value="100" label="Min. Increment" />
          <div className="h-8 w-px bg-gray-300 hidden sm:block" />
          <Stat value={String(car.bids.length)} label="Total Bids" />
          <div className="h-8 w-px bg-gray-300 hidden sm:block" />
          <Stat value={car.lotNo || '—'} label="Lot No." />
          <div className="h-8 w-px bg-gray-300 hidden sm:block" />
          <Stat value="10,878 K.M" label="Odometer" />
        </div>

        {/* ── Description + Features ──────────────────────────── */}
        <div className="w-full bg-white">
          {/* Tab bar */}
          <div className="flex items-end gap-0">
            {(["description", "entertainment", "exterior"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative px-4 py-2 font-['Lato'] font-medium text-[16px] capitalize text-[#2E3D83]"
              >
                {tab === "description" ? "Description" : tab === "entertainment" ? "Entertainment" : "Exterior Features"}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-[#FFC300] rounded-sm" />
                )}
              </button>
            ))}
          </div>
          {/* Separator */}
          <div className="w-full h-px bg-[#B3B3B3]" />

          {/* Description text */}
          {activeTab === "description" && (
            <div className="py-5">
              <p className="font-['Lato'] font-medium text-[15px] leading-6 text-[#8D8D8D] max-w-3xl">
                Lorem ipsum dolor sit amet consectetur. Duis ac sodales vulputate dolor volutpat ac. Turpis ut neque eu
                adipiscing nibh nunc gravida. Ipsum at feugiat id dui elementum nibh nec suspendisse. Ut sapien metus
                elementum tincidunt euismod.
              </p>
              <p className="font-['Lato'] font-medium text-[15px] leading-6 text-[#8D8D8D] max-w-3xl mt-4">
                In est eget turpis nulla leo amet arcu. Consequat viverra erat pellentesque ut non placerat placerat amet
                vitae. Lobortis velit senectus blandit pellentesque viverra augue dolor orci. Odio leo in et in. Ac purus
                morbi ac vulputate amet. Ut maecenas leo venenatis aliquet a fringilla quam varius pellentesque.
              </p>

              {/* 3-col features */}
              <div className="mt-8 flex flex-col lg:flex-row gap-8">
                {/* Entertainment */}
                <div className="flex flex-col gap-3 flex-1">
                  <h3 className="font-['Lato'] font-semibold text-[18px] text-[#2E3D83]">Entertainment</h3>
                  <div className="h-px bg-[#959494]" />
                  <Feature label="Central Locking" />
                  <Feature label="Automatic Air Conditioning" />
                  <Feature label="Full Leather Interior" />
                  <Feature label="Electric Heated Seats" />
                  <Feature label="Navigation GPS Multimedia" />
                </div>
                {/* Exterior Features */}
                <div className="flex flex-col gap-3 flex-1">
                  <h3 className="font-['Lato'] font-semibold text-[18px] text-[#2E3D83]">Exterior Features</h3>
                  <div className="h-px bg-[#959494]" />
                  <Feature label="Parking Sensors" />
                  <Feature label="Double Exhaust" />
                  <Feature label="Electric Mirrors" />
                  <Feature label="Manufacturing Year 2015" />
                  <Feature label="Full Service History" />
                </div>
                {/* Interior Features */}
                <div className="flex flex-col gap-3 flex-1">
                  <h3 className="font-['Lato'] font-semibold text-[18px] text-[#2E3D83]">Interior Features</h3>
                  <div className="h-px bg-[#959494]" />
                  <Feature label="ABS" />
                  <Feature label="Xenon Headlights" />
                  <Feature label="Immobilizer" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "entertainment" && (
            <div className="py-5 flex flex-col gap-3 max-w-xs">
              <h3 className="font-['Lato'] font-semibold text-[18px] text-[#2E3D83]">Entertainment</h3>
              <div className="h-px bg-[#959494]" />
              <Feature label="Central Locking" />
              <Feature label="Automatic Air Conditioning" />
              <Feature label="Full Leather Interior" />
              <Feature label="Electric Heated Seats" />
              <Feature label="Navigation GPS Multimedia" />
            </div>
          )}

          {activeTab === "exterior" && (
            <div className="py-5 flex flex-col gap-3 max-w-xs">
              <h3 className="font-['Lato'] font-semibold text-[18px] text-[#2E3D83]">Exterior Features</h3>
              <div className="h-px bg-[#959494]" />
              <Feature label="Parking Sensors" />
              <Feature label="Double Exhaust" />
              <Feature label="Electric Mirrors" />
              <Feature label="Manufacturing Year 2015" />
              <Feature label="Full Service History" />
            </div>
          )}
        </div>

        {/* ── Top Bidder ───────────────────────────────────────── */}
        <div className="w-full rounded-[5px] overflow-hidden bg-[#F1F2FF]">
          <div className="bg-[#2E3D83] px-5 py-2.5">
            <span className="font-['Lato'] font-semibold text-[18px] text-white">Top Bidder</span>
          </div>
          {topBidderProfile ? (
            <div className="p-5 flex flex-col sm:flex-row items-start gap-5">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-[#D9D9D9] overflow-hidden shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-gray-500" fill="currentColor">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </div>
              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-24 gap-y-4 flex-1">
                <div className="flex flex-col gap-1">
                  <span className="font-['Lato'] font-semibold text-[18px] text-[#2E3D83]">Full Name</span>
                  <span className="font-['Lato'] font-normal text-[18px] text-[#939393]">{topBidderProfile.fullName || '—'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-['Lato'] font-semibold text-[18px] text-[#2E3D83]">Email</span>
                  <span className="font-['Lato'] font-normal text-[18px] text-[#939393]">{topBidderProfile.email || '—'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-['Lato'] font-semibold text-[18px] text-[#2E3D83]">Mobile Number</span>
                  <span className="font-['Lato'] font-normal text-[18px] text-[#939393]">{topBidderProfile.mobile || '—'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-['Lato'] font-semibold text-[18px] text-[#2E3D83]">Nationality</span>
                  <span className="font-['Lato'] font-normal text-[18px] text-[#939393]">{topBidderProfile.nationality || '—'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-['Lato'] font-semibold text-[18px] text-[#2E3D83]">ID Type</span>
                  <span className="font-['Lato'] font-normal text-[18px] text-[#939393]">{topBidderProfile.idType || '—'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5">
              <span className="font-['Lato'] font-normal text-[16px] text-[#939393]">
                No bids placed yet. Be the first to bid!
              </span>
            </div>
          )}
        </div>

      </div>

      <AuctionFooter />
    </div>
  );
}
