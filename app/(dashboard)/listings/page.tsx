"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

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

export default function ListingsPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div
        variants={item}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your marketplace listings.
          </p>
        </div>
        <Button asChild>
          <Link href="/listings/new" className="gap-2">
            <Plus className="h-4 w-4" />
            New listing
          </Link>
        </Button>
      </motion.div>

      <motion.div
        variants={item}
        className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-12"
      >
        <p className="text-muted-foreground text-center">
          You don&apos;t have any listings yet.
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/listings/new" className="gap-2">
            <Plus className="h-4 w-4" />
            Create your first listing
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
