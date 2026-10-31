
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-gradient-to-br from-[#f0f9f1] via-white to-[#e5f5e8]">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-14 lg:px-8">

        {/* Left Content */}
        <div className="max-w-xl">
          {/* Eyebrow */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#cde8d2] bg-white px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#168044]" />
            <span className="text-sm font-semibold text-[#168044]">
              বাংলাদেশের প্রতিদিনের বাজারদর
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-extrabold leading-[1.3] tracking-tight text-[#1d3023] sm:text-5xl lg:text-[56px]">
            আজকের বাজারের দাম
            <span className="block text-[#168044]">
              এক নজরে
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-lg text-base leading-8 text-gray-600 sm:text-lg">
            চাল, ডাল, মাছ, মাংস, সবজি থেকে শুরু করে নিত্যপ্রয়োজনীয়
            সব পণ্যের সর্বশেষ বাজারদর জানুন সহজেই। বাজারে যাওয়ার
            আগে জেনে নিন সঠিক দাম।
          </p>

          {/* CTA Button */}
          <div className="mt-8">
            <Link
              href="#সব-পণ্য"
              className="inline-flex items-center gap-3 rounded-xl bg-[#168044] px-7 py-4 text-base font-bold text-white shadow-lg shadow-green-900/10 transition hover:-translate-y-1 hover:bg-[#116b38]"
            >
              আজকের বাজারদর দেখুন
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Small Info */}
          <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="text-[#168044]">✓</span>
              সহজে দাম যাচাই
            </span>

            <span className="flex items-center gap-2">
              <span className="text-[#168044]">✓</span>
              বিভিন্ন বাজারের তুলনা
            </span>
          </div>
        </div>

        {/* Right Hero Image */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-[#ccebd2] blur-2xl" />
          <div className="absolute -bottom-5 -left-5 h-40 w-40 rounded-full bg-[#d9f0dc] blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-white bg-white p-3 shadow-xl shadow-green-900/10">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#edf7ef]">
              <Image
                src="/bazar-hero.png"
                alt="তাজা বাজারের পণ্য"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Floating Price Card */}
          <div className="absolute -bottom-5 left-3 rounded-2xl border border-[#e4eee5] bg-white px-5 py-4 shadow-lg sm:-left-5">
            <p className="text-xs text-gray-500">
              বাজারের দাম জানুন
            </p>
            <p className="mt-1 text-lg font-extrabold text-[#168044]">
              প্রতিদিন, এক জায়গায়
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

