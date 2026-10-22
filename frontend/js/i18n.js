/* Full 6-Language Translations */

const TRANSLATIONS = {
  en: {
    app_name: 'NamAgriConnect — Namibia All-in-One Agri Platform',
    login: '🔐 Login', logout: '⏻ Logout', sell_btn: '➕ Sell',
    tab_market: '🛒 Market', tab_sell: '📸 Post Listing', tab_soil: '🧪 Soil & NPK AI',
    tab_virus: '🦠 Virus Scanner', tab_water: '💧 Water & Drip', tab_weather: '🌦️ Agro-Weather',
    tab_rfq: '📢 RFQs & Ticker', tab_talk: '💬 Agri-Talk', tab_ussd: '📱 USSD Gateway',
    tab_orders: '📦 My Orders', tab_wallet: '💰 Wallet', tab_track: '🚚 Track Order',
    tab_market_short: '🛒 Market', tab_sell_short: '➕ Sell', tab_wallet_short: '💰 Wallet', tab_orders_short: '📦 Orders',
    market_title: '🛒 Live Marketplace', market_sub: 'Buy & sell directly — no middlemen.',
    stat_listings: 'Active Listings', stat_farmers: 'Registered Farmers', stat_trades: 'Trades This Month',
    search_ph: '🔍 Search crops, livestock...', all_cats: 'All Categories', all_regions: 'All Regions',
    cat_crops: 'Crops & Horticulture', cat_livestock: 'Livestock', cat_inputs: 'Inputs & Seeds',
    cat_machinery: 'Machinery Rental', cat_charcoal: 'Biomass / Charcoal',
    sell_title: '📸 Post a New Listing', sell_sub: 'Up to 10 photos.',
    form_title: 'Product Title *', form_cat: 'Category *', form_desc: 'Description',
    form_qty: 'Quantity *', form_unit: 'Unit *', form_price: 'Price (N$) *', form_priceper: 'Price per',
    form_region: 'Region *', form_town: 'Town *', form_badge: 'Compliance Badge',
    form_delivery: 'Delivery', form_photos: '📷 Photos (up to 10)',
    badge_none: 'None', del_pickup: 'Pickup only', del_buyer: 'Delivery (buyer pays)', del_incl: 'Delivery included',
    btn_publish: '✅ Publish Listing', btn_manual: '✍️ Manual Readings', btn_post: 'Post',
    soil_title: '🧪 Soil AI', soil_scan: 'Tap to Scan Soil', soil_sub: 'Powered by NamAgri AI.',
    virus_title: '🦠 Virus Scanner', virus_scan: 'Tap to Scan Plant', virus_alerts: '🚨 Regional Outbreak Alerts',
    water_title: '💧 Water & Drip', lbl_crop: 'Crop', lbl_area: 'Area (ha)', lbl_soil: 'Soil', lbl_stage: 'Stage',
    crop_maize: 'Maize', crop_wheat: 'Wheat', crop_tomato: 'Tomato', crop_onion: 'Onion', crop_potato: 'Potato',
    crop_grapes: 'Grapes', crop_pasture: 'Pasture / Lucerne',
    soil_sandy: 'Sandy', soil_clay: 'Clay', soil_loam: 'Loam',
    stage_seedling: 'Seedling', stage_vegetative: 'Vegetative', stage_flowering: 'Flowering', stage_maturity: 'Maturity',
    weather_title: '🌦️ Agro-Weather', ndvi_title: '🛰️ NDVI — Crop Health',
    rfq_title: '📢 RFQs & Ticker', rfq_post: 'Post an RFQ', rfq_what: 'What do you need?',
    rfq_region: 'Region', rfq_budget: 'Budget (N$)', rfq_trends: '📊 Price Trends', btn_post_rfq: '📤 Post RFQ',
    talk_title: '💬 Agri-Talk', talk_feed: '🗣️ Agri-Talk Feed', talk_ph: 'Share advice...',
    leaderboard: '🏆 Farmer Leaderboard', emergency: '🚨 Emergency Hotlines',
    ussd_title: '📱 USSD Gateway',
    orders_title: '📦 My Orders', wallet_title: '💰 My Wallet',
    track_title: '🚚 Track Order', track_code: 'Enter your tracking code', btn_track: 'Track',
    checkout_title: '🛒 Complete Your Order', checkout_qty: 'Quantity', checkout_address: 'Delivery Address',
    btn_confirm_pay: '✅ Confirm & Pay', btn_cancel: 'Cancel',
    lbl_phone: 'Phone Number *', lbl_name: 'Your Name *', lbl_region: 'Region', lbl_password: 'Password *',
    manual_soil_title: '✍️ Manual Soil Readings'
  },
  osh: {
    app_name: 'NamAgriConnect — Namibia',
    login: '🔐 Djamo', logout: 'Djamo', sell_btn: '➕ Landifa',
    tab_market: '🛒 Omatala', tab_sell: '📸 Landifa', tab_soil: '🧪 Evhu AI',
    tab_virus: '🦠 Omukithi', tab_water: '💧 Omeva', tab_weather: '🌦️ Onghalo yomepo',
    tab_rfq: '📢 Omapulo', tab_talk: '💬 Omukunda', tab_ussd: '📱 USSD',
    tab_orders: '📦 Iilonga', tab_wallet: '💰 Oimaliwa', tab_track: '🚚 Landa',
    tab_market_short: '🛒 Omatala', tab_sell_short: '➕ Landifa', tab_wallet_short: '💰 Oimaliwa', tab_orders_short: '📦 Iilonga',
    market_title: '🛒 Omatala', market_sub: 'Landeni nokulandifa.',
    stat_listings: 'Iilongekidho', stat_farmers: 'Aalimi', stat_trades: 'Iilonga',
    search_ph: '🔍 Kambadhala...', all_cats: 'Iigwana ayihe', all_regions: 'Iitopolwa ayihe',
    cat_crops: 'Oombuto', cat_livestock: 'Oimuna', cat_inputs: 'Omidhingi', cat_machinery: 'Oomashina', cat_charcoal: 'Omakala',
    sell_title: '📸 Landifa Oinima', sell_sub: 'Iifaaniso 10.',
    form_title: 'Edhina lyoinima', form_cat: 'Ongundu', form_desc: 'Efatululo',
    form_qty: 'Omuvalu', form_unit: 'Oshidhigu', form_price: 'Ondando (N$)', form_priceper: 'Ondando ku',
    form_region: 'Oshikandjo', form_town: 'Ondoolopa', form_badge: 'Oshihopaenenwa',
    form_delivery: 'Etumwalaka', form_photos: '📷 Iifaaniso',
    badge_none: 'Apehe', del_pickup: 'Kufa po', del_buyer: 'Etumwalaka', del_incl: 'Etumwalaka lyomolwa',
    btn_publish: '✅ Landifa', btn_manual: '✍️ Nyola', btn_post: 'Tuma',
    soil_title: '🧪 Evhu AI', soil_scan: 'Kanda evhu', soil_sub: 'NamAgri AI.',
    virus_title: '🦠 Omukithi', virus_scan: 'Kanda omuti', virus_alerts: '🚨 Omakumagidho',
    water_title: '💧 Omeva', lbl_crop: 'Omuti', lbl_area: 'Eha', lbl_soil: 'Evhu', lbl_stage: 'Omuvalu',
    crop_maize: 'Omawele', crop_wheat: 'Onga', crop_tomato: 'Omatomati', crop_onion: 'Anyasa', crop_potato: 'Eembyoka',
    crop_grapes: 'Omagrapes', crop_pasture: 'Omwiidhi',
    soil_sandy: 'Omutunda', soil_clay: 'Evi', soil_loam: 'Evhu',
    stage_seedling: 'Okamuti', stage_vegetative: 'Okukula', stage_flowering: 'Omafo', stage_maturity: 'Okupya',
    weather_title: '🌦️ Ombuze', ndvi_title: '🛰️ Oonkundathana',
    rfq_title: '📢 Omapulo', rfq_post: 'Tuma epulo', rfq_what: 'Oshike wa pumbwa?',
    rfq_region: 'Oshikandjo', rfq_budget: 'Iimaliwa', rfq_trends: '📊 Iindando', btn_post_rfq: '📤 Tuma epulo',
    talk_title: '💬 Omukunda', talk_feed: '🗣️ Omukunda', talk_ph: 'Topolola omayele...',
    leaderboard: '🏆 Aalimi aakuluntu', emergency: '🚨 Iinakugwanithwa',
    ussd_title: '📱 USSD',
    orders_title: '📦 Iilonga', wallet_title: '💰 Oimaliwa',
    track_title: '🚚 Landa', track_code: 'Nyola okoodhi', btn_track: 'Landa',
    checkout_title: '🛒 Landifa', checkout_qty: 'Omuvalu', checkout_address: 'Ondoolopa',
    btn_confirm_pay: '✅ Landifa', btn_cancel: 'Etha',
    lbl_phone: 'Onomola *', lbl_name: 'Edhina *', lbl_region: 'Oshikandjo', lbl_password: 'Oshidhigu *',
    manual_soil_title: '✍️ Nyola omigongo'
  },
  afr: {
    app_name: 'NamAgriConnect — Namibië',
    login: '🔐 Teken in', logout: '⏻ Teken uit', sell_btn: '➕ Verkoop',
    tab_market: '🛒 Mark', tab_sell: '📸 Plaas', tab_soil: '🧪 Grond AI',
    tab_virus: '🦠 Virus', tab_water: '💧 Water', tab_weather: '🌦️ Weer',
    tab_rfq: '📢 RFQs', tab_talk: '💬 Praat', tab_ussd: '📱 USSD',
    tab_orders: '📦 Bestellings', tab_wallet: '💰 Beursie', tab_track: '🚚 Volg',
    tab_market_short: '🛒 Mark', tab_sell_short: '➕ Verkoop', tab_wallet_short: '💰 Beursie', tab_orders_short: '📦 Bestellings',
    market_title: '🛒 Lewendige Mark', market_sub: 'Koop en verkoop direk.',
    stat_listings: 'Aktiewe Advertensies', stat_farmers: 'Geregistreerde Boere', stat_trades: 'Transaksies',
    search_ph: '🔍 Soek gewasse...', all_cats: 'Alle Kategorieë', all_regions: 'Alle Streke',
    cat_crops: 'Gewasse', cat_livestock: 'Vee', cat_inputs: 'Sade', cat_machinery: 'Masjinerie', cat_charcoal: 'Charcoal',
    sell_title: '📸 Plaas Advertensie', sell_sub: 'Tot 10 foto\'s.',
    form_title: 'Produk Naam', form_cat: 'Kategorie', form_desc: 'Beskrywing',
    form_qty: 'Hoeveelheid', form_unit: 'Eenheid', form_price: 'Prys (N$)', form_priceper: 'Prys per',
    form_region: 'Streek', form_town: 'Dorp', form_badge: 'Sertifisering',
    form_delivery: 'Aflewering', form_photos: '📷 Foto\'s',
    badge_none: 'Geen', del_pickup: 'Optel', del_buyer: 'Aflewering', del_incl: 'Ingesluit',
    btn_publish: '✅ Plaas', btn_manual: '✍️ Voer In', btn_post: 'Plaas',
    soil_title: '🧪 Grond AI', soil_scan: 'Skandeer Grond', soil_sub: 'NamAgri AI.',
    virus_title: '🦠 Virus', virus_scan: 'Skandeer Plant', virus_alerts: '🚨 Uitbrake',
    water_title: '💧 Water', lbl_crop: 'Gewas', lbl_area: 'Oppervlakte', lbl_soil: 'Grond', lbl_stage: 'Stadium',
    crop_maize: 'Mielies', crop_wheat: 'Koring', crop_tomato: 'Tamatie', crop_onion: 'Ui', crop_potato: 'Aartappel',
    crop_grapes: 'Druiwe', crop_pasture: 'Weiding',
    soil_sandy: 'Sanderig', soil_clay: 'Klei', soil_loam: 'Leem',
    stage_seedling: 'Saailing', stage_vegetative: 'Groei', stage_flowering: 'Blom', stage_maturity: 'Volwasse',
    weather_title: '🌦️ Weer', ndvi_title: '🛰️ NDVI',
    rfq_title: '📢 RFQs', rfq_post: 'Plaas RFQ', rfq_what: 'Wat benodig jy?',
    rfq_region: 'Streek', rfq_budget: 'Begroting', rfq_trends: '📊 Pryse', btn_post_rfq: '📤 Plaas RFQ',
    talk_title: '💬 Boere-Praat', talk_feed: '🗣️ Praat', talk_ph: 'Deel raad...',
    leaderboard: '🏆 Ranglys', emergency: '🚨 Noodlyne',
    ussd_title: '📱 USSD',
    orders_title: '📦 Bestellings', wallet_title: '💰 Beursie',
    track_title: '🚚 Volg', track_code: 'Kode', btn_track: 'Volg',
    checkout_title: '🛒 Bestelling', checkout_qty: 'Hoeveelheid', checkout_address: 'Adres',
    btn_confirm_pay: '✅ Betaal', btn_cancel: 'Kanselleer',
    lbl_phone: 'Foon *', lbl_name: 'Naam *', lbl_region: 'Streek', lbl_password: 'Wagwoord *',
    manual_soil_title: '✍️ Grond Lesings'
  },
  her: {
    app_name: 'NamAgriConnect — Namibia',
    login: '🔐 Taurire', logout: '⏻ Pita', sell_btn: '➕ Randisa',
    tab_market: '🛒 Otjihavero', tab_sell: '📸 Randisa', tab_soil: '🧪 Ehi AI',
    tab_virus: '🦠 Omukithi', tab_water: '💧 Omeva', tab_weather: '🌦️ Ombuze',
    tab_rfq: '📢 Omazundo', tab_talk: '💬 Ovandu', tab_ussd: '📱 USSD',
    tab_orders: '📦 Omazundo', tab_wallet: '💰 Ovimariva', tab_track: '🚚 Tara',
    tab_market_short: '🛒 Otjihavero', tab_sell_short: '➕ Randisa', tab_wallet_short: '💰 Ovimariva', tab_orders_short: '📦 Omazundo',
    market_title: '🛒 Otjihavero', market_sub: 'Randisa.',
    stat_listings: 'Ovandisa', stat_farmers: 'Ovarimi', stat_trades: 'Omirongo',
    search_ph: '🔍 Tara...', all_cats: 'Ovikoa', all_regions: 'Ozondema',
    cat_crops: 'Ovihape', cat_livestock: 'Ozondundu', cat_inputs: 'Omiti', cat_machinery: 'Oomasina', cat_charcoal: 'Omakara',
    sell_title: '📸 Randisa', sell_sub: 'Ovifananekero 10.',
    form_title: 'Ena', form_cat: 'Onganda', form_desc: 'Omahandjauriro',
    form_qty: 'Otjivaro', form_unit: 'Ondjivisiro', form_price: 'Ondando', form_priceper: 'Ondando ku',
    form_region: 'Okuwa', form_town: 'Onganda', form_badge: 'Otjipatri',
    form_delivery: 'Okutwara', form_photos: '📷 Ovifananekero',
    badge_none: 'Apehe', del_pickup: 'Twara', del_buyer: 'Okutwara', del_incl: 'Okutwara',
    btn_publish: '✅ Randisa', btn_manual: '✍️ Nyora', btn_post: 'Tuma',
    soil_title: '🧪 Ehi AI', soil_scan: 'Kanda ehi', soil_sub: 'NamAgri AI.',
    virus_title: '🦠 Omukithi', virus_scan: 'Kanda omuti', virus_alerts: '🚨 Omakumagidho',
    water_title: '💧 Omeva', lbl_crop: 'Omuti', lbl_area: 'Otjihwa', lbl_soil: 'Ehi', lbl_stage: 'Omuano',
    crop_maize: 'Omahangu', crop_wheat: 'Onga', crop_tomato: 'Omotoma', crop_onion: 'Anya', crop_potato: 'Omakapa',
    crop_grapes: 'Ondjupa', crop_pasture: 'Oomwiidhi',
    soil_sandy: 'Omuronga', soil_clay: 'Otjimbumba', soil_loam: 'Ehi',
    stage_seedling: 'Otjikoro', stage_vegetative: 'Okukura', stage_flowering: 'Omafo', stage_maturity: 'Okupya',
    weather_title: '🌦️ Ombuze', ndvi_title: '🛰️ Otjikando',
    rfq_title: '📢 Omazundo', rfq_post: 'Tuma omazundo', rfq_what: 'Ove na omburo?',
    rfq_region: 'Okuwa', rfq_budget: 'Ovimariva', rfq_trends: '📊 Oviyandja', btn_post_rfq: '📤 Tuma',
    talk_title: '💬 Ovandu', talk_feed: '🗣️ Ovandu', talk_ph: 'Pandjara...',
    leaderboard: '🏆 Ovarimi aakururukire', emergency: '🚨 Ozondjeso',
    ussd_title: '📱 USSD',
    orders_title: '📦 Omazundo', wallet_title: '💰 Ovimariva',
    track_title: '🚚 Tara', track_code: 'Nyora koodhi', btn_track: 'Tara',
    checkout_title: '🛒 Randisa', checkout_qty: 'Otjivaro', checkout_address: 'Ondjira',
    btn_confirm_pay: '✅ Randisa', btn_cancel: 'Isena',
    lbl_phone: 'Otjinga *', lbl_name: 'Ena *', lbl_region: 'Okuwa', lbl_password: 'Ondjivisiro *',
    manual_soil_title: '✍️ Nyora ovivaro'
  },
  kho: {
    app_name: 'NamAgriConnect — Namibia',
    login: '🔐 ǁNāǂgā', logout: '⏻ ǁNā', sell_btn: '➕ ǁAma',
    tab_market: '🛒 ǁAma', tab_sell: '📸 ǁAma', tab_soil: '🧪 ǁHūs',
    tab_virus: '🦠 ǁNā', tab_water: '💧 ǁGam', tab_weather: '🌦️ ǁGuib',
    tab_rfq: '📢 ǁNā', tab_talk: '💬 ǁAma', tab_ussd: '📱 USSD',
    tab_orders: '📦 ǁNā', tab_wallet: '💰 ǁNā', tab_track: '🚚 ǁNā',
    tab_market_short: '🛒 ǁAma', tab_sell_short: '➕ ǁAma', tab_wallet_short: '💰 ǁNā', tab_orders_short: '📦 ǁNā',
    market_title: '🛒 ǁAma', market_sub: 'ǁAma.',
    stat_listings: 'ǁAma', stat_farmers: 'ǁHūs', stat_trades: 'ǁAma',
    search_ph: '🔍 ǁGâu...', all_cats: 'ǁNā', all_regions: 'ǁNā',
    cat_crops: 'ǁNā', cat_livestock: 'ǁNā', cat_inputs: 'ǁNā', cat_machinery: 'ǁNā', cat_charcoal: 'ǁNā',
    sell_title: '📸 ǁAma', sell_sub: 'ǁAma.',
    form_title: 'ǁNā', form_cat: 'ǁAma', form_desc: 'ǁNā',
    form_qty: 'ǁNā', form_unit: 'ǁNā', form_price: 'ǁNā', form_priceper: 'ǁNā',
    form_region: 'ǁNā', form_town: 'ǁNā', form_badge: 'ǁNā',
    form_delivery: 'ǁNā', form_photos: '📷 ǁNā',
    badge_none: 'ǁNā', del_pickup: 'ǁNā', del_buyer: 'ǁNā', del_incl: 'ǁNā',
    btn_publish: '✅ ǁAma', btn_manual: '✍️ ǁNā', btn_post: 'ǁNā',
    soil_title: '🧪 ǁHūs', soil_scan: 'ǁNā', soil_sub: 'NamAgri AI.',
    virus_title: '🦠 ǁNā', virus_scan: 'ǁNā', virus_alerts: '🚨 ǁNā',
    water_title: '💧 ǁGam', lbl_crop: 'ǁNā', lbl_area: 'ǁNā', lbl_soil: 'ǁHūs', lbl_stage: 'ǁNā',
    crop_maize: 'ǁNā', crop_wheat: 'ǁNā', crop_tomato: 'ǁNā', crop_onion: 'ǁNā', crop_potato: 'ǁNā',
    crop_grapes: 'ǁNā', crop_pasture: 'ǁNā',
    soil_sandy: 'ǁNā', soil_clay: 'ǁNā', soil_loam: 'ǁNā',
    stage_seedling: 'ǁNā', stage_vegetative: 'ǁNā', stage_flowering: 'ǁNā', stage_maturity: 'ǁNā',
    weather_title: '🌦️ ǁGuib', ndvi_title: '🛰️ ǁNā',
    rfq_title: '📢 ǁNā', rfq_post: 'ǁNā', rfq_what: 'ǁNā?',
    rfq_region: 'ǁNā', rfq_budget: 'ǁNā', rfq_trends: '📊 ǁNā', btn_post_rfq: '📤 ǁNā',
    talk_title: '💬 ǁAma', talk_feed: '🗣️ ǁAma', talk_ph: 'ǁNā...',
    leaderboard: '🏆 ǁNā', emergency: '🚨 ǁNā',
    ussd_title: '📱 USSD',
    orders_title: '📦 ǁNā', wallet_title: '💰 ǁNā',
    track_title: '🚚 ǁNā', track_code: 'ǁNā', btn_track: 'ǁNā',
    checkout_title: '🛒 ǁAma', checkout_qty: 'ǁNā', checkout_address: 'ǁNā',
    btn_confirm_pay: '✅ ǁAma', btn_cancel: 'ǁNā',
    lbl_phone: 'ǁNā *', lbl_name: 'ǁNā *', lbl_region: 'ǁNā', lbl_password: 'ǁNā *',
    manual_soil_title: '✍️ ǁNā'
  },
  siz: {
    app_name: 'NamAgriConnect — Namibia',
    login: '🔐 Kena', logout: '⏻ Taha', sell_btn: '➕ Rekisa',
    tab_market: '🛒 Mubaraka', tab_sell: '📸 Rekisa', tab_soil: '🧪 Mubu',
    tab_virus: '🦠 Kozo', tab_water: '💧 Mazi', tab_weather: '🌦️ Bupilo',
    tab_rfq: '📢 Dikupo', tab_talk: '💬 Mubuso', tab_ussd: '📱 USSD',
    tab_orders: '📦 Dikupo', tab_wallet: '💰 Tjelete', tab_track: '🚚 Latelela',
    tab_market_short: '🛒 Mubaraka', tab_sell_short: '➕ Rekisa', tab_wallet_short: '💰 Tjelete', tab_orders_short: '📦 Dikupo',
    market_title: '🛒 Mubaraka', market_sub: 'Reka ni ku rekisa.',
    stat_listings: 'Likwalezimo', stat_farmers: 'Balimi', stat_trades: 'Misipili',
    search_ph: '🔍 Batla...', all_cats: 'Mikoa kaofela', all_regions: 'Libaka kaofela',
    cat_crops: 'Likunwa', cat_livestock: 'Lifu', cat_inputs: 'Lipeu', cat_machinery: 'Likomiki', cat_charcoal: 'Makala',
    sell_title: '📸 Rekisa', sell_sub: 'Lifota 10.',
    form_title: 'Libizo', form_cat: 'Mukoa', form_desc: 'Tlhaloso',
    form_qty: 'Bukata', form_unit: 'Sikalo', form_price: 'Tjelete', form_priceper: 'Tjelete ku',
    form_region: 'Sihalo', form_town: 'Munzi', form_badge: 'Sitlankiso',
    form_delivery: 'Kutisa', form_photos: '📷 Lifota',
    badge_none: 'Halina', del_pickup: 'Kutisa', del_buyer: 'Kutisa', del_incl: 'Kutisa',
    btn_publish: '✅ Rekisa', btn_manual: '✍️ Ngola', btn_post: 'Lahla',
    soil_title: '🧪 Mubu', soil_scan: 'Hlahloba mubu', soil_sub: 'NamAgri AI.',
    virus_title: '🦠 Kozo', virus_scan: 'Hlahloba sika', virus_alerts: '🚨 Dikupo',
    water_title: '💧 Mazi', lbl_crop: 'Sika', lbl_area: 'Sibaka', lbl_soil: 'Mubu', lbl_stage: 'Sikalo',
    crop_maize: 'Poone', crop_wheat: 'Korosi', crop_tomato: 'Tamati', crop_onion: 'Anye', crop_potato: 'Tapola',
    crop_grapes: 'Morara', crop_pasture: 'Bucwani',
    soil_sandy: 'Musihali', soil_clay: 'Lobu', soil_loam: 'Mubu',
    stage_seedling: 'Sihlota', stage_vegetative: 'Ku hula', stage_flowering: 'Lipalesa', stage_maturity: 'Ku buta',
    weather_title: '🌦️ Bupilo', ndvi_title: '🛰️ Sifota sa naha',
    rfq_title: '📢 Dikupo', rfq_post: 'Lahla kopo', rfq_what: 'U batla eng?',
    rfq_region: 'Sihalo', rfq_budget: 'Tjelete', rfq_trends: '📊 Litjelete', btn_post_rfq: '📤 Lahla',
    talk_title: '💬 Mubuso', talk_feed: '🗣️ Mubuso', talk_ph: 'Abela likelezo...',
    leaderboard: '🏆 Balimi ba pahami', emergency: '🚨 Dikgokelo',
    ussd_title: '📱 USSD',
    orders_title: '📦 Dikupo', wallet_title: '💰 Tjelete',
    track_title: '🚚 Latelela', track_code: 'Ngola khodi', btn_track: 'Latelela',
    checkout_title: '🛒 Rekisa', checkout_qty: 'Bukata', checkout_address: 'Aterese',
    btn_confirm_pay: '✅ Lefa', btn_cancel: 'Taha',
    lbl_phone: 'Fono *', lbl_name: 'Libizo *', lbl_region: 'Sihalo', lbl_password: 'Phasewete *',
    manual_soil_title: '✍️ Ngola dihanyiso'
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function t(key) {
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || TRANSLATIONS.en[key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.innerHTML = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPh);
  });
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
console.log('✅ i18n.js ready');