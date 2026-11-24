import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Box,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileText,
  Film,
  Images,
  MessageCircle,
  Pause,
  Play,
  Ruler,
  X,
} from 'lucide-react';
import { Language, PropertyListing } from '../types/estate';
import { TranslationBundle } from '../i18n/translations';
import { FloorPlanViewer } from './FloorPlanViewer';
import { Property3DViewer } from './Property3DViewer';
import { Panorama360Viewer } from './Panorama360Viewer';
import { LuxuryButton } from './LuxuryButton';

export type ModalTabId = 'photos' | 'floorplan' | 'model3d' | 'tour360' | 'booking';

interface PropertyModalProps {
  property: PropertyListing | null;
  initialTab?: ModalTabId;
  language: Language;
  t: TranslationBundle;
  onClose: () => void;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  initialTab = 'photos',
  language,
  t,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTabId>(initialTab);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [gifTourActive, setGifTourActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const isRtl = language === 'ku' || language === 'ar';

  // Mini Installment Calculator inside Booking Tab
  const [downPct, setDownPct] = useState(30);
  const [months, setMonths] = useState(60);

  // Private Viewing Booking State
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('2026-12-01');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [issuedPassCode, setIssuedPassCode] = useState<string | null>(null);

  useEffect(() => {
    if (!property) return;
    setActiveTab(initialTab);
    setPhotoIndex(0);
    setGifTourActive(false);
    setIssuedPassCode(null);
    setFormError('');
  }, [property?.id, initialTab]);

  useEffect(() => {
    if (!property) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [property, onClose]);

  // Auto-looping Cinematic GIF Tour timer
  useEffect(() => {
    if (!property || !gifTourActive || activeTab !== 'photos') return;
    const timer = window.setInterval(() => {
      setPhotoIndex((idx) => (idx + 1) % property.gallery.length);
    }, 3400);
    return () => window.clearInterval(timer);
  }, [property, gifTourActive, activeTab]);

  const tabs: { id: ModalTabId; label: string; icon: React.ReactNode }[] = [
    { id: 'photos', label: t.modal.tabs.photos, icon: <Images className="w-4 h-4" /> },
    { id: 'floorplan', label: t.modal.tabs.floorplan, icon: <Ruler className="w-4 h-4" /> },
    { id: 'model3d', label: t.modal.tabs.model3d, icon: <Box className="w-4 h-4" /> },
    { id: 'tour360', label: t.modal.tabs.tour360, icon: <Compass className="w-4 h-4" /> },
    { id: 'booking', label: t.modal.tabs.booking, icon: <FileText className="w-4 h-4" /> },
  ];

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || visitorPhone.trim().length < 7) {
      setFormError(
        language === 'ku'
          ? 'تکایە ناوی تەواو و ژمارەی مۆبایلی دروست بنووسە.'
          : language === 'ar'
          ? 'يرجى إدخال الاسم الكامل ورقم هاتف صحيح.'
          : 'Please provide your full name and a valid phone number.'
      );
      return;
    }
    setFormError('');
    const randCode = Math.floor(1000 + Math.random() * 9000);
    setIssuedPassCode(`BSL-EST-2026-${randCode}`);
  };

