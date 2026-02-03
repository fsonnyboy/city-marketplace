'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, X, ImagePlus } from 'lucide-react';

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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { useCategories, useCreateListing } from '@/lib/hooks';

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
  status: z.enum(['ACTIVE', 'SOLD', 'EXPIRED', 'REMOVED']),
});

type ListingFormValues = z.infer<typeof listingSchema>;


export default function CreateListingPage() {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const { data: categories } = useCategories();
  const { mutateAsync: createListing } = useCreateListing();

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      negotiable: false,
      condition: 'NEW',
      categoryId: '',
      status: 'ACTIVE',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addImages(files);
  };

  const addImages = (files: File[]) => {
    const maxFiles = 8;
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter((file) => {
      if (images.length >= maxFiles) {
        toast.error('Maximum images reached', {
          description: `You can only upload up to ${maxFiles} images`,
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

    const newImages = [...images, ...validFiles].slice(0, maxFiles);
    setImages(newImages);

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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
      await createListing({
        ...data,
        price: parseFloat(data.price),
      });

      toast.success('Listing created!', {
        description: 'Your listing has been published successfully.',
      });

      // Reset form
      form.reset();
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      toast.error('Failed to create listing. Please try again.', {
        description: 'Failed to create listing. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-slate-900 mb-2 tracking-tight">
            Create Listing
          </h1>
          <p className="text-slate-600 text-lg">
            Share what you're selling with our community
          </p>
        </div>

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

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
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
                                    id="new"
                                    className="peer sr-only"
                                  />
                                  <label
                                    htmlFor="new"
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
                                    id="used"
                                    className="peer sr-only"
                                  />
                                  <label
                                    htmlFor="used"
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
                  </div>

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
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <ImagePlus className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-base font-medium text-slate-700 mb-2">
                      Click or drag photos here
                    </p>
                    <p className="text-sm text-slate-500">
                      Upload up to 8 images (JPG, PNG, max 5MB each)
                    </p>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden group animate-in fade-in zoom-in-95 duration-300"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-black/70 hover:bg-orange-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1 text-base"
                    onClick={() => {
                      if (confirm('Are you sure? All changes will be lost.')) {
                        form.reset();
                        setImages([]);
                        setImagePreviews([]);
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-base"
                  >
                    Publish Listing
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}