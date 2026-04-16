'use client';

import { useState, useEffect } from "react";
import Aboutus from "@/components/Aboutus";
import LightNavbar from "@/components/LightNavbar";
import AuctionFooter from "@/components/AuctionFooter";
import MyCarCard from "@/components/MyCarCard";
import MyBidCard from "@/components/MyBidCard";
import WishlistCard from "@/components/WishlistCard";
import ListCarForm from "@/components/ListCarForm";
import { api } from "@/lib/api";

type Tab = "personal" | "mycars" | "mybids" | "wishlist" | "listcar";

interface MyCarItem {
  _id: string;
  carName: string;
  carImage: string;
  currentBid: number;
  bids: { amount: number }[];
  trending: boolean;
  sold: boolean;
}

interface MyBidItem {
  auctionId: string;
  carName: string;
  carImage: string;
  winningBid: number;
  yourBid: number;
  bidStatus: "winning" | "losing";
  totalBids: number;
  trending?: boolean;
  canBid: boolean;
}

interface WishlistItem {
  _id: string;
  carName: string;
  carImage: string;
  currentBid: number;
  bids: { amount: number }[];
  endTime: string;
  trending: boolean;
}

/* ── Edit pencil icon ──────────────────────────────────────── */
const EditIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#EEEEEE" strokeWidth="2">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Section card header ────────────────────────────────────── */
const SectionHeader = ({ title, onEdit, editing }: { title: string; onEdit?: () => void; editing?: boolean }) => (
  <div className="bg-[#2E3D83] rounded-t-[5px] px-5 py-2.5 flex items-center justify-between">
    <span className="font-['Lato'] font-semibold text-[18px] text-white">{title}</span>
    {onEdit && !editing && (
      <button aria-label="Edit" onClick={onEdit} className="opacity-80 hover:opacity-100 transition-opacity">
        <EditIcon />
      </button>
    )}
  </div>
);

/* ── Label + value pair ─────────────────────────────────────── */
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <span className="font-['Lato'] font-semibold text-[16px] sm:text-[18px] text-[#2E3D83]">{label}</span>
    <span className="font-['Lato'] font-normal text-[16px] sm:text-[18px] text-[#939393]">{value || "—"}</span>
  </div>
);

/* ── Editable field ─────────────────────────────────────────── */
const EditField = ({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean }) => (
  <div className="flex flex-col gap-1">
    <label className="font-['Lato'] font-semibold text-[14px] text-[#2E3D83]">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="h-10 border border-[#EAECF3] rounded-[5px] px-3 font-['Lato'] text-[14px] text-[#2E3D83] outline-none focus:border-[#2E3D83] transition-colors bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  </div>
);

/* ── Car card ───────────────────────────────────────────────── */
/* ── Profile defaults (match Figma) ────────────────────────── */
const DEFAULT_PROFILE = {
  fullName: "Manish Sharma",
  email: "Manish Sharma",
  mobile: "1234567890",
  nationality: "India",
  idType: "India",
  idNumber: "345203",
  country: "India",
  city: "India",
  address1: "India",
  address2: "Manish Sharma",
  landLine: "345203",
  poBox: "345203",
};

