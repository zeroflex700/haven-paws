"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/lib/hooks/useRecentlyViewed";

export default function RecordPuppyView({
  id,
  name,
  image,
}: {
  id: string;
  name: string;
  image: string | null;
}) {
  const { addItem } = useRecentlyViewed();

  useEffect(() => {
    addItem({ id, type: "puppy", name, image, href: `/puppies/${id}` });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return null;
}