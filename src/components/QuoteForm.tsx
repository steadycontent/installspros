import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { MapPin, User, Mail, Phone, Wrench, Loader2 } from "lucide-react";

const noHtmlChars = (val: string) => !/<|>/.test(val);
const quoteFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters")
    .refine(noHtmlChars, "Name contains invalid characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(10, "Please enter a valid phone number").max(20, "Phone number is too long"),
  address: z.string().trim().min(5, "Please enter a valid address").max(500, "Address is too long"),
  installationType: z.string().min(1, "Please select an installation type"),
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;

const installationTypes = [
  { value: "residential", label: "Residential Starlink Installation" },
  { value: "commercial", label: "Commercial Starlink Installation" },
  { value: "marine", label: "Marine Starlink Installation" },
  { value: "mobile", label: "Mobile/RV Starlink Installation" },
];

interface QuoteFormProps {
  className?: string;
}

const QuoteForm = ({ className }: QuoteFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      installationType: "",
    },
  });

  const installationType = watch("installationType");

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    
    try {
      // Store form data in sessionStorage for the thank-you page
      sessionStorage.setItem("quoteFormData", JSON.stringify(data));
      
      // Simulate API call (will be replaced with actual webhook when backend is connected)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Quote Request Submitted!",
        description: "We'll be in touch shortly to discuss your installation.",
      });
      
      navigate("/thank-you");
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <div className="space-y-5">
        {/* Address Field with Icon */}
        <div className="space-y-2">
          <Label htmlFor="address" className="text-gray-700 font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Installation Address
          </Label>
          <Input
            id="address"
            placeholder="Enter your address"
            className="h-12 border-gray-200 focus:border-primary focus:ring-primary"
            data-hj-allow
            {...register("address")}
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address.message}</p>
          )}
          <p className="text-xs text-gray-500">
            Google Places autocomplete will be enabled when API is connected
          </p>
        </div>

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700 font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="John Smith"
            className="h-12 border-gray-200 focus:border-primary focus:ring-primary"
            data-hj-allow
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            className="h-12 border-gray-200 focus:border-primary focus:ring-primary"
            data-hj-allow
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-700 font-medium flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            className="h-12 border-gray-200 focus:border-primary focus:ring-primary"
            data-hj-allow
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Installation Type Select */}
        <div className="space-y-2">
          <Label htmlFor="installationType" className="text-gray-700 font-medium flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" />
            Installation Type
          </Label>
          <Select
            value={installationType}
            onValueChange={(value) => setValue("installationType", value, { shouldValidate: true })}
          >
            <SelectTrigger className="h-12 border-gray-200 focus:border-primary focus:ring-primary">
              <SelectValue placeholder="Select installation type" />
            </SelectTrigger>
            <SelectContent>
              {installationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.installationType && (
            <p className="text-sm text-red-500">{errors.installationType.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="gradient"
          size="lg"
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Get Your Free Quote"
          )}
        </Button>
      </div>
    </form>
  );
};

export default QuoteForm;
