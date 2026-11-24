import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { PROPERTIES } from '../data/properties';
import { Language } from '../types/estate';
import { TranslationBundle } from '../i18n/translations';

interface InstallmentCalculatorProps {
  language: Language;
  t: TranslationBundle;
}

export const InstallmentCalculator: React.FC<InstallmentCalculatorProps> = ({
  language,
  t,
}) => {
  const [priceUsd, setPriceUsd] = useState<number>(410000);
  const [downPercent, setDownPercent] = useState<number>(30);
  const [months, setMonths] = useState<number>(60);

  const downAmount = Math.round((priceUsd * downPercent) / 100);
  const financedAmount = priceUsd - downAmount;
  const monthlyPayment = Math.round(financedAmount / months);

  return (
    <section
      id="calculator"
      className="py-16 sm:py-20 border-t border-[#E5C97B]/12 bg-[#0B0D11]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Intro & Quick Residence Loader */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs font-medium text-[#D4AF37] tracking-wide">
                {t.calculator.eyebrow}
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#F5F3EE] mt-2 text-balance">
                {t.calculator.title}
              </h2>
              <p className="text-sm text-[#B8B3A8] leading-relaxed mt-3">
                {t.calculator.subtitle}
              </p>
            </div>

            <div className="rounded-2xl bg-[#14171F] border border-[#E5C97B]/15 p-5 space-y-3">
              <label
                htmlFor="calc-residence-select"
                className="flex items-center gap-2 text-xs font-medium text-[#E5C97B]"
              >
                <Calculator className="w-4 h-4 text-[#D4AF37]" />
                <span>{t.calculator.selectResidence}</span>
              </label>
              <select
                id="calc-residence-select"
                value={
                  PROPERTIES.find((p) => p.priceUsd === priceUsd)?.id ?? 'custom'
                }
                onChange={(e) => {
                  const found = PROPERTIES.find((p) => p.id === e.target.value);
                  if (found) setPriceUsd(found.priceUsd);
                }}
                className="w-full rounded-xl bg-[#0B0D11] border border-[#E5C97B]/20 px-3.5 py-2.5 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="custom" disabled>
                  ${priceUsd.toLocaleString()}
                </option>
                {PROPERTIES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title[language]} — ${p.priceUsd.toLocaleString()}
                  </option>
                ))}
              </select>
              <div className="text-xs text-[#B8B3A8]">{t.calculator.zeroInterestNote}</div>
            </div>
          </div>

          {/* Right Interactive Calculator Card */}
          <div className="lg:col-span-7 rounded-2xl bg-[#14171F] border border-[#E5C97B]/20 p-6 sm:p-8 flex flex-col justify-between space-y-7">
            <div className="space-y-6">
              {/* Property Price Slider */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#B8B3A8]">{t.calculator.propertyPrice}</span>
                  <span className="font-mono-tech text-lg font-semibold text-[#F5F3EE]" dir="ltr">
                    ${priceUsd.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={150000}
                  max={1500000}
                  step={5000}
                  value={priceUsd}
                  onChange={(e) => setPriceUsd(Number(e.target.value))}
                  className="w-full gold-slider"
                />
                <div className="flex justify-between text-[11px] font-mono-tech text-[#B8B3A8] mt-1.5" dir="ltr">
                  <span>$150,000</span>
                  <span>$1,500,000</span>
                </div>
              </div>

              {/* Down Payment Slider */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#B8B3A8]">{t.calculator.downPayment}</span>
                  <span className="font-mono-tech text-base font-semibold text-[#E5C97B]" dir="ltr">
                    {downPercent}% · ${downAmount.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={50}
                  step={5}
                  value={downPercent}
                  onChange={(e) => setDownPercent(Number(e.target.value))}
                  className="w-full gold-slider"
                />
                <div className="flex justify-between text-[11px] font-mono-tech text-[#B8B3A8] mt-1.5" dir="ltr">
                  <span>20%</span>
                  <span>35%</span>
                  <span>50%</span>
                </div>
              </div>

              {/* Tenure Selector */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2.5">
                  <span className="text-[#B8B3A8]">{t.calculator.tenure}</span>
                  <span className="font-mono-tech text-xs text-[#E5C97B]">
                    {months} {t.calculator.monthsUnit}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[24, 36, 48, 60, 72].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setMonths(term)}
                      className={`py-2.5 rounded-xl font-mono-tech text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                        months === term
                          ? 'bg-[#D4AF37] text-[#0B0D11]'
                          : 'bg-[#0B0D11] text-[#F5F3EE] border border-white/10 hover:border-[#D4AF37]/45'
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Financial Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E5C97B]/15">
              <div>
                <div className="text-xs text-[#B8B3A8]">{t.calculator.summaryDown}</div>
                <div className="font-mono-tech text-lg font-semibold text-[#F5F3EE] mt-1" dir="ltr">
                  ${downAmount.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#B8B3A8]">{t.calculator.summaryFinanced}</div>
                <div className="font-mono-tech text-lg font-semibold text-[#F5F3EE] mt-1" dir="ltr">
                  ${financedAmount.toLocaleString()}
                </div>
              </div>
              <div className="sm:text-end">
                <div className="text-xs text-[#D4AF37] font-medium">
                  {t.calculator.summaryMonthly}
                </div>
                <div className="font-mono-tech text-2xl font-bold text-[#E5C97B] mt-0.5" dir="ltr">
                  ${monthlyPayment.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
