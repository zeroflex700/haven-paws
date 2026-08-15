import { NextResponse } from "next/server";

const GOOGLE_PLACES_URL =
  "https://places.googleapis.com/v1/places:autocomplete";

type RequestBody =
  | {
      action: "suggest";
      input: string;
      sessionToken: string;
    }
  | {
      action: "details";
      placeId: string;
      sessionToken: string;
    };

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error("GOOGLE_MAPS_API_KEY is not configured");

      return NextResponse.json(
        { error: "Address autocomplete is not configured." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as RequestBody;

    if (body.action === "suggest") {
      const input = body.input?.trim();

      if (!input || input.length < 3) {
        return NextResponse.json({ suggestions: [] });
      }

      if (!body.sessionToken) {
        return NextResponse.json(
          { error: "Missing session token." },
          { status: 400 }
        );
      }

      const response = await fetch(GOOGLE_PLACES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.placeId," +
            "suggestions.placePrediction.text.text," +
            "suggestions.placePrediction.structuredFormat.mainText.text," +
            "suggestions.placePrediction.structuredFormat.secondaryText.text",
        },
        body: JSON.stringify({
          input,
          sessionToken: body.sessionToken,

          // Haven Paws is currently collecting US addresses.
          includedRegionCodes: ["us"],

          // Keep suggestions focused on actual addresses.
          includedPrimaryTypes: [
            "street_address",
            "premise",
            "subpremise",
          ],
        }),
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Google Autocomplete error:", data);

        return NextResponse.json(
          { error: "Unable to search addresses." },
          { status: 502 }
        );
      }

      const suggestions =
        data.suggestions
          ?.filter(
            (item: {
              placePrediction?: unknown;
            }) => item.placePrediction
          )
          .map(
            (item: {
              placePrediction: {
                placeId?: string;
                text?: {
                  text?: string;
                };
                structuredFormat?: {
                  mainText?: {
                    text?: string;
                  };
                  secondaryText?: {
                    text?: string;
                  };
                };
              };
            }) => ({
              placeId: item.placePrediction.placeId,
              text: item.placePrediction.text?.text ?? "",
              mainText:
                item.placePrediction.structuredFormat?.mainText?.text ??
                "",
              secondaryText:
                item.placePrediction.structuredFormat?.secondaryText?.text ??
                "",
            })
          ) ?? [];

      return NextResponse.json({ suggestions });
    }

    if (body.action === "details") {
      if (!body.placeId || !body.sessionToken) {
        return NextResponse.json(
          { error: "Missing place ID or session token." },
          { status: 400 }
        );
      }

      const placeId = encodeURIComponent(body.placeId);

      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?sessionToken=${encodeURIComponent(
          body.sessionToken
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask":
              "formattedAddress,postalAddress,addressComponents",
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Google Place Details error:", data);

        return NextResponse.json(
          { error: "Unable to retrieve the selected address." },
          { status: 502 }
        );
      }

      const postalAddress = data.postalAddress ?? {};

      const components = Array.isArray(data.addressComponents)
        ? data.addressComponents
        : [];

      function getComponent(types: string[]) {
        const component = components.find(
          (item: {
            types?: string[];
          }) =>
            Array.isArray(item.types) &&
            item.types.some((type: string) => types.includes(type))
        );

        return component?.longText ?? "";
      }

      const streetNumber = getComponent(["street_number"]);
      const route = getComponent(["route"]);

      const address =
        postalAddress.addressLines?.[0] ||
        [streetNumber, route].filter(Boolean).join(" ") ||
        "";

      const city =
        postalAddress.locality ||
        getComponent(["locality", "postal_town", "sublocality"]) ||
        "";

      const state =
        postalAddress.administrativeArea ||
        getComponent(["administrative_area_level_1"]) ||
        "";

      const zip =
        postalAddress.postalCode ||
        getComponent(["postal_code"]) ||
        "";

      return NextResponse.json({
        address,
        city,
        state,
        zip,
        formattedAddress: data.formattedAddress ?? "",
      });
    }

    return NextResponse.json(
      { error: "Invalid autocomplete action." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Address autocomplete error:", error);

    return NextResponse.json(
      { error: "Address autocomplete failed." },
      { status: 500 }
    );
  }
}