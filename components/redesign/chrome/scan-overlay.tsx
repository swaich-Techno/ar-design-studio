"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

type ScanNav = {
  go: (href: string) => void;
};

const Ctx = createContext<ScanNav>({ go: () => {} });

export function useScanNav() {
  return useContext(Ctx);
}

export function ScanOverlay({ children }: { children?: ReactNode }) {
  const router = useRouter();
  const [on, setOn] = useState(false);
  const value = useMemo<ScanNav>(
    () => ({
      go: (href: string) => {
        setOn(true);
        window.setTimeout(() => {
          router.push(href);
          window.setTimeout(() => setOn(false), 280);
        }, 420);
      },
    }),
    [router],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <AnimatePresence>
        {on ? (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[95] grid place-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute h-10 w-10 border border-[var(--accent-2)]"
              initial={{ scale: 0.4, opacity: 0.2 }}
              animate={{ scale: 28, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{
                boxShadow: "0 0 80px rgba(139,124,255,0.35), inset 0 0 40px rgba(139,124,255,0.2)",
              }}
            />
            <motion.div
              className="absolute h-px w-24 bg-[var(--accent-2)]"
              initial={{ scaleX: 0.2, y: -16 }}
              animate={{ scaleX: 8, y: 0 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
