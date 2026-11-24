import { PROPERTIES } from '../data/properties';
import { Language } from '../types/estate';

export function getLocalAdvisorReply(
  query: string,
  language: Language,
  activePropertyId?: string | null
): string {
  const q = query.toLowerCase();

  const activeProp = activePropertyId
    ? PROPERTIES.find((p) => p.id === activePropertyId)
    : undefined;

  const wantsVilla = /villa|pool|lagoon|ڤێلا|مەلەوانگە|فيلا|مسبح|بحيرة/.test(q);
  const wantsApartment = /apartment|penthouse|duplex|flat|شوقە|پێنتهاوس|شقة|بنتهاوس|دوبلكس/.test(q);
  const wantsHouse = /house|townhouse|courtyard|خانوو|تاونهاوس|منزل|تاون هاوس/.test(q);
  const wantsInstallment = /installment|payment|month|down|finance|قیست|مانگ|پێشەکی|أقساط|قسط|دفعة|شهر/.test(q);
  const wants3d = /3d|360|floor|blueprint|خەریتە|پانۆراما|مخطط|ثلاثي|جولة/.test(q);
  const wantsBudget = /250|200|185|cheap|under|budget|هەرزان|کەمتر|أقل من|ميزانية/.test(q);

  const areaMatch = PROPERTIES.find((p) => {
    const n = p.neighborhood.toLowerCase();
    return (
      q.includes(n) ||
      (n === 'empire world' && /ئیمپایەر|إمباير/.test(q)) ||
      (n === 'dream city' && /دریم|دريم/.test(q)) ||
      (n === 'pavilion' && /پاڤیلیۆن|بافيليون/.test(q)) ||
      (n === 'ankawa' && /عەنکاوە|عنكاوا/.test(q)) ||
      (n === 'italian village' && /ئیتاڵی|إيطالية/.test(q)) ||
      (n === 'english village' && /ئینگلیزی|إنجليزية/.test(q)) ||
      (n === 'park view' && /پارک|بارك/.test(q)) ||
      (n === '120m blvd' && /١٢٠|120/.test(q)) ||
      (n === 'gulan' && /گوڵان|كولان/.test(q))
    );
  });

  if (language === 'ku') {
    if (areaMatch) {
      return `لە ناوچەی ${areaMatch.neighborhoodLabel.ku}، پێشنیاری "${areaMatch.title.ku}" دەکەم بە ڕووبەری ${areaMatch.areaSqm} م² و نرخی $${areaMatch.priceUsd.toLocaleString()} (${areaMatch.beds} ژووری نووستن). دەتوانیت ڕاستەوخۆ کلیک لە کارتەکە بکەیت بۆ بینینی خەریتەی قیاسدار، مۆدێلی 3D، و گەشتی 360 پلە.`;
    }
    if (wantsBudget) {
      return `بۆ بودجەی کەمتر لە ٢٥٠,٠٠٠ دۆلار، دوو بژاردەی ناوازەمان هەیە لە هەولێر: "شوقەی پانۆرامای پارک ڤیو" ($185,000 · 165 م²) و "شوقەی بۆتیک ڕێزیدێنس لە عەنکاوە" ($245,000 · 195 م²). هەردووکیان بە قیستی ڕاستەوخۆ بەردەستن.`;
    }
    if (wantsInstallment) {
      const basePrice = activeProp ? activeProp.priceUsd : 410000;
      const down = Math.round(basePrice * 0.3);
      const monthly = Math.round((basePrice - down) / 60);
      return `پلانی قیستی باسڵون بێ هیچ سوودێکە (0%): دەتوانیت ٢٠٪ بۆ ٥٠٪ پێشەکی بدەیت و باقی نرخەکە لە ماوەی ٢٤ بۆ ٧٢ مانگدا بدەیتەوە. بۆ نموونە بۆ موڵکێکی $${basePrice.toLocaleString()} بە پێشەکی ٣٠٪ ($${down.toLocaleString()})، قیستی ٦٠ مانگە دەکاتە $${monthly.toLocaleString()} لە مانگێکدا.`;
    }
    if (wants3d) {
      return `هەموو ١٠ موڵکەکەی باسڵون خەریتەی تەلارسازی تایبەت (بە قیاسی مەتری هەر ژوورێک)، مۆدێلی کارلێکی 3D (بە کردنەوەی سەربان و دیمەنی ڕۆژ/ئێوارە)، و گەشتی 360 پلە و دیمەنی جووڵاویان لەگەڵدایە. کلیک لە هەر موڵکێک بکە بۆ تاقیکردنەوەیان.`;
    }
    if (wantsVilla) {
      return `باشترین ڤێلاکانمان بریتین لە: "ڤێلای کەنار دەریاچەی پاڤیلیۆن" (720 م² · $1,250,000)، "ڤێلای مەلەوانگەداری دریم سیتی" (600 م² · $950,000)، "ڤێلای سووچی شاهانەی گوڵان" (500 م² · $790,000)، و "پێنتهاوسی ئاسمانی ئیمپایەر وۆڵد" (380 م² · $680,000).`;
    }
    if (wantsHouse) {
      return `بۆ خانووی سەربەخۆ لە هەولێر: "خانووی حەوشەداری گوندی ئینگلیزی" (320 م² · $440,000)، "خانووی مۆدێرن لە گوندی ئیتاڵی" (250 م² · $310,000)، و "تاونهاوسی شەقامی ١٢٠ مەتری" (220 م² · $275,000) بەردەستن.`;
    }
    if (wantsApartment) {
      return `بۆ شوقەی مۆدێرن: "دوپلێکسی ئەڵماسی ئیمپایەر" (280 م² · $410,000)، "شوقەی بۆتیک عەنکاوە" (195 م² · $245,000)، و "شوقەی پانۆرامای پارک ڤیو" (165 م² · $185,000) هەڵبژاردەی نایابن.`;
    }
    if (activeProp) {
      return `ئێستا سەیری "${activeProp.title.ku}" دەکەیت لە ${activeProp.neighborhoodLabel.ku} ($${activeProp.priceUsd.toLocaleString()} · ${activeProp.areaSqm} م² · ${activeProp.beds} ژووری نووستن). دەتوانیت لە تابەکانی ناو پەنجەرەکەدا خەریتەی ژوورەکان، 3D، 360° یان حجزکردنی VIP هەڵبژێریت.`;
    }
    return `باسڵون ١٠ موڵکی تایبەت لە ٩ ناوچەی سەرەکی هەولێر پێشکەش دەکات (لە $185,000 هەتا $1,250,000). ناوچەیەک یان بودجەیەک دیاری بکە تا باشترین پێشنیار و خشتەی قیستت بۆ ئامادە بکەم، یان سەردانی گەلەری فەرمیمان بکە لە ئیمپایەر وۆڵد T1.`;
  }

  if (language === 'ar') {
    if (areaMatch) {
      return `في منطقة ${areaMatch.neighborhoodLabel.ar}، نرشح لك "${areaMatch.title.ar}" بمساحة ${areaMatch.areaSqm} م² وسعر $${areaMatch.priceUsd.toLocaleString()} (${areaMatch.beds} غرف نوم). انقر على البطاقة لاستعراض المخطط المعماري المفصل، المجسم ثلاثي الأبعاد 3D، وجولة 360°.`;
    }
    if (wantsBudget) {
      return `ضمن ميزانية أقل من 250,000 دولار، يتوفر خياران مميزان في أربيل: "شقة بارك فيو البانورامية" ($185,000 · 165 م²) و"شقة بوتيك ريزيدنس عنكاوا" ($245,000 · 195 م²)، وكلاهما متاح بخطط تقسيط مباشرة.`;
    }
    if (wantsInstallment) {
      const basePrice = activeProp ? activeProp.priceUsd : 410000;
      const down = Math.round(basePrice * 0.3);
      const monthly = Math.round((basePrice - down) / 60);
      return `تقدم باسلون خطط سداد مباشرة بدون فوائد (0%): دفعة أولى بين 20% و50% وأقساط تمتد من 24 إلى 72 شهراً. لعقار بقيمة $${basePrice.toLocaleString()} مع دفعة أولى 30% ($${down.toLocaleString()}) على 60 شهراً، يكون القسط الشهري $${monthly.toLocaleString()}.`;
    }
    if (wants3d) {
      return `كل عقار من العقارات العشرة يضم مخططاً هندسياً تفاعلياً بمقاسات كل غرفة، ومجسماً ثلاثي الأبعاد 3D مع إمكانية كشف السقف وإضاءة النهار والغروب، إضافة إلى جولة بانورامية 360° ومعاينة متحركة.`;
    }
    if (wantsVilla) {
      return `أبرز الفلل المتوفرة في أربيل: "فيلا بحيرة بافيليون" (720 م² · $1,250,000)، "فيلا دريم سيتي بالمسبح" (600 م² · $950,000)، "فيلا كولان الملكية" (500 م² · $790,000)، و"بنتهاوس إمباير وورلد السماوي" (380 م² · $680,000).`;
    }
    if (wantsHouse) {
      return `المنازل العائلية المتوفرة: "منزل الفناء في القرية الإنجليزية" (320 م² · $440,000)، "منزل القرية الإيطالية المجدد" (250 م² · $310,000)، و"تاون هاوس شارع 120 متري" (220 م² · $275,000).`;
    }
    if (wantsApartment) {
      return `الشقق الفاخرة المتاحة: "دوبلكس إمباير دايموند" (280 م² · $410,000)، "شقة بوتيك عنكاوا" (195 م² · $245,000)، و"شقة بارك فيو البانورامية" (165 م² · $185,000).`;
    }
    if (activeProp) {
      return `أنت تتصفح حالياً "${activeProp.title.ar}" في ${activeProp.neighborhoodLabel.ar} ($${activeProp.priceUsd.toLocaleString()} · ${activeProp.areaSqm} م²). يمكنك التنقل بين التبويبات الخمسة لفحص المخطط و3D و360° أو حجز معاينة VIP.`;
    }
    return `تضم محفظة باسلون 10 عقارات مختارة في 9 أحياء رئيسية بأربيل (من $185,000 حتى $1,250,000). أخبرني بالمنطقة أو الميزانية المناسبة وسأرشح لك الخيار الأمثل مع خطة السداد.`;
  }

  // English
  if (areaMatch) {
    return `In ${areaMatch.neighborhood}, we recommend "${areaMatch.title.en}" (${areaMatch.areaSqm} m², ${areaMatch.beds} beds) at $${areaMatch.priceUsd.toLocaleString()}. Click the residence card to inspect its bespoke dimensioned floor plan, 3D cutaway model, and 360° panoramic room tour.`;
  }
  if (wantsBudget) {
    return `Under $250,000 in Erbil, we feature two turnkey residences: Park View Panoramic Apartment ($185,000 · 165 m² · 2 Beds) and Ankawa Boutique Residence ($245,000 · 195 m² · 3 Beds), both eligible for up to 72-month direct installments.`;
  }
  if (wantsInstallment) {
    const basePrice = activeProp ? activeProp.priceUsd : 410000;
    const down = Math.round(basePrice * 0.3);
    const monthly = Math.round((basePrice - down) / 60);
    return `BASLUNE offers 0% developer-direct payment terms with 20%–50% down payment across 24 to 72 months. For a $${basePrice.toLocaleString()} property at 30% down ($${down.toLocaleString()}) over 60 months, your installment is $${monthly.toLocaleString()}/month.`;
  }
  if (wants3d) {
    return `Every one of our 10 Erbil listings includes a custom-drawn SVG blueprint with room-by-room meter measurements, an interactive Three.js 3D model with Roof Cutaway & Day/Twilight modes, a 360° panoramic room tour, and a Cinematic GIF Tour preview.`;
  }
  if (wantsVilla) {
    return `Our flagship Erbil villas include Pavilion Waterfront Lagoon Villa (720 m² · $1,250,000), Dream City Signature Pool Villa (600 m² · $950,000), Gulan Royal Corner Villa (500 m² · $790,000), and Empire World Sky Penthouse (380 m² · $680,000).`;
  }
  if (wantsHouse) {
    return `Our curated Erbil houses are English Village Courtyard House (320 m² · $440,000), Italian Village Modern House (250 m² · $310,000), and 120m Blvd Contemporary Townhouse (220 m² · $275,000).`;
  }
  if (wantsApartment) {
    return `Our curated Erbil apartments include Empire Diamond Duplex (280 m² · $410,000), Ankawa Boutique Residence (195 m² · $245,000), and Park View Panoramic Apartment (165 m² · $185,000).`;
  }
  if (activeProp) {
    return `You are viewing ${activeProp.title.en} in ${activeProp.neighborhood} ($${activeProp.priceUsd.toLocaleString()} · ${activeProp.areaSqm} m² · ${activeProp.beds} beds). Switch across the 5 modal tabs to inspect the floor plan, 3D model, 360° tour, or generate a VIP viewing pass.`;
  }
  return `BASLUNE Estates curates 10 signature residences across 9 prime Erbil districts from $185,000 to $1,250,000. Tell me your preferred area, property type, or budget and I will recommend the best match or arrange a private tour at our Empire World T1 Sales Gallery.`;
}
