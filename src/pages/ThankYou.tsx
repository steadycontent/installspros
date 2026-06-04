import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import StepIndicator from "@/components/StepIndicator";
import { Camera, Upload, MessageSquare, Send, Loader2, X, Clock } from "lucide-react";
import { trackLead } from "@/lib/analytics/tracker";
import { fireGoogleAdsConversion } from "@/lib/googleAds";
import { setBingUetUserData } from "@/lib/bingUet";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/installpros-logo.svg";

interface QuoteData {
  name: string;
  email: string;
  phone: string;
  address: string;
  installationType: string;
}

const steps = [
{ number: 1, label: "Check Availability", completed: true },
{ number: 2, label: "Upload Property Photos", completed: false },
{ number: 3, label: "Same-Day Quote", completed: false }];


const ThankYou = () => {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = sessionStorage.getItem("quoteFormData");
    if (stored) {
      const data = JSON.parse(stored) as QuoteData;
      setQuoteData(data);
      // Track this as a lead in analytics
      trackLead(data.installationType || "unknown");
    }
    // Fallback Google Ads conversion fire (deduped per-session via sessionStorage).
    fireGoogleAdsConversion();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmitPhotos = async () => {
    if (selectedFiles.length === 0 || !quoteData) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];
      const timestamp = Date.now();
      const sanitizedEmail = quoteData.email.replace(/[^a-zA-Z0-9]/g, "_");

      // Upload each file to Supabase Storage
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${sanitizedEmail}/${timestamp}_${i}.${fileExt}`;

        const { data, error } = await supabase.storage.
        from("property-photos").
        upload(fileName, file, {
          cacheControl: "3600",
          upsert: false
        });

        if (error) {
          console.error("Upload error:", error);
          throw new Error(`Failed to upload ${file.name}`);
        }

        // Get the public URL
        const { data: urlData } = supabase.storage.
        from("property-photos").
        getPublicUrl(data.path);

        uploadedUrls.push(urlData.publicUrl);
        setUploadProgress(Math.round((i + 1) / selectedFiles.length * 80));
      }

      // Forward photo URLs to Fix9
      setUploadProgress(90);
      const { error: webhookError } = await supabase.functions.invoke("forward-photos-webhook", {
        body: {
          email: quoteData.email,
          phone: quoteData.phone,
          photoUrls: uploadedUrls
        }
      });

      if (webhookError) {
        console.error("Webhook error:", webhookError);
        // Don't fail the whole process if webhook fails - photos are still uploaded
        toast({
          title: "Photos uploaded",
          description: "Your photos were saved. We'll process them shortly."
        });
      } else {
        toast({
          title: "Photos submitted!",
          description: "We're preparing your same-day quote."
        });
      }

      setUploadProgress(100);

      // Navigate after brief delay to show completion
      setTimeout(() => {
        navigate("/same-day-quote");
      }, 500);

    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: "Please try again or text your photos instead.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Get the user's first name for personalization
  const firstName = quoteData?.name?.split(' ')[0] || '';

  // Build SMS deep link with context
  const smsBody = encodeURIComponent(
    `Hi, I'd like to send photos for my satellite internet quote${quoteData?.address ? ` at ${quoteData.address}` : ''}.`
  );

  return (
    <>
      <Helmet>
        <title>Thank You | InstallPros</title>
        <meta name="description" content="Thank you for your quote request. Upload property photos to help us prepare your quote." />
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        {/* White header with standard logo */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-16 sm:h-20">
              <Link to="/">
                <img
                  src={logo}
                  alt="InstallPros"
                  className="h-8 sm:h-10" />
                
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 pt-28 pb-20 px-6 my-[39px] py-[53px]">
          <div className="max-w-3xl mx-auto">
            {/* Step Indicator */}
            <div className="mb-12">
              <StepIndicator steps={steps} currentStep={2} variant="dark" />
            </div>

            {/* Personalized Heading */}
            <h1 className="text-3xl md:text-4xl text-white mb-2 text-center font-normal">
              {firstName ? `Thanks ${firstName}!` : 'Thank You!'}
            </h1>
            
            {/* Personalized Subtitle */}
            <p className="text-lg text-primary font-medium text-center mb-4">
              We're preparing your quote.
            </p>

            {/* Description */}
            <p className="text-base text-gray-400 text-center mb-8 max-w-2xl mx-auto hyphens-none">Please send a few exterior photos of your property via SMS or email.
            </p>

            {/* Send Your Photos Section */}
            <div className="max-w-xl mx-auto">
              {/* Urgency Messaging */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <p className="text-sm text-amber-200 font-medium">
                    Upload before 3pm CT for same-day quote
                  </p>
                </div>
              </div>

              

              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-white" />
                <h2 className="text-lg text-white font-medium">Send us a few exterior photos</h2>
              </div>

              {/* Mobile: Text Photos Button */}
              <div className="md:hidden">
                <a
                  href={`sms:+15127102043?body=${smsBody}`}
                  className="flex items-center justify-center gap-3 w-full bg-[#1d9bf0] text-white py-4 px-6 rounded-xl text-lg hover:bg-[#1a8cd8] transition-colors font-sans font-medium">
                  <MessageSquare className="w-5 h-5" />
                  Text us your photos
                </a>
                <p className="text-sm text-gray-500 text-center mt-3">
                  Tap to open your messaging app
                </p>
              </div>

              {/* Desktop: Upload Box */}
              <div className="hidden md:block">
                <div
                  onClick={handleUploadClick}
                  className="border-2 border-dashed border-white/20 rounded-xl p-8 cursor-pointer hover:border-white/40 transition-colors bg-white/5">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-lg">Upload Photos</p>
                        <p className="text-sm text-gray-400">Click to select photos from your phone or device.</p>
                      </div>
                    </div>
                    <div className="w-24 h-20 rounded-lg bg-white/8 border border-white/15 flex items-center justify-center flex-shrink-0">
                      <svg width="48" height="38" viewBox="0 0 48 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="46" height="36" rx="3" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                        <circle cx="16" cy="14" r="4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.3" fill="none" />
                        <path d="M5 30 L16 19 L24 27 L32 17 L43 30" stroke="rgba(255,255,255,0.35)" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden" />
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 &&
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm font-medium text-gray-300 mb-3">
                      {selectedFiles.length} file(s) selected:
                    </p>
                    <ul className="space-y-2">
                      {selectedFiles.map((file, index) =>
                    <li key={index} className="flex items-center justify-between text-sm text-gray-300 bg-white/5 px-3 py-2 rounded border border-white/10">
                          <span className="truncate flex-1 mr-2">{file.name}</span>
                          <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        className="text-gray-500 hover:text-gray-300 p-1">
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                    )}
                    </ul>
                  </div>
                }

                {/* Upload Progress */}
                {isUploading &&
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="text-sm font-medium text-gray-300">
                        {uploadProgress < 80 ? "Uploading photos..." :
                      uploadProgress < 100 ? "Processing..." : "Complete!"}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                }

                {/* Submit Button */}
                {selectedFiles.length > 0 && !isUploading &&
                <Button
                  onClick={handleSubmitPhotos}
                  className="w-full mt-4 py-6 text-lg"
                  disabled={isUploading}>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Photos
                  </Button>
                }
              </div>
            </div>

              {/* Skip Option */}
              <Link
              to="/same-day-quote"
              className="text-sm text-gray-500 underline underline-offset-2 mt-6 block text-center min-h-[44px] flex items-center justify-center">
                Skip for now
              </Link>

          </div>
        </main>

        <Footer />
      </div>
    </>);

};

export default ThankYou;