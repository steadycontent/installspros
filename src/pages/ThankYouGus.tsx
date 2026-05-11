import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import StepIndicator from "@/components/StepIndicator";
import { Camera, ImagePlus, Loader2, X } from "lucide-react";
import { trackLead } from "@/lib/analytics/tracker";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import logo from "@/assets/installpros-logo.svg";

interface QuoteData {
  name: string;
  email: string;
  phone: string;
  address: string;
  installationType: string;
  state?: string;
}

const installationTypeLabels: Record<string, string> = {
  residential: "Residential Starlink",
  commercial: "Commercial Starlink",
  marine: "Marine Starlink",
  mobile: "Mobile/RV Starlink"
};

const steps = [
  { number: 1, label: "Check Availability", completed: true },
  { number: 2, label: "Upload Property Photos", completed: false },
  { number: 3, label: "Same-Day Quote", completed: false },
];

const ThankYouGus = () => {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const libraryInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = sessionStorage.getItem("quoteFormData");
    if (stored) {
      const data = JSON.parse(stored) as QuoteData;
      setQuoteData(data);
      // Track this as a lead in analytics
      trackLead(data.installationType || "unknown");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      // Reset input so same file can be re-selected
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  const handleUploadFromLibrary = () => {
    libraryInputRef.current?.click();
  };

  const handleAddMore = () => {
    libraryInputRef.current?.click();
  };

  const handleSubmitPhotos = async () => {
    if (selectedFiles.length === 0 || !quoteData) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];
      const timestamp = Date.now();
      const sanitizedEmail = quoteData.email.replace(/[^a-zA-Z0-9]/g, "_");

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${sanitizedEmail}/${timestamp}_${i}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("property-photos")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Upload error:", error);
          throw new Error(`Failed to upload ${file.name}`);
        }

        const { data: urlData } = supabase.storage
          .from("property-photos")
          .getPublicUrl(data.path);

        uploadedUrls.push(urlData.publicUrl);
        setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 80));
      }

      setUploadProgress(90);
      const { error: webhookError } = await supabase.functions.invoke("forward-photos-webhook", {
        body: {
          email: quoteData.email,
          phone: quoteData.phone,
          photoUrls: uploadedUrls,
        },
      });

      if (webhookError) {
        console.error("Webhook error:", webhookError);
        toast({
          title: "Photos uploaded",
          description: "Your photos were saved. We'll process them shortly.",
        });
      } else {
        toast({
          title: "Photos submitted!",
          description: "We're preparing your same-day quote.",
        });
      }

      setUploadProgress(100);
      
      setTimeout(() => {
        navigate("/same-day-quote");
      }, 500);

    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: "Please try again or text your photos instead.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Get the user's first name for personalization
  const firstName = quoteData?.name?.split(' ')[0] || '';
  const stateName = quoteData?.state || 'your area';
  const installationLabel = installationTypeLabels[quoteData?.installationType || ''] || 'Starlink';

  return (
    <>
      <Helmet>
        <title>Thank You | InstallPros</title>
        <meta name="description" content="Thank you for your quote request. Upload property photos to help us prepare your quote." />
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a] flex flex-col dark">
        {/* White header with standard logo */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-16 sm:h-20">
              <Link to="/">
                <img 
                  src={logo} 
                  alt="InstallPros" 
                  className="h-8 sm:h-10"
                />
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 pt-28 pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            {/* Step Indicator */}
            <div className="mb-12">
              <StepIndicator steps={steps} currentStep={2} variant="dark" />
            </div>

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
              We're Available — Get Your Quote
            </h1>

            {/* Description */}
            <p className="text-base text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
              Upload a few exterior photos to get accurate pricing.
            </p>

            {/* Upload Section */}
            <div className="max-w-xl mx-auto">

              {/* Hidden file inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                multiple
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={libraryInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Primary CTA or Submit */}
              {selectedFiles.length === 0 ? (
                <>
                  {isMobile ? (
                    <>
                      <Button
                        onClick={handleTakePhoto}
                        className="w-full rounded-xl gap-2"
                      >
                        <Camera className="w-5 h-5" />
                        Take Photos
                      </Button>

                      <Button
                        onClick={handleUploadFromLibrary}
                        variant="outline"
                        className="w-full mt-3 gap-2 border-white/30 text-white/70 hover:bg-white/10 hover:text-white"
                      >
                        <ImagePlus className="w-4 h-4" />
                        Upload from Library
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleUploadFromLibrary}
                      className="w-full rounded-xl gap-2"
                    >
                      <ImagePlus className="w-5 h-5" />
                      Upload Photos
                    </Button>
                  )}

                  <p className="text-center text-xs text-muted-foreground mt-3">
                    Takes ~30 seconds
                  </p>
                </>
              ) : (
                <>
                  {/* Photo Thumbnails */}
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-sm font-medium text-primary mb-3">
                      {selectedFiles.length} photo{selectedFiles.length > 1 ? 's' : ''} ready to upload:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg border border-white/10"
                          />
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-black/80 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-destructive transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add more photos link */}
                  <button
                    onClick={handleAddMore}
                    className="w-full mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors py-2"
                  >
                    <ImagePlus className="w-4 h-4" />
                    Add Photos
                  </button>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="mt-4 p-4 bg-primary/10 rounded-xl border border-primary/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {uploadProgress < 80 ? "Uploading photos..." : 
                           uploadProgress < 100 ? "Processing..." : "Complete!"}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  {!isUploading && (
                    <Button 
                      onClick={handleSubmitPhotos}
                      className="w-full mt-4 rounded-xl"
                      disabled={isUploading}
                    >
                      Get My Quote →
                    </Button>
                  )}
                </>
              )}

              {/* Helper Section */}
              <div className="mt-8 p-5 bg-white/5 rounded-xl border border-white/10">
                <h3 className="font-semibold text-white mb-3">What to include:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Front of the house (roof visible)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Install location
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Trees or obstacles
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ThankYouGus;
