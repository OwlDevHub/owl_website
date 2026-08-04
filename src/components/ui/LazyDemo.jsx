import React, { Suspense, useEffect, useRef, useState } from "react";

const AppDemo = React.lazy(() =>
  import("../../owl-demo/components").then((m) => ({ default: m.AppDemo })),
);

const placeholder = (
  <div className="owl-demo-placeholder" aria-hidden="true" />
);

const LazyDemo = ({ defaultTab }) => {
  const ref = useRef(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNearViewport(true);
          io.disconnect();
        }
      },
      { rootMargin: "500px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ width: "100%", minWidth: 0 }}>
      {nearViewport ? (
        <Suspense fallback={placeholder}>
          <AppDemo defaultTab={defaultTab} />
        </Suspense>
      ) : (
        placeholder
      )}
    </div>
  );
};

export default LazyDemo;