  return (
    <AnimatePresence>
      {property && (
        <motion.div
          key="property-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-5"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key={`modal-${property.id}`}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.94, y: 24 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, y: 18 }
            }
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="relative w-full max-w-6xl max-h-[94vh] flex flex-col rounded-2xl bg-[#0B0D11] border border-[#E5C97B]/25 shadow-2xl overflow-hidden"
          >
            {/* Modal Top Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 sm:px-7 py-4 border-b border-[#E5C97B]/15 bg-[#14171F]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#B8B3A8]">
                  <span className="font-mono-tech text-[#D4AF37]">{property.code}</span>
                  <span aria-hidden="true">·</span>
                  <span>{property.neighborhoodLabel[language]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{property.typeDisplay[language]}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-[#F5F3EE] truncate mt-0.5">
                  {property.title[language]}
                </h2>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-end" dir="ltr">
                  <div className="font-mono-tech text-lg sm:text-xl font-semibold text-[#E5C97B] tabular-nums">
                    ${property.priceUsd.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#B8B3A8] font-mono-tech">
                    {property.areaSqm} m² · {property.beds} {t.card.beds}
                  </div>
                </div>

                <motion.button
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
                  type="button"
                  onClick={onClose}
                  aria-label={t.modal.close}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#0B0D11] border border-[#E5C97B]/20 text-[#F5F3EE] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* 5 Interactive Tabs with Glowing Spring Pill & Underline */}
            <div className="px-4 sm:px-7 py-3 border-b border-[#E5C97B]/12 bg-[#0F1218] overflow-x-auto">
              <div className="flex items-center gap-1.5 min-w-max">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive ? 'text-[#0B0D11] font-semibold' : 'text-[#B8B3A8] hover:text-[#F5F3EE]'
                      }`}
                    >
                      {isActive && (
                        <>
                          <motion.div
                            layoutId="modal-tab-indicator"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            className="absolute inset-0 rounded-xl bg-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                          />
                          <motion.div
                            layoutId="modal-tab-underline"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            className="absolute -bottom-3 inset-x-3 h-[2px] bg-[#E5C97B] shadow-[0_0_8px_#D4AF37]"
                          />
                        </>
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        {tab.icon}
                        <span>{tab.label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Scrollable Body with 5-Tab Cross-Slide & Fade */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: isRtl ? -16 : 16 }
                  }
                  animate={{ opacity: 1, x: 0 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: isRtl ? 16 : -16 }
                  }
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* TAB 1: Photos & Animated Walkthrough */}
                  {activeTab === 'photos' && (() => {
                    const currentPhoto = property.gallery[photoIndex] ?? property.gallery[0];
                    return (
                      <div className="space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="text-sm text-[#B8B3A8]">
                            {currentPhoto.caption[language]}{' '}
                            <span className="text-[#D4AF37] font-mono-tech ms-2" dir="ltr">
                              ({photoIndex + 1} / {property.gallery.length})
                            </span>
                          </div>

                          <LuxuryButton
                            variant={gifTourActive ? 'primary' : 'outline'}
                            size="sm"
                            isRtl={isRtl}
                            onClick={() => setGifTourActive((v) => !v)}
                            icon={gifTourActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            iconPosition="start"
                          >
                            {gifTourActive ? t.modal.photos.gifTourOn : t.modal.photos.gifTourOff}
                          </LuxuryButton>
                        </div>

                        {/* Main Gallery / Ken Burns Stage */}
                        <div className="relative w-full h-[320px] sm:h-[440px] rounded-2xl overflow-hidden border border-[#E5C97B]/20 bg-[#14171F]">
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={`${property.id}-${photoIndex}-${gifTourActive ? 'motion' : 'still'}`}
                              src={currentPhoto.url}
                              alt={currentPhoto.caption[language]}
                              referrerPolicy="no-referrer"
                              initial={{ opacity: 0.25 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0.2 }}
                              transition={{ duration: 0.55 }}
                              className={`w-full h-full object-cover ${
                                gifTourActive
                                  ? photoIndex % 2 === 0
                                    ? 'ken-burns-a'
                                    : 'ken-burns-b'
                                  : ''
                              }`}
                            />
                          </AnimatePresence>

                          {/* Gradient Scrim for Legibility */}
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0D11]/85 via-transparent to-[#0B0D11]/25" />

                          {/* LIVE MOTION Architectural Indicator */}
                          {gifTourActive && (
                            <div
                              className="absolute top-4 start-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B0D11]/90 border border-[#D4AF37]/60 text-[11px] font-mono-tech font-semibold text-[#E5C97B] tracking-wider"
                              dir="ltr"
                            >
                              <Film className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>{t.modal.photos.liveMotion}</span>
                            </div>
                          )}

                          {/* Scene Tag & Controls */}
                          <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between gap-4">
                            <div className="text-xs text-[#F5F3EE]">
                              <span className="text-[#D4AF37] font-medium">
                                {currentPhoto.tag[language]}
                              </span>
                              <span className="mx-2" aria-hidden="true">
                                ·
                              </span>
                              <span>{currentPhoto.caption[language]}</span>
                            </div>

                            <div className="flex items-center gap-2" dir="ltr">
                              <motion.button
                                whileTap={{ scale: 0.92 }}
                                type="button"
                                onClick={() =>
                                  setPhotoIndex(
                                    (i) =>
                                      (i - 1 + property.gallery.length) % property.gallery.length
                                  )
                                }
                                aria-label={t.modal.photos.prev}
                                className="p-2 rounded-lg bg-[#0B0D11]/85 border border-[#E5C97B]/25 text-[#F5F3EE] hover:border-[#D4AF37] cursor-pointer"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.92 }}
                                type="button"
                                onClick={() =>
                                  setPhotoIndex((i) => (i + 1) % property.gallery.length)
                                }
                                aria-label={t.modal.photos.next}
                                className="p-2 rounded-lg bg-[#0B0D11]/85 border border-[#E5C97B]/25 text-[#F5F3EE] hover:border-[#D4AF37] cursor-pointer"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </div>

                        {/* Clickable Thumbnails */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {property.gallery.map((media, idx) => {
                            const selected = idx === photoIndex;
                            return (
                              <motion.button
                                whileTap={{ scale: 0.97 }}
                                key={idx}
                                type="button"
                                onClick={() => setPhotoIndex(idx)}
                                className={`group relative rounded-xl overflow-hidden border text-start transition-all cursor-pointer ${
                                  selected
                                    ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]'
                                    : 'border-[#E5C97B]/15 opacity-75 hover:opacity-100'
                                }`}
                              >
                                <div className="aspect-[16/10] w-full overflow-hidden bg-[#14171F]">
                                  <img
                                    src={media.url}
                                    alt={media.caption[language]}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <div className="px-3 py-2 bg-[#14171F] text-xs font-medium text-[#F5F3EE] truncate">
                                  {media.tag[language]}
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>

                        <p className="text-sm leading-relaxed text-[#B8B3A8] pt-2">
                          {property.description[language]}
                        </p>
                      </div>
                    );
                  })()}

                  {/* TAB 2: Interactive Floor Plan & Room Dimensions */}
                  {activeTab === 'floorplan' && (
                    <FloorPlanViewer property={property} language={language} t={t} />
                  )}

                  {/* TAB 3: Interactive 3D Property Viewer */}
                  {activeTab === 'model3d' && (
                    <Property3DViewer property={property} language={language} t={t} />
                  )}

                  {/* TAB 4: Interactive 360 Virtual Tour */}
                  {activeTab === 'tour360' && (
                    <Panorama360Viewer property={property} language={language} t={t} />
                  )}

                  {/* TAB 5: Specs, Payment Plan & Booking */}
                  {activeTab === 'booking' && (() => {
                    const downAmount = Math.round((property.priceUsd * downPct) / 100);
                    const financedBalance = property.priceUsd - downAmount;
                    const monthlyPayment = Math.round(financedBalance / months);
                    const whatsappText = encodeURIComponent(
                      `BASLUNE Estates — Erbil Inquiry: ${property.title.en} (${property.code}) · $${property.priceUsd.toLocaleString()}`
                    );
                    const whatsappUrl = `https://wa.me/9647508884200?text=${whatsappText}`;

                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Column: Architectural Specs + Mini Installment Calculator */}
                        <div className="lg:col-span-6 space-y-6">
                          <div className="rounded-2xl border border-[#E5C97B]/15 bg-[#14171F] p-5 space-y-4">
                            <h3 className="text-base font-semibold text-[#F5F3EE]">
                              {t.modal.booking.specsTitle}
                            </h3>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="border-b border-white/8 pb-2.5">
                                <div className="text-xs text-[#B8B3A8]">
                                  {t.modal.booking.totalArea}
                                </div>
                                <div
                                  className="font-mono-tech font-semibold text-[#F5F3EE] mt-0.5"
                                  dir="ltr"
                                >
                                  {property.areaSqm} m²
                                </div>
                              </div>
                              <div className="border-b border-white/8 pb-2.5">
                                <div className="text-xs text-[#B8B3A8]">
                                  {t.modal.booking.builtUp}
                                </div>
                                <div
                                  className="font-mono-tech font-semibold text-[#F5F3EE] mt-0.5"
                                  dir="ltr"
                                >
                                  {property.builtUpSqm} m²
                                </div>
                              </div>
                              <div className="border-b border-white/8 pb-2.5">
                                <div className="text-xs text-[#B8B3A8]">
                                  {t.modal.booking.floors}
                                </div>
                                <div
                                  className="font-mono-tech font-semibold text-[#F5F3EE] mt-0.5"
                                  dir="ltr"
                                >
                                  {property.floors}
                                </div>
                              </div>
                              <div className="border-b border-white/8 pb-2.5">
                                <div className="text-xs text-[#B8B3A8]">
                                  {t.modal.booking.parking}
                                </div>
                                <div
                                  className="font-mono-tech font-semibold text-[#F5F3EE] mt-0.5"
                                  dir="ltr"
                                >
                                  {property.parking}
                                </div>
                              </div>
                              <div className="border-b border-white/8 pb-2.5">
                                <div className="text-xs text-[#B8B3A8]">
                                  {t.modal.booking.yearBuilt}
                                </div>
                                <div
                                  className="font-mono-tech font-semibold text-[#F5F3EE] mt-0.5"
                                  dir="ltr"
                                >
                                  {property.yearBuilt}
                                </div>
                              </div>
                              <div className="border-b border-white/8 pb-2.5">
                                <div className="text-xs text-[#B8B3A8]">
                                  {t.modal.booking.furnishing}
                                </div>
                                <div className="text-xs font-medium text-[#E5C97B] mt-1">
                                  {property.furnishing[language]}
                                </div>
                              </div>
                              <div className="col-span-2">
                                <div className="text-xs text-[#B8B3A8]">
                                  {t.modal.booking.smartHome}
                                </div>
                                <div className="text-sm font-medium text-[#F5F3EE] mt-0.5">
                                  {property.smartHome[language]}
                                </div>
                              </div>
                            </div>

                            <div className="pt-2">
                              <div className="text-xs font-semibold text-[#D4AF37] mb-2.5">
                                {t.modal.booking.highlightsTitle}
                              </div>
                              <ul className="space-y-2">
                                {property.highlights.map((item, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2 text-xs text-[#F5F3EE]/90"
                                  >
                                    <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                                    <span>{item[language]}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Mini Installment Calculator */}
                          <div className="rounded-2xl border border-[#E5C97B]/20 bg-[#14171F] p-5 space-y-4">
                            <h3 className="text-base font-semibold text-[#F5F3EE]">
                              {t.modal.booking.calcTitle}
                            </h3>

                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                  <span className="text-[#B8B3A8]">
                                    {t.modal.booking.downPayment}
                                  </span>
                                  <span className="font-mono-tech text-[#E5C97B]" dir="ltr">
                                    {downPct}% (${downAmount.toLocaleString()})
                                  </span>
                                </div>
                                <input
                                  type="range"
                                  min={20}
                                  max={50}
                                  step={5}
                                  value={downPct}
                                  onChange={(e) => setDownPct(Number(e.target.value))}
                                  className="w-full gold-slider"
                                />
                              </div>

                              <div>
                                <div className="text-xs text-[#B8B3A8] mb-2">
                                  {t.modal.booking.duration}
                                </div>
                                <div className="grid grid-cols-5 gap-1.5">
                                  {[24, 36, 48, 60, 72].map((m) => (
                                    <button
                                      key={m}
                                      type="button"
                                      onClick={() => setMonths(m)}
                                      className={`relative py-1.5 rounded-lg font-mono-tech text-xs font-medium transition-colors cursor-pointer ${
                                        months === m
                                          ? 'text-[#0B0D11] font-semibold'
                                          : 'bg-[#0B0D11] text-[#B8B3A8] border border-white/10 hover:border-[#D4AF37]/40'
                                      }`}
                                    >
                                      {months === m && (
                                        <motion.span
                                          layoutId="mini-calc-months-pill"
                                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                          className="absolute inset-0 rounded-lg bg-[#D4AF37]"
                                        />
                                      )}
                                      <span className="relative z-10">{m}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                              <div>
                                <div className="text-[11px] text-[#B8B3A8]">
                                  {t.modal.booking.totalFinanced}
                                </div>
                                <div
                                  className="font-mono-tech text-sm font-semibold text-[#F5F3EE] mt-0.5"
                                  dir="ltr"
                                >
                                  ${financedBalance.toLocaleString()}
                                </div>
                              </div>
                              <div className="text-end">
                                <div className="text-[11px] text-[#D4AF37]">
                                  {t.modal.booking.monthlyPayment}
                                </div>
                                <div
                                  className="font-mono-tech text-lg font-semibold text-[#E5C97B] mt-0.5"
                                  dir="ltr"
                                >
                                  ${monthlyPayment.toLocaleString()} / {t.modal.booking.months}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Private Viewing Booking Form & Animated VIP Pass */}
                        <div className="lg:col-span-6 rounded-2xl border border-[#E5C97B]/25 bg-[#14171F] p-5 sm:p-6">
                          {issuedPassCode ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ type: 'spring', stiffness: 360, damping: 26 }}
                              className="space-y-5 py-2"
                            >
                              <div className="flex items-center gap-3.5 text-[#D4AF37]">
                                {/* Self-Drawing SVG Gold Checkmark */}
                                <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37] flex items-center justify-center shrink-0">
                                  <svg
                                    viewBox="0 0 28 28"
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="#D4AF37"
                                    strokeWidth="2.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <motion.path
                                      d="M 6 14.5 L 11.5 20 L 22 8.5"
                                      initial={{ pathLength: 0, opacity: 0 }}
                                      animate={{ pathLength: 1, opacity: 1 }}
                                      transition={{ duration: 0.55, ease: 'easeOut' }}
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <div className="text-xs text-[#B8B3A8]">
                                    {t.modal.booking.passTitle}
                                  </div>
                                  <div
                                    className="font-mono-tech text-xl font-bold text-[#E5C97B]"
                                    dir="ltr"
                                  >
                                    {issuedPassCode}
                                  </div>
                                </div>
                              </div>

                              {/* VIP Confirmation Card with Luxury Gold Shimmer Sweep */}
                              <div className="relative overflow-hidden rounded-xl bg-[#0B0D11] border border-[#D4AF37]/50 p-4 space-y-2.5 text-sm shadow-[0_0_30px_rgba(212,175,55,0.12)]">
                                {!prefersReducedMotion && (
                                  <motion.div
                                    aria-hidden="true"
                                    initial={{ x: '-130%' }}
                                    animate={{ x: '230%' }}
                                    transition={{
                                      duration: 1.6,
                                      ease: 'easeInOut',
                                      repeat: Infinity,
                                      repeatDelay: 2.8,
                                    }}
                                    className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent"
                                  />
                                )}
                                <div className="flex justify-between gap-4 relative z-10">
                                  <span className="text-[#B8B3A8]">
                                    {t.modal.booking.passIssuedFor}
                                  </span>
                                  <span className="font-semibold text-[#F5F3EE]">
                                    {visitorName}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4 relative z-10">
                                  <span className="text-[#B8B3A8]">{t.modal.booking.passDate}</span>
                                  <span className="font-mono-tech text-[#E5C97B]" dir="ltr">
                                    {preferredDate}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4 relative z-10">
                                  <span className="text-[#B8B3A8]">{property.code}</span>
                                  <span className="font-medium text-[#F5F3EE]">
                                    {property.title[language]}
                                  </span>
                                </div>
                                <div className="pt-2 border-t border-white/10 text-xs text-[#B8B3A8] relative z-10">
                                  {t.modal.booking.passLocation}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-3">
                                <LuxuryButton
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  variant="primary"
                                  size="md"
                                  isRtl={isRtl}
                                  icon={<MessageCircle className="w-4 h-4" />}
                                  iconPosition="start"
                                  className="flex-1"
                                >
                                  {t.modal.booking.whatsappBtn}
                                </LuxuryButton>

                                <LuxuryButton
                                  variant="secondary"
                                  size="sm"
                                  isRtl={isRtl}
                                  onClick={() => setIssuedPassCode(null)}
                                >
                                  {t.modal.booking.bookAnother}
                                </LuxuryButton>
                              </div>
                            </motion.div>
                          ) : (
                            <form onSubmit={handleBookSubmit} className="space-y-4">
                              <div className="flex items-center gap-2.5">
                                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                                <h3 className="text-base font-semibold text-[#F5F3EE]">
                                  {t.modal.booking.formTitle}
                                </h3>
                              </div>

                              <div>
                                <label className="block text-xs text-[#B8B3A8] mb-1.5">
                                  {t.modal.booking.fullName}
                                </label>
                                <input
                                  type="text"
                                  value={visitorName}
                                  onChange={(e) => setVisitorName(e.target.value)}
                                  required
                                  className="w-full rounded-xl bg-[#0B0D11] border border-white/12 px-3.5 py-2.5 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D4AF37]"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-[#B8B3A8] mb-1.5">
                                    {t.modal.booking.phone}
                                  </label>
                                  <input
                                    type="tel"
                                    dir="ltr"
                                    placeholder="+964 750 ..."
                                    value={visitorPhone}
                                    onChange={(e) => setVisitorPhone(e.target.value)}
                                    required
                                    className="w-full rounded-xl bg-[#0B0D11] border border-white/12 px-3.5 py-2.5 text-sm font-mono-tech text-[#F5F3EE] focus:outline-none focus:border-[#D4AF37]"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs text-[#B8B3A8] mb-1.5">
                                    {t.modal.booking.preferredDate}
                                  </label>
                                  <input
                                    type="date"
                                    dir="ltr"
                                    value={preferredDate}
                                    onChange={(e) => setPreferredDate(e.target.value)}
                                    className="w-full rounded-xl bg-[#0B0D11] border border-white/12 px-3.5 py-2.5 text-sm font-mono-tech text-[#F5F3EE] focus:outline-none focus:border-[#D4AF37]"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs text-[#B8B3A8] mb-1.5">
                                  {t.modal.booking.notes}
                                </label>
                                <textarea
                                  rows={3}
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  className="w-full rounded-xl bg-[#0B0D11] border border-white/12 px-3.5 py-2.5 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D4AF37] resize-none"
                                />
                              </div>

                              {formError && (
                                <div className="text-xs text-rose-400 bg-rose-950/30 border border-rose-500/30 rounded-lg px-3 py-2">
                                  {formError}
                                </div>
                              )}

                              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                <LuxuryButton
                                  type="submit"
                                  variant="primary"
                                  size="md"
                                  isRtl={isRtl}
                                  className="flex-1 py-3"
                                >
                                  {t.modal.booking.submitBtn}
                                </LuxuryButton>

                                <LuxuryButton
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  variant="outline"
                                  size="md"
                                  isRtl={isRtl}
                                  icon={<MessageCircle className="w-4 h-4" />}
                                  iconPosition="start"
                                  className="py-3"
                                >
                                  {t.modal.booking.whatsappBtn}
                                </LuxuryButton>
                              </div>
                            </form>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
