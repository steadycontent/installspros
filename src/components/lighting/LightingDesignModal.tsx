import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Camera, Sparkles, DollarSign, User, CheckCircle2, Loader2, Upload, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useAddressAutocomplete } from "./useAddressAutocomplete";
import LightingCanvas from "./LightingCanvas";
import type { DesignStep, AddressData, LightConfig, PropertyData, PlacePrediction } from "./types";
import { PRICING, HOLIDAY_PRESETS } from "./types";

/* ---- validation ---- */
const noHtml = (v: string) => !/<|>/.test(v);
const schemas = {
  name: z.string().trim().min(2).max(100).refine(noHtml),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(10).max(20),
};
const formatPhone = (v: string): string => {
  const d = v.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

/* ---- styles ---- */
const S = {
  bg: "#1a1a1e",
  surface: "#222226",
  accent: "#3b82f6",
  accentGlow: "rgba(59,130,246,0.25)",
  text: "#f1f5f9",
  muted: "#94a3b8",
  border: "rgba(255,255,255,0.08)",
};

const stepMeta: { icon: typeof MapPin; label: string }[] = [
  { icon: MapPin, label: "Address" },
  { icon: Camera, label: "Upload" },
  { icon: Sparkles, label: "Preview" },
  { icon: DollarSign, label: "Estimate" },
  { icon: User, label: "Details" },
  { icon: CheckCircle2, label: "Confirmed" },
];

/* ---- compress helper ---- */
const compressImage = (file: File, maxW = 1920, quality = 0.8): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const c = document.createElement("canvas");
      c.width = img.width * scale;
      c.height = img.height * scale;
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("compress failed"))), "image/jpeg", quality);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });

/* ==================================================================== */
interface Props { open: boolean; onClose: () => void }

