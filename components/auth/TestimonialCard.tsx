"use client";

import Image from "next/image";
import { CheckCircle2, Quote, Star } from "lucide-react";
import clsx from "clsx";

interface TestimonialCardProps {
  name: string;
  role: string;
  company?: string;
  testimonial: string;
  avatar?: string;
  rating?: number;
  verified?: boolean;
  className?: string;
}

export default function TestimonialCard({
  name,
  role,
  company,
  testimonial,
  avatar,
  rating = 5,
  verified = true,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300",
        "hover:-translate-y-1 hover:border-orange-400/30 hover:shadow-2xl",
        className
      )}
    >
      {/* Quote Icon */}

      <div className="mb-5 flex items-center justify-between">
        <Quote className="h-8 w-8 text-orange-400" />

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={clsx(
                "h-4 w-4",
                index < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-500"
              )}
            />
          ))}
        </div>
      </div>

      {/* Testimonial */}

      <p className="text-base leading-7 text-slate-200">
        "{testimonial}"
      </p>

      {/* Footer */}

      <div className="mt-6 flex items-center gap-4">
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            width={56}
            height={56}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-lg font-bold text-white">
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-white">
              {name}
            </h4>

            {verified && (
              <CheckCircle2 className="h-4 w-4 text-green-400" />
            )}
          </div>

          <p className="text-sm text-slate-300">
            {role}
          </p>

          {company && (
            <p className="text-sm text-orange-300">
              {company}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}