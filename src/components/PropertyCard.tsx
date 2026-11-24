import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpLeft, ArrowUpRight, Box, Building2, Compass, Heart, Ruler } from 'lucide-react';
import { Language, PropertyListing } from '../types/estate';
import { TranslationBundle } from '../i18n/translations';
import { ModalTabId } from './PropertyModal';
import { LuxuryButton } from './LuxuryButton';

interface PropertyCardProps {
  property: PropertyListing;
  language: Language;
  t: TranslationBundle;
  isFavorite?: boolean;
  onToggleFavorite?: (propertyId: string) => void;
  onSelect: (property: PropertyListing, tab?: ModalTabId) => void;
}

const SPARK_ANGLES = [0, 60, 120, 180, 240, 300];

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  language,
  t,
  isFavorite = false,
  onToggleFavorite,
  onSelect,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [burstId, setBurstId] = useState<number>(0);
  const prefersReducedMotion = useReducedMotion();
  const isRtl = language === 'ku' || language === 'ar';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBurstId(Date.now());
    onToggleFavorite?.(property.id);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 10 }}
      transition={{
        layout: { type: 'spring', stiffness: 340, damping: 30 },
        duration: 0.25,
      }}
      className="group relative flex flex-col rounded-2xl bg-[#14171F] border border-[#E5C97B]/15 hover:border-[#D4AF37]/55 transition-colors overflow-hidden"
    >
      {/* Favorite / Save Button with 6-Point Golden Spark Burst */}
      <div className="absolute top-3.5 end-3.5 z-20">
        <motion.button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from saved residences' : 'Save residence'}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.88 }}
          className={`relative flex items-center justify-center w-9 h-9 rounded-xl border transition-colors cursor-pointer ${
            isFavorite
              ? 'bg-[#0B0D11]/90 border-[#D4AF37] text-[#D4AF37]'
              : 'bg-[#0B0D11]/75 border-white/15 text-[#F5F3EE]/85 hover:border-[#D4AF37]/60 hover:text-[#E5C97B]'
          }`}
        >
          <motion.span
            key={burstId}
            animate={
              burstId > 0 && !prefersReducedMotion
                ? { scale: [1, 1.35, 0.95, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.42, ease: 'easeOut' }}
            className="inline-flex"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
          </motion.span>

          {/* 6 Miniature Gold Spark Dots Radiating Outward */}
          <AnimatePresence>
            {burstId > 0 && !prefersReducedMotion && (
              <motion.span
                key={`sparks-${burstId}`}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-none absolute inset-0"
              >
                {SPARK_ANGLES.map((angleDeg) => {
                  const rad = (angleDeg * Math.PI) / 180;
                  const tx = Math.cos(rad) * 20;
                  const ty = Math.sin(rad) * 20;
                  return (
                    <motion.span
                      key={angleDeg}
                      initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
                      animate={{ x: tx, y: ty, scale: [1.1, 0], opacity: [1, 0] }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37]"
                    />
                  );
                })}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Visual Media Container */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(property, 'photos')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(property, 'photos');
          }
        }}
        className="relative aspect-[16/10] w-full overflow-hidden bg-[#0F131A] text-start cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
      >
        {!imgFailed ? (
          <img
            src={property.gallery[0].url}
            alt={property.title[language]}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#14171F] to-[#0B0D11] text-[#D4AF37] p-4">
            <Building2 className="w-8 h-8 mb-2 opacity-75" />
            <span className="text-xs text-[#F5F3EE] text-center">{property.title[language]}</span>
          </div>
        )}

        {/* Measured Contrast Scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0D11]/90 via-[#0B0D11]/20 to-transparent" />

        {/* Price Overlay Bottom */}
        <div className="absolute bottom-3.5 inset-x-4 flex items-end justify-between gap-3">
          <div className="font-mono-tech text-xl font-semibold text-[#E5C97B] tabular-nums" dir="ltr">
            ${property.priceUsd.toLocaleString()}
          </div>
          <span className="text-xs font-mono-tech text-[#F5F3EE]/90" dir="ltr">
            {property.areaSqm} m²
          </span>
        </div>
      </div>

      {/* Card Body (Zero-Pill Clean Typographic Metadata) */}
      <div className="flex-1 flex flex-col justify-between p-5 space-y-4">
        <div className="space-y-2">
          {/* Unboxed Metadata Line */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#B8B3A8]">
            <span className="text-[#D4AF37] font-medium">{property.typeDisplay[language]}</span>
            <span aria-hidden="true">·</span>
            <span>{property.neighborhoodLabel[language]}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tech text-[11px]" dir="ltr">
              {property.code}
            </span>
          </div>

          <h3
            onClick={() => onSelect(property, 'photos')}
            className="text-lg font-semibold text-[#F5F3EE] group-hover:text-[#E5C97B] transition-colors cursor-pointer leading-snug"
          >
            {property.title[language]}
          </h3>

          <p className="text-xs text-[#B8B3A8] line-clamp-2 leading-relaxed">
            {property.subtitle[language]}
          </p>
        </div>

        {/* Specs & Quick Interactive View Launchers */}
        <div className="space-y-3 pt-3 border-t border-white/8">
          <div className="flex items-center justify-between text-xs text-[#F5F3EE]/85 tabular-nums">
            <span>
              <strong className="font-mono-tech text-[#F5F3EE]">{property.beds}</strong>{' '}
              <span className="text-[#B8B3A8]">{t.card.beds}</span>
            </span>
            <span aria-hidden="true" className="text-[#E5C97B]/35">
              ·
            </span>
            <span>
              <strong className="font-mono-tech text-[#F5F3EE]">{property.baths}</strong>{' '}
              <span className="text-[#B8B3A8]">{t.card.baths}</span>
            </span>
            <span aria-hidden="true" className="text-[#E5C97B]/35">
              ·
            </span>
            <span className="font-mono-tech" dir="ltr">
              {property.areaSqm} m²
            </span>
          </div>

          {/* Direct Tab Jump Controls (Blueprint / 3D / 360) */}
          <div className="grid grid-cols-3 gap-1.5">
            <motion.button
              whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
              type="button"
              onClick={() => onSelect(property, 'floorplan')}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#0B0D11] border border-white/10 hover:border-[#D4AF37]/60 text-[11px] font-medium text-[#F5F3EE] transition-colors whitespace-nowrap cursor-pointer"
            >
              <Ruler className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.card.hasBlueprint}</span>
            </motion.button>
            <motion.button
              whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
              type="button"
              onClick={() => onSelect(property, 'model3d')}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#0B0D11] border border-white/10 hover:border-[#D4AF37]/60 text-[11px] font-medium text-[#F5F3EE] transition-colors whitespace-nowrap cursor-pointer"
            >
              <Box className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.card.has3d}</span>
            </motion.button>
            <motion.button
              whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
              type="button"
              onClick={() => onSelect(property, 'tour360')}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#0B0D11] border border-white/10 hover:border-[#D4AF37]/60 text-[11px] font-medium text-[#F5F3EE] transition-colors whitespace-nowrap cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.card.has360}</span>
            </motion.button>
          </div>

          <LuxuryButton
            variant="subtle"
            size="sm"
            isRtl={isRtl}
            onClick={() => onSelect(property, 'photos')}
            icon={isRtl ? <ArrowUpLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
            className="w-full py-2.5"
          >
            {t.card.explore}
          </LuxuryButton>
        </div>
      </div>
    </motion.article>
  );
};
