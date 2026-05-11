import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PlacePrediction, PlaceDetails } from "./types";

export const useAddressAutocomplete = () => {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const sessionTokenRef = useRef<string>(crypto.randomUUID());
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchPredictions = useCallback(async (input: string) => {
    if (!input || input.length < 3) {
      setPredictions([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!supabase) { setIsAvailable(false); return; }
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("google-places-autocomplete", {
          body: { input, sessionToken: sessionTokenRef.current },
        });
        if (error) { setIsAvailable(false); setPredictions([]); return; }
        setPredictions(data?.predictions || []);
      } catch { setIsAvailable(false); setPredictions([]); }
      finally { setIsLoading(false); }
    }, 300);
  }, []);

  const fetchPlaceDetails = useCallback(async (placeId: string): Promise<PlaceDetails | null> => {
    if (!supabase) return null;
    setIsFetchingDetails(true);
    try {
      const { data, error } = await supabase.functions.invoke("google-places-autocomplete", {
        body: { placeId, sessionToken: sessionTokenRef.current },
      });
      if (error) return null;
      return data?.placeDetails || null;
    } catch { return null; }
    finally { setIsFetchingDetails(false); }
  }, []);

  const clearPredictions = useCallback(() => {
    setPredictions([]);
    sessionTokenRef.current = crypto.randomUUID();
  }, []);

  return { predictions, isLoading, isFetchingDetails, isAvailable, fetchPredictions, fetchPlaceDetails, clearPredictions };
};
