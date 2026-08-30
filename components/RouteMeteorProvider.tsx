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
  viaA: Point;
  viaB: Point;
  target: Point;
  sourceScale: number;
  targetScale: number;
  angleA: number;
  angleB: number;
  angleC: number;
};

type RouteMeteorStyle = CSSProperties & {
  "--route-from-x": string;
  "--route-from-y": string;
  "--route-via-a-x": string;
  "--route-via-a-y": string;
  "--route-via-b-x": string;
  "--route-via-b-y": string;
  "--route-target-x": string;
  "--route-target-y": string;
  "--route-source-scale": number;
  "--route-target-scale": number;
  "--route-angle-a": string;
  "--route-angle-b": string;
  "--route-angle-c": string;
};

type RouteMeteorContextValue = {
  beginRouteFlight: (href: string, source: HTMLElement) => void;
  isRouteFlying: boolean;
};

const RouteMeteorContext = createContext<RouteMeteorContextValue | null>(null);

function pointOnQuadratic(from: Point, control: Point, target: Point, t: number): Point {
  const inverse = 1 - t;
  return {
    x: inverse * inverse * from.x + 2 * inverse * t * control.x + t * t * target.x,
    y: inverse * inverse * from.y + 2 * inverse * t * control.y + t * t * target.y,
  };
}

function angleBetween(from: Point, to: Point) {
  return Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
}

function estimatedTermStarTarget(): Point {
  const detailWidth = Math.min(window.innerWidth, 720);
  return {
    x: (window.innerWidth - detailWidth) / 2 + 59,
    y: 181,
  };
}

export function RouteMeteorProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [flight, setFlight] = useState<RouteFlight | null>(null);
  const [pagePhase, setPagePhase] = useState<"idle" | "departing" | "arriving">("idle");
  const navigationTimerRef = useRef<number | null>(null);
  const finishTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (navigationTimerRef.current !== null) window.clearTimeout(navigationTimerRef.current);
    if (finishTimerRef.current !== null) window.clearTimeout(finishTimerRef.current);
    navigationTimerRef.current = null;
    finishTimerRef.current = null;
  }, []);

  const beginRouteFlight = useCallback((href: string, source: HTMLElement) => {
    if (flight) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }

    const rect = source.getBoundingClientRect();
    const from = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const target = estimatedTermStarTarget();
    const distance = Math.hypot(target.x - from.x, target.y - from.y);
    const control = {
      x: (from.x + target.x) / 2 + Math.min(70, distance * .1),
      y: Math.min(from.y, target.y) - Math.min(150, distance * .26),
    };
    const viaA = pointOnQuadratic(from, control, target, .38);
    const viaB = pointOnQuadratic(from, control, target, .72);
    const targetPath = new URL(href, window.location.href).pathname;
    const nextFlight: RouteFlight = {
      id: Date.now(),
      href,
      targetPath,
      from,
      viaA,
      viaB,
      target,
      sourceScale: Math.max(rect.width, rect.height) / 48,
      targetScale: 54 / 48,
      angleA: angleBetween(from, viaA),
      angleB: angleBetween(viaA, viaB),
      angleC: angleBetween(viaB, target),
    };

    clearTimers();
    router.prefetch(href);
    setFlight(nextFlight);
    setPagePhase("departing");
    navigationTimerRef.current = window.setTimeout(() => router.push(href), 280);
    finishTimerRef.current = window.setTimeout(() => {
      setFlight(null);
      setPagePhase("idle");
      clearTimers();
    }, 760);
  }, [clearTimers, flight, router]);

  const flightId = flight?.id;
  const flightTargetPath = flight?.targetPath;

  useEffect(() => {
    if (!flightId || pathname !== flightTargetPath) return;
    const frame = window.requestAnimationFrame(() => {
      const targetElement = document.querySelector<HTMLElement>("[data-route-star-target]");
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const measuredTarget = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        setFlight((current) => current?.id === flightId ? {
          ...current,
          target: measuredTarget,
          targetScale: Math.max(rect.width, rect.height) / 48,
          angleC: angleBetween(current.viaB, measuredTarget),
        } : current);
      }
      setPagePhase("arriving");
    });
    return () => window.cancelAnimationFrame(frame);
  }, [flightId, flightTargetPath, pathname]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const style = useMemo<RouteMeteorStyle | undefined>(() => flight ? {
    "--route-from-x": `${flight.from.x - 24}px`,
    "--route-from-y": `${flight.from.y - 24}px`,
    "--route-via-a-x": `${flight.viaA.x - 24}px`,
    "--route-via-a-y": `${flight.viaA.y - 24}px`,
    "--route-via-b-x": `${flight.viaB.x - 24}px`,
    "--route-via-b-y": `${flight.viaB.y - 24}px`,
    "--route-target-x": `${flight.target.x - 24}px`,
    "--route-target-y": `${flight.target.y - 24}px`,
    "--route-source-scale": flight.sourceScale,
    "--route-target-scale": flight.targetScale,
    "--route-angle-a": `${flight.angleA}deg`,
    "--route-angle-b": `${flight.angleB}deg`,
    "--route-angle-c": `${flight.angleC}deg`,
  } : undefined, [flight]);

  const value = useMemo(() => ({ beginRouteFlight, isRouteFlying: Boolean(flight) }), [beginRouteFlight, flight]);

  return (
    <RouteMeteorContext.Provider value={value}>
      <div className={`route-page is-${pagePhase}${flight ? " has-route-flight" : ""}`}>
        {children}
      </div>
      {flight && (
        <div className="route-meteor-layer" aria-hidden="true">
          <span key={flight.id} className="route-meteor" style={style}>
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
