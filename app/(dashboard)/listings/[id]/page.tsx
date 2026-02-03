"use client";


import { UpdateListingForm } from "@/app/components/UpateListingForm";
import { useUserListing } from "@/lib/hooks";
import { use } from "react";

interface UpdateListingPageProps {
    params: Promise<{
        id: string;
        }>;
    }
  
  export default function UpdateListingPage({ params }: UpdateListingPageProps) {
    const { id } = use(params); 
    const { data: listing, isLoading, error } = useUserListing(id);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-500">Loading listing…</p>
        </div>
      );
    }
  
    if (error || !listing) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-500">Listing not found</p>
        </div>
      );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <h1 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-2 tracking-tight">
                    Update Listing
                </h1>
                <p className="text-slate-600 text-lg">
                    Make changes to your listing
                </p>
            </div>
            {listing &&
                <UpdateListingForm listing={listing}/>
            }
        </div>
        </div>
    );
}