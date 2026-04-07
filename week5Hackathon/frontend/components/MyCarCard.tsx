interface MyCarCardProps {
  name: string;
  image: string;
  bid: string;
  bids: string;
  trending: boolean;
  sold: boolean;
  onEndBid?: () => void;
  ending?: boolean;
  onDelete?: () => void;
  deleting?: boolean;
}

export default function MyCarCard({ name, image, bid, bids, trending, sold, onEndBid, ending, onDelete, deleting }: MyCarCardProps) {
  return (
    <div className="group relative w-full sm:w-72 border border-[#EAECF3] rounded-[5px] bg-white overflow-hidden flex flex-col">
      {/* Delete icon — visible on group hover */}
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          disabled={deleting}
          aria-label="Delete listing"
          className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-[#EF233C] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
        >
          {deleting ? (
            <svg className="w-3.5 h-3.5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          )}
        </button>
      )}
      {/* Trending badge */}
      {trending && (
        <div className="absolute top-2 left-2 z-10 bg-[#EF233C] px-1.5 py-0.5 rounded-[4px_2px_2px_0px]">
          <span className="font-['Lato'] font-semibold text-[10px] text-white">Trending</span>
        </div>
      )}
      {/* Car name */}
      <div className="pt-3 pb-1 px-4 text-center">
        <span className="font-['Lato'] font-bold text-[16px] text-[#2E3D83]">{name}</span>
      </div>
      {/* Car image */}
      <div
        className="w-full h-36 bg-cover bg-center shrink-0"
        style={{ backgroundImage: `url("${encodeURI(image)}")` }}
      />
      {/* Bid info bar */}
      <div className="mx-4 mt-3 bg-[#F1F2FF] rounded-[5px] px-3 py-3 flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="font-['Lato'] font-bold text-[14px] text-[#2E3D83]">{bid}</span>
          <span className="font-['Lato'] font-normal text-[12px] text-[#939393]">Winning Bid</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="font-['Lato'] font-bold text-[12px] text-[#2E3D83]">{bids}</span>
          <span className="font-['Lato'] font-normal text-[10px] text-[#939393]">Total Bids</span>
        </div>
      </div>
      {/* Action button */}
      <div className="px-4 py-4">
        {sold ? (
          <div className="w-full h-10 bg-[#F1F2FF] rounded-[5px] flex items-center justify-center">
            <span className="font-['Lato'] font-bold text-[16px] text-[#939393]">Sold</span>
          </div>
        ) : (
          <button
            onClick={onEndBid}
            disabled={ending || !onEndBid}
            className="w-full h-10 bg-[#EF233C] rounded-[5px] font-['Lato'] font-bold text-[16px] text-white hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {ending ? 'Ending...' : 'End Bid'}
          </button>
        )}
      </div>
    </div>
  );
}
