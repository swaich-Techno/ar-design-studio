"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, type ReactNode } from "react";
import { bindLocalPointer } from "@/lib/redesign/pointer";
import { prefersReducedMotion } from "@/lib/redesign/runtime";
import { useNearViewport } from "@/lib/redesign/use-near-viewport";
import { ArBreakoutFallback, MaterialiseFallback } from "@/components/redesign/3d/fallbacks";

const MaterialiseCanvas = dynamic(
  () => import("@/components/redesign/main/capability-gl").then((m) => m.MaterialiseCanvas),
  { ssr: false, loading: () => <MaterialiseFallback /> },
);

const ArBreakoutCanvas = dynamic(
  () => import("@/components/redesign/main/capability-gl").then((m) => m.ArBreakoutCanvas),
  { ssr: false, loading: () => <ArBreakoutFallback /> },
);

const FOOD = "/redesign/campaigns/food-ar.webp";
const LAVA = "/redesign/demo/signature-molten-lava-cake.png";

function LocalRig({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return bindLocalPointer(el, prefersReducedMotion());
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

function CampaignDeck() {
  return (
    <LocalRig className="cap-deck" data-cursor="grow">
      <div className="cap-deck__stage">
        <article className="cap-panel cap-panel--1">
          <img src={LAVA} alt="" />
          <div className="cap-panel__meta">
            <p>B SOCIO CONCEPT 01</p>
            <h4>FOOD AR</h4>
            <span>DROP 01</span>
          </div>
        </article>
        <article className="cap-panel cap-panel--2">
          <img src={FOOD} alt="" />
          <div className="cap-panel__meta">
            <p>TABLE 04</p>
            <h4>RESTAURANT</h4>
            <span>TASTE FIRST</span>
          </div>
        </article>
        <article className="cap-panel cap-panel--3">
          <div className="cap-panel__type">
            <p>LAUNCH 03</p>
            <h4>ORBIT SERIES</h4>
            <span>PRODUCT DROP</span>
          </div>
        </article>
        <article className="cap-panel cap-panel--4">
          <img src={FOOD} alt="" />
          <div className="cap-panel__reel">
            <span>REEL</span>
            <b>00:15</b>
          </div>
        </article>
        <article className="cap-panel cap-panel--5">
          <div className="cap-panel__type cap-panel__type--led">
            <p>CONCEPT</p>
            <h4>BE EXPERIENCED</h4>
            <span>B SOCIO</span>
          </div>
        </article>
      </div>
    </LocalRig>
  );
}

function LivingBrowser() {
  return (
    <LocalRig className="cap-browser" data-cursor="grow">
      <div className="cap-browser__frame">
        <div className="cap-browser__bar">
          <span className="cap-browser__dot" />
          <span className="cap-browser__dot" />
          <span className="cap-browser__dot" />
          <div className="cap-browser__url">ar.bsocio.in / lava-cake</div>
        </div>
        <div className="cap-browser__page">
          <div className="cap-browser__scroll">
            <div className="cap-browser__hero">
              <img src={LAVA} alt="" />
              <div className="cap-browser__thumb">3D</div>
            </div>
            <div className="cap-browser__chips">
              <span>LIVE</span>
              <span>AR READY</span>
              <span>ENQUIRE</span>
            </div>
            <div className="cap-browser__row">
              <div>
                <p>Lava Cake</p>
                <small>Warm fondant · molten centre</small>
              </div>
              <button type="button" className="cap-browser__cta" tabIndex={-1}>
                See on My Table
              </button>
            </div>
            <div className="cap-browser__float">
              <img src={FOOD} alt="" />
              <span>Inspect</span>
            </div>
          </div>
        </div>
        <span className="cap-browser__pointer" />
      </div>
    </LocalRig>
  );
}

function GlCard({ kind }: { kind: "three" | "ar" }) {
  const [ref, near] = useNearViewport("220px");
  return (
    <div ref={ref} className="absolute inset-0">
      {near ? kind === "three" ? <MaterialiseCanvas /> : <ArBreakoutCanvas /> : kind === "three" ? (
        <MaterialiseFallback />
      ) : (
        <ArBreakoutFallback />
      )}
      {kind === "ar" ? (
        <div className="cap-ar__hud">
          <span>VIEW IN 3D</span>
          <span>AR READY</span>
          <span>SCAN</span>
          <span>ENQUIRE</span>
        </div>
      ) : null}
    </div>
  );
}

export function CreativeScene({ kind }: { kind: string }) {
  if (kind === "creative") return <CampaignDeck />;
  if (kind === "digital") return <LivingBrowser />;
  return <GlCard kind={kind === "three" ? "three" : "ar"} />;
}
