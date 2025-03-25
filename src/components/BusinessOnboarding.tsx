
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { api } from "@/services/api";
import { ArrowLeft, ArrowRight, LightbulbIcon } from "lucide-react";

interface BusinessOnboardingProps {
  onSubmitSuccess: (business: Business) => void;
  userId: string;
}

const BusinessOnboarding = ({ onSubmitSuccess, userId }: BusinessOnboardingProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [businessData, setBusinessData] = useState<Partial<Business>>({
    userId,
    name: "",
    type: "",
    location: "",
    industry: "",
    size: "small" as BusinessSize,
    description: "",
    foundedYear: undefined,
    website: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBusinessData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setBusinessData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = value === "" ? undefined : parseInt(value);
    setBusinessData((prev) => ({ ...prev, [name]: numberValue }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Ensure all required fields are present and non-optional before passing to API
      const requiredBusinessData: Omit<Business, "id" | "createdAt" | "updatedAt"> = {
        userId,
        name: businessData.name || "",
        type: businessData.type || "",
        location: businessData.location || "",
        industry: businessData.industry || "",
        size: businessData.size || "small",
        description: businessData.description || "",
        foundedYear: businessData.foundedYear,
        website: businessData.website || undefined,
        logoUrl: undefined,
      };
      
      const business = await api.createBusiness(requiredBusinessData);
      
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

  const steps = [
    {
      title: "Welcome to Business Assistant",
      content: (
        <div className="space-y-6 py-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to Business Assistant</h1>
            <p className="text-muted-foreground">
              Let's set up your business profile to provide personalized tasks and tips
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <LightbulbIcon className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Personalized Business Insights</h2>
            <p className="text-muted-foreground">
              We'll use your business information to generate tailored tasks and tips to help you succeed
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Basic Information",
      content: (
        <div className="space-y-6 py-4">
          <h2 className="text-2xl font-bold">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <Input
                name="name"
                value={businessData.name || ""}
                onChange={handleInputChange}
                placeholder="Coastal Cafe"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Business Type</label>
              <Input
                name="type"
                value={businessData.type || ""}
                onChange={handleInputChange}
                placeholder="Cafe, Retail Store, Agency..."
                className="w-full"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Location & Industry",
      content: (
        <div className="space-y-6 py-4">
          <h2 className="text-2xl font-bold">Location & Industry</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Where is your business located?</label>
              <Input
                name="location"
                value={businessData.location || ""}
                onChange={handleInputChange}
                placeholder="San Francisco, CA"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <Input
                name="industry"
                value={businessData.industry || ""}
                onChange={handleInputChange}
                placeholder="Food & Beverage, Technology, Retail..."
                className="w-full"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Size & Details",
      content: (
        <div className="space-y-6 py-4">
          <h2 className="text-2xl font-bold">Size & Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Business Size</label>
              <Select
                name="size"
                value={businessData.size || "small"}
                onValueChange={(value) => handleSelectChange("size", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sole_proprietor">Sole Proprietor</SelectItem>
                  <SelectItem value="micro">Micro (1-9 employees)</SelectItem>
                  <SelectItem value="small">Small (10-49 employees)</SelectItem>
                  <SelectItem value="medium">Medium (50-249 employees)</SelectItem>
                  <SelectItem value="large">Large (250-999 employees)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Year Founded</label>
              <Input
                type="number"
                name="foundedYear"
                value={businessData.foundedYear || ""}
                onChange={handleNumberChange}
                placeholder="2020"
                min={1800}
                max={new Date().getFullYear()}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Website (optional)</label>
              <Input
                name="website"
                value={businessData.website || ""}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Description",
      content: (
        <div className="space-y-6 py-4">
          <h2 className="text-2xl font-bold">Business Description</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tell us more about your business</label>
              <Textarea
                name="description"
                value={businessData.description || ""}
                onChange={handleInputChange}
                placeholder="Describe your business, goals, and what makes it unique..."
                className="min-h-[150px] resize-y w-full"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Review & Submit",
      content: (
        <div className="space-y-6 py-4">
          <h2 className="text-2xl font-bold">Review Information</h2>
          <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Business Name:</span>
                <p className="font-medium">{businessData.name || "Not provided"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Business Type:</span>
                <p className="font-medium">{businessData.type || "Not provided"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Location:</span>
                <p className="font-medium">{businessData.location || "Not provided"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Industry:</span>
                <p className="font-medium">{businessData.industry || "Not provided"}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Size:</span>
                <p className="font-medium">{
                  businessData.size === "sole_proprietor" ? "Sole Proprietor" :
                  businessData.size === "micro" ? "Micro (1-9 employees)" :
                  businessData.size === "small" ? "Small (10-49 employees)" :
                  businessData.size === "medium" ? "Medium (50-249 employees)" :
                  businessData.size === "large" ? "Large (250-999 employees)" :
                  businessData.size === "enterprise" ? "Enterprise (1000+ employees)" :
                  "Not provided"
                }</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Founded Year:</span>
                <p className="font-medium">{businessData.foundedYear || "Not provided"}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-muted-foreground">Website:</span>
                <p className="font-medium">{businessData.website || "Not provided"}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-muted-foreground">Description:</span>
                <p className="font-medium">{businessData.description || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative bg-white dark:bg-gray-950 rounded-lg shadow-md overflow-hidden animate-fade-in">
      <div className="relative pb-6">
        {/* Progress indicator */}
        <div className="flex justify-center mb-6 pt-6">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6">{steps[currentStep].content}</div>

        {/* Navigation */}
        <div className="flex justify-between px-6 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={nextStep} className="flex items-center">
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center"
            >
              {isSubmitting ? "Creating..." : "Create Business"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessOnboarding;
