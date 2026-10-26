export function ArExplainerFallback() {
  return (
    <div className="ar-explainer-fallback" aria-hidden>
      <div className="ar-ex-glow" />
      <div className="ar-ex-table" />
      <div className="ar-ex-tray">
        <div className="ar-ex-grid" />
        <div className="ar-ex-reticle" />
        <div className="ar-ex-scanline" />
        <div className="ar-ex-qr" />
        <div className="ar-ex-ring" />
        <div className="ar-ex-plate" />
        <span className="ar-ex-dot d1" />
        <span className="ar-ex-dot d2" />
        <span className="ar-ex-dot d3" />
        <span className="ar-ex-dot d4" />
      </div>
      <div className="ar-ex-phone">
        <div className="ar-ex-screen">
          <div className="ar-ex-hud-line" />
          <div className="ar-ex-hud-product" />
        </div>
      </div>
    </div>
  );
}

export function OrbitFallback() {
  return <ArExplainerFallback />;
}

export function PortalFallback() {
  return <ArExplainerFallback />;
}

export function JewelFallback() {
  return (
    <div className="jewel-fallback" aria-hidden>
      <div className="jewel-spot" />
      <div className="jewel-ring" />
      <div className="jewel-gem" />
    </div>
  );
}

export function FoodFallback() {
  return (
    <div className="food-fallback" aria-hidden>
      <div className="food-table" />
      <div className="food-plate" />
      <div className="food-dish" />
    </div>
  );
}

export function MaterialiseFallback() {
  return (
    <div className="cap-mat" aria-hidden>
      <div className="cap-mat__glow" />
      <img className="cap-mat__still" src="/redesign/campaigns/food-ar.webp" alt="" />
      <div className="cap-mat__ring cap-mat__ring--wire" />
      <div className="cap-mat__ring cap-mat__ring--clay" />
      <div className="cap-mat__ring cap-mat__ring--chrome" />
      <div className="cap-mat__gem" />
      <div className="cap-mat__scan" />
    </div>
  );
}

export function ArBreakoutFallback() {
  return (
    <div className="cap-ar" aria-hidden>
      <div className="cap-ar__grid" />
      <div className="cap-ar__phone">
        <div className="cap-ar__screen">
          <img className="cap-ar__ui" src="/redesign/campaigns/food-ar.webp" alt="" />
          <div className="cap-ar__chips">
            <span>VIEW IN 3D</span>
            <span>AR READY</span>
          </div>
        </div>
      </div>
      <div className="cap-ar__emerge cap-ar__emerge--jewel">
        <img src="/redesign/demo/signature-molten-lava-cake.png" alt="" />
      </div>
      <div className="cap-ar__emerge cap-ar__emerge--food">
        <img src="/redesign/campaigns/food-ar.webp" alt="" />
      </div>
      <div className="cap-ar__labels">
        <span>SCAN</span>
        <span>ENQUIRE</span>
      </div>
      <span className="cap-ar__wa" />
    </div>
  );
}

export function ExperienceCoreFallback() {
  return (
    <div className="xcore-fallback" aria-hidden>
      <div className="xcore-fallback__orb" />
      <div className="xcore-fallback__ribbon xcore-fallback__ribbon--a" />
      <div className="xcore-fallback__ribbon xcore-fallback__ribbon--b" />
      <div className="xcore-fallback__scan" />
      <div className="xcore-fallback__core" />
    </div>
  );
}
