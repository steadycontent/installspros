import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface UrlParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  utm_agency: string;
  gclid: string;
  fbclid: string;
}

interface UrlParamsContextValue {
  urlParams: UrlParams;
}

const defaultParams: UrlParams = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
  utm_agency: "",
  gclid: "",
  fbclid: "",
};

const STORAGE_KEY = "installpros_url_params";

const UrlParamsContext = createContext<UrlParamsContextValue | undefined>(undefined);

export const UrlParamsProvider = ({ children }: { children: ReactNode }) => {
  const [urlParams, setUrlParams] = useState<UrlParams>(defaultParams);

  useEffect(() => {
    // Try to load from sessionStorage first
    const storedParams = sessionStorage.getItem(STORAGE_KEY);
    let params: UrlParams = storedParams ? JSON.parse(storedParams) : { ...defaultParams };

    // Check current URL for parameters
    const searchParams = new URLSearchParams(window.location.search);
    
    const paramKeys: (keyof UrlParams)[] = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "utm_agency",
      "gclid",
      "fbclid",
    ];

    // Aliases: maps URL param names (case-insensitive) onto canonical keys.
    const aliases: Record<keyof UrlParams, string[]> = {
      utm_source: ["utm_source"],
      utm_medium: ["utm_medium"],
      utm_campaign: ["utm_campaign"],
      utm_term: ["utm_term"],
      utm_content: ["utm_content"],
      utm_agency: ["utm_agency", "agencyid", "agency_id", "agency"],
      gclid: ["gclid"],
      fbclid: ["fbclid"],
    };

    // Case-insensitive lookup of the actual URL params.
    const lowerLookup = new Map<string, string>();
    searchParams.forEach((value, key) => {
      if (value && !lowerLookup.has(key.toLowerCase())) {
        lowerLookup.set(key.toLowerCase(), value);
      }
    });

    let hasNewParams = false;
    paramKeys.forEach((key) => {
      for (const alias of aliases[key]) {
        const value = lowerLookup.get(alias.toLowerCase());
        if (value) {
          params[key] = value;
          hasNewParams = true;
          break;
        }
      }
    });

    // Only update storage if we found new params in URL
    if (hasNewParams) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
      console.log("URL params captured:", params);
    }

    setUrlParams(params);
  }, []);

  return (
    <UrlParamsContext.Provider value={{ urlParams }}>
      {children}
    </UrlParamsContext.Provider>
  );
};

export const useUrlParams = (): UrlParams => {
  const context = useContext(UrlParamsContext);
  if (!context) {
    // Return defaults if used outside provider (graceful fallback)
    return defaultParams;
  }
  return context.urlParams;
};
