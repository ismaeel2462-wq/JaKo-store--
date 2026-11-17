
/* =========================================
   JAKO STORE - CHECKOUT ENGINE
   معالجة الطلبات وطرق الدفع
========================================= */

(function () {
    "use strict";

    const STORE = window.JAKO_STORE;

    if (!STORE || !STORE.client) {
        console.error("JAKO STORE: Supabase configuration is missing.");
        return;
    }

    const PAYMENT_METHODS = {
        sham_cash: "شام كاش",
        google_play: "بطاقة Google Play",
        whatsapp: "الطلب عبر واتساب"
    };

    /* =========================================
       أدوات مساعدة
    ========================================= */

    function clean(value) {
        return String(value ?? "").trim();
    }

    function formatPrice(value) {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return clean(value) || "غير محدد";
        }

        return number.toLocaleString("en-US", {
            maximumFractionDigits: 2
        });
    }

    function getFieldLines(fields) {
        if (!fields || typeof fields !== "object") {
            return [];
        }

        return Object.entries(fields).map(([key, value]) => {
            return `${key}: ${clean(value) || "غير محدد"}`;
        });
    }

    function buildOrderMessage(order, note) {
        const paymentName =
            PAYMENT_METHODS[order.paymentMethod] || "غير محدد";

        const lines = [
            "🛒 *طلب جديد من JAKO STORE*",
            "",
            `🎮 المنتج: ${clean(order.productName)}`,
            `📦 الباقة: ${clean(order.packageName)}`,
            `🆔 رقم المنتج: ${clean(order.productId)}`,
            "",
            "👤 *بيانات الطلب:*",
            ...getFieldLines(order.fields),
            "",
            `💳 طريقة الدفع: ${paymentName}`,
            `💵 السعر الأصلي: $${formatPrice(order.price?.usd)}`,
            `💰 السعر المطلوب: ${formatPrice(order.price?.syp)} ل.س`
        ];

        if (order.paymentMethod === "sham_cash") {
            lines.push(
                "",
                "🏦 *الدفع عبر شام كاش*",
                `🔢 رقم ملاحظة التحويل: ${note}`,
                "يرجى إرفاق صورة إثبات التحويل."
            );
        }

        if (order.paymentMethod === "google_play") {
            lines.push(
                "",
                "🎁 *بيانات بطاقة Google Play*",
                `🔐 الرمز: ${clean(order.googlePlayCode)}`
            );
        }

        lines.push(
            "",
            `📅 التاريخ: ${new Date(order.createdAt || Date.now()).toLocaleString("ar")}`,
            "",
            "يرجى مراجعة الطلب وتأكيده."
        );

        return lines.join("\n");
    }

    function openWhatsApp(message) {
        const phone = clean(STORE.getWhatsAppNumber());

        if (!phone) {
            throw new Error("رقم واتساب المتجر غير مضبوط في الإعدادات.");
        }

        const link = STORE.createWhatsAppLink(message);

        if (link) {
            window.location.href = link;
            return;
        }

        window.location.href =
            "https://wa.me/" + phone.replace(/\D/g, "") +
            "?text=" + encodeURIComponent(message);
    }

    /* =========================================
       توليد رقم ملاحظة شام كاش
    ========================================= */

    async function generateShamCashNote() {
        const result = await STORE.generateShamcashNote();

        let note = result;

        if (result && typeof result === "object") {
            note =
                result.note ??
                result.number ??
                result.code ??
                result.data ??
                result;
        }

        note = clean(note);

        if (!note || note === "[object Object]") {
            throw new Error(
                "لم نتمكن من إنشاء رقم ملاحظة شام كاش. حاول مرة أخرى."
            );
        }

        return note;
    }

    /* =========================================
       التحقق من بيانات الطلب
    ========================================= */

    function validateOrder(order) {
        if (!order || typeof order !== "object") {
            throw new Error("بيانات الطلب غير صحيحة.");
        }

        if (!clean(order.productId)) {
            throw new Error("لم يتم تحديد المنتج.");
        }

        if (!clean(order.productName)) {
            throw new Error("اسم المنتج غير موجود.");
        }

        if (!clean(order.packageId)) {
            throw new Error("يرجى اختيار الباقة.");
        }

        if (!clean(order.packageName)) {
            throw new Error("اسم الباقة غير موجود.");
        }

        if (!PAYMENT_METHODS[order.paymentMethod]) {
            throw new Error("طريقة الدفع غير معروفة.");
        }

        if (!order.price || !Number.isFinite(Number(order.price.syp))) {
            throw new Error("تعذر تحديد سعر الطلب.");
        }

        if (!Number.isFinite(Number(order.price.usd))) {
            throw new Error("السعر الأصلي للطلب غير صحيح.");
        }

        if (
            order.paymentMethod === "google_play" &&
            !clean(order.googlePlayCode)
        ) {
            throw new Error("يرجى إدخال رمز بطاقة Google Play.");
        }

        return true;
    }

    /* =========================================
       إرسال الطلب
    ========================================= */

    async function submit(order) {
        validateOrder(order);

        // التأكد من تسجيل دخول العميل
        const session = await STORE.getSession();

        if (!session) {
            localStorage.setItem(
                "returnAfterLogin",
                window.location.href
            );

            window.location.href = "login.html";

            return {
                success: false,
                redirected: true
            };
        }

        let shamCashNote = null;

        // إنشاء رقم ملاحظة خاص بطلب شام كاش
        if (order.paymentMethod === "sham_cash") {
            shamCashNote = await generateShamCashNote();
        }

        // بناء رسالة الطلب
        const message = buildOrderMessage(
            order,
            shamCashNote
        );

        // إرسال الطلب إلى واتساب المتجر
        openWhatsApp(message);

        return {
            success: true,
            paymentMethod: order.paymentMethod,
            shamCashNote: shamCashNote
        };
    }

    /* =========================================
       إتاحة المحرك لبقية ملفات المتجر
    ========================================= */

    window.JAKO_CHECKOUT = {
        submit: submit,
        validateOrder: validateOrder,
        buildOrderMessage: buildOrderMessage
    };

    console.log("JAKO STORE: Checkout engine loaded successfully.");

})();
