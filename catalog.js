
/* =========================================
   JAKO STORE - PRODUCT CATALOG
   Games / Apps / Packages / Pricing
========================================= */

(function () {
    "use strict";

    const catalog = {

        version: "1.0.0",

        currency: "USD",

        pricingRegion: "global",

        // الأسعار المستوردة من الصفحات القديمة
        // تحتاج مراجعة قبل اعتمادها نهائياً.

        priceStatus: "imported_needs_verification",

        paymentMethods: [
            {
                id: "sham_cash",
                name: "شام كاش",
                enabled: true
            },
            {
                id: "google_play",
                name: "بطاقات Google Play",
                enabled: true
            },
            {
                id: "whatsapp",
                name: "الطلب عبر واتساب",
                enabled: true
            }
        ],

        // =====================================
        // GAMES
        // =====================================

        games: [

            // PUBG MOBILE
            {
                id: "pubg",
                name: "PUBG Mobile",
                nameAr: "ببجي موبايل",
                category: "game",
                page: "pubg.html",
                image: "pubg.jpg",
                description: "شحن شدات UC ورويال باس ببجي موبايل",
                status: "active",

                inputFields: [
                    {
                        id: "playerId",
                        label: "معرف اللاعب PUBG ID",
                        type: "text",
                        placeholder: "أدخل ID الخاص بك",
                        required: true,
                        inputMode: "numeric"
                    }
                ],

                packages: [
                    { id: "uc_60", name: "60 شدة UC", usd: 1.50 },
                    { id: "uc_325", name: "325 شدة UC", usd: 4.80 },
                    { id: "uc_660", name: "660 شدة UC", usd: 10.99 },
                    { id: "uc_1800", name: "1800 شدة UC", usd: 26.99 },
                    { id: "uc_3850", name: "3850 شدة UC", usd: 52.99 },
                    { id: "uc_8100", name: "8100 شدة UC", usd: 103.99 },
                    { id: "elite_pass", name: "الرويال باس العادي Elite Pass", usd: 6.99 },
                    { id: "elite_plus", name: "الرويال باس بلس Elite Plus", usd: 15.99 }
                ],

                priceSource: "existing_pubg_page",
                priceNeedsReview: true
            },

            // FREE FIRE
            {
                id: "freefire",
                name: "Free Fire",
                nameAr: "فري فاير",
                category: "game",
                page: "freefire.html",
                image: "freefire.jpg",
                description: "شحن جواهر واشتراكات Free Fire",
                status: "active",

                inputFields: [
                    {
                        id: "playerId",
                        label: "معرف اللاعب UID",
                        type: "text",
                        placeholder: "أدخل معرف حسابك",
                        required: true,
                        inputMode: "numeric"
                    }
                ],

                packages: [
                    { id: "diamond_100", name: "100 جوهرة", usd: 0.99 },
                    { id: "diamond_210", name: "210 جوهرة", usd: 2.99 },
                    { id: "diamond_530", name: "530 جوهرة", usd: 5.99 },
                    { id: "diamond_1080", name: "1080 جوهرة", usd: 10.99 },
                    { id: "diamond_2200", name: "2200 جوهرة", usd: 20.99 },
                    { id: "weekly_vip", name: "الاشتراك الأسبوعي Weekly VIP", usd: 2.99 },
                    { id: "monthly_vip", name: "الاشتراك الشهري Monthly VIP", usd: 8.99 }
                ],

                priceSource: "existing_freefire_page",
                priceNeedsReview: true
            },

            // CALL OF DUTY MOBILE
            {
                id: "cod",
                name: "Call of Duty Mobile",
                nameAr: "كول أوف ديوتي",
                category: "game",
                page: "cod.html",
                image: "cod.jpg",
                description: "شحن نقاط CP",
                status: "active",

                inputFields: [
                    {
                        id: "playerId",
                        label: "معرف اللاعب Player ID",
                        type: "text",
                        placeholder: "أدخل Player ID",
                        required: true
                    }
                ],

                packages: [
                    { id: "cp_88", name: "88 CP", usd: 0.99 },
                    { id: "cp_160", name: "160 CP", usd: 0.99 },
                    { id: "cp_460", name: "460 CP", usd: 4.99 },
                    { id: "cp_960", name: "960 CP", usd: 9.99 },
                    { id: "cp_2600", name: "2600 CP", usd: 24.99 },
                    { id: "cp_5400", name: "5400 CP", usd: 49.99 },
                    { id: "cp_11600", name: "11600 CP", usd: 99.99 },
                    { id: "cp_23200", name: "23200 CP", usd: 199.99 },
                    { id: "cp_34800", name: "34800 CP", usd: 299.99 },
                    { id: "cp_58000", name: "58000 CP", usd: 499.99 }
                ],

                priceSource: "existing_cod_page",
                priceNeedsReview: true
            },

            // ROBLOX
            {
                id: "roblox",
                name: "Roblox",
                nameAr: "روبلوكس",
                category: "game",
                page: "roblox.html",
                image: "roblox.jpg",
                description: "شحن Robux",
                status: "active",

                inputFields: [
                    {
                        id: "playerId",
                        label: "اسم المستخدم أو معرف الحساب",
                        type: "text",
                        placeholder: "أدخل اسم حساب Roblox",
                        required: true
                    }
                ],

                packages: [
                    { id: "robux_80", name: "80 Robux", usd: 0.99 },
                    { id: "robux_400", name: "400 Robux", usd: 5.99 },
                    { id: "robux_800", name: "800 Robux", usd: 10.99 },
                    { id: "robux_1700", name: "1700 Robux", usd: 20.99 },
                    { id: "robux_4500", name: "4500 Robux", usd: 51.99 }
                ],

                priceSource: "existing_roblox_page",
                priceNeedsReview: true
            },

            // EFOOTBALL
            {
                id: "pes",
                name: "eFootball",
                nameAr: "إي فوتبول",
                category: "game",
                page: "pes.html",
                image: "pes.jpg",
                description: "شحن عملات eFootball",
                status: "active",

                inputFields: [
                    {
                        id: "playerId",
                        label: "معرف اللاعب",
                        type: "text",
                        placeholder: "أدخل معرف حسابك",
                        required: true,
                        inputMode: "numeric"
                    }
                ],

                packages: [
                    { id: "coins_100", name: "100 Coins", usd: 0.99 },
                    { id: "coins_500", name: "500 Coins", usd: 5.99 },
                    { id: "coins_1000", name: "1000 Coins", usd: 10.99 },
                    { id: "coins_2100", name: "2100 Coins", usd: 20.99 },
                    { id: "coins_5700", name: "5700 Coins", usd: 50.99 }
                ],

                priceSource: "existing_pes_page",
                priceNeedsReview: true
            },

            // CLASH OF CLANS
            {
                id: "coc",
                name: "Clash of Clans",
                nameAr: "كلاش أوف كلانس",
                category: "game",
                page: "coc.html",
                image: "clash.jpg",
                description: "جواهر وتصاريح وعروض Clash of Clans",
                status: "active",

                inputFields: [
                    {
                        id: "playerTag",
                        label: "Player Tag",
                        type: "text",
                        placeholder: "#XXXXXXXX",
                        required: true
                    },
                    {
                        id: "townHall",
                        label: "مستوى Town Hall",
                        type: "select",
                        required: true,
                        options: [
                            "3", "4", "5", "6", "7", "8",
                            "9", "10", "11", "12", "13",
                            "14", "15", "16", "17", "18"
                        ]
                    }
                ],

                packageGroups: [
                    {
                        id: "gems",
                        name: "جواهر Gems",
                        pricingMode: "fixed",

                        packages: [
                            { id: "gems_80", name: "80 جوهرة", usd: 0.99 },
                            { id: "gems_500", name: "500 جوهرة", usd: 4.99 },
                            { id: "gems_1200", name: "1200 جوهرة", usd: 9.99 },
                            { id: "gems_2500", name: "2500 جوهرة", usd: 19.99 },
                            { id: "gems_6500", name: "6500 جوهرة", usd: 49.99 },
                            { id: "gems_14000", name: "14000 جوهرة", usd: 99.99 }
                        ]
                    },
                    {
                        id: "goldpass",
                        name: "Gold Pass",
                        pricingMode: "manual",
                        requiresQuote: true,
                        packages: []
                    },
                    {
                        id: "eventpass",
                        name: "Event Pass",
                        pricingMode: "manual",
                        requiresQuote: true,
                        packages: []
                    },
                    {
                        id: "special",
                        name: "العروض الخاصة والعناصر الأخرى",
                        pricingMode: "manual",
                        requiresQuote: true,
                        packages: []
                    }
                ],

                priceSource: "existing_coc_page",
                priceNeedsReview: true
            },

            // CLASH ROYALE
            {
                id: "clash",
                name: "Clash Royale",
                nameAr: "كلاش رويال",
                category: "game",
                page: "clash.html",
                image: "clash.jpg",
                description: "شحن جواهر Clash Royale والتذكرة الذهبية",
                status: "active",

                inputFields: [
                    {
                        id: "playerId",
                        label: "معرف اللاعب",
                        type: "text",
                        placeholder: "أدخل معرف اللاعب",
                        required: true
                    }
                ],

                packages: [
                    { id: "gems_80", name: "80 جوهرة", usd: 0.99 },
                    { id: "gems_500", name: "500 جوهرة", usd: 5.50 },
                    { id: "gems_1200", name: "1200 جوهرة", usd: 10.99 },
                    { id: "gems_2500", name: "2500 جوهرة", usd: 20.99 },
                    { id: "gems_6500", name: "6500 جوهرة", usd: 51.99 },
                    { id: "gems_14000", name: "14000 جوهرة", usd: 102.99 },
                    { id: "gold_pass", name: "التذكرة الذهبية Gold Pass", usd: 7.50 }
                ],

                priceSource: "existing_clash_page",
                priceNeedsReview: true
            },

            // LUDO KING
            {
                id: "ludo",
                name: "Ludo King",
                nameAr: "لودو كينغ",
                category: "game",
                page: "ludo.html",
                image: "ludo.jpg",
                description: "شحن العملات والجواهر",
                status: "active",

                inputFields: [
                    {
                        id: "playerId",
                        label: "معرف الحساب",
                        type: "text",
                        placeholder: "أدخل معرف حسابك",
                        required: true
                    }
                ],

                packageGroups: [
                    {
                        id: "coins",
                        name: "العملات النقدية",
                        pricingMode: "fixed",
                        packages: [
                            { id: "coins_50000", name: "50,000 قطعة نقدية", usd: 0.99 },
                            { id: "coins_250000", name: "250,000 قطعة نقدية", usd: 3.99 },
                            { id: "coins_500000", name: "500,000 قطعة نقدية", usd: 5.99 },
                            { id: "coins_1000000", name: "1,000,000 قطعة نقدية", usd: 9.99 },
                            { id: "coins_5000000", name: "5,000,000 قطعة نقدية", usd: 41.99 }
                        ]
                    },
                    {
                        id: "gems",
                        name: "الجواهر",
                        pricingMode: "fixed",
                        packages: [
                            { id: "gems_50", name: "50 جوهرة", usd: 0.99 },
                            { id: "gems_250", name: "250 جوهرة", usd: 5.99 },
                            { id: "gems_500", name: "500 جوهرة", usd: 9.99 },
                            { id: "gems_2500", name: "2500 جوهرة", usd: 41.99 }
                        ]
                    }
                ],

                priceSource: "existing_ludo_page",
                priceNeedsReview: true
            }
        ],

        // =====================================
        // APPLICATIONS
        // =====================================

        apps: [

            // BIGO LIVE
            {
                id: "bigo",
                name: "BIGO LIVE",
                nameAr: "بيجو لايف",
                category: "app",
                page: "bigo.html",
                image: "bigo.jpg",
                description: "شحن ألماسات BIGO LIVE",
                status: "active",

                inputFields: [
                    {
                        id: "playerId",
                        label: "BIGO ID",
                        type: "text",
                        placeholder: "أدخل Bigo ID",
                        required: true,
                        inputMode: "numeric"
                    },
                    {
                        id: "diamondQuantity",
                        label: "عدد الألماسات",
                        type: "number",
                        placeholder: "مثلاً: 500",
                        required: true,
                        min: 1
                    }
                ],

                pricing: {
                    mode: "unit_fraction",
                    numerator: 1,
                    denominator: 28,
                    unitName: "ألماسة",
                    minQuantity: 1,
                    note: "السعر المرجعي المستورد: 42 ألماسة مقابل 1.50 دولار."
                },

                packages: [],

                priceSource: "existing_bigo_page",
                priceNeedsReview: true
            },

            // MICO
            {
                id: "mico",
                name: "MICO",
                nameAr: "ميكو",
                category: "app",
                page: "mico.html",
                image: "mico.jpg",
                description: "شحن عملات MICO",
                status: "active",

                inputFields: [
                    {
                        id: "playerId",
                        label: "معرف حساب MICO",
                        type: "text",
                        placeholder: "أدخل معرف الحساب",
                        required: true
                    }
                ],

                packages: [
                    { id: "coins_70", name: "70 Coins", usd: 0.99 },
                    { id: "coins_350", name: "350 Coins", usd: 5.99 },
                    { id: "coins_700", name: "700 Coins", usd: 10.99 },
                    { id: "coins_3500", name: "3500 Coins", usd: 52.99 },
                    { id: "coins_7000", name: "7000 Coins", usd: 102.99 }
                ],

                priceSource: "existing_mico_page",
                priceNeedsReview: true
            },

            // POPPO LIVE
            {
                id: "poppo",
                name: "Poppo Live",
                nameAr: "بوبو لايف",
                category: "app",
                page: "poppo.html",
                image: "poppo.jpg",
                description: "شحن عملات Poppo Live",
                status: "active",

                inputFields: [
                    {
                        id: "playerId",
                        label: "معرف حساب Poppo",
                        type: "text",
                        placeholder: "أدخل معرف الحساب",
                        required: true,
                        inputMode: "numeric"
                    }
                ],

                packages: [
                    { id: "coins_7000", name: "7,000 Coins", usd: 0.99 },
                    { id: "coins_21000", name: "21,000 Coins", usd: 2.99 },
                    { id: "coins_70000", name: "70,000 Coins", usd: 9.99 },
                    { id: "coins_210000", name: "210,000 Coins", usd: 29.99 },
                    { id: "coins_350000", name: "350,000 Coins", usd: 49.99 },
                    { id: "coins_700000", name: "700,000 Coins", usd: 99.99 },
                    { id: "coins_1400000", name: "1,400,000 Coins", usd: 199.99 }
                ],

                priceSource: "existing_poppo_page",
                priceNeedsReview: true
            },

            // SOULCHILL
            {
                id: "soulchill",
                name: "SoulChill",
                nameAr: "سول تشيل",
                category: "app",
                page: "soulchill.html",
                image: "soulchill.jpg",
                description: "شحن كريستالات SoulChill",
                status: "active",

                inputFields: [
                    {
                        id: "playerId",
                        label: "معرف حساب SoulChill",
                        type: "text",
                        placeholder: "أدخل معرف الحساب",
                        required: true
                    },
                    {
                        id: "crystalAmount",
                        label: "عدد الكريستالات",
                        type: "number",
                        placeholder: "مثلاً: 5000",
                        required: true,
                        min: 1,
                        max: 1000000
                    }
                ],

                pricing: {
                    mode: "interpolated_quantity",
                    unitName: "كريستالة",
                    minQuantity: 1,
                    maxQuantity: 1000000,

                    // الأسعار بالدولار، ممثلة بالسنت.
                    referencePoints: [
                        { quantity: 2160, cents: 436 },
                        { quantity: 4450, cents: 897 },
                        { quantity: 13700, cents: 2759 },
                        { quantity: 23500, cents: 4732 },
                        { quantity: 48300, cents: 9725 }
                    ],

                    rounding: "up"
                },

                packages: [],

                priceSource: "existing_soulchill_page",
                priceNeedsReview: true
            },

            // TIKTOK
            {
                id: "tiktok",
                name: "TikTok",
                nameAr: "تيك توك",
                category: "app",
                page: "tiktok.html",
                image: "tiktok.jpg",
                description: "شحن عملات TikTok",
                status: "active",

                inputFields: [
                    {
                        id: "playerId",
                        label: "اسم المستخدم",
                        type: "text",
                        placeholder: "أدخل اسم المستخدم",
                        required: true
                    }
                ],

                packages: [
                    { id: "coins_70", name: "70 Coins", usd: 0.99 },
                    { id: "coins_350", name: "350 Coins", usd: 5.99 },
                    { id: "coins_700", name: "700 Coins", usd: 10.99 },
                    { id: "coins_1400", name: "1400 Coins", usd: 20.99 },
                    { id: "coins_3500", name: "3500 Coins", usd: 51.99 },
                    { id: "coins_7000", name: "7000 Coins", usd: 102.99 }
                ],

                priceSource: "existing_tiktok_page",
                priceNeedsReview: true
            },

            // YAAHLAN
            {
                id: "yaahlan",
                name: "Yaahlan",
                nameAr: "ياهلا",
                category: "app",
                page: "yaahlan.html",
                image: "yaahlan.jpg",
                description: "شحن ألماسات Yaahlan",
                status: "needs_setup",

                inputFields: [
                    {
                        id: "playerId",
                        label: "معرف الحساب",
                        type: "text",
                        placeholder: "أدخل معرف حسابك",
                        required: true
                    }
                ],

                packages: [],

                priceSource: null,
                priceNeedsReview: true,
                note: "صفحة Yaahlan القديمة فارغة؛ يجب التحقق من الباقات والأسعار قبل تفعيل الشحن."
            },

            // YALLA
            {
                id: "yalla",
                name: "Yalla",
                nameAr: "يلا",
                category: "app",
                page: "yalla.html",
                image: "yalla.jpg",
                description: "شحن ألماس واشتراكات Yalla",
                status: "active",

                inputFields: [
                    {
                        id: "playerId",
                        label: "معرف الحساب",
                        type: "text",
                        placeholder: "أدخل معرف حسابك",
                        required: true
                    }
                ],

                packages: [
                    { id: "diamonds_630", name: "630 ماسة", usd: 1.99 },
                    { id: "diamonds_1280", name: "1280 ماسة", usd: 2.99 },
                    { id: "diamonds_3350", name: "3350 ماسة", usd: 5.99 },
                    { id: "diamonds_7100", name: "7100 ماسة", usd: 10.99 },
                    { id: "knight", name: "اشتراك الفارس Knight", usd: 5.99 },
                    { id: "baron", name: "اشتراك البارون Baron", usd: 15.99 }
                ],

                priceSource: "existing_yalla_page",
                priceNeedsReview: true
            },

            // YALLA LUDO
            {
                id: "yalla-ludo",
                name: "Yalla Ludo",
                nameAr: "يلا لودو",
                category: "app",
                page: "yalla-ludo.html",
                image: "ludo.jpg",
                description: "شحن ماسات واشتراكات Yalla Ludo",
                status: "active",

                inputFields: [
                    {
                        id: "playerId",
                        label: "Player ID",
                        type: "text",
                        placeholder: "أدخل Player ID",
                        required: true
                    }
                ],

                packages: [
                    { id: "diamonds_630", name: "630 ماسة", usd: 1.99 },
                    { id: "diamonds_1280", name: "1280 ماسة", usd: 2.99 },
                    { id: "diamonds_3350", name: "3350 ماسة", usd: 5.99 },
                    { id: "diamonds_7100", name: "7100 ماسة", usd: 10.99 },
                    { id: "knight", name: "الفارس Knight", usd: 5.99 },
                    { id: "baron", name: "البارون Baron", usd: 15.99 }
                ],

                priceSource: "existing_yalla_ludo_page",
                priceNeedsReview: true
            },

            // TANGO
            {
                id: "tango",
                name: "Tango",
                nameAr: "تانغو",
                category: "app",
                page: "tango.html",
                image: "tango.jpg",
                description: "شحن Tango",
                status: "needs_setup",

                inputFields: [
                    {
                        id: "playerId",
                        label: "معرف حساب Tango",
                        type: "text",
                        placeholder: "أدخل معرف الحساب",
                        required: true
                    }
                ],

                packages: [],

                priceSource: null,
                priceNeedsReview: true,
                note: "تحتاج صفحة Tango إلى بناء وتحديد الباقات والأسعار."
            }
        ]
    };

    // =====================================
    // CATALOG HELPERS
    // =====================================

    function getAllProducts() {
        return [
            ...catalog.games,
            ...catalog.apps
        ];
    }

    function findProduct(id) {
        return getAllProducts().find(function (product) {
            return product.id === id;
        }) || null;
    }

    function getProductsByCategory(category) {
        if (category === "game") {
            return catalog.games;
        }

        if (category === "app") {
            return catalog.apps;
        }

        return getAllProducts();
    }

    function getAvailableProducts() {
        return getAllProducts().filter(function (product) {
            return product.status === "active";
        });
    }

    function getProductPackages(productId, groupId = null) {
        const product = findProduct(productId);

        if (!product) {
            return [];
        }

        if (groupId && Array.isArray(product.packageGroups)) {
            const group = product.packageGroups.find(function (item) {
                return item.id === groupId;
            });

            return group ? group.packages : [];
        }

        return product.packages || [];
    }

    // =====================================
    // COMPATIBILITY LAYER — product-engine.js
    // يحوّل بنية JAKO_CATALOG إلى البنية التي
    // يعتمد عليها محرك صفحات المنتجات الحالي.
    // =====================================

    function packageQuantity(item) {
        if (Number.isFinite(Number(item.quantity))) {
            return Number(item.quantity);
        }

        const match = String(item.name || "")
            .replace(/,/g, "")
            .match(/\d+(?:\.\d+)?/);

        return match ? Number(match[0]) : null;
    }

    function convertPackage(item, groupName = "") {
        const label = groupName
            ? `${groupName} — ${item.name}`
            : item.name;

        return [
            label,
            packageQuantity(item),
            item.usd === null || item.usd === undefined
                ? null
                : Number(item.usd),
            item.id || null
        ];
    }

    function toEngineProduct(item) {
        const firstField = Array.isArray(item.inputFields)
            ? item.inputFields.find(field => field.id === "playerId") || item.inputFields[0]
            : null;

        let packages = Array.isArray(item.packages)
            ? item.packages.map(pack => convertPackage(pack))
            : [];

        // محرك المنتجات الحالي لا يعرض مجموعات باقات متعددة،
        // لذلك تُعرض باقات المجموعة بأسمائها لتجنب إسقاط أي باقة.
        if (Array.isArray(item.packageGroups)) {
            packages = item.packageGroups.flatMap(group =>
                (group.packages || []).map(pack =>
                    convertPackage(pack, group.name)
                )
            );
        }

        const product = {
            title: item.nameAr || item.name,
            en: item.name,
            image: item.image || "",
            description: item.description || "",
            fieldLabel: firstField?.label || "معرّف الحساب",
            fieldPlaceholder: firstField?.placeholder || "أدخل معرّف الحساب",
            validation: null,
            packages,
            priceNote: item.priceNeedsReview
                ? "الأسعار المستوردة مرجعية وتحتاج إلى مراجعة قبل اعتمادها نهائياً."
                : ""
        };

        // قواعد التحقق التي يدعمها product-engine.js.
        if (
            item.id === "pubg" ||
            item.id === "freefire" ||
            item.id === "pes"
        ) {
            product.validation = "digits";
        } else if (item.id === "cod") {
            product.validation = "cod";
            product.customCP = true;
        } else if (item.id === "roblox") {
            product.validation = "username";
        } else if (
            item.id === "bigo" ||
            item.id === "poppo"
        ) {
            product.validation = "digits";
        }

        // منتجات تعتمد على كمية يحددها العميل.
        if (item.id === "bigo") {
            product.custom = "bigo";
        }

        if (item.id === "soulchill") {
            product.custom = "soulchill";
        }

        // Clash of Clans له واجهة وحقول تحقق خاصة داخل المحرك.
        if (item.id === "coc") {
            product.special = "coc";
        }

        // المنتجات التي لم تكتمل أسعارها تبقى طلبات تسعير
        // ولا تُعرض لها باقات أو أسعار مخمّنة.
        if (item.status === "needs_setup") {
            product.custom = "quote";
            product.packages = [];
            product.priceNote = item.note ||
                "هذا المنتج يحتاج إلى مراجعة الباقات والأسعار قبل تنفيذ الشحن.";
        }

        // إرفاق حالة المنتج حتى تستطيع الصفحات أو الواجهة
        // إخفاء المنتجات غير الجاهزة دون فقدان بيانات الكتالوج.
        product.status = item.status || "active";
        product.category = item.category;
        product.page = item.page;
        product.sourceId = item.id;

        return product;
    }

    const engineProducts = Object.create(null);

    getAllProducts().forEach(function (item) {
        engineProducts[item.id] = toEngineProduct(item);
    });

    // المتغير الذي يقرأه product-engine.js مباشرة.
    window.JAKO_PRODUCTS = engineProducts;

    // واجهة موحدة للاستخدام في الصفحة الرئيسية وأي سكربت لاحق.
    window.JAKO_CATALOG = catalog;

    window.JAKO_CATALOG_API = Object.freeze({
        getAllProducts: getAllProducts,
        findProduct: findProduct,
        getProductsByCategory: getProductsByCategory,
        getAvailableProducts: getAvailableProducts,
        getProductPackages: getProductPackages
    });

})();
