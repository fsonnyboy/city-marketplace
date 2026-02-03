"use client";

import Link from "next/link";
import {
  Eye,
  Flag,
  MapPin,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageCarousel } from "./ImageCarousel";
import { Badge } from "@/components/ui/badge";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    description: string;
    price: number;
    negotiable: boolean;
    condition: "NEW" | "USED";
    status: "ACTIVE" | "SOLD" | "EXPIRED" | "REMOVED";
    createdAt: Date;
    images: { id: string; url: string }[];
    category: { id: string; name: string };
    city: { id: string; name: string };
    _count?: {
      reports: number;
      views: number;
    };
    boost?: {
      plan: string;
      endsAt: Date;
    } | null;
  };
}

const statusColors = {
  ACTIVE: "bg-green-500/10 text-green-700 dark:text-green-400",
  SOLD: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  EXPIRED: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  REMOVED: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const conditionColors = {
  NEW: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  USED: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

export function ListingCard({ listing }: ListingCardProps) {
  const totalViews = listing._count?.views ?? 0;
  const reportCount = listing._count?.reports ?? 0;
  const isBoosted = listing.boost && new Date(listing.boost.endsAt) > new Date();

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md h-full"
    >
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] w-full flex-shrink-0">
        <ImageCarousel images={listing.images} alt={listing.title} />
        
        {/* Boost Badge */}
        {isBoosted && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
            <TrendingUp className="h-3 w-3" />
            Boosted
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-2">
        {/* Title - Fixed height */}
        <h3 className="line-clamp-2 text-lg font-semibold group-hover:text-primary min-h-5 truncate">
          {listing.title}
        </h3>

        {/* Description - Fixed height */}
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground min-h-5 truncate">
          {listing.description}
        </p>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <p className="text-2xl font-bold">
            ₱{listing.price.toLocaleString()}
          </p>
          {listing.negotiable && (
            <span className="text-xs text-muted-foreground">(Negotiable)</span>
          )}
        </div>

        {/* Badges */}
        <div className="mt-3 flex flex-wrap gap-2 pb-2">
          <Badge variant="secondary" className={cn("text-xs", statusColors[listing.status])}>
            {listing.status}
          </Badge>
          <Badge variant="secondary" className={cn("text-xs", conditionColors[listing.condition])}>
            {listing.condition}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {listing.category.name}
          </Badge>
        </div>

        {/* Meta Information - Push to bottom */}
        <div className="mt-auto space-y-2 border-t border-border pt-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{listing.city.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
            </div>
            {/* Stats */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              <span className="font-medium">{totalViews.toLocaleString()}</span>
              <span>views</span>
            </div>
            
            {reportCount > 0 && (
              <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <Flag className="h-3.5 w-3.5" />
                <span className="font-medium">{reportCount}</span>
                <span>reports</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}