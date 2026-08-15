"use client";

import { useEffect, useRef, useState } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (GOOGLE_MAPS_API_KEY) {
  setOptions({
    key: GOOGLE_MAPS_API_KEY,
    v: "weekly",
  });
}

type AddressParts = {
  address: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
};

type AddressAutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: AddressParts) => void;
  className?: string;
};

export default function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  className = "",
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  const requestIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function loadGooglePlaces() {
      if (!GOOGLE_MAPS_API_KEY) {
        console.error(
          "Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"
        );
        return;
      }

      try {
        const { AutocompleteSessionToken } =
          await importLibrary("places");

        if (cancelled) return;

        sessionTokenRef.current =
          new AutocompleteSessionToken();

        setGoogleReady(true);
      } catch (error) {
        console.error(
          "Failed to load Google Places:",
          error
        );
      }
    }

    void loadGooglePlaces();

    return () => {
      cancelled = true;
    };
  }, []);

  async function fetchSuggestions(input: string) {
    if (!googleReady || !input.trim()) {
      setSuggestions([]);
      return;
    }

    if (!sessionTokenRef.current) {
      const { AutocompleteSessionToken } =
        await importLibrary("places");

      sessionTokenRef.current =
        new AutocompleteSessionToken();
    }

    const currentRequestId = ++requestIdRef.current;

    setLoading(true);

    try {
      const { AutocompleteSuggestion } =
        await importLibrary("places");

      const request: google.maps.places.AutocompleteRequest =
        {
          input,
          sessionToken: sessionTokenRef.current,
          includedRegionCodes: ["us"],
          includedPrimaryTypes: ["street_address"],
          language: "en-US",
          region: "us",
        };

      const { suggestions } =
        await AutocompleteSuggestion.fetchAutocompleteSuggestions(
          request
        );

      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      setSuggestions(suggestions);
    } catch (error) {
      console.error(
        "Address autocomplete failed:",
        error
      );

      if (currentRequestId === requestIdRef.current) {
        setSuggestions([]);
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }

  function getComponent(
    components: google.maps.places.AddressComponent[] | undefined,
    type: string
  ) {
    return components?.find((component) =>
      component.types.includes(type)
    );
  }

  async function selectSuggestion(
    suggestion: google.maps.places.AutocompleteSuggestion
  ) {
    const prediction = suggestion.placePrediction;

    if (!prediction) return;

    try {
      setLoading(true);
      setSuggestions([]);

      const place = prediction.toPlace();

      await place.fetchFields({
        fields: ["addressComponents"],
      });

      const components = place.addressComponents;

      if (!components) {
        return;
      }

      const streetNumber =
        getComponent(
          components,
          "street_number"
        )?.longText ?? "";

      const route =
        getComponent(
          components,
          "route"
        )?.longText ?? "";

      let address = [streetNumber, route]
        .filter(Boolean)
        .join(" ");

      /*
       * Some addresses may not return a separate
       * street_number/route combination, so fall back
       * to the selected prediction text.
       */
      if (!address) {
        address = prediction.text.toString();
      }

      const city =
        getComponent(
          components,
          "locality"
        )?.longText ??
        getComponent(
          components,
          "postal_town"
        )?.longText ??
        getComponent(
          components,
          "sublocality_level_1"
        )?.longText ??
        "";

      const state =
        getComponent(
          components,
          "administrative_area_level_1"
        )?.shortText ?? "";

      const postalCode =
        getComponent(
          components,
          "postal_code"
        )?.longText ?? "";

      const postalSuffix =
        getComponent(
          components,
          "postal_code_suffix"
        )?.longText ?? "";

      const zip = postalSuffix
        ? `${postalCode}-${postalSuffix}`
        : postalCode;

      const apt =
        getComponent(
          components,
          "subpremise"
        )?.longText ?? "";

      onChange(address);

      onAddressSelect({
        address,
        apt,
        city,
        state,
        zip,
      });

      /*
       * A completed autocomplete selection ends the
       * current session. Create a fresh token for
       * the next address search.
       */
      const { AutocompleteSessionToken } =
        await importLibrary("places");

      sessionTokenRef.current =
        new AutocompleteSessionToken();
    } catch (error) {
      console.error(
        "Failed to select address:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative mb-3">
      <input
        ref={inputRef}
        placeholder="Address"
        aria-label="Street address"
        autoComplete="off"
        value={value}
        onChange={(event) => {
          const nextValue = event.target.value;

          onChange(nextValue);

          void fetchSuggestions(nextValue);
        }}
        onFocus={() => {
          if (value.trim()) {
            void fetchSuggestions(value);
          }
        }}
        onBlur={() => {
          /*
           * Delay hiding the suggestions so a tap/click
           * on a suggestion can finish first.
           */
          window.setTimeout(() => {
            setSuggestions([]);
          }, 200);
        }}
        className={`w-full border border-sage/30 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-gold ${className}`}
      />

      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-sage/30 border-t-forest rounded-full animate-spin" />
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 overflow-hidden rounded-md border border-sage/20 bg-white shadow-lg">
          {suggestions.map((suggestion, index) => {
            const prediction =
              suggestion.placePrediction;

            if (!prediction) return null;

            return (
              <button
                key={`${prediction.placeId}-${index}`}
                type="button"
                className="block w-full px-3 py-3 text-left text-sm hover:bg-cream-alt border-b border-sage/10 last:border-b-0"
                onMouseDown={(event) => {
                  /*
                   * Prevent the input's blur event from
                   * firing before the selection completes.
                   */
                  event.preventDefault();
                }}
                onClick={() => {
                  void selectSuggestion(suggestion);
                }}
              >
                <span className="block text-forest font-medium">
                  {prediction.mainText?.text}
                </span>

                {prediction.secondaryText?.text && (
                  <span className="block text-xs text-ink/60 mt-0.5">
                    {prediction.secondaryText.text}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <p className="text-[10px] text-ink/40 mt-1">
        Powered by Google
      </p>
    </div>
  );
}