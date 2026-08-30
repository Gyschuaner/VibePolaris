"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Point = { x: number; y: number };

type RouteFlight = {
  id: number;
  href: string;
  targetPath: string;
  from: Point;
  controlA: Point;
  controlB: Point;
  target: Point;
  sourceScale: number;
  targetScale: number;
};

type RouteMeteorStyle = CSSProperties & {
  "--route-source-scale": number;
  "--route-target-scale": number;
};

type RouteMeteorContextValue = {
  beginRouteFlight: (href: string, source: HTMLElement) => void;
  isRouteFlying: boolean;
};

const RouteMeteorContext = createContext<RouteMeteorContextValue | null>(null);

function estimatedTermStarTarget(): { point: Point; size: number } {
  const viewportWidth = document.documentElement.clientWidth;
  const mobile = viewportWidth <= 760;
  const pagePadding = mobile ? 20 : 32;
  const size = mobile ? 44 : 52;
  const detailWidth = Math.min(940, viewportWidth - pagePadding * 2);
  return {
    point: {
      x: (viewportWidth - detailWidth) / 2 + size / 2,
      y: mobile ? 160 : 178,
    },
    size,
  };
}

function controlsForFlight(from: Point, target: Point) {
  const dx = target.x - from.x;
  const dy = target.y - from.y;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const unit = { x: dx / distance, y: dy / distance };
  const normal = { x: -unit.y, y: unit.x };
  const bend = Math.min(74, distance * .2);
  const landingHandle = Math.min(88, distance * .24);
  const horizontalDirection = Math.sign(dx) || 1;

  return {
    controlA: {
      x: from.x + unit.x * distance * .26 + normal.x * bend,
      y: from.y + unit.y * distance * .26 + normal.y * bend,
    },
    controlB: {
      x: target.x - horizontalDirection * landingHandle,
      y: target.y,
    },
  };
}

function motionPath(flight: RouteFlight) {
  const n = (value: number) => value.toFixed(2);
  return `path("M ${n(flight.from.x)} ${n(flight.from.y)} C ${n(flight.controlA.x)} ${n(flight.controlA.y)}, ${n(flight.controlB.x)} ${n(flight.controlB.y)}, ${n(flight.target.x)} ${n(flight.target.y)}")`;
}

export function RouteMeteorProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [flight, setFlight] = useState<RouteFlight | null>(null);
  const [pagePhase, setPagePhase] = useState<"idle" | "departing" | "arriving">("idle");
  const navigationTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);
  const motionDoneRef = useRef(false);
  const routeArrivedRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (navigationTimerRef.current !== null) window.clearTimeout(navigationTimerRef.current);
    if (finishTimerRef.current !== null) window.clearTimeout(finishTimerRef.current);
    navigationTimerRef.current = null;
    finishTimerRef.current = null;
  }, []);

  const finishFlight = useCallback((flightId: number) => {
    clearTimers();
    setFlight((current) => current?.id === flightId ? null : current);
    setPagePhase("idle");
    motionDoneRef.current = false;
    routeArrivedRef.current = false;
  }, [clearTimers]);

  const beginRouteFlight = useCallback((href: string, source: HTMLElement) => {
    if (flight) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }

    const rect = source.getBoundingClientRect();
    const from = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const { point: target, size: targetSize } = estimatedTermStarTarget();
    const { controlA, controlB } = controlsForFlight(from, target);
    const targetPath = new URL(href, window.location.href).pathname;
    const nextFlight: RouteFlight = {
      id: Date.now(),
      href,
      targetPath,
      from,
      controlA,
      controlB,
      target,
      sourceScale: Math.max(rect.width, rect.height) / 48,
      targetScale: targetSize / 48,
    };

    clearTimers();
    motionDoneRef.current = false;
    routeArrivedRef.current = false;
    router.prefetch(href);
    setFlight(nextFlight);
    setPagePhase("departing");
    navigationTimerRef.current = window.setTimeout(() => router.push(href), 120);
    finishTimerRef.current = window.setTimeout(() => finishFlight(nextFlight.id), 1200);
  }, [clearTimers, finishFlight, flight, router]);

  useEffect(() => {
    if (!flight || pathname !== flight.targetPath) return;
    const flightId = flight.id;
    const frame = window.requestAnimationFrame(() => {
      routeArrivedRef.current = true;
      setPagePhase("arriving");
      if (motionDoneRef.current) finishFlight(flightId);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [finishFlight, flight, pathname]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const style = useMemo<RouteMeteorStyle | undefined>(() => flight ? {
    offsetPath: motionPath(flight),
    "--route-source-scale": flight.sourceScale,
    "--route-target-scale": flight.targetScale,
  } : undefined, [flight]);

  const handleFlightEnd = useCallback((flightId: number) => {
    motionDoneRef.current = true;
    if (routeArrivedRef.current) finishFlight(flightId);
  }, [finishFlight]);

  const value = useMemo(() => ({ beginRouteFlight, isRouteFlying: Boolean(flight) }), [beginRouteFlight, flight]);

  return (
    <RouteMeteorContext.Provider value={value}>
      <div className={`route-page is-${pagePhase}${flight ? " has-route-flight" : ""}`}>
        {children}
      </div>
      {flight && (
        <div className="route-meteor-layer" aria-hidden="true">
          <span
            key={flight.id}
            className="route-meteor"
            style={style}
            onAnimationEnd={(event) => {
              if (event.currentTarget === event.target && event.animationName === "route-meteor-flight") {
                handleFlightEnd(flight.id);
              }
            }}
          >
            <span className="route-meteor-tail" />
            <span className="brand-star-only route-meteor-star" />
          </span>
        </div>
      )}
    </RouteMeteorContext.Provider>
  );
}

export function useRouteMeteor() {
  const context = useContext(RouteMeteorContext);
  if (!context) throw new Error("useRouteMeteor must be used within RouteMeteorProvider");
  return context;
}
