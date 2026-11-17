
/* =========================================
   JAKO STORE - SUPABASE CONFIGURATION
   Shared configuration for all store pages
========================================= */

(function () {
    "use strict";

    // =====================================
    // 1. SUPABASE CONNECTION
    // =====================================

    const SUPABASE_URL =
        "https://anfpisxylmvclheoehnh.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_B9JjVM8dQpDnOOMaK_QIKg_kXlud85S";

    let supabaseClient = null;
    let initializationError = null;

    try {
        if (!window.supabase || typeof window.supabase.createClient !== "function") {
            throw new Error(
                "مكتبة Supabase غير محمّلة. تأكد من إضافة مكتبة Supabase قبل هذا الملف."
            );
        }

        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

        console.info("JAKO STORE: Supabase connected.");

    } catch (error) {
        initializationError = error;
        console.error("Supabase initialization error:", error);
    }

    // توافق مع ملفات المتجر
    window.supabaseClient = supabaseClient;

    // =====================================
    // 2. STORE SETTINGS
    // =====================================

    const WHATSAPP_NUMBER = "963982704754";

    const SETTINGS_TABLE = "store_settings";
    const SETTINGS_ID = 1;

    let currentExchangeRate = null;
    let settingsLoaded = false;

    // =====================================
    // 3. CONNECTION CHECK
    // =====================================

    function requireSupabase() {
        if (!supabaseClient) {
            throw new Error(
                "تعذر الاتصال بقاعدة البيانات. تحقق من إعدادات Supabase."
            );
        }

        return supabaseClient;
    }

    function isConnected() {
        return Boolean(supabaseClient);
    }

    // =====================================
    // 4. NUMBER FORMATTING
    // =====================================

    function formatDecimalString(value) {
        const text = String(value).trim();

        if (!/^\d+(\.\d+)?$/.test(text)) {
            throw new Error("القيمة الرقمية غير صحيحة.");
        }

        const parts = text.split(".");

        let integerPart = parts[0] || "0";
        let decimalPart = parts[1] || "";

        integerPart = integerPart.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ","
        );

        decimalPart = decimalPart.replace(/0+$/, "");

        return decimalPart
            ? integerPart + "." + decimalPart
            : integerPart;
    }

    // =====================================
    // 5. PRECISE DECIMAL MULTIPLICATION
    // =====================================

    function multiplyDecimals(first, second) {

        function parseDecimal(value) {
            const text = String(value).trim();

            if (!/^\d+(\.\d+)?$/.test(text)) {
                throw new Error("قيمة رقمية غير صحيحة.");
            }

            const parts = text.split(".");
            const decimals = (parts[1] || "").length;

            return {
                integer: BigInt(parts.join("")),
                decimals: decimals
            };
        }

        const a = parseDecimal(first);
        const b = parseDecimal(second);

        let result = a.integer * b.integer;
        const scale = a.decimals + b.decimals;

        let resultText = result.toString();

        if (scale > 0) {
            resultText = resultText.padStart(
                scale + 1,
                "0"
            );

            const position = resultText.length - scale;

            resultText =
                resultText.slice(0, position) +
                "." +
                resultText.slice(position);
        }

        if (resultText.includes(".")) {
            resultText = resultText.replace(/0+$/, "");
            resultText = resultText.replace(/\.$/, "");
        }

        return resultText;
    }

    // =====================================
    // 6. LOAD EXCHANGE RATE
    // =====================================

    async function loadExchangeRate(forceRefresh = false) {

        const client = requireSupabase();

        if (settingsLoaded && !forceRefresh) {
            return currentExchangeRate;
        }

        const { data, error } = await client
            .from(SETTINGS_TABLE)
            .select("usd_to_syp")
            .eq("id", SETTINGS_ID)
            .single();

        if (error) {
            console.error("Exchange rate error:", error);

            throw new Error(
                "تعذر تحميل سعر الصرف من إعدادات المتجر."
            );
        }

        if (
            !data ||
            data.usd_to_syp === null ||
            !Number.isFinite(Number(data.usd_to_syp)) ||
            Number(data.usd_to_syp) <= 0
        ) {
            throw new Error(
                "لم يتم تحديد سعر الصرف بشكل صحيح في لوحة الإدارة."
            );
        }

        currentExchangeRate = String(data.usd_to_syp);
        settingsLoaded = true;

        return currentExchangeRate;
    }

    // =====================================
    // 7. GET CURRENT EXCHANGE RATE
    // =====================================

    function getExchangeRate() {
        return currentExchangeRate;
    }

    // =====================================
    // 8. CALCULATE SYP PRICE
    // =====================================

    async function calculateSypPrice(usdPrice) {

        const rate = await loadExchangeRate();

        const result = multiplyDecimals(
            usdPrice,
            rate
        );

        return {
            usd: String(usdPrice),
            syp: result,
            formattedSyp: formatDecimalString(result)
        };
    }

    // =====================================
    // 9. AUTHENTICATION
    // =====================================

    async function getSession() {

        const client = requireSupabase();

        const { data, error } =
            await client.auth.getSession();

        if (error) {
            console.error("Session error:", error);
            throw error;
        }

        return data.session;
    }

    async function getCurrentUser() {

        const client = requireSupabase();

        const { data, error } =
            await client.auth.getUser();

        if (error) {
            console.error("User error:", error);
            throw error;
        }

        return data.user;
    }

    async function signOut() {

        const client = requireSupabase();

        const { error } =
            await client.auth.signOut();

        if (error) {
            console.error("Sign out error:", error);
            throw error;
        }

        return true;
    }

    // =====================================
    // 10. ADMIN DISPLAY CHECK
    // =====================================

    async function isAdmin() {

        try {
            const user = await getCurrentUser();

            if (!user) {
                return false;
            }

            // هذا الفحص لإظهار عناصر الواجهة فقط.
            // صلاحيات الإدارة الحقيقية يجب فرضها
            // عبر سياسات RLS في Supabase.

            return user.user_metadata?.role === "admin";

        } catch (error) {
            console.error("Admin display check:", error);
            return false;
        }
    }

    // =====================================
    // 11. SHAM CASH NOTE GENERATION
    // =====================================

    async function generateShamcashNote() {

        const client = requireSupabase();

        const { data, error } = await client.rpc(
            "generate_shamcash_note"
        );

        if (error) {
            console.error("Sham Cash note error:", error);
            throw error;
        }

        const noteCode = String(data);

        if (!/^[0-9]{8}$/.test(noteCode)) {
            throw new Error(
                "لم يتم استلام رقم ملاحظة شام كاش صحيح."
            );
        }

        return noteCode;
    }

    // =====================================
    // 12. WHATSAPP CONFIGURATION
    // =====================================

    function getWhatsAppNumber() {
        return WHATSAPP_NUMBER;
    }

    function createWhatsAppLink(message) {

        const text = String(message || "").trim();

        if (!text) {
            throw new Error("رسالة الطلب فارغة.");
        }

        return (
            "https://wa.me/" +
            WHATSAPP_NUMBER +
            "?text=" +
            encodeURIComponent(text)
        );
    }

    // =====================================
    // 13. GLOBAL STORE OBJECT
    // =====================================

    window.JAKO_STORE = {

        // Connection
        client: supabaseClient,
        isConnected: isConnected,
        initializationError: initializationError,

        // Store settings
        whatsappNumber: WHATSAPP_NUMBER,
        settingsTable: SETTINGS_TABLE,

        // Number utilities
        formatDecimalString: formatDecimalString,
        multiplyDecimals: multiplyDecimals,

        // Pricing
        loadExchangeRate: loadExchangeRate,
        getExchangeRate: getExchangeRate,
        calculateSypPrice: calculateSypPrice,

        // Authentication
        getSession: getSession,
        getCurrentUser: getCurrentUser,
        signOut: signOut,
        isAdmin: isAdmin,

        // Payments
        generateShamcashNote: generateShamcashNote,

        // WhatsApp
        getWhatsAppNumber: getWhatsAppNumber,
        createWhatsAppLink: createWhatsAppLink
    };

})();
