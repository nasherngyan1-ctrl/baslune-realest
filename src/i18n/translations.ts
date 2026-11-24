import { Language } from '../types/estate';

export interface TranslationBundle {
  brandName: string;
  nav: {
    residences: string;
    calculator: string;
    gallery: string;
    contact: string;
    bookViewing: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    stats: {
      residences: { value: string; label: string };
      districts: { value: string; label: string };
      tours: { value: string; label: string };
      installment: { value: string; label: string };
    };
  };
  filters: {
    title: string;
    typeLabel: string;
    types: {
      all: string;
      apartment: string;
      house: string;
      villa: string;
    };
    areaLabel: string;
    allAreas: string;
    priceLabel: string;
    upTo: string;
    sortLabel: string;
    sorts: {
      featured: string;
      'price-asc': string;
      'price-desc': string;
      'area-desc': string;
    };
    matchingCount: string;
    reset: string;
    emptyTitle: string;
    emptyDesc: string;
  };
  card: {
    beds: string;
    baths: string;
    areaUnit: string;
    explore: string;
    hasBlueprint: string;
    has3d: string;
    has360: string;
  };
  modal: {
    close: string;
    tabs: {
      photos: string;
      floorplan: string;
      model3d: string;
      tour360: string;
      booking: string;
    };
    photos: {
      gifTourOn: string;
      gifTourOff: string;
      liveMotion: string;
      scene: string;
      next: string;
      prev: string;
    };
    floorplan: {
      title: string;
      subtitle: string;
      hoverHint: string;
      selectedRoom: string;
      dimensions: string;
      area: string;
      floor: string;
      tableTitle: string;
      roomCol: string;
      floorCol: string;
      dimCol: string;
      areaCol: string;
      totalBuilt: string;
    };
    model3d: {
      dragHint: string;
      cutawayOn: string;
      cutawayOff: string;
      dayMode: string;
      twilightMode: string;
      zoomIn: string;
      zoomOut: string;
      resetCam: string;
      fallbackNote: string;
    };
    tour360: {
      title: string;
      dragHint: string;
      autoRotate: string;
      pauseRotate: string;
      compass: string;
      roomsLabel: string;
      hotspotHint: string;
    };
    booking: {
      specsTitle: string;
      totalArea: string;
      builtUp: string;
      floors: string;
      parking: string;
      yearBuilt: string;
      furnishing: string;
      smartHome: string;
      highlightsTitle: string;
      calcTitle: string;
      downPayment: string;
      duration: string;
      months: string;
      monthlyPayment: string;
      totalFinanced: string;
      formTitle: string;
      fullName: string;
      phone: string;
      preferredDate: string;
      notes: string;
      submitBtn: string;
      whatsappBtn: string;
      passTitle: string;
      passIssuedFor: string;
      passDate: string;
      passLocation: string;
      bookAnother: string;
    };
  };
  calculator: {
    eyebrow: string;
    title: string;
    subtitle: string;
    propertyPrice: string;
    downPayment: string;
    tenure: string;
    monthsUnit: string;
    summaryDown: string;
    summaryFinanced: string;
    summaryMonthly: string;
    zeroInterestNote: string;
    selectResidence: string;
  };
  gallery: {
    eyebrow: string;
    title: string;
    subtitle: string;
    addressLabel: string;
    addressValue: string;
    hoursLabel: string;
    hoursValue: string;
    conciergeLabel: string;
    conciergeValue: string;
    cta: string;
  };
  advisor: {
    buttonLabel: string;
    title: string;
    subtitle: string;
    welcome: string;
    placeholder: string;
    send: string;
    quickPrompts: string[];
  };
  footer: {
    tagline: string;
    credit: string;
    email: string;
    rights: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationBundle> = {
  ku: {
    brandName: 'BASLUNE ESTATES',
    nav: {
      residences: 'موڵکەکان',
      calculator: 'حاسیبەی قیست',
      gallery: 'گەلەری فەرمی',
      contact: 'پەیوەندی',
      bookViewing: 'حجزکردنی سەردان',
    },
    hero: {
      eyebrow: 'هەولێر · کوردستان · تەلارسازی پێشکەوتوو',
      headline: 'تەلارسازی شاهانە بۆ ژیانێکی بێهاوتا لە هەولێر',
      subheadline:
        'کۆمەڵە موڵکە هەڵبژێردراوەکانی باسڵون لە ئیمپایەر وۆڵد، دریم سیتی، پاڤیلیۆن و عەنکاوە — لەگەڵ خەریتەی قیاسدار، بینینی 3D، گەشتی 360 پلە و دیمەنی جووڵاو.',
      primaryCta: 'گەڕان لە موڵکەکان',
      secondaryCta: 'حاسیبەی قیست',
      stats: {
        residences: { value: '10', label: 'موڵکی ناوازە لە هەولێر' },
        districts: { value: '9', label: 'ناوچەی سەرەکی و ستراتیژی' },
        tours: { value: '3D + 360°', label: 'پشکنینی تەواوی ناوەوە' },
        installment: { value: '72', label: 'مانگ قیستی ڕاستەوخۆ' },
      },
    },
    filters: {
      title: 'فلتەری زیرەکی موڵکەکان',
      typeLabel: 'جۆری موڵک',
      types: {
        all: 'هەمووی',
        apartment: 'شوقە',
        house: 'خانوو',
        villa: 'ڤێلا',
      },
      areaLabel: 'ناوچە لە هەولێر',
      allAreas: 'هەموو ناوچەکان',
      priceLabel: 'بەرزترین نرخ',
      upTo: 'هەتا',
      sortLabel: 'ڕیزکردن',
      sorts: {
        featured: 'هەڵبژێردراوەکان',
        'price-asc': 'نرخ: کەمترین بۆ زۆرترین',
        'price-desc': 'نرخ: زۆرترین بۆ کەمترین',
        'area-desc': 'گەورەترین ڕووبەر (m²)',
      },
      matchingCount: 'موڵکی گونجاو دۆزرایەوە',
      reset: 'سڕینەوەی فلتەرەکان',
      emptyTitle: 'هیچ موڵکێک بەم فلتەرە نەدۆزرایەوە',
      emptyDesc: 'تکایە سنووری نرخ زیاد بکە یان فلتەری ناوچە بگۆڕە بۆ بینینی موڵکە بەردەستەکان.',
    },
    card: {
      beds: 'ژووری نووستن',
      baths: 'حەمام',
      areaUnit: 'م²',
      explore: 'بینینی خەریتە، 3D و 360°',
      hasBlueprint: 'خەریتە',
      has3d: 'مۆدێلی 3D',
      has360: 'گەشتی 360°',
    },
    modal: {
      close: 'داخستن',
      tabs: {
        photos: 'وێنە و دیمەنی جووڵاو',
        floorplan: 'خەریتە و قیاسی ڕووبەر',
        model3d: 'بینینی 3D',
        tour360: 'بینینی 360 پلە',
        booking: 'تایبەتمەندی و حجزکردن',
      },
      photos: {
        gifTourOn: 'وەستاندنی گەشتی جووڵاو',
        gifTourOff: 'گەشتی جووڵاوی سینەمایی (GIF)',
        liveMotion: 'LIVE MOTION',
        scene: 'دیمەن',
        prev: 'پێشوو',
        next: 'دواتر',
      },
      floorplan: {
        title: 'خەریتەی تەلارسازی و قیاسی ژوورەکان',
        subtitle: 'ماوس بخەرە سەر یان کلیک لە هەر ژوورێک بکە بۆ بینینی قیاس و ڕووبەری ورد',
        hoverHint: 'کلیک لە ژوورێک بکە لە خەریتەکەدا',
        selectedRoom: 'ژووری هەڵبژێردراو',
        dimensions: 'قیاس',
        area: 'ڕووبەر',
        floor: 'نهۆم',
        tableTitle: 'خشتەی ڕووبەری تەواوی ژوورەکان',
        roomCol: 'بەش / ژوور',
        floorCol: 'نهۆم',
        dimCol: 'قیاسی ورد (مەتر)',
        areaCol: 'ڕووبەر (م²)',
        totalBuilt: 'کۆی ڕووبەری موڵک',
      },
      model3d: {
        dragHint: 'ڕابکێشە بۆ سوڕاندنی 360° · سکڕۆڵ بکە بۆ زووم',
        cutawayOn: 'داخستنی سەربان',
        cutawayOff: 'کردنەوەی سەربان و ناوەوە',
        dayMode: 'دیمەنی ڕۆژ',
        twilightMode: 'دیمەنی ئێوارە',
        zoomIn: 'نزیککردنەوە',
        zoomOut: 'دوورخستنەوە',
        resetCam: 'ڕێکخستنەوەی گۆشە',
        fallbackNote: 'پشکنینی مۆدێلی تەلارسازی سێ ڕەهەندی',
      },
      tour360: {
        title: 'گەشتی پانۆرامای 360 پلە',
        dragHint: 'ڕابکێشە بۆ چەپ یان ڕاست بۆ سەیرکردنی تەواوی ژوورەکە',
        autoRotate: 'سوڕانەوەی خۆکار',
        pauseRotate: 'وەستاندنی سوڕانەوە',
        compass: 'ئاڕاستە',
        roomsLabel: 'گواستنەوە بۆ ژوورەکان',
        hotspotHint: 'کلیک لە خاڵە زێڕینەکانی ناو وێنەکە بکە بۆ گواستنەوە',
      },
      booking: {
        specsTitle: 'تایبەتمەندییە تەلارسازییەکان',
        totalArea: 'کۆی ڕووبەر',
        builtUp: 'ڕووبەری بینا',
        floors: 'نهۆمەکان',
        parking: 'گەراجی ئۆتۆمبێل',
        yearBuilt: 'ساڵی دروستکردن',
        furnishing: 'کەلوپەل و ناوماڵ',
        smartHome: 'سیستەمی زیرەک',
        highlightsTitle: 'خاڵە بەهێزەکانی موڵک',
        calcTitle: 'پلانی قیستی ئەم موڵکە',
        downPayment: 'پێشەکی',
        duration: 'ماوەی قیست',
        months: 'مانگ',
        monthlyPayment: 'قیستی مانگانە',
        totalFinanced: 'بڕی ماوە',
        formTitle: 'حجزکردنی سەردانی تایبەت (VIP)',
        fullName: 'ناوی تەواو',
        phone: 'ژمارەی مۆبایل / واتسئەپ',
        preferredDate: 'ڕۆژی گونجاو بۆ سەردان',
        notes: 'تێبینی یان پرسیار',
        submitBtn: 'دەرکردنی کارتی سەردانی VIP',
        whatsappBtn: 'پەیوەندی لە ڕێگەی واتسئەپ',
        passTitle: 'کارتی سەردانی تایبەتی باسڵون',
        passIssuedFor: 'تۆمارکراوە بۆ',
        passDate: 'بەرواری سەردان',
        passLocation: 'ئیمپایەر وۆڵد، تاوەری بازرگانی T1، هەولێر',
        bookAnother: 'حجزکردنەوەی کاتی نوێ',
      },
    },
    calculator: {
      eyebrow: 'پلاندانانی دارایی تایبەت',
      title: 'حاسیبەی قیستی موڵک لە باسڵون',
      subtitle: 'بە شێوەیەکی خێرا پێشەکی و بڕی قیستی مانگانەت دیاری بکە بەبێ سوود بۆ ماوەی ٢٤ هەتا ٧٢ مانگ.',
      propertyPrice: 'نرخی موڵک',
      downPayment: 'ڕێژەی پێشەکی',
      tenure: 'ماوەی دانەوەی قیست',
      monthsUnit: 'مانگ',
      summaryDown: 'پێشەکی ئامادە',
      summaryFinanced: 'کۆی ماوەی قیست',
      summaryMonthly: 'قیستی مانگانە',
      zeroInterestNote: 'پێشنیاری ڕاستەوخۆی باسڵون · گرێبەستی فەرمی تۆمارکراو',
      selectResidence: 'هەڵبژاردنی موڵکێک لە لیستەکە:',
    },
    gallery: {
      eyebrow: 'سەنتەری پێشوازی و ماکێتی تەلارسازی',
      title: 'گەلەری فەرمی باسڵون لە هەولێر',
      subtitle:
        'سەردانی گەلەری VIPـمان بکە لە ئیمپایەر وۆڵد بۆ بینینی ماکێتی پڕۆژەکان، نموونەی بەردی مەڕمەڕ و ڕاوێژکاری یاسایی و دارایی تایبەت.',
      addressLabel: 'ناونیشان',
      addressValue: 'ئیمپایەر وۆڵد، تاوەری بازرگانی T1، نهۆمی زەمینی، هەولێر',
      hoursLabel: 'کاتی کارکردن',
      hoursValue: 'شەممە – پێنجشەممە · ١٠:٠٠ بەیانی هەتا ٨:٠٠ ئێوارە',
      conciergeLabel: 'ڕاوێژکاری VIP',
      conciergeValue: '+964 750 888 4200 · baslunestudio@gmail.com',
      cta: 'حجزکردنی سەردانی گەلەری',
    },
    advisor: {
      buttonLabel: 'ڕاوێژکاری زیرەک',
      title: 'ڕاوێژکاری تایبەتی باسڵون',
      subtitle: 'پرسیار بکە دەربارەی ناوچەکانی هەولێر، نرخ، خەریتە یان قیست',
      welcome:
        'سڵاو و بەخێربێیت بۆ باسڵون ئیستەیتس لە هەولێر. دەتوانم یارمەتیت بدەم لە هەڵبژاردنی ڤێلا، خانوو، یان شوقە لە ئیمپایەر وۆڵد، دریم سیتی، پاڤیلیۆن، و عەنکاوە، یان حیسابکردنی قیست.',
      placeholder: 'پرسیارەکەت بنووسە... (نموونە: باشترین ڤێلا لە دریم سیتی)',
      send: 'ناردن',
      quickPrompts: [
        'ڤێلای مەلەوانگەدار لە دریم سیتی یان پاڤیلیۆن',
        'شوقە بە نرخی کەمتر لە ٢٥٠ هەزار دۆلار',
        'پلانی قیستی ٦٠ مانگە چۆنە؟',
      ],
    },
    footer: {
      tagline: 'تەلارسازی مۆدێرن و خزمەتگوزاری کڕینی موڵکی شاهانە لە هەولێر.',
      credit: 'Crafted by BASLUNE Digital Studio',
      email: 'baslunestudio@gmail.com',
      rights: '© 2026 BASLUNE Estates — Erbil. هەموو مافەکان پارێزراون.',
    },
  },
  ar: {
    brandName: 'BASLUNE ESTATES',
    nav: {
      residences: 'العقارات',
      calculator: 'حاسبة الأقساط',
      gallery: 'صالة العرض',
      contact: 'تواصل معنا',
      bookViewing: 'حجز معاينة',
    },
    hero: {
      eyebrow: 'أربيل · إقليم كوردستان · عمارة فاخرة',
      headline: 'عمارة استثنائية لأسلوب حياة راقٍ في أربيل',
      subheadline:
        'مجموعة باسلون المختارة في إمباير وورلد، دريم سيتي، بافيليون وعنكاوا — مع مخططات هندسية بمقاسات دقيقة، نماذج ثلاثية الأبعاد 3D، جولات 360° ومعاينة سينمائية متحركة.',
      primaryCta: 'استكشف العقارات',
      secondaryCta: 'حاسبة الأقساط',
      stats: {
        residences: { value: '10', label: 'عقارات مختارة في أربيل' },
        districts: { value: '9', label: 'أرقى الأحياء السكنية' },
        tours: { value: '3D + 360°', label: 'جولات ومخططات تفاعلية' },
        installment: { value: '72', label: 'شهراً أقساط مباشرة' },
      },
    },
    filters: {
      title: 'تصفية ذكية وفورية للعقارات',
      typeLabel: 'نوع العقار',
      types: {
        all: 'الكل',
        apartment: 'شقة',
        house: 'منزل',
        villa: 'فيلا',
      },
      areaLabel: 'المنطقة في أربيل',
      allAreas: 'جميع المناطق',
      priceLabel: 'الحد الأقصى للسعر',
      upTo: 'حتى',
      sortLabel: 'الترتيب',
      sorts: {
        featured: 'المميزة أولاً',
        'price-asc': 'السعر: من الأقل للأعلى',
        'price-desc': 'السعر: من الأعلى للأقل',
        'area-desc': 'أكبر مساحة (م²)',
      },
      matchingCount: 'عقار مطابق متاح',
      reset: 'إعادة ضبط الفلاتر',
      emptyTitle: 'لا توجد عقارات مطابقة لهذا البحث',
      emptyDesc: 'يرجى رفع سقف الميزانية أو اختيار منطقة أخرى لعرض العقارات المتاحة.',
    },
    card: {
      beds: 'غرف نوم',
      baths: 'حمامات',
      areaUnit: 'م²',
      explore: 'عرض المخطط و 3D و 360°',
      hasBlueprint: 'مخطط',
      has3d: 'نموذج 3D',
      has360: 'جولة 360°',
    },
    modal: {
      close: 'إغلاق',
      tabs: {
        photos: 'الصور والجولة المتحركة',
        floorplan: 'المخطط والمساحات',
        model3d: 'المجسم ثلاثي الأبعاد 3D',
        tour360: 'جولة 360 درجة',
        booking: 'المواصفات والحجز',
      },
      photos: {
        gifTourOn: 'إيقاف الجولة المتحركة',
        gifTourOff: 'تشغيل الجولة السينمائية (GIF)',
        liveMotion: 'LIVE MOTION',
        scene: 'مشهد',
        prev: 'السابق',
        next: 'التالي',
      },
      floorplan: {
        title: 'المخطط المعماري وتفاصيل الغرف',
        subtitle: 'مرّر أو انقر فوق أي غرفة لعرض الأبعاد الدقيقة والمساحة بالمتر المربع',
        hoverHint: 'انقر على أي غرفة في المخطط',
        selectedRoom: 'الغرفة المختارة',
        dimensions: 'الأبعاد',
        area: 'المساحة',
        floor: 'الطابق',
        tableTitle: 'جدول المساحات التفصيلي لكل غرفة',
        roomCol: 'الغرفة / القسم',
        floorCol: 'الطابق',
        dimCol: 'الأبعاد (متر)',
        areaCol: 'المساحة (م²)',
        totalBuilt: 'إجمالي مساحة العقار',
      },
      model3d: {
        dragHint: 'اسحب للتدوير 360° · مرّر للتقريب والتبعيد',
        cutawayOn: 'إغلاق السقف',
        cutawayOff: 'كشف السقف والداخل 3D',
        dayMode: 'إضاءة النهار',
        twilightMode: 'إضاءة الغروب',
        zoomIn: 'تقريب',
        zoomOut: 'تبعيد',
        resetCam: 'إعادة ضبط الكاميرا',
        fallbackNote: 'مستعرض المجسم المعماري ثلاثي الأبعاد',
      },
      tour360: {
        title: 'جولة بانورامية تفاعلية 360°',
        dragHint: 'اسحب يميناً أو يساراً لاستكشاف الغرفة بزاوية كاملة',
        autoRotate: 'تدوير تلقائي',
        pauseRotate: 'إيقاف التدوير',
        compass: 'البوصلة',
        roomsLabel: 'التنقل بين الغرف',
        hotspotHint: 'انقر على النقاط الذهبية داخل المشهد للانتقال بين الغرف',
      },
      booking: {
        specsTitle: 'المواصفات الهندسية الكاملة',
        totalArea: 'المساحة الإجمالية',
        builtUp: 'مساحة البناء',
        floors: 'الطوابق',
        parking: 'مواقف السيارات',
        yearBuilt: 'سنة البناء',
        furnishing: 'التأثيث',
        smartHome: 'النظام الذكي',
        highlightsTitle: 'أبرز المزايا',
        calcTitle: 'حاسبة أقساط هذا العقار',
        downPayment: 'الدفعة الأولى',
        duration: 'مدة السداد',
        months: 'شهراً',
        monthlyPayment: 'القسط الشهري',
        totalFinanced: 'المبلغ المتبقي',
        formTitle: 'حجز معاينة خاصة (VIP)',
        fullName: 'الاسم الكامل',
        phone: 'رقم الهاتف / واتساب',
        preferredDate: 'التاريخ المفضل للمعاينة',
        notes: 'ملاحظات إضافية',
        submitBtn: 'إصدار بطاقة معاينة VIP',
        whatsappBtn: 'استفسار عبر واتساب',
        passTitle: 'بطاقة المعاينة الخاصة من باسلون',
        passIssuedFor: 'صادرة باسم',
        passDate: 'موعد المعاينة',
        passLocation: 'إمباير وورلد، برج الأعمال T1، أربيل',
        bookAnother: 'حجز موعد آخر',
      },
    },
    calculator: {
      eyebrow: 'التخطيط المالي المرن',
      title: 'حاسبة التمويل والأقساط المباشرة',
      subtitle: 'خطط لدفعتك الأولى وقسطك الشهري مباشرة بدون فوائد لفترات تمتد من 24 إلى 72 شهراً.',
      propertyPrice: 'سعر العقار',
      downPayment: 'نسبة الدفعة الأولى',
      tenure: 'مدة الأقساط',
      monthsUnit: 'شهراً',
      summaryDown: 'الدفعة الأولى',
      summaryFinanced: 'الرصيد المقسّط',
      summaryMonthly: 'القسط الشهري',
      zeroInterestNote: 'خطة سداد مباشرة من المطور · عقود موثقة رسمياً',
      selectResidence: 'اختر عقاراً من القائمة لتعبئة السعر:',
    },
    gallery: {
      eyebrow: 'مركز المبيعات والماكيت المعماري',
      title: 'صالة عرض باسلون الفاخرة في أربيل',
      subtitle:
        'تفضل بزيارة صالة كبار الشخصيات في إمباير وورلد لمعاينة المجسمات المعمارية، عينات الرخام والخشب، والحصول على استشارة عقارية خاصة.',
      addressLabel: 'العنوان',
      addressValue: 'إمباير وورلد، برج الأعمال T1، الممشى الأرضي، أربيل',
      hoursLabel: 'ساعات العمل',
      hoursValue: 'السبت – الخميس · 10:00 صباحاً حتى 8:00 مساءً',
      conciergeLabel: 'الكونسيرج الخاص',
      conciergeValue: '+964 750 888 4200 · baslunestudio@gmail.com',
      cta: 'احجز موعداً في صالة العرض',
    },
    advisor: {
      buttonLabel: 'المستشار الذكي',
      title: 'مستشار باسلون العقاري',
      subtitle: 'اسأل عن أحياء أربيل، الأسعار، المخططات والأقساط',
      welcome:
        'أهلاً بك في باسلون إستيتس — أربيل. يسعدني مساعدتك في مقارنة الفلل والمنازل والشقق في إمباير وورلد، دريم سيتي، بافيليون، وعنكاوا وحساب خطط الدفع.',
      placeholder: 'اكتب سؤالك هنا... (مثال: أفضل فيلا بمسبح في دريم سيتي)',
      send: 'إرسال',
      quickPrompts: [
        'فلل بمسبح في دريم سيتي أو بافيليون',
        'شقق بسعر أقل من 250 ألف دولار',
        'تفاصيل الأقساط لمدة 60 شهراً',
      ],
    },
    footer: {
      tagline: 'عمارة معاصرة واستشارات عقارية فاخرة في قلب أربيل.',
      credit: 'Crafted by BASLUNE Digital Studio',
      email: 'baslunestudio@gmail.com',
      rights: '© 2026 BASLUNE Estates — Erbil. جميع الحقوق محفوظة.',
    },
  },
  en: {
    brandName: 'BASLUNE ESTATES',
    nav: {
      residences: 'Residences',
      calculator: 'Payment Plan',
      gallery: 'Sales Gallery',
      contact: 'Contact',
      bookViewing: 'Book Viewing',
    },
    hero: {
      eyebrow: 'Erbil · Kurdistan Region · Architectural Luxury',
      headline: 'Architectural Living Curated for Erbil’s Premier Skylines',
      subheadline:
        'Explore 10 bespoke residences across Empire World, Dream City, Pavilion, and Ankawa — complete with dimensioned 2D blueprints, interactive 3D models, 360° room tours, and cinematic motion previews.',
      primaryCta: 'Explore Portfolio',
      secondaryCta: 'Payment Calculator',
      stats: {
        residences: { value: '10', label: 'Curated Erbil Residences' },
        districts: { value: '9', label: 'Prime Districts Covered' },
        tours: { value: '3D + 360°', label: 'Interactive Inspection' },
        installment: { value: '72', label: 'Months Direct Financing' },
      },
    },
    filters: {
      title: 'Portfolio Precision Filter',
      typeLabel: 'Property Type',
      types: {
        all: 'All',
        apartment: 'Apartment',
        house: 'House',
        villa: 'Villa',
      },
      areaLabel: 'Erbil Neighborhood',
      allAreas: 'All Districts',
      priceLabel: 'Max Budget',
      upTo: 'Up to',
      sortLabel: 'Sort By',
      sorts: {
        featured: 'Featured',
        'price-asc': 'Price: Low to High',
        'price-desc': 'Price: High to Low',
        'area-desc': 'Largest Area (m²)',
      },
      matchingCount: 'matching residences',
      reset: 'Reset Filters',
      emptyTitle: 'No residences match these filters',
      emptyDesc: 'Increase the maximum price slider or switch neighborhood to view available listings.',
    },
    card: {
      beds: 'Beds',
      baths: 'Baths',
      areaUnit: 'm²',
      explore: 'Inspect Blueprint, 3D & 360°',
      hasBlueprint: 'Floor Plan',
      has3d: '3D Model',
      has360: '360° Tour',
    },
    modal: {
      close: 'Close',
      tabs: {
        photos: 'Photos & Motion Tour',
        floorplan: 'Floor Plan & Dimensions',
        model3d: 'Interactive 3D',
        tour360: '360° Virtual Tour',
        booking: 'Specs & Private Booking',
      },
      photos: {
        gifTourOn: 'Pause Motion Tour',
        gifTourOff: 'Play Cinematic GIF Tour',
        liveMotion: 'LIVE MOTION',
        scene: 'Scene',
        prev: 'Previous',
        next: 'Next',
      },
      floorplan: {
        title: 'Architectural Blueprint & Room Dimensions',
        subtitle: 'Hover or click any room inside the blueprint to inspect exact meters and square footage',
        hoverHint: 'Select a room on the blueprint',
        selectedRoom: 'Selected Space',
        dimensions: 'Dimensions',
        area: 'Net Area',
        floor: 'Level',
        tableTitle: 'Room-by-Room Area Breakdown',
        roomCol: 'Space / Room',
        floorCol: 'Level',
        dimCol: 'Dimensions (m)',
        areaCol: 'Area (m²)',
        totalBuilt: 'Total Property Area',
      },
      model3d: {
        dragHint: 'Drag to orbit 360° · Scroll to zoom',
        cutawayOn: 'Restore Roof',
        cutawayOff: 'Roof Cutaway / Interior',
        dayMode: 'Daylight',
        twilightMode: 'Twilight',
        zoomIn: 'Zoom In',
        zoomOut: 'Zoom Out',
        resetCam: 'Reset View',
        fallbackNote: 'Interactive 3D architectural volume viewer',
      },
      tour360: {
        title: '360° Panoramic Room Tour',
        dragHint: 'Drag horizontally to look around · Use compass or hotspots to navigate',
        autoRotate: 'Auto Rotate',
        pauseRotate: 'Pause Rotation',
        compass: 'Heading',
        roomsLabel: 'Jump to Room',
        hotspotHint: 'Click gold scene hotspots to transition smoothly between spaces',
      },
      booking: {
        specsTitle: 'Architectural Specifications',
        totalArea: 'Plot / Total Area',
        builtUp: 'Built-Up Area',
        floors: 'Levels',
        parking: 'Private Parking',
        yearBuilt: 'Year Completed',
        furnishing: 'Furnishing',
        smartHome: 'Automation',
        highlightsTitle: 'Signature Highlights',
        calcTitle: 'Property Payment Schedule',
        downPayment: 'Down Payment',
        duration: 'Installment Term',
        months: 'Months',
        monthlyPayment: 'Monthly Installment',
        totalFinanced: 'Financed Balance',
        formTitle: 'Book Private Viewing',
        fullName: 'Full Name',
        phone: 'Phone / WhatsApp',
        preferredDate: 'Preferred Viewing Date',
        notes: 'Viewing Notes',
        submitBtn: 'Generate VIP Viewing Pass',
        whatsappBtn: 'WhatsApp Inquiry',
        passTitle: 'BASLUNE VIP Viewing Pass',
        passIssuedFor: 'Issued For',
        passDate: 'Scheduled Date',
        passLocation: 'Empire World, Business Tower T1, Erbil',
        bookAnother: 'Schedule Another Visit',
      },
    },
    calculator: {
      eyebrow: 'Bespoke Acquisition Terms',
      title: 'Erbil Direct Installment Calculator',
      subtitle: 'Model your down payment and zero-interest developer schedule across 24 to 72 months.',
      propertyPrice: 'Residence Value',
      downPayment: 'Down Payment',
      tenure: 'Payment Term',
      monthsUnit: 'Months',
      summaryDown: 'Initial Deposit',
      summaryFinanced: 'Remaining Balance',
      summaryMonthly: 'Monthly Payment',
      zeroInterestNote: '0% Developer Interest · Registered Title Transfer',
      selectResidence: 'Quick-load a residence price:',
    },
    gallery: {
      eyebrow: 'Private Client Lounge',
      title: 'BASLUNE VIP Sales Gallery — Erbil',
      subtitle:
        'Visit our flagship architectural salon at Empire World to inspect scale models, material stone palettes, and arrange private chauffeur-driven site tours.',
      addressLabel: 'Gallery Address',
      addressValue: 'Empire World, Business Tower T1, Ground Promenade, Erbil',
      hoursLabel: 'Private Hours',
      hoursValue: 'Saturday – Thursday · 10:00 AM – 8:00 PM',
      conciergeLabel: 'Direct Desk',
      conciergeValue: '+964 750 888 4200 · baslunestudio@gmail.com',
      cta: 'Schedule Gallery Visit',
    },
    advisor: {
      buttonLabel: 'AI Advisor',
      title: 'BASLUNE Property Advisor',
      subtitle: 'Ask about Erbil districts, floor plans, 3D tours & pricing',
      welcome:
        'Welcome to BASLUNE Estates — Erbil. Ask me to compare villas, houses, and apartments across Empire World, Dream City, Pavilion, and Ankawa, or estimate a payment schedule.',
      placeholder: 'Ask about Erbil neighborhoods, villas, or installments...',
      send: 'Send',
      quickPrompts: [
        'Pool villas in Dream City or Pavilion',
        'Apartments under $250,000',
        'How does the 60-month installment plan work?',
      ],
    },
    footer: {
      tagline: 'Dark architectural luxury & private residence advisory in Erbil.',
      credit: 'Crafted by BASLUNE Digital Studio',
      email: 'baslunestudio@gmail.com',
      rights: '© 2026 BASLUNE Estates — Erbil. All rights reserved.',
    },
  },
};
