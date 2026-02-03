"use client";

import { motion } from "framer-motion";
import { useAuth, useUserListings } from "@/lib/hooks";
import { Package, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ListingCard } from "@/app/components/ListingCard";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { data } = useAuth();
  const user = data?.user;

  const { data: listings, isLoading } = useUserListings()

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 relative p-6"
    >
      <motion.div variants={item} className="flex items-center justify-between h-[64px] sticky top-0 bg-background z-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{user ? `, ${user.firstName}` : ""}
          </h1>
        </div>
        <Button asChild>
          <Link href="/listings/new">
            <Plus className="h-4 w-4" />
            New listing
          </Link>
        </Button>
      </motion.div>

      <motion.div variants={item} className="space-y-4">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-[450px] animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : listings?.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No listings yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first listing to start selling on the marketplace.
            </p>
            <Button asChild className="mt-6">
              <Link href="/dashboard/listings/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Listing
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings?.map((listing) => (
              <motion.div
                key={listing.id}
                variants={item}
                initial="hidden"
                animate="show"
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Tips */}
      {listings && listings.length > 0 && (
        <motion.div
          variants={item}
          className="rounded-lg border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Boost your listings</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get more visibility by boosting your listings. Boosted listings
                appear at the top of search results and get up to 10x more views.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link href="/dashboard/boost">Learn More</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
