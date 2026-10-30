

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-100">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-24">
        {/* Left Content */}
        <div className="z-10">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            বাংলাদেশের আজকের বাজারদর
          </span>

          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম—বাজারভিত্তিক বিস্তারিত ও গড় মূল্য এক জায়গায়।
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#সব-পণ্য"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              সব পণ্য দেখুন
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Right Banner Image */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute inset-8 rounded-full bg-green-200/50 blur-3xl" />

          <div className="relative aspect-[5/4] overflow-hidden rounded-3xl border border-white/70 bg-white/60 shadow-2xl shadow-green-900/10">
            <Image
              src="/bazar-hero.png"
              alt="তাজা শাকসবজি ও নিত্যপ্রয়োজনীয় বাজারের পণ্য"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
