import Image from "next/image";
import Link from "next/link";

const stats = [
  { value: "200+", label: "International Brands" },
  { value: "2,000+", label: "High-Quality Products" },
  { value: "30,000+", label: "Happy Customers" },
];

export default function HeroSection() {
  return (
    <section className="w-full bg-[#F2F0F1] overflow-hidden">
      <div className="relative max-w-[1440px] mx-auto flex flex-col md:flex-row items-center">

        {/* Left content */}
        <div className="flex-1 flex flex-col justify-center px-6 pt-10 pb-6 md:pl-[100px] md:py-20 z-10">
          {/* Heading */}
          <h1
            className="font-extrabold text-black uppercase leading-tight text-[40px] sm:text-[52px] md:text-[64px] max-w-[630px]"
            style={{ fontFamily: "'Integral CF', sans-serif" }}
          >
            Find Clothes That Matches Your Style
          </h1>

          {/* Subtext */}
          <p
            className="mt-4 md:mt-6 text-black/60 text-sm md:text-base leading-[22px] max-w-[440px]"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
          >
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>

          {/* CTA */}
          <Link
            href="/shop"
            className="mt-6 md:mt-8 inline-flex items-center justify-center bg-black text-white text-base font-medium rounded-full px-[54px] py-[16px] w-fit hover:opacity-80 transition-opacity"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
          >
            Shop Now
          </Link>

          {/* Stats */}
          <div className="mt-10 md:mt-12 flex flex-wrap items-center gap-6 md:gap-0">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col ${
                  i !== 0
                    ? "md:pl-6 md:border-l md:border-black/20"
                    : ""
                } md:pr-6`}
              >
                <span
                  className="font-bold text-black text-[32px] md:text-[40px] leading-tight"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-black/60 text-sm leading-[22px]"
                  style={{ fontFamily: "'Satoshi', sans-serif" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right image */}
        <div className="relative w-full md:w-[400px] lg:w-[500px] xl:w-[600px] flex-shrink-0 flex justify-center md:justify-end">
          {/* Decorative stars */}
          <StarIcon className="absolute top-6 right-6 md:top-10 md:right-10 w-[36px] h-[36px] md:w-[52px] md:h-[52px] z-10" />
          <StarIcon className="absolute bottom-[120px] left-4 md:bottom-[160px] md:left-0 w-[20px] h-[20px] md:w-[28px] md:h-[28px] z-10" />

          <Image
            src="/hero-section.jpg"
            alt="Two models wearing stylish clothes"
            width={700}
            height={870}
            priority
            className="object-cover object-top w-full md:h-[600px] lg:h-[680px] xl:h-[760px]"
          />
        </div>
      </div>
    </section>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28 0C28 0 30.5 22 28 28C25.5 34 0 28 0 28C0 28 22 25.5 28 28C34 30.5 28 56 28 56C28 56 25.5 34 28 28C30.5 22 56 28 56 28C56 28 34 30.5 28 28C22 25.5 28 0 28 0Z"
        fill="black"
      />
    </svg>
  );
}
