'use client';

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import Aboutus from "@/components/Aboutus";
import LightNavbar from "@/components/LightNavbar";
import AuctionFooter from "@/components/AuctionFooter";
import { api } from "@/lib/api";
import { io, Socket } from "socket.io-client";

/* ── Types ──────────────────────────────────────────────────── */
type PaymentStatus = 'unpaid' | 'ready_for_shipping' | 'in_transit' | 'delivered' | 'completed';

interface PaymentAuction {
  _id: string;
  carName: string;
  carImage: string;
  currentBid: number;
  startingBid: number;
  bids: { amount: number }[];
  endTime: string;
  soldAt: string | null;
  lotNo: string;
  paymentStatus: PaymentStatus;
  winnerId: string;
  sold: boolean;
}

/* ── Shipping stages ────────────────────────────────────────── */
const STAGES: { key: PaymentStatus; label: string; icon: string }[] = [
  { key: 'ready_for_shipping', label: 'Ready for Shipping', icon: '\uD83D\uDCE6' },
  { key: 'in_transit',         label: 'In Transit',         icon: '\uD83D\uDE9A' },
  { key: 'delivered',          label: 'Delivered',          icon: '\u2705'       },
];

const STATUS_ORDER: PaymentStatus[] = [
  'unpaid', 'ready_for_shipping', 'in_transit', 'delivered', 'completed',
];

function stageIndex(status: PaymentStatus) {
  return STATUS_ORDER.indexOf(status);
}

