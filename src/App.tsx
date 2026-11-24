import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Globe,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { IMAGES, NEIGHBORHOOD_OPTIONS, PROPERTIES } from './data/properties';
import { TRANSLATIONS } from './i18n/translations';
import {
  Language,
  NeighborhoodId,
  PropertyCategory,
  PropertyListing,
  SortOption,
} from './types/estate';
import { PropertyCard } from './components/PropertyCard';
import { ModalTabId, PropertyModal } from './components/PropertyModal';
import { InstallmentCalculator } from './components/InstallmentCalculator';
import { AiAdvisorWidget } from './components/AiAdvisorWidget';
import { LuxuryButton } from './components/LuxuryButton';

const MAX_BUDGET_LIMIT = 1500000;
const MIN_BUDGET_LIMIT = 120000;

export default function App() {
  const [language, setLanguage] = useState<Language>('ku');
  const [selectedType, setSelectedType] = useState<PropertyCategory>('all');
  const [selectedArea, setSelectedArea] = useState<NeighborhoodId>('all');
  const [maxPrice, setMaxPrice] = useState<number>(MAX_BUDGET_LIMIT);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [favorites, setFavorites] = useState<string[]>(['empire-sky-penthouse']);

  const [modalProperty, setModalProperty] = useState<PropertyListing | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<ModalTabId>('photos');

  const t = TRANSLATIONS[language];
  const isRtl = language === 'ku' || language === 'ar';

  // Razor-thin (2px) Champagne Gold Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language, isRtl]);

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const filteredProperties = useMemo(() => {
    const filtered = PROPERTIES.filter((prop) => {
      if (selectedType !== 'all' && prop.category !== selectedType) return false;
      if (selectedArea !== 'all' && prop.neighborhood !== selectedArea) return false;
      if (prop.priceUsd > maxPrice) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.priceUsd - b.priceUsd;
        case 'price-desc':
          return b.priceUsd - a.priceUsd;
        case 'area-desc':
          return b.areaSqm - a.areaSqm;
        case 'featured':
        default:
          return a.featuredRank - b.featuredRank;
      }
    });
  }, [selectedType, selectedArea, maxPrice, sortBy]);

  const hasActiveFilters =
    selectedType !== 'all' ||
    selectedArea !== 'all' ||
    maxPrice !== MAX_BUDGET_LIMIT ||
    sortBy !== 'featured';

  const resetFilters = () => {
    setSelectedType('all');
    setSelectedArea('all');
    setMaxPrice(MAX_BUDGET_LIMIT);
    setSortBy('featured');
  };

  const openPropertyModal = (property: PropertyListing, tab: ModalTabId = 'photos') => {
    setModalProperty(property);
    setModalInitialTab(tab);
  };

  const openQuickBooking = () => {
    openPropertyModal(PROPERTIES[0], 'booking');
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] text-[#F5F3EE]">
      {/* 2px Champagne-Gold Top Scroll Progress Bar */}
      <motion.div
        aria-hidden="true"
        style={{
          scaleX: smoothProgress,
          transformOrigin: isRtl ? '100% 50%' : '0% 50%',
        }}
        className="fixed top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#D4AF37] via-[#E5C97B] to-[#D4AF37] z-50 shadow-[0_0_10px_#D4AF37]"
      />

      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-[#E5C97B]/15 bg-[#0B0D11]/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#top"
            className="font-serif-luxury text-lg sm:text-xl font-semibold tracking-wider text-[#F5F3EE] hover:text-[#E5C97B] transition-colors whitespace-nowrap shrink-0"
          >
            {t.brandName}
          </a>

          {/* Zone 2: 4 Clean Text Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#B8B3A8]">
            <a
              href="#portfolio"
              className="hover:text-[#F5F3EE] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.residences}
            </a>
            <a
              href="#calculator"
              className="hover:text-[#F5F3EE] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.calculator}
            </a>
            <a
              href="#gallery"
              className="hover:text-[#F5F3EE] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.gallery}
            </a>
            <a
              href="#footer"
              className="hover:text-[#F5F3EE] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.contact}
            </a>
          </nav>

          {/* Zone 3: Primary CTA */}
          <div className="flex items-center shrink-0">
            <LuxuryButton
              variant="primary"
              size="sm"
              isRtl={isRtl}
              onClick={openQuickBooking}
              icon={<Calendar className="w-3.5 h-3.5" />}
              iconPosition="start"
            >
              {t.nav.bookViewing}
            </LuxuryButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="top" className="relative overflow-hidden border-b border-[#E5C97B]/12">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={IMAGES.heroErbilSkyline}
            alt="Erbil luxury skyline towers"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11] via-[#0B0D11]/72 to-[#0B0D11]/55" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16 space-y-10">
          {/* Hero Utility Bar: Eyebrow + Spring Trilingual Switcher (KU / AR / EN) */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs sm:text-sm font-medium text-[#E5C97B]">
              {t.hero.eyebrow}
            </div>

            {/* Trilingual Switcher with Spring layoutId Pill */}
            <div
              className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#14171F]/95 border border-[#E5C97B]/25"
              role="group"
              aria-label="Language Switcher"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF37] mx-2 hidden sm:block" />
              {(
                [
                  { id: 'ku', label: 'کوردی' },
                  { id: 'ar', label: 'عربي' },
                  { id: 'en', label: 'EN' },
                ] as { id: Language; label: string }[]
              ).map((lang) => {
                const active = language === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setLanguage(lang.id)}
                    className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active ? 'text-[#0B0D11]' : 'text-[#B8B3A8] hover:text-[#F5F3EE]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="lang-switcher-pill"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-lg bg-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.35)]"
                      />
                    )}
                    <span className="relative z-10">{lang.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dominant Focal Headline & Primary/Secondary LuxuryButton CTAs */}
          <div className="max-w-3xl space-y-6">
            <h1
              className="font-serif-luxury font-semibold text-[#F5F3EE] leading-[1.12] text-balance"
              style={{ fontSize: 'clamp(2.25rem, 4.2vw, 3.75rem)' }}
            >
              {t.hero.headline}
            </h1>

            <p className="text-sm sm:text-base text-[#F5F3EE]/85 leading-relaxed max-w-2xl">
              {t.hero.subheadline}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <LuxuryButton
                href="#portfolio"
                variant="primary"
                size="lg"
                isRtl={isRtl}
                icon={<ArrowDown className="w-4 h-4" />}
              >
                {t.hero.primaryCta}
              </LuxuryButton>

              <LuxuryButton
                href="#calculator"
                variant="secondary"
                size="lg"
                isRtl={isRtl}
                icon={isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              >
                {t.hero.secondaryCta}
              </LuxuryButton>
            </div>
          </div>

          {/* Full-Width 4-Column KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-[#E5C97B]/15">
            {Object.values(t.hero.stats).map((stat, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-[#14171F]/85 border border-[#E5C97B]/15 px-4 py-3.5"
              >
                <div
                  className="font-mono-tech text-xl sm:text-2xl font-semibold text-[#E5C97B] tabular-nums"
                  dir="ltr"
                >
                  {stat.value}
                </div>
                <div className="text-xs text-[#B8B3A8] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Portfolio & Sticky Real-Time Filtering Bar */}
      <main id="portfolio" className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Smart Filter Bar */}
          <section
            aria-label={t.filters.title}
            className="lg:sticky lg:top-[76px] z-20 rounded-2xl bg-[#14171F]/95 border border-[#E5C97B]/20 p-4 sm:p-5 shadow-2xl space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#F5F3EE]">
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                <span>{t.filters.title}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-xs text-[#B8B3A8] tabular-nums">
                  <strong className="font-mono-tech text-sm text-[#E5C97B] me-1">
                    {filteredProperties.length}
                  </strong>
                  <span>{t.filters.matchingCount}</span>
                </div>

                {hasActiveFilters && (
                  <LuxuryButton
                    variant="outline"
                    size="sm"
                    isRtl={isRtl}
                    onClick={resetFilters}
                    icon={<RotateCcw className="w-3.5 h-3.5" />}
                    iconPosition="start"
                  >
                    {t.filters.reset}
                  </LuxuryButton>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
              {/* Property Type Segmented Filter with Glowing Spring Tab Pill */}
              <div className="lg:col-span-5 space-y-1.5">
                <span className="block text-[11px] font-medium text-[#B8B3A8]">
                  {t.filters.typeLabel}
                </span>
                <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[#0B0D11] border border-white/10">
                  {(['all', 'apartment', 'house', 'villa'] as PropertyCategory[]).map((cat) => {
                    const active = selectedType === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedType(cat)}
                        className={`relative py-2 px-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                          active ? 'text-[#0B0D11] font-semibold' : 'text-[#B8B3A8] hover:text-[#F5F3EE]'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="property-type-pill"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            className="absolute inset-0 rounded-lg bg-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.32)]"
                          />
                        )}
                        <span className="relative z-10">{t.filters.types[cat]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Slider ($120,000 - $1,500,000) */}
              <div className="lg:col-span-4 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#B8B3A8]">{t.filters.priceLabel}</span>
                  <span className="font-mono-tech font-semibold text-[#E5C97B]" dir="ltr">
                    {t.filters.upTo} ${maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={MIN_BUDGET_LIMIT}
                  max={MAX_BUDGET_LIMIT}
                  step={10000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  aria-label={t.filters.priceLabel}
                  className="w-full gold-slider"
                />
                <div className="flex justify-between text-[10px] font-mono-tech text-[#B8B3A8]" dir="ltr">
                  <span>$120K</span>
                  <span>$1.5M</span>
                </div>
              </div>

              {/* Quick Sort */}
              <div className="lg:col-span-3 space-y-1.5">
                <label
                  htmlFor="filter-sort"
                  className="block text-[11px] font-medium text-[#B8B3A8]"
                >
                  {t.filters.sortLabel}
                </label>
                <select
                  id="filter-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full rounded-xl bg-[#0B0D11] border border-white/12 px-3 py-2.5 text-xs sm:text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D4AF37]"
                >
                  {(['featured', 'price-asc', 'price-desc', 'area-desc'] as SortOption[]).map(
                    (s) => (
                      <option key={s} value={s}>
                        {t.filters.sorts[s]}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* Erbil Area Interactive Pills with Glowing Spring layoutId Highlight */}
            <div className="pt-2 border-t border-white/8 space-y-1.5">
              <div className="text-[11px] font-medium text-[#B8B3A8]">{t.filters.areaLabel}</div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {NEIGHBORHOOD_OPTIONS.map((opt) => {
                  const active = selectedArea === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedArea(opt.id as NeighborhoodId)}
                      className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'text-[#0B0D11] font-semibold'
                          : 'bg-[#0B0D11] text-[#B8B3A8] hover:text-[#F5F3EE] border border-white/8'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="erbil-area-pill"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          className="absolute inset-0 rounded-lg bg-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.3)]"
                        />
                      )}
                      <span className="relative z-10">{opt.label[language]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Fluid Morphing Properties Grid */}
          {filteredProperties.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    language={language}
                    t={t}
                    isFavorite={favorites.includes(property.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelect={openPropertyModal}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-[#14171F] border border-[#E5C97B]/20 p-10 text-center space-y-4"
            >
              <h3 className="text-lg font-semibold text-[#F5F3EE]">{t.filters.emptyTitle}</h3>
              <p className="text-sm text-[#B8B3A8] max-w-md mx-auto">{t.filters.emptyDesc}</p>
              <LuxuryButton
                variant="primary"
                size="md"
                isRtl={isRtl}
                onClick={resetFilters}
                icon={<RotateCcw className="w-4 h-4" />}
                iconPosition="start"
              >
                {t.filters.reset}
              </LuxuryButton>
            </motion.div>
          )}
        </div>
      </main>

      {/* Global Installment Calculator Section */}
      <InstallmentCalculator language={language} t={t} />

      {/* VIP Sales Gallery Section */}
      <section
        id="gallery"
        className="py-16 sm:py-20 border-t border-[#E5C97B]/12 bg-[#0F1218]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#E5C97B]/20 bg-[#14171F]">
              <img
                src={IMAGES.officeBasluneEstates}
                alt="BASLUNE Estates VIP Sales Gallery in Empire World Erbil"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-96 lg:h-full object-cover"
              />
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-[#14171F] border border-[#E5C97B]/15 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="text-xs font-medium text-[#D4AF37]">{t.gallery.eyebrow}</div>
                <h2 className="font-serif-luxury text-3xl font-semibold text-[#F5F3EE] text-balance">
                  {t.gallery.title}
                </h2>
                <p className="text-sm text-[#B8B3A8] leading-relaxed">{t.gallery.subtitle}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-[#B8B3A8]">{t.gallery.addressLabel}</div>
                    <div className="text-[#F5F3EE] font-medium mt-0.5">
                      {t.gallery.addressValue}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-[#B8B3A8]">{t.gallery.hoursLabel}</div>
                    <div className="text-[#F5F3EE] font-medium mt-0.5">
                      {t.gallery.hoursValue}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                  <div>
                    <div className="text-xs text-[#B8B3A8]">{t.gallery.conciergeLabel}</div>
                    <div className="font-mono-tech text-xs text-[#E5C97B] mt-0.5" dir="ltr">
                      {t.gallery.conciergeValue}
                    </div>
                  </div>
                </div>
              </div>

              <LuxuryButton
                variant="primary"
                size="lg"
                isRtl={isRtl}
                onClick={openQuickBooking}
                icon={isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                className="w-full"
              >
                {t.gallery.cta}
              </LuxuryButton>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Architectural Footer */}
      <footer id="footer" className="border-t border-[#E5C97B]/15 bg-[#0B0D11] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="font-serif-luxury text-lg font-semibold tracking-wider text-[#F5F3EE]">
              BASLUNE ESTATES — ERBIL
            </div>
            <p className="text-xs text-[#B8B3A8]">{t.footer.tagline}</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-[#B8B3A8]">
            <span className="font-medium text-[#E5C97B]">{t.footer.credit}</span>
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <a
              href={`mailto:${t.footer.email}`}
              className="inline-flex items-center gap-1.5 font-mono-tech text-[#F5F3EE] hover:text-[#D4AF37] transition-colors"
              dir="ltr"
            >
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{t.footer.email}</span>
            </a>
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <span>{t.footer.rights}</span>
          </div>
        </div>
      </footer>

      {/* 5-Tab Full-Screen Property Inspection Modal */}
      <PropertyModal
        property={modalProperty}
        initialTab={modalInitialTab}
        language={language}
        t={t}
        onClose={() => setModalProperty(null)}
      />

      {/* Guaranteed-Response Trilingual AI Property Advisor */}
      <AiAdvisorWidget
        language={language}
        t={t}
        activePropertyId={modalProperty?.id}
        activePropertyTitle={modalProperty?.title[language]}
      />
    </div>
  );
}
