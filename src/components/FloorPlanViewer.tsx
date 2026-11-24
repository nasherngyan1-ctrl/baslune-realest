import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Compass, Layers, Maximize2 } from 'lucide-react';
import { FloorPlanRoom, Language, PropertyListing } from '../types/estate';
import { TranslationBundle } from '../i18n/translations';

interface FloorPlanViewerProps {
  property: PropertyListing;
  language: Language;
  t: TranslationBundle;
}

function renderDoorArc(
  x: number,
  y: number,
  r: number,
  orientation: 'ne' | 'nw' | 'se' | 'sw'
): string {
  switch (orientation) {
    case 'ne':
      return `M ${x} ${y} L ${x} ${y - r} A ${r} ${r} 0 0 1 ${x + r} ${y}`;
    case 'nw':
      return `M ${x} ${y} L ${x} ${y - r} A ${r} ${r} 0 0 0 ${x - r} ${y}`;
    case 'se':
      return `M ${x} ${y} L ${x} ${y + r} A ${r} ${r} 0 0 0 ${x + r} ${y}`;
    case 'sw':
      return `M ${x} ${y} L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x - r} ${y}`;
  }
}

function renderRoomFurnishingGlyph(room: FloorPlanRoom) {
  const cx = room.x + room.width / 2;
  const cy = room.y + room.height / 2;

  if (room.kind === 'pool') {
    return (
      <g opacity={0.35} pointerEvents="none">
        <path
          d={`M ${room.x + 18} ${cy - 12} Q ${cx - 30} ${cy - 20}, ${cx} ${cy - 12} T ${room.x + room.width - 18} ${cy - 12}`}
          fill="none"
          stroke="#56C8D8"
          strokeWidth="1.2"
        />
        <path
          d={`M ${room.x + 24} ${cy + 10} Q ${cx - 20} ${cy + 2}, ${cx + 10} ${cy + 10} T ${room.x + room.width - 24} ${cy + 10}`}
          fill="none"
          stroke="#56C8D8"
          strokeWidth="1.2"
        />
      </g>
    );
  }

  if (room.kind === 'master' || room.kind === 'bedroom') {
    const bw = Math.min(48, room.width * 0.34);
    const bh = Math.min(36, room.height * 0.34);
    return (
      <g opacity={0.32} pointerEvents="none" stroke="#E5C97B" fill="none" strokeWidth="1">
        <rect x={cx - bw / 2} y={cy - bh / 2 - 8} width={bw} height={bh} rx="2" />
        <rect x={cx - bw / 2 + 4} y={cy - bh / 2 - 5} width={bw / 2 - 6} height={9} rx="1" />
        <rect x={cx + 2} y={cy - bh / 2 - 5} width={bw / 2 - 6} height={9} rx="1" />
      </g>
    );
  }

  if (room.kind === 'living') {
    const sw = Math.min(72, room.width * 0.42);
    const sh = Math.min(42, room.height * 0.32);
    return (
      <g opacity={0.3} pointerEvents="none" stroke="#E5C97B" fill="none" strokeWidth="1">
        <path
          d={`M ${cx - sw / 2} ${cy - sh / 2 - 4} h ${sw} v ${sh * 0.45} h ${-sw * 0.72} v ${sh * 0.55} h ${-sw * 0.28} z`}
        />
        <rect x={cx - 12} y={cy - 2} width={28} height={14} rx="1.5" />
      </g>
    );
  }

  if (room.kind === 'kitchen' || room.kind === 'dining') {
    const iw = Math.min(58, room.width * 0.4);
    return (
      <g opacity={0.32} pointerEvents="none" stroke="#E5C97B" fill="none" strokeWidth="1">
        <rect x={cx - iw / 2} y={cy - 14} width={iw} height={16} rx="1.5" />
        <circle cx={cx - iw / 3} cy={cy + 8} r="3" />
        <circle cx={cx} cy={cy + 8} r="3" />
        <circle cx={cx + iw / 3} cy={cy + 8} r="3" />
      </g>
    );
  }

  if (room.kind === 'courtyard') {
    return (
      <g opacity={0.35} pointerEvents="none" stroke="#8FB98D" fill="none" strokeWidth="1">
        <circle cx={cx - 24} cy={cy} r="10" strokeDasharray="3 2" />
        <circle cx={cx + 24} cy={cy} r="12" strokeDasharray="3 2" />
      </g>
    );
  }

  return null;
}

