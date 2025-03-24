
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Business, BusinessSize } from "@/types/database";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/services/api";

const businessFormSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  type: z.string().min(2, "Business type must be at least 2 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  size: z.enum(["sole_proprietor", "micro", "small", "medium", "large", "enterprise"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  foundedYear: z.coerce.number().int().min(1800).max(new Date().getFullYear()).optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type BusinessFormValues = z.infer<typeof businessFormSchema>;

interface BusinessFormProps {
  onSubmitSuccess: (business: Business) => void;
  userId: string;
}

const BusinessForm = ({ onSubmitSuccess, userId }: BusinessFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: "",
      type: "",
      location: "",
      industry: "",
      size: "small" as BusinessSize,
      description: "",
      foundedYear: undefined,
      website: "",
    },
  });

  const onSubmit = async (data: BusinessFormValues) => {
    setIsSubmitting(true);
    try {
      // Ensure all required fields are present and non-optional before passing to API
      const businessData: Omit<Business, "id" | "createdAt" | "updatedAt"> = {
        userId,
        name: data.name,
        type: data.type,
        location: data.location,
        industry: data.industry,
        size: data.size,
        description: data.description,
        foundedYear: data.foundedYear,
        website: data.website || undefined,
        logoUrl: undefined,
      };
      
      const business = await api.createBusiness(businessData);
      
      toast({
        title: "Business created!",
        description: "Your business information has been saved.",
      });
      
      onSubmitSuccess(business);
    } catch (error) {
      toast({
        title: "Failed to create business",
        description: "There was an error saving your business information.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input placeholder="Coastal Cafe" {...field} className="transition-all" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Type</FormLabel>
                <FormControl>
                  <Input placeholder="Cafe, Retail Store, Agency..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="San Francisco, CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input placeholder="Food & Beverage" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Size</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sole_proprietor">Sole Proprietor</SelectItem>
                    <SelectItem value="micro">Micro (1-9 employees)</SelectItem>
                    <SelectItem value="small">Small (10-49 employees)</SelectItem>
                    <SelectItem value="medium">Medium (50-249 employees)</SelectItem>
                    <SelectItem value="large">Large (250-999 employees)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="foundedYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year Founded</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="2020" 
                    {...field} 
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : parseInt(e.target.value);
                      field.onChange(value);
                    }}
                    min={1800}
                    max={new Date().getFullYear()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com" 
                    {...field} 
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Business Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your business..." 
                    {...field} 
                    className="min-h-[120px] resize-y"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto transition-all">
            {isSubmitting ? "Saving..." : "Save Business Information"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BusinessForm;