/* ── Progress bar ───────────────────────────────────────────── */
function ProgressBar({ status }: { status: PaymentStatus }) {
  const current = stageIndex(status);

  return (
    <div className="flex items-start gap-0 w-full">
      {STAGES.map((stage, i) => {
        const stageIdx = stageIndex(stage.key);
        const done    = current > stageIdx;
        const active  = current === stageIdx;

        return (
          <div key={stage.key} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-500
                ${done    ? 'bg-[#2E3D83] border-[#2E3D83] text-white'
                : active  ? 'bg-[#F9C146] border-[#F9C146] text-[#2E3D83] shadow-lg scale-110'
                          : 'bg-white border-[#CBCBCB] text-[#CBCBCB]'}`}>
                {done ? '✓' : stage.icon}
              </div>
              <span className={`font-['Lato'] text-[12px] text-center leading-4 max-w-20
                ${done || active ? 'font-semibold text-[#2E3D83]' : 'font-normal text-[#939393]'}`}>
                {stage.label}
              </span>
            </div>
            {/* Connector line */}
            {i < STAGES.length - 1 && (
              <div className="flex-1 h-0.5 mb-6 mx-1 relative">
                <div className="absolute inset-0 bg-[#CBCBCB] rounded-full" />
                <div className={`absolute inset-y-0 left-0 bg-[#2E3D83] rounded-full transition-all duration-700 ${done ? 'w-full' : 'w-0'}`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Info row ───────────────────────────────────────────────── */
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <span className="font-['Lato'] font-semibold text-[16px] text-[#2E3D83]">{label}</span>
    <span className="font-['Lato'] font-normal text-[16px] text-[#939393]">{value || '—'}</span>
  </div>
);

/* ── Page ───────────────────────────────────────────────────── */
export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [auction, setAuction] = useState<PaymentAuction | null>(null);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const socketRef = useRef<Socket | null>(null);

  /* Fetch auction */
  useEffect(() => {
    api.payments.getStatus(id)
      .then((d) => setAuction(d as unknown as PaymentAuction))
      .catch(() => setError('Could not load auction details.'));
  }, [id]);

  /* Socket: live payment status updates */
  useEffect(() => {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000';
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = socket;
    socket.emit('join:auction', id);

    socket.on('payment:status', ({ status }: { status: PaymentStatus }) => {
      setAuction((prev) => prev ? { ...prev, paymentStatus: status } : prev);
    });

    return () => { socket.disconnect(); };
  }, [id]);

  async function handlePay() {
    if (!confirm('Confirm payment for this auction?')) return;
    setPaying(true);
    setError('');
    try {
      const updated = await api.payments.pay(id);
      setAuction((prev) => prev ? { ...prev, paymentStatus: ((updated as unknown) as PaymentAuction).paymentStatus } : prev);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Payment failed');
    } finally {
      setPaying(false);
    }
  }

  if (error && !auction) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-white">
        <Aboutus /><LightNavbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <span className="font-['Lato'] text-red-500 text-lg">{error}</span>
          <Link href="/car-auction" className="text-[#2E3D83] underline font-['Lato']">Back to auctions</Link>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-white">
        <Aboutus /><LightNavbar />
        <div className="flex-1 flex items-center justify-center">
          <span className="font-['Lato'] text-[#2E3D83] text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  const isPaid      = auction.paymentStatus !== 'unpaid';
  const isCompleted = auction.paymentStatus === 'completed';

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <Aboutus />
      <LightNavbar />

      {/* ── Hero band ─────────────────────────────────────────── */}
      <div className="w-full bg-[#C6D8F9] pt-10 flex flex-col items-center gap-3">
        <h1 className="font-['Josefin_Sans'] font-semibold text-[48px] sm:text-[64px] leading-tight text-[#2E3D83] text-center">
          {auction.carName}
        </h1>
        <div className="w-20 h-0.75 bg-[#2E3D83] rounded-full" />
        <p className="font-['Lato'] font-medium text-[17px] text-[#545677] text-center max-w-xl px-4">
          Complete your payment to begin the shipping process.
        </p>
        <div className="mt-2 flex items-center gap-1 bg-[#BBD0F6] rounded-t-[3px] px-4 py-2">
          <Link href="/" className="font-['Lato'] font-medium text-[14px] text-[#545677]">Home</Link>
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
            <path d="M6 4l4 4-4 4" stroke="#000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Link href={`/auction-detail/${id}`} className="font-['Lato'] font-medium text-[14px] text-[#545677]">Auction Detail</Link>
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
            <path d="M6 4l4 4-4 4" stroke="#000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-['Lato'] font-medium text-[14px] text-[#2E3D83]">Payment</span>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col gap-6">

        {/* ── Car header bar ──────────────────────────────────── */}
        <div className="w-full bg-[#2E3D83] rounded-[5px] h-15 flex items-center justify-between px-5">
          <span className="font-['Lato'] font-bold text-[20px] text-white">{auction.carName}</span>
          {isCompleted ? (
            <span className="font-['Lato'] font-bold text-[13px] text-[#F9C146] bg-[#F9C146]/20 px-3 py-1 rounded-full">
              ✓ Completed
            </span>
          ) : (
            <span className={`font-['Lato'] font-bold text-[13px] px-3 py-1 rounded-full ${isPaid ? 'text-[#F9C146] bg-[#F9C146]/20' : 'text-white bg-white/20'}`}>
              {isPaid ? 'Payment Received' : 'Awaiting Payment'}
            </span>
          )}
        </div>

        {/* ── Two-column layout ───────────────────────────────── */}
        <div className="flex flex-col xl:flex-row gap-6">

          {/* Left: car image */}
          <div
            className="flex-1 min-h-72 rounded-[5px] overflow-hidden relative"
            style={{ backgroundImage: `url("${encodeURI(auction.carImage)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute top-2 left-2 bg-[#EF233C] px-2 py-0.5 rounded-[4px_2px_2px_0px]">
              <span className="font-['Lato'] font-semibold text-[12px] text-white">
                {auction.sold ? 'Sold' : 'Live'}
              </span>
            </div>
          </div>

          {/* Right: payment widget */}
          <div className="xl:w-80 shrink-0 flex flex-col gap-4">

            {/* Auction details card */}
            <div className="bg-[#F1F2FF] rounded-[5px] overflow-hidden">
              <div className="bg-[#2E3D83] px-5 py-2.5">
                <span className="font-['Lato'] font-semibold text-[15px] text-white">Auction Details</span>
              </div>
              <div className="px-5 py-4 grid grid-cols-2 gap-4">
                <InfoRow label="Winning Bid" value={`$${auction.currentBid.toLocaleString()}`} />
                <InfoRow label="Total Bids" value={String(auction.bids?.length ?? 0)} />
                <InfoRow
                  label="Winning Date"
                  value={auction.soldAt ? new Date(auction.soldAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                />
                <InfoRow
                  label="End Date"
                  value={new Date(auction.endTime).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                />
                <InfoRow label="Lot No." value={auction.lotNo || '—'} />
                <InfoRow label="Starting Bid" value={`$${auction.startingBid.toLocaleString()}`} />
              </div>
            </div>

            {/* Payment / Status card */}
            <div className="bg-[#F1F2FF] rounded-[5px] overflow-hidden">
              <div className="bg-[#2E3D83] px-5 py-2.5">
                <span className="font-['Lato'] font-semibold text-[15px] text-white">
                  {isPaid ? 'Shipping Status' : 'Payment'}
                </span>
              </div>

              <div className="px-5 py-5 flex flex-col gap-4">
                {!isPaid ? (
                  /* Make Payment button */
                  <>
                    <div className="flex items-center justify-between">
                      <span className="font-['Lato'] text-[14px] text-[#545677]">Amount Due</span>
                      <span className="font-['Lato'] font-bold text-[20px] text-[#2E3D83]">
                        ${auction.currentBid.toLocaleString()}
                      </span>
                    </div>
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    <button
                      onClick={handlePay}
                      disabled={paying}
                      className="w-full bg-[#2E3D83] text-white font-['Lato'] font-bold text-[16px] py-3 rounded-[5px] hover:bg-[#243070] transition-colors disabled:opacity-60"
                    >
                      {paying ? 'Processing...' : 'Make Payment'}
                    </button>
                    <p className="font-['Lato'] text-[11px] text-[#939393] text-center">
                      Secure dummy payment — no real charge
                    </p>
                  </>
                ) : (
                  /* Progress bar */
                  <div className="flex flex-col gap-6">
                    <ProgressBar status={auction.paymentStatus} />
                    {isCompleted && (
                      <div className="w-full bg-[#2E3D83] text-white font-['Lato'] font-semibold text-[14px] py-2.5 rounded-[5px] text-center">
                        ✓ Auction Completed — Enjoy your car!
                      </div>
                    )}
                    {!isCompleted && (
                      <p className="font-['Lato'] text-[12px] text-[#939393] text-center">
                        Status updates automatically every ~60 seconds
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ── Full-width progress tracker (paid only) ──────────── */}
        {isPaid && (
          <div className="w-full bg-[#F1F2FF] rounded-[5px] overflow-hidden">
            <div className="bg-[#2E3D83] px-5 py-2.5 flex items-center gap-3">
              <div className="w-0.5 h-8 bg-[#FDB94B] shrink-0" />
              <span className="font-['Lato'] font-semibold text-[16px] text-white">Delivery Tracking</span>
            </div>
            <div className="px-8 py-8 flex items-center justify-center">
              <div className="w-full max-w-xl">
                <ProgressBar status={auction.paymentStatus} />
              </div>
            </div>
            <div className="px-8 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#E0E0E0] pt-4">
              <InfoRow label="Order Status" value={
                auction.paymentStatus === 'ready_for_shipping' ? 'Being Packaged' :
                auction.paymentStatus === 'in_transit' ? 'On the Way' :
                auction.paymentStatus === 'delivered' ? 'Delivered' :
                auction.paymentStatus === 'completed' ? 'Completed' : '—'
              } />
              <InfoRow label="Vehicle" value={auction.carName} />
              <InfoRow label="Lot No." value={auction.lotNo || '—'} />
            </div>
          </div>
        )}

      </div>

      <AuctionFooter />
    </div>
  );
}
