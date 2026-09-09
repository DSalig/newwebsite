"use client";

// Client-side cart: React context persisted to localStorage.
// Prices are looked up from the catalog at render/checkout time —
// the stored shape is only { slug, qty, subscribe }, so a stale
// cart can never pin an old price.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FLAT_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  getProduct,
} from "@/lib/products";

export interface CartLine {
  slug: string;
  qty: number;
  subscribe: boolean;
}

interface CartState {
  lines: CartLine[];
  count: number;
  subtotal: number; // cents
  shipping: number; // cents
  total: number; // cents
  add: (slug: string, qty?: number, subscribe?: boolean) => void;
  remove: (slug: string, subscribe: boolean) => void;
  setQty: (slug: string, subscribe: boolean, qty: number) => void;
  clear: () => void;
  hasIngestible: boolean;
  hasSubscription: boolean;
  /** Live price for a line (cents): console-edited value when the
   *  backend is connected, file-catalog price otherwise. */
  unitPrice: (slug: string, subscribe: boolean) => number;
}

interface CatalogOverride {
  price: number;
  subscribePrice: number;
  stock: number;
  active: boolean;
}

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = "pepthea-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, CatalogOverride>>({});

  // Live pricing from the merged catalog; on any failure the file
  // catalog bundled with the client keeps everything working.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data === "object") setOverrides(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: CartLine[] = JSON.parse(raw);
        // Drop lines whose product no longer exists in the catalog.
        setLines(parsed.filter((l) => getProduct(l.slug) && l.qty > 0));
      }
    } catch {
      // corrupted storage — start fresh
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage full/blocked — cart still works in-memory
    }
  }, [lines, hydrated]);

  const add = useCallback((slug: string, qty = 1, subscribe = false) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.slug === slug && l.subscribe === subscribe);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: Math.min(next[i].qty + qty, 20) };
        return next;
      }
      return [...prev, { slug, qty, subscribe }];
    });
  }, []);

  const remove = useCallback((slug: string, subscribe: boolean) => {
    setLines((prev) => prev.filter((l) => !(l.slug === slug && l.subscribe === subscribe)));
  }, []);

  const setQty = useCallback((slug: string, subscribe: boolean, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => !(l.slug === slug && l.subscribe === subscribe))
        : prev.map((l) =>
            l.slug === slug && l.subscribe === subscribe ? { ...l, qty: Math.min(qty, 20) } : l
          )
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartState>(() => {
    const unitPrice = (slug: string, subscribe: boolean): number => {
      const o = overrides[slug];
      if (o) return subscribe ? o.subscribePrice : o.price;
      const prod = getProduct(slug);
      return prod ? (subscribe ? prod.subscribePrice : prod.price) : 0;
    };
    let subtotal = 0;
    let count = 0;
    let hasIngestible = false;
    let hasSubscription = false;
    for (const l of lines) {
      const prod = getProduct(l.slug);
      if (!prod) continue;
      subtotal += unitPrice(l.slug, l.subscribe) * l.qty;
      count += l.qty;
      if (prod.ingestible) hasIngestible = true;
      if (l.subscribe) hasSubscription = true;
    }
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
    return {
      lines,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      add,
      remove,
      setQty,
      clear,
      hasIngestible,
      hasSubscription,
      unitPrice,
    };
  }, [lines, overrides, add, remove, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
