type ImportedMedia = {
  url: string;
  mediaType: "image" | "video";
};

const IMAGE_EXTENSIONS =
  /\.(jpg|jpeg|png|webp|gif|avif)(?:[?#].*)?$/i;

const VIDEO_EXTENSIONS =
  /\.(mp4|webm|mov|m4v|m3u8)(?:[?#].*)?$/i;

function isProbablyImage(
  url: string
): boolean {
  return IMAGE_EXTENSIONS.test(
    url
  );
}

function isProbablyVideo(
  url: string
): boolean {
  return VIDEO_EXTENSIONS.test(
    url
  );
}

function normalizeUrl(
  value: string,
  pageUrl: string
): string | null {
  if (!value) {
    return null;
  }

  let cleaned =
    value.trim();

  // Ignore things that clearly aren't
  // normal URLs.
  if (
    cleaned.startsWith(
      "data:"
    ) ||
    cleaned.startsWith(
      "blob:"
    ) ||
    cleaned.startsWith(
      "javascript:"
    )
  ) {
    return null;
  }

  // Decode common HTML escaping.
  cleaned =
    cleaned
      .replace(
        /&amp;/g,
        "&"
      )
      .replace(
        /&quot;/g,
        '"'
      )
      .replace(
        /&#x27;/g,
        "'"
      );

  try {
    const absolute =
      new URL(
        cleaned,
        pageUrl
      );

    if (
      absolute.protocol !==
        "http:" &&
      absolute.protocol !==
        "https:"
    ) {
      return null;
    }

    return absolute.toString();
  } catch {
    return null;
  }
}

function addCandidate(
  candidates: Map<
    string,
    ImportedMedia
  >,
  value: string,
  pageUrl: string,
  forcedType?: "image" | "video"
) {
  const url =
    normalizeUrl(
      value,
      pageUrl
    );

  if (!url) {
    return;
  }

  let mediaType =
    forcedType;

  if (!mediaType) {
    if (
      isProbablyVideo(url)
    ) {
      mediaType =
        "video";
    } else if (
      isProbablyImage(url)
    ) {
      mediaType =
        "image";
    }
  }

  if (!mediaType) {
    return;
  }

  candidates.set(
    url,
    {
      url,
      mediaType,
    }
  );
}

function extractAttributeUrls(
  html: string,
  pageUrl: string,
  candidates: Map<
    string,
    ImportedMedia
  >
) {
  // src="..."
  const srcRegex =
    /\b(?:src|data-src|data-original|data-lazy-src)\s*=\s*["']([^"']+)["']/gi;

  let match: RegExpExecArray | null;

  while (
    (match =
      srcRegex.exec(
        html
      ))
  ) {
    addCandidate(
      candidates,
      match[1],
      pageUrl
    );
  }

  // poster="..." is normally an image.
  const posterRegex =
    /\bposter\s*=\s*["']([^"']+)["']/gi;

  while (
    (match =
      posterRegex.exec(
        html
      ))
  ) {
    addCandidate(
      candidates,
      match[1],
      pageUrl,
      "image"
    );
  }

  // href="..." can contain video files.
  const hrefRegex =
    /\bhref\s*=\s*["']([^"']+)["']/gi;

  while (
    (match =
      hrefRegex.exec(
        html
      ))
  ) {
    addCandidate(
      candidates,
      match[1],
      pageUrl
    );
  }
}

function extractSrcSets(
  html: string,
  pageUrl: string,
  candidates: Map<
    string,
    ImportedMedia
  >
) {
  const srcSetRegex =
    /\b(?:srcset|data-srcset)\s*=\s*["']([^"']+)["']/gi;

  let match: RegExpExecArray | null;

  while (
    (match =
      srcSetRegex.exec(
        html
      ))
  ) {
    const values =
      match[1]
        .split(",")
        .map(
          (part) =>
            part.trim().split(
              /\s+/
            )[0]
        );

    for (const value of values) {
      addCandidate(
        candidates,
        value,
        pageUrl
      );
    }
  }
}

function extractOpenGraph(
  html: string,
  pageUrl: string,
  candidates: Map<
    string,
    ImportedMedia
  >
) {
  const metaRegex =
    /<meta\b[^>]*\b(?:property|name)\s*=\s*["']([^"']+)["'][^>]*\bcontent\s*=\s*["']([^"']+)["'][^>]*>/gi;

  let match: RegExpExecArray | null;

  while (
    (match =
      metaRegex.exec(
        html
      ))
  ) {
    const key =
      match[1].toLowerCase();

    const value =
      match[2];

    if (
      key ===
        "og:image" ||
      key ===
        "twitter:image"
    ) {
      addCandidate(
        candidates,
        value,
        pageUrl,
        "image"
      );
    }

    if (
      key ===
        "og:video" ||
      key ===
        "og:video:url" ||
      key ===
        "og:video:secure_url"
    ) {
      addCandidate(
        candidates,
        value,
        pageUrl,
        "video"
      );
    }
  }
}

function extractJsonLd(
  html: string,
  pageUrl: string,
  candidates: Map<
    string,
    ImportedMedia
  >
) {
  const scriptRegex =
    /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

  let match: RegExpExecArray | null;

  while (
    (match =
      scriptRegex.exec(
        html
      ))
  ) {
    const raw =
      match[1].trim();

    try {
      const parsed =
        JSON.parse(
          raw
        );

      walkJson(
        parsed,
        pageUrl,
        candidates
      );
    } catch {
      // Some websites contain invalid JSON-LD.
      // Ignore it and continue with other extraction.
    }
  }
}

function walkJson(
  value: unknown,
  pageUrl: string,
  candidates: Map<
    string,
    ImportedMedia
  >
) {
  if (
    typeof value ===
    "string"
  ) {
    if (
      isProbablyImage(
        value
      )
    ) {
      addCandidate(
        candidates,
        value,
        pageUrl,
        "image"
      );
    }

    if (
      isProbablyVideo(
        value
      )
    ) {
      addCandidate(
        candidates,
        value,
        pageUrl,
        "video"
      );
    }

    return;
  }

  if (
    Array.isArray(value)
  ) {
    for (const item of value) {
      walkJson(
        item,
        pageUrl,
        candidates
      );
    }

    return;
  }

  if (
    value &&
    typeof value ===
      "object"
  ) {
    for (const [
      key,
      child,
    ] of Object.entries(
      value
    )) {
      if (
        typeof child ===
        "string"
      ) {
        const lowerKey =
          key.toLowerCase();

        if (
          lowerKey.includes(
            "image"
          ) ||
          lowerKey.includes(
            "photo"
          )
        ) {
          addCandidate(
            candidates,
            child,
            pageUrl,
            "image"
          );
        } else if (
          lowerKey.includes(
            "video"
          ) ||
          lowerKey.includes(
            "media"
          )
        ) {
          addCandidate(
            candidates,
            child,
            pageUrl
          );
        } else {
          walkJson(
            child,
            pageUrl,
            candidates
          );
        }
      } else {
        walkJson(
          child,
          pageUrl,
          candidates
        );
      }
    }
  }
}

function extractRawMediaUrls(
  html: string,
  pageUrl: string,
  candidates: Map<
    string,
    ImportedMedia
  >
) {
  // This catches absolute media URLs
  // embedded inside JavaScript objects,
  // serialized state, etc.
  const urlRegex =
    /https?:\/\/[^"'\\\s<>]+/gi;

  let match: RegExpExecArray | null;

  while (
    (match =
      urlRegex.exec(
        html
      ))
  ) {
    const value =
      match[0]
        .replace(
          /\\u0026/g,
          "&"
        )
        .replace(
          /\\\//g,
          "/"
        );

    addCandidate(
      candidates,
      value,
      pageUrl
    );
  }
}

function removeTracking(
  url: string
): string {
  try {
    const parsed =
      new URL(url);

    // Don't remove query strings wholesale,
    // because some CDN URLs require them.
    // Only remove obvious tracking parameters.
    const trackingPrefixes = [
      "utm_",
      "fbclid",
      "gclid",
    ];

    for (const key of Array.from(
      parsed.searchParams.keys()
    )) {
      if (
        trackingPrefixes.some(
          (prefix) =>
            key === prefix ||
            key.startsWith(
              prefix
            )
        )
      ) {
        parsed.searchParams.delete(
          key
        );
      }
    }

    return parsed.toString();
  } catch {
    return url;
  }
}

function deduplicate(
  media: ImportedMedia[]
): ImportedMedia[] {
  const seen =
    new Set<string>();

  const result: ImportedMedia[] =
    [];

  for (const item of media) {
    const normalized =
      removeTracking(
        item.url
      );

    if (
      seen.has(
        normalized
      )
    ) {
      continue;
    }

    seen.add(
      normalized
    );

    result.push({
      ...item,
      url: normalized,
    });
  }

  return result;
}

export async function importMediaFromPage(
  pageUrl: string
): Promise<
  ImportedMedia[]
> {
  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () =>
        controller.abort(),
      15_000
    );

  try {
    const response =
      await fetch(
        pageUrl,
        {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; HavenPawsMediaImporter/1.0)",
            Accept:
              "text/html,application/xhtml+xml",
          },
          redirect:
            "follow",
          cache:
            "no-store",
          signal:
            controller.signal,
        }
      );

    if (!response.ok) {
      throw new Error(
        `The website returned HTTP ${response.status}.`
      );
    }

    const contentType =
      response.headers.get(
        "content-type"
      ) ?? "";

    if (
      !contentType.includes(
        "text/html"
      ) &&
      !contentType.includes(
        "application/xhtml+xml"
      )
    ) {
      throw new Error(
        "That URL did not return a webpage."
      );
    }

    const html =
      await response.text();

    const candidates =
      new Map<
        string,
        ImportedMedia
      >();

    extractAttributeUrls(
      html,
      pageUrl,
      candidates
    );

    extractSrcSets(
      html,
      pageUrl,
      candidates
    );

    extractOpenGraph(
      html,
      pageUrl,
      candidates
    );

    extractJsonLd(
      html,
      pageUrl,
      candidates
    );

    extractRawMediaUrls(
      html,
      pageUrl,
      candidates
    );

    return deduplicate(
      Array.from(
        candidates.values()
      )
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.name ===
        "AbortError"
    ) {
      throw new Error(
        "The website took too long to respond."
      );
    }

    throw new Error(
      error instanceof Error
        ? error.message
        : "Could not fetch that website."
    );
  } finally {
    clearTimeout(
      timeout
    );
  }
}