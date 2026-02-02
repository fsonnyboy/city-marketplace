"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/lib/hooks";

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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{user ? `, ${user.firstName} ${user.lastName.split(" ")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your marketplace activity.
        </p>
      </motion.div>

      <motion.div
        variants={item}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {[
          { label: "Active Listings", value: "0", description: "Your active listings" },
          { label: "Total Views", value: "0", description: "All-time listing views" },
          { label: "Messages", value: "0", description: "Unread messages" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="rounded-lg border border-border bg-card p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={item} className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Quick actions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a new listing or browse existing ones to get started.
        </p>
      </motion.div>
    </motion.div>
  );
}
