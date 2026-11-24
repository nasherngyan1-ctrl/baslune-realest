import React, { useEffect, useRef, useState } from 'react';
import { Compass, Pause, Play, ZoomIn, ZoomOut } from 'lucide-react';
import { Language, PropertyListing } from '../types/estate';
import { TranslationBundle } from '../i18n/translations';

interface Panorama360ViewerProps {
  property: PropertyListing;
  language: Language;
  t: TranslationBundle;
}

export const Panorama360Viewer: React.FC<Panorama360ViewerProps> = ({
  property,
  language,
  t,
}) => {
  const rooms = property.panoramaRooms;
  const [activeRoomId, setActiveRoomId] = useState(rooms[0]?.id ?? '');
  const activeRoom = rooms.find((r) => r.id === activeRoomId) ?? rooms[0];

  const [yawDeg, setYawDeg] = useState<number>(activeRoom?.initialYaw ?? 0);
  const [zoom, setZoom] = useState<number>(1.08);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const dragStartRef = useRef<{ x: number; yaw: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveRoomId(rooms[0]?.id ?? '');
    setYawDeg(rooms[0]?.initialYaw ?? 0);
  }, [property.id, rooms]);

  useEffect(() => {
    if (!autoRotate || isDragging) return;
    let rafId = 0;
    let prev = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      setYawDeg((y) => (y + dt * 9) % 360);
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [autoRotate, isDragging]);

  const handleRoomSwitch = (roomId: string) => {
    const target = rooms.find((r) => r.id === roomId);
    if (!target) return;
    setActiveRoomId(roomId);
    setYawDeg(target.initialYaw);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setAutoRotate(false);
    dragStartRef.current = { x: e.clientX, yaw: yawDeg };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const deltaDeg = -(dx * 0.28);
    setYawDeg(((dragStartRef.current.yaw + deltaDeg) % 360 + 360) % 360);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const normalizedYaw = Math.round(((yawDeg % 360) + 360) % 360);
  const bgPercent = (normalizedYaw / 360) * 100;

  // Project hotspot yaw onto visible horizontal viewport (-65deg .. +65deg)
  const computeHotspotLeftPercent = (targetYaw: number): number | null => {
    let diff = targetYaw - normalizedYaw;
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;
    if (Math.abs(diff) > 68) return null;
    return 50 + (diff / 68) * 44;
  };

  const cardinalDirection =
    normalizedYaw >= 315 || normalizedYaw < 45
      ? 'N'
      : normalizedYaw >= 45 && normalizedYaw < 135
      ? 'E'
      : normalizedYaw >= 135 && normalizedYaw < 225
      ? 'S'
      : 'W';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold text-[#F5F3EE]">{t.modal.tour360.title}</h3>
          <p className="text-xs text-[#B8B3A8]">{t.modal.tour360.dragHint}</p>
        </div>

        {/* Live Compass Heading */}
        <div
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#14171F] border border-[#E5C97B]/20 text-xs font-mono-tech self-start"
          dir="ltr"
        >
          <Compass className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-[#E5C97B] font-semibold">{normalizedYaw}°</span>
          <span className="text-[#B8B3A8]">{cardinalDirection}</span>
        </div>
      </div>

      {/* Interactive 360 Panoramic Viewport */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border border-[#E5C97B]/25 bg-[#0B0D11] cursor-grab active:cursor-grabbing select-none touch-none"
      >
        {/* Seamless 360° Repeating Image Strip */}
        <div
          className="absolute inset-0 transition-transform duration-150 ease-out"
          style={{
            backgroundImage: `url(${activeRoom?.imageUrl})`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: `${Math.round(240 * zoom)}% 100%`,
            backgroundPosition: `${bgPercent}% center`,
            transform: `scale(${1 + (zoom - 1) * 0.25})`,
          }}
        />

        {/* Subtle Atmospheric Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0D11]/75 via-transparent to-[#0B0D11]/35" />

        {/* Interactive Gold Room Hotspots */}
        {activeRoom?.hotspots.map((hotspot) => {
          const leftPct = computeHotspotLeftPercent(hotspot.yawDeg);
          if (leftPct === null) return null;

          return (
            <button
              key={hotspot.id}
              type="button"
              onClick={() => handleRoomSwitch(hotspot.targetRoomId)}
              style={{
                left: `${leftPct}%`,
                top: `${hotspot.pitchPercent}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B0D11]/88 border border-[#D4AF37] text-xs font-medium text-[#F5F3EE] hover:bg-[#D4AF37] hover:text-[#0B0D11] transition-all shadow-lg cursor-pointer whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] group-hover:bg-[#0B0D11]" />
              <span>{hotspot.label[language]}</span>
            </button>
          );
        })}

        {/* Active Room Label */}
        <div className="pointer-events-none absolute top-4 start-4 z-10 px-3.5 py-1.5 rounded-lg bg-[#0B0D11]/85 border border-[#E5C97B]/25 text-xs font-semibold text-[#F5F3EE]">
          {activeRoom?.name[language]}
        </div>

        {/* Bottom Controls Bar */}
        <div className="absolute bottom-4 inset-x-4 z-10 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-[#E5C97B] bg-[#0B0D11]/85 border border-[#E5C97B]/20 rounded-lg px-3 py-1.5">
            {t.modal.tour360.hotspotHint}
          </span>

          <div className="flex items-center gap-2 bg-[#0B0D11]/90 border border-[#E5C97B]/25 rounded-xl p-1.5">
            <button
              type="button"
              onClick={() => setAutoRotate((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#14171F] text-[#F5F3EE] hover:border-[#D4AF37]/50 border border-white/10 transition-colors whitespace-nowrap cursor-pointer"
            >
              {autoRotate ? <Pause className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Play className="w-3.5 h-3.5 text-[#D4AF37]" />}
              <span>{autoRotate ? t.modal.tour360.pauseRotate : t.modal.tour360.autoRotate}</span>
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.75, +(z + 0.16).toFixed(2)))}
              aria-label="Zoom In"
              className="p-1.5 rounded-lg bg-[#14171F] text-[#F5F3EE] border border-white/10 hover:border-[#D4AF37]/50 cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1.0, +(z - 0.16).toFixed(2)))}
              aria-label="Zoom Out"
              className="p-1.5 rounded-lg bg-[#14171F] text-[#F5F3EE] border border-white/10 hover:border-[#D4AF37]/50 cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Room Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-[#B8B3A8] me-1">{t.modal.tour360.roomsLabel}:</span>
        {rooms.map((room) => {
          const isCurrent = room.id === activeRoom?.id;
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => handleRoomSwitch(room.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isCurrent
                  ? 'bg-[#D4AF37] text-[#0B0D11]'
                  : 'bg-[#14171F] text-[#F5F3EE] border border-[#E5C97B]/15 hover:border-[#D4AF37]/50'
              }`}
            >
              {room.name[language]}
            </button>
          );
        })}
      </div>
    </div>
  );
};
