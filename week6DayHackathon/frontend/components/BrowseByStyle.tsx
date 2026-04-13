import Image from "next/image";
import Link from "next/link";

const styles = [
  {
    label: "Casual",
    image: "/browse-dress-1.png",
    href: "/category/casual",
    wide: false,
  },
  {
    label: "Formal",
    image: "/browse-dress-2.png",
    href: "/category/formal",
    wide: true,
  },
  {
    label: "Party",
    image: "/browse-dress-3.png",
    href: "/category/party",
    wide: true,
  },
  {
    label: "Gym",
    image: "/browse-dress-4.png",
    href: "/category/gym",
    wide: false,
  },
];

function StyleCard({
  label,
  image,
  href,
}: {
  label: string;
  image: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="relative w-full h-[289px] bg-white rounded-[20px] overflow-hidden group block"
    >
      <Image
        src={image}
        alt={label}
        fill
        className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
      />
      <span
        className="absolute top-6 left-9 text-black font-bold text-[36px] leading-[49px] z-10"
        style={{ fontFamily: "'Satoshi', sans-serif" }}
      >
        {label}
      </span>
    </Link>
  );
}

export default function BrowseByStyle() {
  return (
    <section className="w-full bg-white py-12 md:py-16 px-4 md:px-[100px]">
      <div className="bg-[#F0F0F0] rounded-[40px] px-8 md:px-16 py-12 md:py-[70px]">
        {/* Heading */}
        <h2
          className="text-black font-extrabold text-[32px] md:text-[48px] leading-tight text-center uppercase mb-10 md:mb-14"
          style={{ fontFamily: "'Integral CF', sans-serif" }}
        >
          Browse By Dress Style
        </h2>

        {/* Desktop grid */}
        <div className="hidden md:flex flex-col gap-5">
          {/* Row 1: small | large */}
          <div className="flex gap-5">
            <div className="w-[37.5%]">
              <StyleCard {...styles[0]} />
            </div>
            <div className="flex-1">
              <StyleCard {...styles[1]} />
            </div>
          </div>
          {/* Row 2: large | small */}
          <div className="flex gap-5">
            <div className="flex-1">
              <StyleCard {...styles[2]} />
            </div>
            <div className="w-[37.5%]">
              <StyleCard {...styles[3]} />
            </div>
          </div>
        </div>

        {/* Mobile: single column stack */}
        <div className="flex flex-col gap-4 md:hidden">
          {styles.map((s) => (
            <StyleCard key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
