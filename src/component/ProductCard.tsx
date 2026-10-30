"use client"

import Link from "next/link";
import { useState } from "react";

type Product = {
    id: number | string;
    slug: string;
    nameBn: string;
    category: string;
    categoryNameBn?: string;
    categoryIcon?: string;
    image?: string;
    unit: string;
    today: number;
    yesterday?: number;
    change?: {
        dir?: "up" | "down" | "same" | "flat";
        pct?: number;
    };
};

const bn = (value: number) =>
    new Intl.NumberFormat("bn-BD", {
        maximumFractionDigits: 1,
    }).format(value);

const productImages: Record<string, string> = {
    chal: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    sobji: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    vegetables:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
    mach: "https://images.unsplash.com/photo-1510130387422-82bed34b456d?auto=format&fit=crop&w=600&q=80",
    fish: "https://images.unsplash.com/photo-1510130387422-82bed34b456d?auto=format&fit=crop&w=600&q=80",
    dim: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80",
    peyaj:
        "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80",
    alu: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
};

const fallbackImage =
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";

function getProductImage(product: Product) {
    const original = product.image?.trim() || "";

    if (/^https?:\/\//i.test(original)) return original;

    const category = product.category?.toLowerCase() || "";
    const name = product.nameBn || "";

    if (productImages[category]) return productImages[category];

    if (/চাল|ধান/.test(name)) return productImages.chal;
    if (/মাছ/.test(name)) return productImages.mach;
    if (/ডিম/.test(name)) return productImages.dim;
    if (/পেঁয়াজ|পেঁয়াজ|পিঁয়াজ/.test(name))
        return productImages.peyaj;
    if (/আলু/.test(name)) return productImages.alu;
    if (/সবজি|শাক|টমেটো|বেগুন|গাজর|শসা/.test(name))
        return productImages.sobji;

    return fallbackImage;
}

const unitNames: Record<string, string> = {
    kg: "কেজি",
    gram: "গ্রাম",
    litre: "লিটার",
    liter: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
    pcs: "পিস",
    packet: "প্যাকেট",
    bag: "বস্তা",
};

export default function ProductCard({
    product,
}: {
    product: Product;
}) {
    const imageUrl = getProductImage(product);
    const [imageFailed, setImageFailed] = useState(false);

    const unit =
        unitNames[product.unit?.toLowerCase() || ""] ||
        product.unit ||
        "একক";

    const direction = product.change?.dir;
    const percentage = Math.abs(product.change?.pct ?? 0);

    const fallbackIcon =
        product.categoryIcon ||
        (/ডাল/.test(product.nameBn) ? "🫘" :
            /চাল/.test(product.nameBn) ? "🍚" :
                /মাছ/.test(product.nameBn) ? "🐟" :
                    /ডিম/.test(product.nameBn) ? "🥚" :
                        /আলু/.test(product.nameBn) ? "🥔" : "🛒");

    return (
        <Link
            href={`/Products/${product.id}/${product.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-xl"
        >
            <div className="relative flex h-36 items-center justify-center overflow-hidden bg-green-50 sm:h-44">
                {!imageFailed ? (
                    <img
                        src={imageUrl}
                        alt={product.nameBn}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-green-50">
                        <span className="text-6xl" aria-hidden="true">
                            {fallbackIcon}
                        </span>
                        <span className="text-xs text-gray-500">
                            {product.nameBn}
                        </span>
                    </div>
                )}

                {direction &&
                    direction !== "same" &&
                    direction !== "flat" && (
                        <span
                            className={`absolute right-2 top-2 rounded-full px-2 py-1 text-xs font-bold ${direction === "up"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                        >
                            {direction === "up" ? "▲" : "▼"} {bn(percentage)}%
                        </span>
                    )}
            </div>

            <div className="flex flex-1 flex-col p-3 sm:p-4">
                <p className="text-xs text-gray-500">
                    {product.categoryIcon || "🛒"}{" "}
                    {product.categoryNameBn || "বাজারের পণ্য"}
                </p>

                <h2 className="mt-2 min-h-12 text-base font-bold text-gray-900 group-hover:text-green-700 sm:text-lg">
                    {product.nameBn}
                </h2>

                <p className="mt-1 text-sm text-gray-500">প্রতি {unit}</p>

                <div className="mt-auto pt-3">
                    <p className="text-xl font-extrabold text-green-700 sm:text-2xl">
                        ৳{bn(product.today)}
                    </p>

                    {typeof product.yesterday === "number" && (
                        <p className="mt-1 text-xs text-gray-500">
                            গতকাল: ৳{bn(product.yesterday)}
                        </p>
                    )}

                    <div className="mt-3 border-t border-gray-100 pt-3">
                        <span className="text-sm font-semibold text-green-700">
                            বিস্তারিত দেখুন →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
