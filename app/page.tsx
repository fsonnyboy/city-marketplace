"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "./components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="px-4 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-24">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.h1
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
              variants={fadeInUp}
            >
              Buy and sell in{" "}
              <span className="text-primary">your city</span>
            </motion.h1>
            <motion.p
              className="mt-6 text-lg text-muted-foreground sm:text-xl"
              variants={fadeInUp}
            >
              Connect with local buyers and sellers. List your products, find
              great deals, and build your neighborhood marketplace.
            </motion.p>
            <motion.div
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              variants={fadeInUp}
            >
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/signup">Get started free</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href="/login">Log in</Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-muted/30 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <motion.h2
              className="text-center text-2xl font-bold text-foreground sm:text-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              Why sell locally?
            </motion.h2>
            <motion.div
              className="mt-12 grid gap-8 sm:grid-cols-3"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.div variants={fadeInUp} transition={{ duration: 0.4 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl">📍</div>
                  <h3 className="mt-3 font-semibold text-foreground">
                    City-scoped listings
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your listings are only shown to people in your city. No
                    noise, just local buyers.
                  </p>
                </CardContent>
              </Card>
              </motion.div>
              <motion.div variants={fadeInUp} transition={{ duration: 0.4 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl">🤝</div>
                  <h3 className="mt-3 font-semibold text-foreground">
                    Meet face-to-face
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Chat with buyers, arrange meetups, and close deals in person.
                    Simple and secure.
                  </p>
                </CardContent>
              </Card>
              </motion.div>
              <motion.div variants={fadeInUp} transition={{ duration: 0.4 }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl">⚡</div>
                  <h3 className="mt-3 font-semibold text-foreground">
                    Free to start
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create your account and list your first item in minutes. No
                    fees to get started.
                  </p>
                </CardContent>
              </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border bg-muted/30 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl">
            <motion.h2
              className="text-center text-2xl font-bold text-foreground sm:text-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              Frequently asked questions
            </motion.h2>
            <motion.div
              className="mt-12 space-y-3"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.details
                className="group rounded-lg border border-border bg-card px-4 py-3 shadow-sm"
                variants={fadeInUp}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-foreground after:ml-2 after:inline-block after:content-['▾'] after:transition-transform group-open:after:rotate-180 [&::-webkit-details-marker]:hidden">
                  How do I list an item for sale?
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">
                  Sign up or log in, then create a listing with a title,
                  description, price, and photos. Your listing will appear only
                  to people in your city.
                </p>
              </motion.details>
              <motion.details
                className="group rounded-lg border border-border bg-card px-4 py-3 shadow-sm"
                variants={fadeInUp}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-foreground after:ml-2 after:inline-block after:content-['▾'] after:transition-transform group-open:after:rotate-180 [&::-webkit-details-marker]:hidden">
                  Is City Marketplace free to use?
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">
                  Yes. Creating an account and listing items is free. We focus on
                  connecting local buyers and sellers in your city.
                </p>
              </motion.details>
              <motion.details
                className="group rounded-lg border border-border bg-card px-4 py-3 shadow-sm"
                variants={fadeInUp}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-foreground after:ml-2 after:inline-block after:content-['▾'] after:transition-transform group-open:after:rotate-180 [&::-webkit-details-marker]:hidden">
                  How do I change my city?
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">
                  You can update your city in your account settings. Listings
                  you’ve already created will stay in the city they were posted
                  in unless you edit them.
                </p>
              </motion.details>
              <motion.details
                className="group rounded-lg border border-border bg-card px-4 py-3 shadow-sm"
                variants={fadeInUp}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-foreground after:ml-2 after:inline-block after:content-['▾'] after:transition-transform group-open:after:rotate-180 [&::-webkit-details-marker]:hidden">
                  How do I contact a seller?
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">
                  Open a listing and use the contact option to message the
                  seller. You can arrange a safe, in-person meetup to complete
                  the sale.
                </p>
              </motion.details>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border px-4 py-16 sm:px-6 sm:py-24">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Ready to list your first item?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join your city&apos;s marketplace and start buying or selling
              today.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/signup">Create free account</Link>
            </Button>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