const LightingDesignModal = ({ open, onClose }: Props) => {
  const [step, setStep] = useState<DesignStep>(1);
  const [address, setAddress] = useState<AddressData | null>(null);
  const [addressInput, setAddressInput] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [streetViewLoading, setStreetViewLoading] = useState(false);
  const [streetViewUrl, setStreetViewUrl] = useState<string | null>(null);
  const [lightConfig, setLightConfig] = useState<LightConfig>({ segments: [], spacingInches: 4, colorPreset: "warm-white" });
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [propertyFallback, setPropertyFallback] = useState(false);
  const [manualStories, setManualStories] = useState(1);
  const [manualSqft, setManualSqft] = useState<string>("medium");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [wantsRender, setWantsRender] = useState(false);
  const [wantsBundle, setWantsBundle] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const [foregroundMaskUrl, setForegroundMaskUrl] = useState<string | null>(null);
  const [generatingMask, setGeneratingMask] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const { predictions, isLoading: addrLoading, fetchPredictions, fetchPlaceDetails, clearPredictions } = useAddressAutocomplete();

  // Lock body scroll
  if (typeof document !== "undefined") {
    document.body.style.overflow = open ? "hidden" : "";
  }

  /* ---- address handlers ---- */
  const handleAddressInput = (v: string) => {
    setAddressInput(v);
    setAddress(null);
    fetchPredictions(v);
    setShowPredictions(true);
  };
  const handleAddressSelect = async (p: PlacePrediction) => {
    setShowPredictions(false);
    clearPredictions();
    const details = await fetchPlaceDetails(p.placeId);
    if (details) {
      const addr = { street: details.street, city: details.city, state: details.state, zip: details.zip, fullAddress: details.formattedAddress };
      setAddress(addr);
      setAddressInput(details.formattedAddress);
      
      // Auto-fetch Street View + property lookup in parallel
      setStreetViewLoading(true);
      
      // Street View fetch
      supabase?.functions.invoke("google-places-autocomplete", {
        body: { streetViewAddress: details.formattedAddress },
      }).then(({ data }) => {
        if (data?.available && data?.imageUrl) {
          setStreetViewUrl(data.imageUrl);
          setPhotoUrl(data.imageUrl);
          setGeneratingMask(true);
          supabase?.functions.invoke("generate-depth-mask", {
            body: { imageUrl: data.imageUrl },
          }).then(({ data: maskData }) => {
            if (maskData?.maskUrl) setForegroundMaskUrl(maskData.maskUrl);
          }).catch(() => {}).finally(() => setGeneratingMask(false));
        }
      }).catch((e) => {
        console.warn("Street View fetch failed (non-critical):", e);
      }).finally(() => {
        setStreetViewLoading(false);
      });

      // Property lookup (for footage calibration)
      supabase?.functions.invoke("property-lookup", {
        body: { address: details.formattedAddress },
      }).then(({ data, error }) => {
        if (!error && data && !data.fallback) {
          setPropertyData(data);
          if (data.stories) setManualStories(data.stories);
        } else {
          setPropertyFallback(true);
        }
      }).catch(() => setPropertyFallback(true));
    }
  };

  /* ---- photo upload ---- */
  const handleFileSelect = async (files: FileList | null) => {
    if (!files?.length || !supabase) return;
    setUploading(true);
    try {
      const blob = await compressImage(files[0]);
      const path = `lighting/${crypto.randomUUID()}.jpg`;
      const { error } = await supabase.storage.from("property-photos").upload(path, blob, { contentType: "image/jpeg" });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("property-photos").getPublicUrl(path);
      const publicUrl = urlData.publicUrl;
      setPhotoUrl(publicUrl);
      
      // Generate foreground mask in background
      setGeneratingMask(true);
      supabase.functions.invoke("generate-depth-mask", {
        body: { imageUrl: publicUrl },
      }).then(({ data }) => {
        if (data?.maskUrl) setForegroundMaskUrl(data.maskUrl);
      }).catch((e) => {
        console.warn("Mask generation failed (non-critical):", e);
      }).finally(() => {
        setGeneratingMask(false);
      });
      
      setTimeout(() => setStep(3), 1500);
    } catch (e) {
      console.error("Upload error:", e);
    } finally {
      setUploading(false);
    }
  };

  /* ---- property lookup ---- */
  const lookupProperty = async () => {
    if (!address || !supabase) { setPropertyFallback(true); return; }
    try {
      const { data, error } = await supabase.functions.invoke("property-lookup", {
        body: { address: address.fullAddress },
      });
      if (error || data?.fallback) { setPropertyFallback(true); return; }
      setPropertyData(data);
      if (data.stories) setManualStories(data.stories);
    } catch { setPropertyFallback(true); }
  };

  /* ---- estimated home frontage from property data ---- */
  const getEstimatedHomeWidthFt = (): number | undefined => {
    const sqft = propertyData?.squareFootage;
    const stories = propertyData?.stories || manualStories;
    if (!sqft) {
      // Use manual size selection as fallback
      const sqftMap: Record<string, number> = { small: 1200, medium: 2000, large: 3200, xlarge: 5000 };
      const estSqft = sqftMap[manualSqft] || 2000;
      return Math.sqrt(estSqft / stories) * 1.3; // frontage ≈ sqrt(floor area) * aspect ratio
    }
    const floorArea = sqft / stories;
    return Math.sqrt(floorArea) * 1.3; // ~1.3 for typical rectangular home (wider than deep)
  };

  /* ---- estimate calculation ---- */
  const calcEstimate = () => {
    const homeWidthFt = getEstimatedHomeWidthFt() || 50;
    const imageWidthFt = homeWidthFt / 0.6; // home is ~60% of image

    // Linear feet from canvas config using calibrated width
    const totalFeet = Math.max(lightConfig.segments.reduce((acc, seg) => {
      const dx = seg.x2 - seg.x1;
      const dy = seg.y2 - seg.y1;
      const normLen = Math.sqrt(dx * dx + dy * dy);
      return acc + normLen * imageWidthFt;
    }, 0), 20);

    const stories = propertyData?.stories || manualStories;
    const storyMult = PRICING.storyMultiplier[stories] || 1.0;
    
    // Sqft complexity
    let complexity = 1.0;
    if (propertyData?.squareFootage) {
      if (propertyData.squareFootage > 3000) complexity = 1.1;
      if (propertyData.squareFootage > 5000) complexity = 1.2;
    } else {
      if (manualSqft === "large") complexity = 1.1;
      if (manualSqft === "xlarge") complexity = 1.2;
    }

    const base = PRICING.basePerFoot * totalFeet * storyMult * complexity;
    return {
      low: Math.round(base * (1 - PRICING.variancePercent) / 100) * 100,
      high: Math.round(base * (1 + PRICING.variancePercent) / 100) * 100,
      feet: Math.round(totalFeet),
    };
  };

  /* ---- submit lead ---- */
  const handleSubmit = async () => {
    const errs: Record<string, string> = {};
    if (!schemas.name.safeParse(name).success) errs.name = "Please enter your name";
    if (!schemas.email.safeParse(email).success) errs.email = "Please enter a valid email";
    if (!schemas.phone.safeParse(phone.replace(/\D/g, "")).success) errs.phone = "Please enter a valid phone";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    const est = calcEstimate();
    try {
      await supabase?.functions.invoke("forward-lighting-lead", {
        body: {
          street: address?.street, city: address?.city, state: address?.state, zip: address?.zip,
          full_address: address?.fullAddress,
          photo_urls: photoUrl ? [photoUrl] : [],
          light_config: lightConfig,
          property_data: propertyData,
          estimated_linear_feet: est.feet,
          estimated_range_low: est.low,
          estimated_range_high: est.high,
          name, email, phone: phone.replace(/\D/g, ""),
          preferred_timeframe: timeframe,
          wants_nighttime_render: wantsRender,
          wants_starlink_bundle: wantsBundle,
        },
      });
      setStep(6);
    } catch (e) {
      console.error("Submit error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- step navigation ---- */
  const canAdvance = (): boolean => {
    switch (step) {
      case 1: return !!address;
      case 2: return !!photoUrl;
      case 3: return lightConfig.segments.length > 0;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const nextStep = () => {
    if (step === 1 && address) { setStep(2); return; }
    if (step === 3) { lookupProperty(); setStep(4); return; }
    if (step === 5) { handleSubmit(); return; }
    if (step < 6) setStep((step + 1) as DesignStep);
  };

  if (!open) return null;

  const est = step >= 4 ? calcEstimate() : null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full h-full md:w-[95vw] md:h-[92vh] md:max-w-5xl md:rounded-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: S.bg }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: S.border }}>
          <div>
            <h2 className="text-lg font-bold" style={{ color: S.text }}>Lighting Design Studio</h2>
            <p className="text-xs" style={{ color: S.muted }}>Step {step} of 6</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" style={{ color: S.muted }} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 px-5 py-3">
          {stepMeta.map((sm, i) => {
            const stepNum = i + 1;
            const active = stepNum <= step;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-1 rounded-full transition-colors" style={{ backgroundColor: active ? S.accent : S.border }} />
                <span className="text-[10px] hidden sm:block" style={{ color: active ? S.text : S.muted }}>{sm.label}</span>
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

              {/* STEP 1: Address */}
              {step === 1 && (
                <div className="max-w-md mx-auto space-y-6">
                  <div className="text-center space-y-2">
                    <MapPin className="h-10 w-10 mx-auto" style={{ color: S.accent }} />
                    <h3 className="text-2xl font-bold" style={{ color: S.text }}>Enter Your Address</h3>
                    <p className="text-sm" style={{ color: S.muted }}>Used to verify service availability and assist with installation planning.</p>
                  </div>
                  <div className="relative">
                    <Input
                      value={addressInput}
                      onChange={(e) => handleAddressInput(e.target.value)}
                      placeholder="123 Main St, City, State"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                      data-1p-ignore
                    />
                    {addrLoading && <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-blue-400" />}
                    {showPredictions && predictions.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden shadow-2xl" style={{ backgroundColor: S.surface, border: `1px solid ${S.border}` }}>
                        {predictions.map((p) => (
                          <button
                            key={p.placeId}
                            onClick={() => handleAddressSelect(p)}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b last:border-b-0"
                            style={{ borderColor: S.border }}
                          >
                            <p className="text-sm font-medium" style={{ color: S.text }}>{p.mainText}</p>
                            <p className="text-xs" style={{ color: S.muted }}>{p.secondaryText}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {address && (
                    <div className="rounded-xl p-4 text-center" style={{ backgroundColor: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
                      <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-blue-400" />
                      <p className="text-sm" style={{ color: S.text }}>{address.street}</p>
                      <p className="text-xs" style={{ color: S.muted }}>{address.city}, {address.state} {address.zip}</p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Photo Upload */}
              {step === 2 && (
                <div className="max-w-md mx-auto space-y-6">
                  <div className="text-center space-y-2">
                    <Camera className="h-10 w-10 mx-auto" style={{ color: S.accent }} />
                    <h3 className="text-2xl font-bold" style={{ color: S.text }}>
                      {streetViewUrl && photoUrl === streetViewUrl ? "We Found Your Home" : "Upload a Clear Front Photo of Your Home"}
                    </h3>
                    <p className="text-sm" style={{ color: S.muted }}>
                      {streetViewUrl && photoUrl === streetViewUrl
                        ? "This image was pulled from Google Street View. You can use it or upload your own photo for better results."
                        : "For best results, upload a daytime image with the full roofline visible."}
                    </p>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileSelect(e.target.files)} />
                  
                  {uploading ? (
                    <div className="flex flex-col items-center gap-3 py-12">
                      <Loader2 className="h-10 w-10 animate-spin text-blue-400" />
                      <p className="text-sm animate-pulse" style={{ color: S.text }}>Designing Your Lighting Preview…</p>
                    </div>
                  ) : streetViewLoading ? (
                    <div className="flex flex-col items-center gap-3 py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                      <p className="text-sm animate-pulse" style={{ color: S.muted }}>Finding your home on Google Street View…</p>
                    </div>
                  ) : photoUrl ? (
                    <div className="space-y-3">
                      <div className="rounded-xl overflow-hidden">
                        <img src={photoUrl} alt="Your home" className="w-full max-h-64 object-cover" />
                      </div>
                      {streetViewUrl && photoUrl === streetViewUrl && (
                        <p className="text-xs text-center" style={{ color: S.muted }}>
                          📍 Google Street View — image may not be current
                        </p>
                      )}
                      <button
                        onClick={() => fileRef.current?.click()}
                        className="w-full py-3 rounded-xl border flex items-center justify-center gap-2 transition-colors hover:bg-white/5"
                        style={{ borderColor: S.border }}
                      >
                        <Upload className="h-4 w-4" style={{ color: S.accent }} />
                        <span className="text-sm" style={{ color: S.text }}>
                          {streetViewUrl && photoUrl === streetViewUrl ? "Upload My Own Photo Instead" : "Replace Photo"}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="w-full py-16 rounded-2xl border-2 border-dashed flex flex-col items-center gap-3 transition-colors hover:bg-white/5"
                      style={{ borderColor: "rgba(59,130,246,0.3)" }}
                    >
                      <Upload className="h-10 w-10" style={{ color: S.accent }} />
                      <p className="text-sm" style={{ color: S.text }}>Tap to upload or take a photo</p>
                      <p className="text-xs" style={{ color: S.muted }}>JPG, PNG — max 10MB</p>
                    </button>
                  )}
                </div>
              )}

              {/* STEP 3: Light Editor */}
              {step === 3 && photoUrl && (
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold" style={{ color: S.text }}>Design Your Lighting</h3>
                    <p className="text-sm" style={{ color: S.muted }}>Draw lines along your roofline to place lights. Adjust spacing and pick a holiday preset.</p>
                  </div>
                  {generatingMask && (
                    <p className="text-xs text-center animate-pulse" style={{ color: S.accent }}>✨ AI is analyzing your photo for depth layering…</p>
                  )}
                  <LightingCanvas imageUrl={photoUrl} config={lightConfig} onConfigChange={setLightConfig} foregroundMaskUrl={foregroundMaskUrl} estimatedHomeWidthFt={getEstimatedHomeWidthFt()} />
                </div>
              )}

              {/* STEP 4: Estimate */}
              {step === 4 && est && (
                <div className="max-w-md mx-auto space-y-6">
                  <div className="text-center space-y-2">
                    <DollarSign className="h-10 w-10 mx-auto" style={{ color: S.accent }} />
                    <h3 className="text-2xl font-bold" style={{ color: S.text }}>Estimated Installation Investment</h3>
                  </div>

                  {/* Fallback: manual property input */}
                  {propertyFallback && (
                    <div className="space-y-3 rounded-xl p-4" style={{ backgroundColor: S.surface, border: `1px solid ${S.border}` }}>
                      <p className="text-sm" style={{ color: S.muted }}>Help us refine your estimate:</p>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="text-xs mb-1 block" style={{ color: S.muted }}>Stories</label>
                          <select value={manualStories} onChange={(e) => setManualStories(Number(e.target.value))} className="w-full rounded-lg px-3 py-2 text-sm bg-white/5 border border-white/10 text-white">
                            <option value={1}>1 Story</option>
                            <option value={2}>2 Stories</option>
                            <option value={3}>3 Stories</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="text-xs mb-1 block" style={{ color: S.muted }}>Home Size</label>
                          <select value={manualSqft} onChange={(e) => setManualSqft(e.target.value)} className="w-full rounded-lg px-3 py-2 text-sm bg-white/5 border border-white/10 text-white">
                            <option value="small">Under 2,000 sqft</option>
                            <option value="medium">2,000 – 3,000 sqft</option>
                            <option value="large">3,000 – 5,000 sqft</option>
                            <option value="xlarge">Over 5,000 sqft</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-center py-8 rounded-2xl" style={{ backgroundColor: S.surface, border: `1px solid ${S.border}`, boxShadow: `0 0 40px ${S.accentGlow}` }}>
                    <p className="text-4xl md:text-5xl font-bold" style={{ color: S.text }}>
                      ${est.low.toLocaleString()} – ${est.high.toLocaleString()}
                    </p>
                    <p className="text-sm mt-2" style={{ color: S.muted }}>{est.feet} linear feet estimated</p>
                    <p className="text-xs mt-3" style={{ color: S.muted }}>Final pricing confirmed after design review.</p>
                  </div>
                </div>
              )}

              {/* STEP 5: Lead Capture */}
              {step === 5 && (
                <div className="max-w-md mx-auto space-y-6">
                  <div className="text-center space-y-2">
                    <User className="h-10 w-10 mx-auto" style={{ color: S.accent }} />
                    <h3 className="text-2xl font-bold" style={{ color: S.text }}>Unlock My Detailed Quote</h3>
                    <p className="text-sm" style={{ color: S.muted }}>No obligation. Your custom lighting design is saved.</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Input
                        value={name} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                        placeholder="Full Name"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                        data-1p-ignore
                      />
                      {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <Input
                        value={email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                        placeholder="Email"
                        type="email"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                        data-1p-ignore
                      />
                      {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <Input
                        value={phone} onChange={(e) => { setPhone(formatPhone(e.target.value)); setErrors((p) => ({ ...p, phone: "" })); }}
                        placeholder="Phone"
                        type="tel"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12"
                        data-1p-ignore
                      />
                      {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <select
                        value={timeframe} onChange={(e) => setTimeframe(e.target.value)}
                        className="w-full rounded-lg px-3 py-3 text-sm bg-white/5 border border-white/10 text-white"
                      >
                        <option value="">Preferred timeframe (optional)</option>
                        <option value="asap">ASAP</option>
                        <option value="1-2-months">1-2 months</option>
                        <option value="3-6-months">3-6 months</option>
                        <option value="exploring">Just exploring</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Confirmation */}
              {step === 6 && (
                <div className="max-w-md mx-auto space-y-6 text-center">
                  <CheckCircle2 className="h-14 w-14 mx-auto text-green-400" />
                  <h3 className="text-2xl font-bold" style={{ color: S.text }}>Your Custom Lighting Design Is Saved</h3>
                  <p className="text-sm" style={{ color: S.muted }}>We'll reach out within 24 hours with your detailed proposal.</p>

                  {photoUrl && (
                    <div className="rounded-xl overflow-hidden">
                      <LightingCanvas imageUrl={photoUrl} config={lightConfig} onConfigChange={() => {}} readOnly foregroundMaskUrl={foregroundMaskUrl} estimatedHomeWidthFt={getEstimatedHomeWidthFt()} />
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button
                      className="w-full h-12 rounded-full text-white"
                      style={{ background: `linear-gradient(135deg, ${S.accent}, #8b5cf6)` }}
                      onClick={() => window.open("/schedule-call", "_self")}
                    >
                      Schedule 10-Minute Design Consultation
                    </Button>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setWantsRender(!wantsRender)}
                        className={`flex-1 rounded-xl p-3 text-sm transition-all ${wantsRender ? "bg-blue-500/20 ring-1 ring-blue-400/50" : "bg-white/5 hover:bg-white/10"}`}
                        style={{ color: S.text }}
                      >
                        🌙 Request Nighttime Render
                      </button>
                      <button
                        onClick={() => setWantsBundle(!wantsBundle)}
                        className={`flex-1 rounded-xl p-3 text-sm transition-all ${wantsBundle ? "bg-blue-500/20 ring-1 ring-blue-400/50" : "bg-white/5 hover:bg-white/10"}`}
                        style={{ color: S.text }}
                      >
                        📡 Bundle with Starlink
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        {step < 6 && (
          <div className="px-5 py-4 flex justify-between items-center border-t" style={{ borderColor: S.border }}>
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep((step - 1) as DesignStep)} className="text-white/60 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            ) : <div />}
            <Button
              disabled={!canAdvance() || submitting}
              onClick={nextStep}
              className="rounded-full px-6 h-11 text-white disabled:opacity-40"
              style={{ background: canAdvance() ? `linear-gradient(135deg, ${S.accent}, #8b5cf6)` : undefined }}
            >
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {step === 5 ? "Lock In My Quote" : step === 4 ? "Unlock My Detailed Quote" : step === 3 ? "See Estimated Investment" : "Continue"}
              {!submitting && step < 5 && <ArrowRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LightingDesignModal;