/* ── Page ───────────────────────────────────────────────────── */
export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [myCars, setMyCars] = useState<MyCarItem[]>([]);
  const [endingCarId, setEndingCarId] = useState<string | null>(null);
  const [deletingCarId, setDeletingCarId] = useState<string | null>(null);
  const [myBids, setMyBids] = useState<MyBidItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  /* editing state */
  const [editingSection, setEditingSection] = useState<'personal' | 'address' | null>(null);
  const [draft, setDraft] = useState(DEFAULT_PROFILE);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  function startEdit(section: 'personal' | 'address') {
    setDraft({ ...profile });
    setSaveError('');
    setSaveSuccess('');
    setEditingSection(section);
  }

  async function handleEndBid(carId: string) {
    if (!confirm('End this auction now? This cannot be undone.')) return;
    setEndingCarId(carId);
    try {
      await api.auctions.endBid(carId);
      setMyCars((prev) => prev.map((c) => c._id === carId ? { ...c, sold: true } : c));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to end auction');
    } finally {
      setEndingCarId(null);
    }
  }

  async function handleDeleteCar(carId: string) {
    if (!confirm('Permanently delete this listing? This cannot be undone.')) return;
    setDeletingCarId(carId);
    try {
      await api.auctions.delete(carId);
      setMyCars((prev) => prev.filter((c) => c._id !== carId));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to delete listing');
    } finally {
      setDeletingCarId(null);
    }
  }

  function cancelEdit() {
    setEditingSection(null);
    setSaveError('');
    setSaveSuccess('');
  }

  async function saveSection(section: 'personal' | 'address') {
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');
    try {
      const payload: Record<string, string> = section === 'personal'
        ? { fullName: draft.fullName, mobile: draft.mobile, nationality: draft.nationality, idType: draft.idType, idNumber: draft.idNumber }
        : { country: draft.country, city: draft.city, address1: draft.address1, address2: draft.address2, landLine: draft.landLine, poBox: draft.poBox };
      await api.users.updateProfile(payload);
      setProfile((prev) => ({ ...prev, ...payload }));
      localStorage.setItem('userProfile', JSON.stringify({ ...profile, ...payload }));
      setSaveSuccess('Saved successfully!');
      setEditingSection(null);
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  function setDraftField(field: keyof typeof DEFAULT_PROFILE, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  /* Load profile: try API first, fall back to localStorage */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("userProfile");
      if (stored) {
        const data = JSON.parse(stored) as Partial<typeof DEFAULT_PROFILE>;
        setProfile((prev) => ({ ...prev, ...data }));
      }
    } catch { /* ignore */ }

    api.users.getProfile()
      .then((data) => {
        const d = data as Record<string, string>;
        setProfile((prev) => ({
          ...prev,
          ...(d.fullName && { fullName: d.fullName }),
          ...(d.email && { email: d.email }),
          ...(d.mobile && { mobile: d.mobile }),
          ...(d.nationality && { nationality: d.nationality }),
          ...(d.idType && { idType: d.idType }),
          ...(d.idNumber && { idNumber: d.idNumber }),
          ...(d.country && { country: d.country }),
          ...(d.city && { city: d.city }),
          ...(d.address1 && { address1: d.address1 }),
          ...(d.address2 && { address2: d.address2 }),
          ...(d.landLine && { landLine: d.landLine }),
          ...(d.poBox && { poBox: d.poBox }),
        }));
      })
      .catch(() => {});

    api.users.getMyCars()
      .then((data) => setMyCars(data as MyCarItem[]))
      .catch(() => {});

    api.users.getMyBids()
      .then((data) => setMyBids(data as MyBidItem[]))
      .catch(() => {});

    api.users.getWishlist()
      .then((data) => setWishlist(data as WishlistItem[]))
      .catch(() => {});
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: "personal", label: "Personal Information" },
    { id: "mycars", label: "My Cars" },
    { id: "mybids", label: "My Bids" },
    { id: "wishlist", label: "Wishlist" },
    { id: "listcar", label: "List Your Car" },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <Aboutus />
      <LightNavbar />

      {/* ── Hero band ─────────────────────────────────────────── */}
      <div className="w-full bg-[#C6D8F9] pt-10 flex flex-col items-center gap-3">
        <h1 className="font-['Josefin_Sans'] font-semibold text-[48px] sm:text-[64px] leading-16 text-[#2E3D83] text-center">
          My Profile
        </h1>
        <div className="w-20 h-0.75 bg-[#2E3D83] rounded-full" />
        <p className="font-['Lato'] font-medium text-[16px] sm:text-[18px] text-[#545677] text-center max-w-xl px-4">
          Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.
        </p>
        <div className="mt-2 flex items-center gap-1 bg-[#BBD0F6] rounded-t-[3px] px-4 py-2">
          <span className="font-['Lato'] font-medium text-[14px] text-[#545677]">Home</span>
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
            <path d="M6 4l4 4-4 4" stroke="#000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-['Lato'] font-medium text-[14px] text-[#2E3D83]">My Profile</span>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">

        {/* ── Left sidebar ──────────────────────────────────────── */}
        <div className="lg:w-72 shrink-0 flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative w-full h-10 flex items-center px-5 rounded-[5px] font-['Lato'] text-[16px] text-[#2E3D83] text-left transition-colors ${
                tab.id === activeTab
                  ? "font-semibold bg-[#F1F2FF]"
                  : "font-normal border border-[#EAECF3] bg-white hover:bg-gray-50"
              }`}
            >
              {tab.label}
              {tab.id === activeTab && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-7.5 bg-[#F9C146] rounded-[5px]" />
              )}
            </button>
          ))}
        </div>

        {/* ── Right content ─────────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-5">

          {/* My Bids tab */}
          {activeTab === "mybids" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-0">
                <div className="flex items-end">
                  <div className="flex flex-col items-stretch gap-0.5">
                    <span className="font-['Lato'] font-medium text-[20px] text-[#2E3D83] px-2">My Bids</span>
                    <div className="h-0.75 bg-[#FFC300] rounded-sm" />
                  </div>
                </div>
                <div className="w-full h-px bg-[#B3B3B3]" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
                {myBids.map((bid) => (
                  <MyBidCard
                    key={bid.auctionId}
                    name={bid.carName}
                    image={bid.carImage}
                    winningBid={`$${bid.winningBid.toLocaleString()}`}
                    yourBid={`$${bid.yourBid.toLocaleString()}`}
                    bidStatus={bid.bidStatus}
                    bids={String(bid.totalBids)}
                    trending={bid.trending}
                    canBid={bid.canBid}
                  />
                ))}
              </div>
            </div>
          )}

          {/* My Cars tab */}
          {activeTab === "mycars" && (
            <div className="flex flex-col gap-4">
              {/* Tab label + dividers */}
              <div className="flex flex-col gap-0">
                <div className="flex items-end gap-0">
                  <div className="flex flex-col items-stretch gap-0.5">
                    <span className="font-['Lato'] font-medium text-[20px] text-[#2E3D83] px-2">My Cars</span>
                    <div className="h-0.75 bg-[#FFC300] rounded-sm" />
                  </div>
                </div>
                <div className="w-full h-px bg-[#B3B3B3]" />
              </div>
              {/* Cards grid */}
              <div className="flex flex-wrap gap-5">
                {myCars.map((car) => (
                  <MyCarCard
                    key={car._id}
                    name={car.carName}
                    image={car.carImage}
                    bid={`$${car.currentBid.toLocaleString()}`}
                    bids={String(car.bids?.length ?? 0)}
                    trending={car.trending}
                    sold={car.sold}
                    onEndBid={() => handleEndBid(car._id)}
                    ending={endingCarId === car._id}
                    onDelete={() => handleDeleteCar(car._id)}
                    deleting={deletingCarId === car._id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Wishlist tab */}
          {activeTab === "wishlist" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-0">
                <div className="flex items-end">
                  <div className="flex flex-col items-stretch gap-0.5">
                    <span className="font-['Lato'] font-bold text-[20px] text-[#2E3D83] px-2">
                      Wishlist ({wishlist.length})
                    </span>
                    <div className="h-0.75 bg-[#F9C146] rounded-sm" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
                {wishlist.map((item) => (
                  <WishlistCard
                    key={item._id}
                    auctionId={item._id}
                    name={item.carName}
                    image={item.carImage}
                    currentBid={`$${item.currentBid.toLocaleString()}`}
                    bids={String(item.bids?.length ?? 0)}
                    endTime={new Date(item.endTime).toLocaleString()}
                    trending={item.trending}
                    onRemove={() => setWishlist((prev) => prev.filter((w) => w._id !== item._id))}
                  />
                ))}
              </div>
            </div>
          )}

          {/* List Your Car tab */}
          {activeTab === "listcar" && (
            <ListCarForm onSuccess={() => {
              setActiveTab("mycars");
              api.users.getMyCars().then((d) => setMyCars(d as MyCarItem[])).catch(() => {});
            }} />
          )}

          {/* ── Personal sections ───────────────────────────────── */}
          {activeTab !== "mycars" && activeTab !== "mybids" && activeTab !== "wishlist" && activeTab !== "listcar" && (
            <>

          {/* ── Personal Information ─── */}
          <div className="bg-[#F1F2FF] rounded-[5px] overflow-hidden">
            <SectionHeader
              title="Personal Information"
              editing={editingSection === 'personal'}
              onEdit={() => startEdit('personal')}
            />
            <div className="p-5 flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-[#D9D9D9] flex items-center justify-center shrink-0 overflow-hidden">
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-gray-500" fill="currentColor">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
              {editingSection === 'personal' ? (
                <div className="flex-1 flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <EditField label="Full Name" value={draft.fullName} onChange={(v) => setDraftField('fullName', v)} disabled={saving} />
                    <EditField label="Email" value={draft.email} onChange={() => {}} disabled />
                    <EditField label="Mobile Number" value={draft.mobile} onChange={(v) => setDraftField('mobile', v)} disabled={saving} />
                    <EditField label="Nationality" value={draft.nationality} onChange={(v) => setDraftField('nationality', v)} disabled={saving} />
                    <EditField label="ID Type" value={draft.idType} onChange={(v) => setDraftField('idType', v)} disabled={saving} />
                    <EditField label="ID Number" value={draft.idNumber} onChange={(v) => setDraftField('idNumber', v)} disabled={saving} />
                  </div>
                  {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
                  <div className="flex gap-3">
                    <button
                      onClick={() => saveSection('personal')}
                      disabled={saving}
                      className="h-10 px-6 bg-[#2E3D83] text-white font-['Lato'] font-bold text-[14px] rounded-[5px] hover:bg-[#1e2d6b] transition-colors disabled:opacity-60"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={saving}
                      className="h-10 px-6 border border-[#2E3D83] text-[#2E3D83] font-['Lato'] font-medium text-[14px] rounded-[5px] hover:bg-[#F1F2FF] transition-colors disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-5 flex-1">
                  <InfoRow label="Full Name" value={profile.fullName} />
                  <InfoRow label="Email" value={profile.email} />
                  <InfoRow label="Mobile Number" value={profile.mobile} />
                  <InfoRow label="Nationality" value={profile.nationality} />
                  <InfoRow label="ID Type" value={profile.idType} />
                  <InfoRow label="ID Number" value={profile.idNumber} />
                </div>
              )}
            </div>
          </div>

          {/* ── Password ─── */}
          <div className="bg-[#F1F2FF] rounded-[5px] overflow-hidden">
            <SectionHeader title="Password" />
            <div className="p-5">
              <InfoRow label="Password" value="*********" />
            </div>
          </div>

          {/* ── Address ─── */}
          <div className="bg-[#F1F2FF] rounded-[5px] overflow-hidden">
            <SectionHeader
              title="Address"
              editing={editingSection === 'address'}
              onEdit={() => startEdit('address')}
            />
            {editingSection === 'address' ? (
              <div className="p-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <EditField label="Country" value={draft.country} onChange={(v) => setDraftField('country', v)} disabled={saving} />
                  <EditField label="City" value={draft.city} onChange={(v) => setDraftField('city', v)} disabled={saving} />
                  <EditField label="Address 1" value={draft.address1} onChange={(v) => setDraftField('address1', v)} disabled={saving} />
                  <EditField label="Address 2" value={draft.address2} onChange={(v) => setDraftField('address2', v)} disabled={saving} />
                  <EditField label="Land Line Number" value={draft.landLine} onChange={(v) => setDraftField('landLine', v)} disabled={saving} />
                  <EditField label="P.O Box" value={draft.poBox} onChange={(v) => setDraftField('poBox', v)} disabled={saving} />
                </div>
                {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
                <div className="flex gap-3">
                  <button
                    onClick={() => saveSection('address')}
                    disabled={saving}
                    className="h-10 px-6 bg-[#2E3D83] text-white font-['Lato'] font-bold text-[14px] rounded-[5px] hover:bg-[#1e2d6b] transition-colors disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={saving}
                    className="h-10 px-6 border border-[#2E3D83] text-[#2E3D83] font-['Lato'] font-medium text-[14px] rounded-[5px] hover:bg-[#F1F2FF] transition-colors disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-5">
                <InfoRow label="Country" value={profile.country} />
                <InfoRow label="City" value={profile.city} />
                <InfoRow label="Address 1" value={profile.address1} />
                <InfoRow label="Address 2" value={profile.address2} />
                <InfoRow label="Land Line Number" value={profile.landLine} />
                <InfoRow label="P.O Box" value={profile.poBox} />
              </div>
            )}
          </div>

          {/* ── Traffic File Information ─── */}
          <div className="bg-[#F1F2FF] rounded-[5px] overflow-hidden">
            <SectionHeader title="Traffic File Information" />
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-5">
              <InfoRow label="Traffic Information Type" value="******" />
              <InfoRow label="Plate State" value="" />
              <InfoRow label="Traffic File Number" value={profile.fullName} />
              <InfoRow label="Plate Code" value="" />
              <InfoRow label="Plate Number" value={profile.fullName} />
              <InfoRow label="Driver License Number" value="" />
              <InfoRow label="Issue City" value="" />
            </div>
          </div>

          {saveSuccess && editingSection === null && (
            <div className="w-full bg-green-50 border border-green-200 rounded-[5px] px-4 py-3">
              <span className="font-['Lato'] text-green-700 text-sm">{saveSuccess}</span>
            </div>
          )}
            </>
          )}

        </div>
      </div>

      <AuctionFooter />
    </div>
  );
}
