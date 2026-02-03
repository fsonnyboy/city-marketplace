"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, X, ImagePlus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// shadcn/ui imports
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useCategories, useUpdateListing } from '@/lib/hooks';

// Zod validation schema
const listingSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  price: z.string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Price must be a positive number',
    }),
  negotiable: z.boolean(),
  condition: z.enum(['NEW', 'USED']),
  categoryId: z.string().min(1, 'Please select a category'),
  status: z.enum(['ACTIVE', 'SOLD', 'EXPIRED', 'REMOVED'])
});

type ListingFormValues = z.infer<typeof listingSchema>;

interface ExistingImage {
  id: string;
  url: string;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  condition: 'NEW' | 'USED';
  status: "ACTIVE" | "SOLD" | "EXPIRED" | "REMOVED";
  category: {
    id: string
    name: string
  }
  images: ExistingImage[];
}

interface UpdateListingFormProps {
  listing: Listing;
}


export function UpdateListingForm({ listing }: UpdateListingFormProps) {
  const router = useRouter();
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(listing.images);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: categories } = useCategories();
  const { mutateAsync } = useUpdateListing()

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: listing.title,
      description: listing.description,
      price: listing.price.toString(),
      negotiable: listing.negotiable,
      condition: listing.condition,
      categoryId: listing.category.id,
      status: listing.status
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addImages(files);
  };

  const addImages = (files: File[]) => {
    const maxFiles = 8;
    const maxSize = 5 * 1024 * 1024; // 5MB
    const totalImages = existingImages.length + newImages.length;

    const validFiles = files.filter((file) => {
      if (totalImages + newImages.length >= maxFiles) {
        toast.error('Maximum images reached', {
          description: `You can only have up to ${maxFiles} images`,
        });
        return false;
      }

      if (file.size > maxSize) {
        toast.error('File too large', {
          description: `${file.name} exceeds 5MB limit`,
        });
        return false;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type', {
          description: `${file.name} is not an image`,
        });
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    const availableSlots = maxFiles - totalImages;
    const filesToAdd = validFiles.slice(0, availableSlots);
    
    setNewImages((prev) => [...prev, ...filesToAdd]);

    // Create previews
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (imageId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addImages(files);
  };

  const onSubmit = async (data: ListingFormValues) => {
    try {
      await mutateAsync({
        listingId: listing.id,
        ...data,
        price: parseFloat(data.price),
      });

      toast.success('Listing created!', {
        description: 'Your listing has been published successfully.',
      });

      // Reset form
      form.reset();
    } catch (error) {
      toast.error('Failed to create listing. Please try again.', {
        description: 'Failed to create listing. Please try again.',
      });
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }

      toast.success('Listing deleted!', {
        description: 'Your listing has been deleted successfully.',
      });

      router.push('/dashboard/listings');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete listing. Please try again.', {
        description: 'Failed to delete listing. Please try again.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const totalImages = existingImages.length + newImages.length;

  return (
    <Card className="shadow-xl border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-2">
                <h2 className="text-2xl font-serif font-semibold text-slate-900">
                  Basic Information
                </h2>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Title *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. iPhone 13 Pro Max 256GB"
                        className="text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be clear and descriptive
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Description *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your item in detail..."
                        className="min-h-[140px] text-base resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include key features, condition details, and reason for selling
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

                <div className='flex items-center w-full gap-2'>
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                        <FormItem className='w-1/2'>
                            <FormLabel className="text-base font-medium">
                            Category *
                            </FormLabel>
                            <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            >
                            <FormControl>
                                <SelectTrigger className="text-base">
                                <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {categories?.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                        <FormItem className='w-1/2'>
                            <FormLabel className="text-base font-medium">
                                Status *
                            </FormLabel>
                            <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            >
                            <FormControl>
                                <SelectTrigger className="text-base">
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {["ACTIVE", "SOLD", "EXPIRED", "REMOVED"].map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </div>

                {/* Pricing */}
                <div className="space-y-6">
                  <div className="border-b border-slate-200 pb-2">
                    <h2 className="text-2xl font-serif font-semibold text-slate-900">
                      Pricing
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            Price (₱) *
                          </FormLabel>
                          <FormControl>
                            <Input
                                id="price"
                                type="text"
                                inputMode="numeric"
                                autoComplete="tel"
                                placeholder="100"
                                {...field}
                                onChange={(e) => {
                                    const v = e.target.value.replace(/\D/g, "");
                                    field.onChange(v);
                                }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                        control={form.control}
                        name="negotiable"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-base font-medium">
                            Is the price negotiable? *
                            </FormLabel>
                            <FormControl>
                            <RadioGroup
                                onValueChange={(value) => field.onChange(value === 'true')}
                                value={field.value ? 'true' : 'false'}
                                className="grid grid-cols-2 gap-4"
                            >
                                <FormItem>
                                <FormControl>
                                    <div className="relative">
                                    <RadioGroupItem
                                        value="true"
                                        id="negotiable-yes"
                                        className="peer sr-only"
                                    />
                                    <label
                                        htmlFor="negotiable-yes"
                                        className="flex items-center justify-center rounded-lg border-2 border-slate-200 bg-white p-1 hover:border-orange-500 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 cursor-pointer transition-all hover:-translate-y-0.5"
                                    >
                                        <span className="text-base font-semibold">Yes</span>
                                    </label>
                                    </div>
                                </FormControl>
                                </FormItem>
                                <FormItem>
                                <FormControl>
                                    <div className="relative">
                                    <RadioGroupItem
                                        value="false"
                                        id="negotiable-no"
                                        className="peer sr-only"
                                    />
                                    <label
                                        htmlFor="negotiable-no"
                                        className="flex items-center justify-center rounded-lg border-2 border-slate-200 bg-white p-1 hover:border-orange-500 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 cursor-pointer transition-all hover:-translate-y-0.5"
                                    >
                                        <span className="text-base font-semibold">No</span>
                                    </label>
                                    </div>
                                </FormControl>
                                </FormItem>
                            </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>
                </div>

            {/* Condition */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-2">
                <h2 className="text-2xl font-serif font-semibold text-slate-900">
                  Condition
                </h2>
              </div>

              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <RadioGroupItem
                                value="NEW"
                                id="condition-new"
                                className="peer sr-only"
                              />
                              <label
                                htmlFor="condition-new"
                                className="flex items-center justify-center rounded-lg border-2 border-slate-200 bg-white p-4 hover:border-orange-500 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 cursor-pointer transition-all hover:-translate-y-0.5"
                              >
                                <span className="text-base font-semibold">New</span>
                              </label>
                            </div>
                          </FormControl>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <RadioGroupItem
                                value="USED"
                                id="condition-used"
                                className="peer sr-only"
                              />
                              <label
                                htmlFor="condition-used"
                                className="flex items-center justify-center rounded-lg border-2 border-slate-200 bg-white p-4 hover:border-orange-500 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 cursor-pointer transition-all hover:-translate-y-0.5"
                              >
                                <span className="text-base font-semibold">Used</span>
                              </label>
                            </div>
                          </FormControl>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Images */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-2">
                <h2 className="text-2xl font-serif font-semibold text-slate-900">
                  Photos
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {totalImages} of 8 images
                </p>
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Current Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((image) => (
                      <div
                        key={image.id}
                        className="relative aspect-square rounded-lg overflow-hidden group"
                      >
                        <img
                          src={image.url}
                          alt="Listing image"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image.id)}
                          className="absolute top-2 right-2 bg-black/70 hover:bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {newImagePreviews.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">New Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {newImagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden group animate-in fade-in zoom-in-95 duration-300"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <img
                          src={preview}
                          alt={`New image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 bg-black/70 hover:bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Area */}
              {totalImages < 8 && (
                <>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-slate-300 bg-slate-50 hover:border-orange-500 hover:bg-orange-50/50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <ImagePlus className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-base font-medium text-slate-700 mb-2">
                      Click or drag photos here
                    </p>
                    <p className="text-sm text-slate-500">
                      Upload up to {8 - totalImages} more images (JPG, PNG, max 5MB each)
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    size="lg"
                    className="text-base"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Listing
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      listing and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="flex flex-1 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1 text-base"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-base"
                >
                  Update Listing
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}