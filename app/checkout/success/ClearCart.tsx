"use client";

// Empties the local cart once Stripe has confirmed payment.

import { useEffect } from "react";
import { useCart } from "@/lib/cart";

export default function ClearCart() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
