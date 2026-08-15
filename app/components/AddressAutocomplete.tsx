"use client";

import { useEffect, useRef, useState } from "react";

type AddressResult = {
  address: string;
  city: string;
  state: string;
  zip: string;
};

type Suggestion = {
  placeId: string;
  text: string;
  mainText: string;
  secondaryText: string;
};

export default function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: AddressResult) => void;
  className: string;
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const sessionTokenRef = useRef<string>(crypto.randomUUID());
  const requestIdRef = useRef(0);

  useEffect(() => {
    const input = value.trim();

    if (input.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const requestId = ++requestIdRef.current;

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/address-autocomplete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "suggest",
            input,
            sessionToken: sessionTokenRef.current,
          }),
        });

        if (requestId !== requestIdRef.current) return;

        const data = await response.json();

        if (!response.ok) {
          setSuggestions([]);
          setShowSuggestions(false);
          return;
        }

        setSuggestions(data.suggestions ?? []);
        setShowSuggestions((data.suggestions ?? []).length > 0);
      } catch {
        if (requestId !== requestIdRef.current) return;

        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [value]);

  async function selectSuggestion(suggestion: Suggestion) {
    try {
      setLoading(true);
      setShowSuggestions(false);

      const response = await fetch("/api/address-autocomplete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "details",
          placeId: suggestion.placeId,
          sessionToken: sessionTokenRef.current,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        onChange(suggestion.text);
        return;
      }

      onChange(data.address || suggestion.text);

      onAddressSelect({
        address: data.address || suggestion.text,
        city: data.city || "",
        state: data.state || "",
        zip: data.zip || "",
      });

      // A session token can only be used once.
      // Start a fresh session for any future typing.
      sessionTokenRef.current = crypto.randomUUID();
    } catch {
      onChange(suggestion.text);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <input
        placeholder="Address"
        aria-label="Street address"
        autoComplete="off"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        onBlur={() => {
          // Give the suggestion button time to receive the tap.
          window.setTimeout(() => {
            setShowSuggestions(false);
          }, 200);
        }}
        className={className}
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-[100] mt-1 overflow-hidden rounded-md border border-sage/30 bg-white shadow-lg">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.placeId}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectSuggestion(suggestion)}
              className="block w-full border-b border-sage/10 px-3 py-3 text-left last:border-b-0 hover:bg-cream-alt active:bg-cream-alt"
            >
              <span className="block text-sm font-medium text-forest">
                {suggestion.mainText || suggestion.text}
              </span>

              {suggestion.secondaryText && (
                <span className="mt-0.5 block text-xs text-ink/60">
                  {suggestion.secondaryText}
                </span>
              )}
            </button>
          ))}

          <div className="border-t border-sage/10 bg-white px-3 py-2 text-right">
            <span className="text-[10px] text-ink/50">
              Powered by Google
            </span>
          </div>
        </div>
      )}

      {loading && value.trim().length >= 3 && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-sage">
          Searching…
        </span>
      )}
    </div>
  );
}