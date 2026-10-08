/* NamAgriConnect — Attribute-based translation system */

const TRANSLATIONS = {
  en: {
    // Header
    login: '🔐 Login', logout: '⏻ Logout', sell: '➕ Sell', myFarm: '👤 My Farm',
    // Tabs
    tab_market: '🛒 Market', tab_sell: '📸 Post Listing', tab_soil: '🧪 Soil & NPK AI',
    tab_virus: '🦠 Virus Scanner', tab_water: '💧 Water & Drip', tab_weather: '🌦️ Agro-Weather',
    tab_rfq: '📢 RFQs & Ticker', tab_talk: '💬 Agri-Talk', tab_ussd: '📱 USSD Gateway',
    tab_profile: '👤 My Farm',
    // Market
    market_title: '🛒 Live Marketplace',
    market_sub: 'Buy & sell directly — no middlemen. Contact sellers on WhatsApp instantly.',
    stat_listings: 'Active Listings', stat_farmers: 'Registered Farmers', stat_trades: 'Trades This Month',
    search_ph: '🔍 Search crops, livestock, region...',
    filter_allCats: 'All Categories', filter_allRegions: 'All Regions',
    // Sell
    sell_title: '📸 Post a New Listing',
    sell_sub: 'Up to 10 photos, auto-compressed. Buyers contact you on your registered WhatsApp.',
    lbl_title: 'Product Title', lbl_category: 'Category', lbl_description: 'Description',
    lbl_quantity: 'Quantity', lbl_unit: 'Unit', lbl_price: 'Price (N$)', lbl_pricePer: 'Price per',
    lbl_region: 'Region', lbl_town: 'Town', lbl_badge: 'Compliance Badge',
    lbl_delivery: 'Delivery', lbl_photos: '📷 Photos (up to 10)',
    btn_publish: '✅ Publish Listing',
    // Soil
    soil_title: '🧪 AI Soil Condition & Nutrient Scanner',
    soil_sub: 'Photo + optional readings. Powered by NamAgri AI.',
    soil_scan: 'Tap to Scan Soil',
    btn_manual: '✍️ Enter Readings Manually',
    // Virus
    virus_title: '🦠 AI Plant Virus & Disease Scanner',
    virus_scan: 'Tap to Scan Plant',
    virus_alerts: '🚨 Regional Outbreak Alerts',
    // Water
    water_title: '💧 Smart Water & Irrigation Calculator',
    lbl_crop: 'Crop', lbl_area: 'Area (ha)', lbl_soil: 'Soil', lbl_stage: 'Stage',
    // Weather
    weather_title: '🌦️ Agro-Weather Intelligence',
    ndvi_title: '🛰️ Satellite NDVI — Crop Health',
    // RFQ
    rfq_title: '📢 RFQs & Shortage Ticker',
    rfq_sub: 'Post an RFQ (auto-archives after 7 days)',
    rfq_what: 'What do you need?', rfq_region: 'Region', rfq_budget: 'Budget (N$)',
    btn_postRFQ: '📤 Post RFQ',
    price_trends: '📊 Price Trends',
    // Talk
    talk_title: '💬 Agri-Talk & Community',
    talk_feed: '🗣️ Agri-Talk Feed',
    talk_ph: 'Share advice or ask a question...',
    leaderboard: '🏆 Farmer Leaderboard',
    emergency: '🚨 Emergency Hotlines',
    btn_post: 'Post',
    // USSD
    ussd_title: '📱 USSD Gateway (*555#)',
    ussd_sub: 'No internet? Dial *555# on any phone. Try it here:',
    // Profile
    profile_title: '👤 My Farm Dashboard',
    sales_history: '📜 Sales History (Auto-Archived)',
    // Common
    loading: 'Loading...', retry: '🔄 Retry', cancel: '✖ Cancel',
    whatsapp: '💬 WhatsApp', call: '📞 Call', comments: '💬 Comments', markSold: '✅ Mark Sold',
    stat_active: 'Active', stat_sold: 'Sold', stat_rating: 'Rating',
    btn_logout: '👋 Logout',
    // Messages
    welcome: 'Welcome', published: 'Published! Refreshing market...', logoutConfirm: 'Logout?'
  },
  osh: {
    login: '🔐 Ehololo', logout: 'Fiyapo epandja lepya loye', sell: '➕ Landifa', myFarm: '👤 Epya lyandje',
    tab_market: '🛒 Omatala', tab_sell: '📸 Landifa', tab_soil: '🧪 Evhu AI',
    tab_virus: '🦠 Omukithi', tab_water: '💧 Omeva', tab_weather: '🌦️ Onghalo yomepo',
    tab_rfq: '📢 Omapulo', tab_talk: '💬 Omukunda', tab_ussd: '📱 Okulongifa ondodi yoye yopeke',
    tab_profile: '👤 Epya lyandje',
    market_title: '🛒 Omatala Nomalandifilo opefimbo',
    market_sub: 'Landeni nokulandifa. Meukililo ko WhatsApp.',
    stat_listings: 'Iilongekidho', stat_farmers: 'Aalimi', stat_trades: 'Iilonga',
    search_ph: '🔍 Konga eshi wahala noupu omboga, oimuna...',
    filter_allCats: 'Iindifomwa aishes', filter_allRegions: 'Iitopolwa ayihe',
    sell_title: '📸 Landifa Oinima Iipe',
    sell_sub: 'Efano loshilandifomwa 10. Aalandi otave ku mono ko WhatsApp.',
    lbl_title: 'Edhina lyoinima', lbl_category: 'Ongundu', lbl_description: 'Efatululo',
    lbl_quantity: 'Omuvalu', lbl_unit: 'Oshidhigu', lbl_price: 'Ondando (N$)', lbl_pricePer: 'Ondando ku',
    lbl_region: 'Oshikandjo', lbl_town: 'Ondoolopa', lbl_badge: 'Oshihopaenenwa',
    lbl_delivery: 'Etumwalaka', lbl_photos: '📷 Efano loshilandifomwa (10)',
    btn_publish: '✅ Landifa',
    soil_title: '🧪 Ehongo lyevhu neNPK',
    soil_sub: 'Ekwalitho lyefano. NamAgri AI.',
    soil_scan: 'Kanda po okukona evhu',
    btn_manual: '✍️ Nyola omaukwatya',
    virus_title: '🦠 Ehongo lyomukithi',
    virus_scan: 'Didilika Ombuto',
    virus_alerts: '🚨 Omakumagidho omukithi',
    water_title: '💧 Omeva nOmilonga',
    lbl_crop: 'Omuti', lbl_area: 'Eha (ha)', lbl_soil: 'Evhu', lbl_stage: 'Omuvalu',
    weather_title: '🌦️ Onkalo yombepo',
    ndvi_title: '🛰️ Oonkundathana dhomuti',
    rfq_title: '📢 Omapulo',
    rfq_sub: 'Tuma epulo (omayuva 7)',
    rfq_what: 'Oshike wa pumbwa?', rfq_region: 'Oshikandjo', rfq_budget: 'Iimaliwa (N$)',
    btn_postRFQ: '📤 Tuma epulo',
    price_trends: '📊 Eendado',
    talk_title: '💬 Omukunda',
    talk_feed: '🗣️ Omukunda',
    talk_ph: 'Topolola omayele...',
    leaderboard: '🏆 Aalimi aakuluntu',
    emergency: '🚨 Iinakugwanithwa',
    btn_post: 'Tuma',
    ussd_title: '📱 Okulongifa ongodi yoye yopeke (*555#)',
    ussd_sub: 'Kape na ekwatafano lopa malungula? Finda *555#.',
    profile_title: '👤 Epya lyandje',
    sales_history: '📜 Iilonga',
    loading: 'Otali etele...', retry: '🔄 Kambadhala', cancel: '✖ Etha',
    whatsapp: '💬 WhatsApp', call: '📞 Ifana', comments: '💬 Omawedelepo', markSold: '✅ Landifwa',
    stat_active: 'Ili po', stat_sold: 'Ya landifwa po', stat_rating: 'Ondando',
    btn_logout: '👋 Fiyapo epandja lepya loye',
    welcome: 'Weyapo', published: 'Ya landifwa!', logoutConfirm: 'Shikoleka'
  },
  afr: {
    login: '🔐 Teken in', logout: '⏻ Teken uit', sell: '➕ Verkoop', myFarm: '👤 My Plaas',
    tab_market: '🛒 Mark', tab_sell: '📸 Plaas Listing', tab_soil: '🧪 Grond AI',
    tab_virus: '🦠 Virus Skandeerder', tab_water: '💧 Water', tab_weather: '🌦️ Weer',
    tab_rfq: '📢 RFQs', tab_talk: '💬 Boere-Praat', tab_ussd: '📱 USSD',
    tab_profile: '👤 My Plaas',
    market_title: '🛒 Lewendige Mark',
    market_sub: 'Koop en verkoop direk. Kontak verkopers op WhatsApp.',
    stat_listings: 'Aktiewe Advertensies', stat_farmers: 'Geregistreerde Boere', stat_trades: 'Transaksies',
    search_ph: '🔍 Soek gewasse, vee...',
    filter_allCats: 'Alle Kategorieë', filter_allRegions: 'Alle Streke',
    sell_title: '📸 Plaas Nuwe Advertensie',
    sell_sub: 'Tot 10 foto\'s. Kopers kontak jou op WhatsApp.',
    lbl_title: 'Produk Naam', lbl_category: 'Kategorie', lbl_description: 'Beskrywing',
    lbl_quantity: 'Hoeveelheid', lbl_unit: 'Eenheid', lbl_price: 'Prys (N$)', lbl_pricePer: 'Prys per',
    lbl_region: 'Streek', lbl_town: 'Dorp', lbl_badge: 'Sertifisering',
    lbl_delivery: 'Aflewering', lbl_photos: '📷 Foto\'s (10)',
    btn_publish: '✅ Plaas',
    soil_title: '🧪 Grond Ontleding AI',
    soil_sub: 'Foto + lesings. NamAgri AI.',
    soil_scan: 'Tik om Grond te Skandeer',
    btn_manual: '✍️ Voer Lesings In',
    virus_title: '🦠 Plant Virus Skandeerder',
    virus_scan: 'Tik om Plant te Skandeer',
    virus_alerts: '🚨 Streeks Uitbrake',
    water_title: '💧 Water & Besproeiing',
    lbl_crop: 'Gewas', lbl_area: 'Oppervlakte (ha)', lbl_soil: 'Grond', lbl_stage: 'Stadium',
    weather_title: '🌦️ Landbou-Weer',
    ndvi_title: '🛰️ Satelliet NDVI — Gesondheid',
    rfq_title: '📢 RFQs & Tekort',
    rfq_sub: 'Plaas RFQ (verval na 7 dae)',
    rfq_what: 'Wat benodig jy?', rfq_region: 'Streek', rfq_budget: 'Begroting (N$)',
    btn_postRFQ: '📤 Plaas RFQ',
    price_trends: '📊 Pryse',
    talk_title: '💬 Boere-Praat',
    talk_feed: '🗣️ Boere-Praat',
    talk_ph: 'Deel raad...',
    leaderboard: '🏆 Boere-Ranglys',
    emergency: '🚨 Noodlyne',
    btn_post: 'Plaas',
    ussd_title: '📱 USSD (*555#)',
    ussd_sub: 'Geen internet? Skakel *555#.',
    profile_title: '👤 My Plaas',
    sales_history: '📜 Verkoopgeskiedenis',
    loading: 'Laai...', retry: '🔄 Probeer', cancel: '✖ Kanselleer',
    whatsapp: '💬 WhatsApp', call: '📞 Bel', comments: '💬 Kommentaar', markSold: '✅ Verkoop',
    stat_active: 'Aktief', stat_sold: 'Verkoop', stat_rating: 'Gradering',
    btn_logout: '👋 Teken uit',
    welcome: 'Welkom', published: 'Geplaas!', logoutConfirm: 'Teken uit?'
  },
  her: {
    login: '🔐 Taurire', logout: '⏻ Pita', sell: '➕ Randisa', myFarm: '👤 Omurima wandje',
    tab_market: '🛒 Otjihavero', tab_sell: '📸 Randisa', tab_soil: '🧪 Ehi AI',
    tab_virus: '🦠 Omukithi', tab_water: '💧 Omeva', tab_weather: '🌦️ Ombuze',
    tab_rfq: '📢 Omazundo', tab_talk: '💬 Ovandu', tab_ussd: '📱 USSD',
    tab_profile: '👤 Omurima wandje',
    market_title: '🛒 Otjihavero',
    market_sub: 'Randisa. Tumisa WhatsApp.',
    stat_listings: 'Ovandisa', stat_farmers: 'Ovarimi', stat_trades: 'Omirongo',
    search_ph: '🔍 Tara ovikurya...',
    filter_allCats: 'Ovikoa avihe', filter_allRegions: 'Ozondema azehe',
    sell_title: '📸 Randisa Ovihape',
    sell_sub: 'Ovifananekero 10.',
    lbl_title: 'Ena', lbl_category: 'Onganda', lbl_description: 'Omahandjauriro',
    lbl_quantity: 'Otjivaro', lbl_unit: 'Ondjivisiro', lbl_price: 'Ondando (N$)', lbl_pricePer: 'Ondando ku',
    lbl_region: 'Okuwa', lbl_town: 'Onganda', lbl_badge: 'Otjipatri',
    lbl_delivery: 'Okutwara', lbl_photos: '📷 Ovifananekero',
    btn_publish: '✅ Randisa',
    soil_title: '🧪 Ehongo roEhi',
    soil_sub: 'Esanekero. NamAgri AI.',
    soil_scan: 'Kanda okukona ehi',
    btn_manual: '✍️ Nyora ovivaro',
    virus_title: '🦠 Ehongo romukithi',
    virus_scan: 'Kanda okukona omuti',
    virus_alerts: '🚨 Omakumagidho',
    water_title: '💧 Omeva',
    lbl_crop: 'Omuti', lbl_area: 'Otjihwa', lbl_soil: 'Ehi', lbl_stage: 'Omuano',
    weather_title: '🌦️ Ombuze',
    ndvi_title: '🛰️ Otjikando tjomuti',
    rfq_title: '📢 Omazundo',
    rfq_sub: 'Tuma omazundo (7 omayuva)',
    rfq_what: 'Ove na omburo?', rfq_region: 'Okuwa', rfq_budget: 'Ovimariva',
    btn_postRFQ: '📤 Tuma',
    price_trends: '📊 Oviyandja',
    talk_title: '💬 Ovandu',
    talk_feed: '🗣️ Ovandu',
    talk_ph: 'Pandjara omahandjauriro...',
    leaderboard: '🏆 Ovarimi aakururukire',
    emergency: '🚨 Ozondjeso',
    btn_post: 'Tuma',
    ussd_title: '📱 USSD (*555#)',
    ussd_sub: 'Kape na internet? Huhuna *555#.',
    profile_title: '👤 Omurima wandje',
    sales_history: '📜 Omirongo',
    loading: 'Otji ri kokure...', retry: '🔄 Kambadhala', cancel: '✖ Isena',
    whatsapp: '💬 WhatsApp', call: '📞 Isana', comments: '💬 Omahandjauriro', markSold: '✅ Randisiwe',
    stat_active: 'Ri po', stat_sold: 'Randisiwe', stat_rating: 'Ondando',
    btn_logout: '👋 Pita',
    welcome: 'Wa koka', published: 'Ya randisiwe!', logoutConfirm: 'Pita?'
  },
  kho: {
    login: '🔐 ǁNāǂgā', logout: '⏻ ǁNā', sell: '➕ ǁAma', myFarm: '👤 Ti ǁHūs',
    tab_market: '🛒 ǁAma', tab_sell: '📸 ǁAma', tab_soil: '🧪 ǁHūs',
    tab_virus: '🦠 ǁNā', tab_water: '💧 ǁGam', tab_weather: '🌦️ ǁGuib',
    tab_rfq: '📢 ǁNā', tab_talk: '💬 ǁAma', tab_ussd: '📱 USSD',
    tab_profile: '👤 Ti ǁHūs',
    market_title: '🛒 ǁAma',
    market_sub: 'ǁAma. WhatsApp.',
    stat_listings: 'ǁAma', stat_farmers: 'ǁHūs', stat_trades: 'ǁAma',
    search_ph: '🔍 ǁGâu...',
    filter_allCats: 'ǁNā', filter_allRegions: 'ǁNā',
    sell_title: '📸 ǁAma ǁNā',
    sell_sub: 'ǁAma 10.',
    lbl_title: 'ǁNā', lbl_category: 'ǁAma', lbl_description: 'ǁNā',
    lbl_quantity: 'ǁNā', lbl_unit: 'ǁNā', lbl_price: 'ǁNā (N$)', lbl_pricePer: 'ǁNā',
    lbl_region: 'ǁNā', lbl_town: 'ǁNā', lbl_badge: 'ǁNā',
    lbl_delivery: 'ǁNā', lbl_photos: '📷 ǁNā',
    btn_publish: '✅ ǁAma',
    soil_title: '🧪 ǁHūs',
    soil_sub: 'ǁNā. NamAgri AI.',
    soil_scan: 'ǁNā ǁNā',
    btn_manual: '✍️ ǁNā',
    virus_title: '🦠 ǁNā',
    virus_scan: 'ǁNā ǁNā',
    virus_alerts: '🚨 ǁNā',
    water_title: '💧 ǁGam',
    lbl_crop: 'ǁNā', lbl_area: 'ǁNā (ha)', lbl_soil: 'ǁHūs', lbl_stage: 'ǁNā',
    weather_title: '🌦️ ǁGuib',
    ndvi_title: '🛰️ ǁNā',
    rfq_title: '📢 ǁNā',
    rfq_sub: 'ǁNā (7 ǁNā)',
    rfq_what: 'ǁNā?', rfq_region: 'ǁNā', rfq_budget: 'ǁNā (N$)',
    btn_postRFQ: '📤 ǁNā',
    price_trends: '📊 ǁNā',
    talk_title: '💬 ǁAma',
    talk_feed: '🗣️ ǁAma',
    talk_ph: 'ǁNā...',
    leaderboard: '🏆 ǁNā',
    emergency: '🚨 ǁNā',
    btn_post: 'ǁNā',
    ussd_title: '📱 USSD',
    ussd_sub: 'ǁNā *555#.',
    profile_title: '👤 Ti ǁHūs',
    sales_history: '📜 ǁNā',
    loading: 'ǁNā...', retry: '🔄 ǁNā', cancel: '✖ ǁNā',
    whatsapp: '💬 WhatsApp', call: '📞 ǁNā', comments: '💬 ǁNā', markSold: '✅ ǁNā',
    stat_active: 'ǁNā', stat_sold: 'ǁNā', stat_rating: 'ǁNā',
    btn_logout: '👋 ǁNā',
    welcome: 'ǁNā', published: 'ǁNā!', logoutConfirm: 'ǁNā?'
  },
  siz: {
    login: '🔐 Kena', logout: '⏻ Taha', sell: '➕ Rekisa', myFarm: '👤 Silepo sa ka',
    tab_market: '🛒 Mubaraka', tab_sell: '📸 Rekisa', tab_soil: '🧪 Mubu',
    tab_virus: '🦠 Kozo', tab_water: '💧 Mazi', tab_weather: '🌦️ Bupilo',
    tab_rfq: '📢 Dikupo', tab_talk: '💬 Mubuso', tab_ussd: '📱 USSD',
    tab_profile: '👤 Silepo sa ka',
    market_title: '🛒 Mubaraka',
    market_sub: 'Reka ni ku rekisa. WhatsApp.',
    stat_listings: 'Likwalezimo', stat_farmers: 'Balimi', stat_trades: 'Misipili',
    search_ph: '🔍 Batla likunwa...',
    filter_allCats: 'Mikoa kaofela', filter_allRegions: 'Libaka kaofela',
    sell_title: '📸 Rekisa Sika Sipya',
    sell_sub: 'Lifota 10.',
    lbl_title: 'Libizo', lbl_category: 'Mukoa', lbl_description: 'Tlhaloso',
    lbl_quantity: 'Bukata', lbl_unit: 'Sikalo', lbl_price: 'Tjelete (N$)', lbl_pricePer: 'Tjelete ku',
    lbl_region: 'Sihalo', lbl_town: 'Munzi', lbl_badge: 'Sitlankiso',
    lbl_delivery: 'Kutisa', lbl_photos: '📷 Lifota',
    btn_publish: '✅ Rekisa',
    soil_title: '🧪 Tlhahlobo ya Mubu',
    soil_sub: 'Sifota. NamAgri AI.',
    soil_scan: 'Tobela ku hlahloba',
    btn_manual: '✍️ Ngola',
    virus_title: '🦠 Tlhahlobo ya Kozo',
    virus_scan: 'Tobela ku hlahloba',
    virus_alerts: '🚨 Dikupo',
    water_title: '💧 Mazi',
    lbl_crop: 'Sika', lbl_area: 'Sibaka (ha)', lbl_soil: 'Mubu', lbl_stage: 'Sikalo',
    weather_title: '🌦️ Bupilo',
    ndvi_title: '🛰️ Sifota sa naha',
    rfq_title: '📢 Dikupo',
    rfq_sub: 'Lahla kopo (7 mazazi)',
    rfq_what: 'U batla eng?', rfq_region: 'Sihalo', rfq_budget: 'Tjelete',
    btn_postRFQ: '📤 Lahla',
    price_trends: '📊 Litjelete',
    talk_title: '💬 Mubuso',
    talk_feed: '🗣️ Mubuso',
    talk_ph: 'Abela likelezo...',
    leaderboard: '🏆 Balimi ba pahamile',
    emergency: '🚨 Dikgokelo',
    btn_post: 'Lahla',
    ussd_title: '📱 USSD (*555#)',
    ussd_sub: 'Ha u na internet? Bizwa *555#.',
    profile_title: '👤 Silepo sa ka',
    sales_history: '📜 Histori',
    loading: 'Ku londa...', retry: '🔄 Leka', cancel: '✖ Taha',
    whatsapp: '💬 WhatsApp', call: '📞 Bizwa', comments: '💬 Mafoko', markSold: '✅ Rekisizwe',
    stat_active: 'Pila', stat_sold: 'Rekisizwe', stat_rating: 'Sikalo',
    btn_logout: '👋 Taha',
    welcome: 'Muyemi', published: 'Rekisizwe!', logoutConfirm: 'Taha?'
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function t(key) {
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || TRANSLATIONS.en[key] || key;
}

function applyTranslations() {
  // Translate every element with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const translated = t(key);
    // Preserve asterisk for required fields
    if (el.dataset.required === 'true') {
      el.textContent = translated + ' *';
    } else {
      el.innerHTML = translated;
    }
  });

  // Placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPh);
  });

  // Auth button (dynamic based on login state)
  const authBtn = document.getElementById('authBtn');
  if (authBtn && !window.currentUser) authBtn.innerHTML = t('login');

  const farmBtn = document.getElementById('myFarmBtn');
  if (farmBtn) farmBtn.innerHTML = t('myFarm');

  // Update <html lang> attribute
  document.documentElement.setAttribute('lang', currentLang);

  console.log('🌐 Language applied:', currentLang);
}

function setLang(v) {
  currentLang = v;
  localStorage.setItem('lang', v);
  applyTranslations();
  const names = { en: 'English', osh: 'Oshiwambo', afr: 'Afrikaans', her: 'Otjiherero', kho: 'Khoekhoegowab', siz: 'Silozi' };
  toast('🌐 ' + (names[v] || v));
}

function initLang() {
  const saved = localStorage.getItem('lang') || 'en';
  currentLang = saved;
  const sel = document.getElementById('lang');
  if (sel) sel.value = saved;
  applyTranslations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLang);
} else {
  initLang();
}

window.setLang = setLang;
window.t = t;
window.applyTranslations = applyTranslations;
window.TRANSLATIONS = TRANSLATIONS;
console.log('✅ i18n.js ready with', Object.keys(TRANSLATIONS).length, 'languages');