export const FloorPlanViewer: React.FC<FloorPlanViewerProps> = ({ property, language, t }) => {
  const { floorPlan } = property;
  const [selectedRoomId, setSelectedRoomId] = useState<string>(floorPlan.rooms[0]?.id ?? '');
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState<number>(0);
  const prefersReducedMotion = useReducedMotion();

  const activeId = hoveredRoomId ?? selectedRoomId;
  const activeRoom = floorPlan.rooms.find((r) => r.id === activeId) ?? floorPlan.rooms[0];

  const totalRoomsArea = floorPlan.rooms.reduce((sum, r) => sum + r.areaSqm, 0);

  const handleRoomClick = (roomId: string) => {
    setSelectedRoomId(roomId);
    setPulseKey(Date.now());
  };

  return (
    <div className="space-y-6">
      {/* Header & Active Room Inspector with Spring Pop-in Dimension Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E5C97B]/15 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#F5F3EE]">{t.modal.floorplan.title}</h3>
          <p className="text-xs text-[#B8B3A8] mt-1">{t.modal.floorplan.subtitle}</p>
        </div>

        <AnimatePresence mode="wait">
          {activeRoom ? (
            <motion.div
              key={`${activeRoom.id}-${pulseKey}`}
              initial={prefersReducedMotion ? false : { opacity: 0.6, scale: 0.94, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              className="flex flex-wrap items-center gap-4 bg-[#14171F] border border-[#D4AF37]/45 shadow-[0_0_24px_rgba(212,175,55,0.14)] rounded-xl px-4 py-3 min-w-[280px]"
            >
              <div className="flex-1 min-w-[140px]">
                <div className="text-[11px] text-[#D4AF37] font-medium">
                  {t.modal.floorplan.selectedRoom} · {activeRoom.floor[language]}
                </div>
                <div className="text-sm font-semibold text-[#F5F3EE] mt-0.5">
                  {activeRoom.name[language]}
                </div>
              </div>
              <div className="h-8 w-px bg-[#E5C97B]/15 hidden sm:block" />
              <div className="text-end">
                <div className="text-[11px] text-[#B8B3A8]">{t.modal.floorplan.dimensions}</div>
                <div className="font-mono-tech text-xs text-[#E5C97B] font-medium mt-0.5" dir="ltr">
                  {activeRoom.dimensions}
                </div>
              </div>
              <div className="h-8 w-px bg-[#E5C97B]/15" />
              <motion.div
                key={`badge-${activeRoom.id}-${pulseKey}`}
                initial={prefersReducedMotion ? false : { scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 480, damping: 20 }}
                className="text-end bg-[#D4AF37]/15 border border-[#D4AF37]/45 rounded-lg px-2.5 py-1"
              >
                <div className="text-[10px] text-[#E5C97B]">{t.modal.floorplan.area}</div>
                <div className="font-mono-tech text-sm font-bold text-[#F5F3EE]" dir="ltr">
                  {activeRoom.areaSqm} m²
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <span className="text-xs text-[#B8B3A8]">{t.modal.floorplan.hoverHint}</span>
          )}
        </AnimatePresence>
      </div>

      {/* Architectural SVG Blueprint Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E5C97B]/25 bg-[#0F131A]">
        {/* Blueprint Top Metadata Strip */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-[#E5C97B]/15 bg-[#0B0D11]/90 text-xs text-[#B8B3A8]"
          dir="ltr"
        >
          <div className="flex items-center gap-3 font-mono-tech">
            <span className="text-[#D4AF37] font-medium">{floorPlan.blueprintCode}</span>
            <span aria-hidden="true">·</span>
            <span>{property.title.en}</span>
            <span aria-hidden="true">·</span>
            <span>{property.areaSqm} m²</span>
          </div>
          <div className="flex items-center gap-2 font-mono-tech text-[#E5C97B]">
            <Compass className="w-3.5 h-3.5" />
            <span>{floorPlan.orientationLabel}</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={floorPlan.viewBox}
            className="w-full h-auto min-w-[540px] max-h-[430px] select-none block"
            role="img"
            aria-label={t.modal.floorplan.title}
          >
            <defs>
              <pattern id={`bp-grid-${property.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="#D4AF37"
                  strokeOpacity="0.07"
                  strokeWidth="0.6"
                />
              </pattern>
              <pattern id={`bp-grid-major-${property.id}`} width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill={`url(#bp-grid-${property.id})`} />
                <path
                  d="M 100 0 L 0 0 0 100"
                  fill="none"
                  stroke="#D4AF37"
                  strokeOpacity="0.14"
                  strokeWidth="0.9"
                />
              </pattern>
            </defs>

            {/* Blueprint Background */}
            <rect width="800" height="520" fill="#0F131A" />
            <rect width="800" height="520" fill={`url(#bp-grid-major-${property.id})`} />

            {/* Outer Structural Footprint Border */}
            <rect
              x={floorPlan.footprintRect.x - 4}
              y={floorPlan.footprintRect.y - 4}
              width={floorPlan.footprintRect.width + 8}
              height={floorPlan.footprintRect.height + 8}
              fill="none"
              stroke="#D4AF37"
              strokeOpacity="0.32"
              strokeWidth="1.2"
              strokeDasharray="6 4"
            />

            {/* Interactive Rooms */}
            {floorPlan.rooms.map((room) => {
              const isSelected = activeId === room.id;
              const isClickedRoom = selectedRoomId === room.id;
              const isPool = room.kind === 'pool';
              const fillColor = isSelected
                ? 'rgba(212, 175, 55, 0.24)'
                : isPool
                ? 'rgba(40, 150, 175, 0.12)'
                : 'rgba(20, 23, 31, 0.72)';

              return (
                <g
                  key={room.id}
                  onMouseEnter={() => setHoveredRoomId(room.id)}
                  onMouseLeave={() => setHoveredRoomId(null)}
                  onClick={() => handleRoomClick(room.id)}
                  className="cursor-pointer transition-colors"
                >
                  <rect
                    x={room.x}
                    y={room.y}
                    width={room.width}
                    height={room.height}
                    fill={fillColor}
                    stroke={isSelected ? '#E5C97B' : '#D4AF37'}
                    strokeOpacity={isSelected ? 1 : 0.55}
                    strokeWidth={isSelected ? 2.4 : 1.4}
                  />

                  {/* Soft Golden Pulse Glow on Clicked Room */}
                  {isClickedRoom && !prefersReducedMotion && (
                    <motion.rect
                      key={`pulse-${room.id}-${pulseKey}`}
                      x={room.x + 2}
                      y={room.y + 2}
                      width={Math.max(0, room.width - 4)}
                      height={Math.max(0, room.height - 4)}
                      fill="rgba(212, 175, 55, 0.28)"
                      stroke="#E5C97B"
                      strokeWidth="2.8"
                      initial={{ opacity: 0.9 }}
                      animate={{ opacity: [0.85, 0.15, 0.45, 0] }}
                      transition={{ duration: 0.75, ease: 'easeOut' }}
                      pointerEvents="none"
                    />
                  )}

                  {/* Subtle Inner Wall Double-Line */}
                  <rect
                    x={room.x + 4}
                    y={room.y + 4}
                    width={Math.max(0, room.width - 8)}
                    height={Math.max(0, room.height - 8)}
                    fill="none"
                    stroke={isSelected ? '#E5C97B' : '#D4AF37'}
                    strokeOpacity={isSelected ? 0.45 : 0.16}
                    strokeWidth="0.7"
                    pointerEvents="none"
                  />

                  {renderRoomFurnishingGlyph(room)}

                  {/* Room Label */}
                  <text
                    x={room.x + room.width / 2}
                    y={room.y + room.height / 2 - 4}
                    textAnchor="middle"
                    fill={isSelected ? '#F5F3EE' : '#E5C97B'}
                    fontSize={room.width < 155 ? '10.5' : '12'}
                    fontWeight="600"
                    style={{ pointerEvents: 'none' }}
                  >
                    {room.name[language].length > 26
                      ? room.name[language].slice(0, 24) + '…'
                      : room.name[language]}
                  </text>

                  {/* Dimensions + Area */}
                  <text
                    x={room.x + room.width / 2}
                    y={room.y + room.height / 2 + 13}
                    textAnchor="middle"
                    fill={isSelected ? '#E5C97B' : '#B8B3A8'}
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                    style={{ pointerEvents: 'none' }}
                    direction="ltr"
                  >
                    {room.dimensions} · {room.areaSqm} m²
                  </text>
                </g>
              );
            })}

            {/* Architectural Door Swing Arcs */}
            {floorPlan.doors.map((door, idx) => (
              <path
                key={idx}
                d={renderDoorArc(door.x, door.y, door.r, door.orientation)}
                fill="none"
                stroke="#E5C97B"
                strokeOpacity="0.65"
                strokeWidth="1.1"
                strokeDasharray="3 2"
                pointerEvents="none"
              />
            ))}

            {/* Double-Line Glazed Windows */}
            {floorPlan.windows.map((win, idx) => (
              <g key={idx} pointerEvents="none">
                <line
                  x1={win.x1}
                  y1={win.y1}
                  x2={win.x2}
                  y2={win.y2}
                  stroke="#0F131A"
                  strokeWidth="5"
                />
                <line
                  x1={win.x1}
                  y1={win.y1}
                  x2={win.x2}
                  y2={win.y2}
                  stroke="#6EC6DA"
                  strokeOpacity="0.85"
                  strokeWidth="2.2"
                />
              </g>
            ))}

            {/* Architectural Scale Bar Bottom-Left */}
            <g transform="translate(56, 496)" pointerEvents="none">
              <line x1="0" y1="0" x2="100" y2="0" stroke="#D4AF37" strokeWidth="1.4" />
              <line x1="0" y1="-4" x2="0" y2="4" stroke="#D4AF37" strokeWidth="1.4" />
              <line x1="50" y1="-3" x2="50" y2="3" stroke="#D4AF37" strokeWidth="1" />
              <line x1="100" y1="-4" x2="100" y2="4" stroke="#D4AF37" strokeWidth="1.4" />
              <text x="0" y="14" fill="#B8B3A8" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
                0m
              </text>
              <text x="44" y="14" fill="#B8B3A8" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
                2.5m
              </text>
              <text x="92" y="14" fill="#B8B3A8" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
                5.0m
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Room-by-Room Area Breakdown Table */}
      <div className="rounded-2xl border border-[#E5C97B]/15 bg-[#14171F] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5C97B]/12">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F3EE]">
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <span>{t.modal.floorplan.tableTitle}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#B8B3A8] tabular-nums">
            <Maximize2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t.modal.floorplan.totalBuilt}:</span>
            <span className="font-mono-tech text-[#E5C97B] font-semibold" dir="ltr">
              {property.areaSqm} m² ({totalRoomsArea} m² net)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5C97B]/10 text-xs text-[#B8B3A8] bg-[#0B0D11]/50">
                <th className="py-2.5 px-5 text-start font-medium">{t.modal.floorplan.roomCol}</th>
                <th className="py-2.5 px-4 text-start font-medium">{t.modal.floorplan.floorCol}</th>
                <th className="py-2.5 px-4 text-end font-medium">{t.modal.floorplan.dimCol}</th>
                <th className="py-2.5 px-5 text-end font-medium">{t.modal.floorplan.areaCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5C97B]/10">
              {floorPlan.rooms.map((room) => {
                const isSelected = activeId === room.id;
                return (
                  <tr
                    key={room.id}
                    onMouseEnter={() => setHoveredRoomId(room.id)}
                    onMouseLeave={() => setHoveredRoomId(null)}
                    onClick={() => handleRoomClick(room.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#D4AF37]/15 text-[#F5F3EE]' : 'hover:bg-white/[0.03] text-[#F5F3EE]/90'
                    }`}
                  >
                    <td className="py-2.5 px-5 font-medium">{room.name[language]}</td>
                    <td className="py-2.5 px-4 text-xs text-[#B8B3A8]">{room.floor[language]}</td>
                    <td className="py-2.5 px-4 text-end font-mono-tech text-xs text-[#E5C97B]" dir="ltr">
                      {room.dimensions}
                    </td>
                    <td className="py-2.5 px-5 text-end font-mono-tech font-semibold tabular-nums" dir="ltr">
                      {room.areaSqm} m²
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
