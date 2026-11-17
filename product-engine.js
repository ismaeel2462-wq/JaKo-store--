
/* =========================================
   JAKO STORE - PRODUCT ENGINE
   Unified Games & Applications Pages
========================================= */

(() => {
    "use strict";

    const STORE = window.JAKO;
    const PRODUCTS = window.JAKO_PRODUCTS || {};
    const params = new URLSearchParams(window.location.search);
    const productId =
        document.body.dataset.product ||
        params.get("product") ||
        "";

    const product = PRODUCTS[productId];
    const root = document.getElementById("productRoot");
    const $ = (id) => document.getElementById(id);

    if (!STORE || !STORE.client) {
        if (root) {
            root.innerHTML =
                '<div class="notice error-message">تعذر الاتصال بإعدادات المتجر. تحقق من تحميل supabase-config.js.</div>';
        }

        console.error("JAKO STORE: window.JAKO.client is unavailable.");
        return;
    }

    if (!product || !root) {
        if (root) {
            root.innerHTML =
                '<div class="notice">هذه الصفحة غير متاحة حالياً.</div>';
        }

        console.error(
            "JAKO STORE: product or #productRoot was not found.",
            productId
        );

        return;
    }

    const client = STORE.client;
    const WHATSAPP_NUMBER = STORE.WHATSAPP_NUMBER;
    const SHAM_CASH_ACCOUNT = STORE.SHAM_CASH_ACCOUNT;

    let exchangeRate = null;
    let cocPrices = null;
    let codCustomRate = null;
    let noteCode = null;
    let selectedItem = null;
    let busy = false;

    // =====================================
    // 1. BASIC UTILITIES
    // =====================================

    const esc = (value) =>
        String(value ?? "").replace(/[&<>"']/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);

    const moneyUSD = (value) =>
        Number(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    function parseDecimal(value) {
        const text = String(value).trim();

        if (!/^\d+(\.\d+)?$/.test(text)) {
            throw new Error("قيمة رقمية غير صالحة.");
        }

        const [whole, fraction = ""] = text.split(".");

        return {
            integer: BigInt(whole + fraction),
            scale: fraction.length
        };
    }

    function toSYP(usd) {
        if (
            exchangeRate === null ||
            usd === null ||
            usd === undefined
        ) {
            return null;
        }

        const price = parseDecimal(Number(usd).toFixed(6));
        const rate = parseDecimal(exchangeRate);

        const numerator = price.integer * rate.integer;
        const denominator =
            10n ** BigInt(price.scale + rate.scale);

        const rounded =
            (numerator + denominator - 1n) / denominator;

        return rounded
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function showError(message) {
        const error = $("formError");
        const success = $("formSuccess");

        if (error) {
            error.textContent = message;
            error.style.display = "block";
        }

        if (success) {
            success.style.display = "none";
        }
    }

    function showSuccess(message) {
        const success = $("formSuccess");
        const error = $("formError");

        if (success) {
            success.textContent = message;
            success.style.display = "block";
        }

        if (error) {
            error.style.display = "none";
        }
    }

    function clearMessages() {
        if ($("formError")) {
            $("formError").style.display = "none";
        }

        if ($("formSuccess")) {
            $("formSuccess").style.display = "none";
        }
    }

    function imageFallback(name) {
        return `https://raw.githubusercontent.com/ismaeel2462-wq/JaKo-store--/main/${encodeURIComponent(name)}`;
    }

    function productImage() {
        const image = esc(product.image || "");
        const fallback = esc(imageFallback(product.image || ""));

        return `
            <img
                src="${image}"
                alt="${esc(product.title)}"
                onerror="this.onerror=null;this.src='${fallback}'"
            >
        `;
    }

    function productPackages() {
        return Array.isArray(product.packages)
            ? product.packages
            : [];
    }

    function cocGemPackages() {
        return productPackages().filter((item) =>
            String(item[3] || "").startsWith("gems_")
        );
    }

    // =====================================
    // 2. LOAD SETTINGS FROM SUPABASE
    // =====================================

    async function loadSettings() {
        let data = null;
        let lastError = null;

        const selections = [
            "usd_to_syp,coc_product_prices,codm_custom_price_per_100_usd",
            "usd_to_syp,coc_product_prices",
            "usd_to_syp"
        ];

        for (const columns of selections) {
            const result = await client
                .from("store_settings")
                .select(columns)
                .eq("id", 1)
                .maybeSingle();

            if (!result.error && result.data) {
                data = result.data;
                lastError = null;
                break;
            }

            lastError =
                result.error ||
                new Error("لم يتم العثور على إعدادات المتجر.");
        }

        if (!data) {
            throw lastError ||
                new Error("تعذر تحميل إعدادات المتجر.");
        }

        const rate = String(data.usd_to_syp ?? "").trim();

        if (
            !/^\d+(\.\d+)?$/.test(rate) ||
            Number(rate) <= 0
        ) {
            throw new Error(
                "سعر الصرف غير مضبوط في إعدادات المتجر."
            );
        }

        exchangeRate = rate;
        cocPrices = data.coc_product_prices || null;

        codCustomRate =
            data.codm_custom_price_per_100_usd == null
                ? null
                : Number(data.codm_custom_price_per_100_usd);
    }

    // =====================================
    // 3. PRODUCT PAGE MARKUP
    // =====================================

    function renderBaseMarkup() {
        return `
            <div class="store-container">

                <div class="store-top">
                    <a class="back-link" href="index.html">
                        ⬅ العودة للمتجر
                    </a>

                    <a class="back-link" href="login.html">
                        تسجيل الدخول
                    </a>
                </div>

                <div class="product-head">
                    ${productImage()}

                    <h1>
                        ${esc(product.title)}
                        <span style="font-size:13px;color:#aaa">
                            ${esc(product.en || "")}
                        </span>
                    </h1>

                    <p>${esc(product.description || "")}</p>
                </div>

                <form id="orderForm" novalidate>

                    <div id="specificFields"></div>

                    <div id="dynamicPackageFields"></div>

                    <div class="price-panel">

                        <span class="price-main" id="priceSYP">
                            جارٍ تحميل السعر...
                        </span>

                        <span class="price-usd" id="priceUSD">
                            —
                        </span>

                        <span class="price-note" id="priceNote">
                            سعر الصرف للاحتساب الداخلي فقط ولا يظهر للعميل.
                            ${esc(product.priceNote || "")}
                        </span>

                    </div>

                    <div class="form-group">

                        <label for="paymentMethod">
                            طريقة الدفع
                        </label>

                        <select
                            class="form-control"
                            id="paymentMethod"
                            required
                        >
                            <option value="">
                                -- اختر طريقة الدفع --
                            </option>

                            <option value="شام كاش">
                                شام كاش
                            </option>

                            <option value="بطاقات جوجل بلاي">
                                بطاقات Google Play
                            </option>

                            <option value="الطلب عبر واتساب">
                                الطلب عبر واتساب (الدفع لاحقاً)
                            </option>

                        </select>

                        <div
                            id="paymentNotice"
                            class="notice hidden"
                        ></div>

                    </div>

                    <div
                        class="form-group hidden"
                        id="googleCodeGroup"
                    >
                        <label for="googleCode">
                            رمز بطاقة Google Play
                        </label>

                        <input
                            class="form-control"
                            id="googleCode"
                            autocomplete="off"
                            placeholder="أدخل رمز البطاقة"
                        >
                    </div>

                    <div
                        id="formError"
                        class="error-message"
                        role="alert"
                    ></div>

                    <div
                        id="formSuccess"
                        class="success-message"
                        role="status"
                    ></div>

                    <button
                        class="submit-btn"
                        id="submitBtn"
                        type="submit"
                        disabled
                    >
                        جارٍ تحميل إعدادات الأسعار...
                    </button>

                </form>

            </div>
        `;
    }

    // =====================================
    // 4. CLASH OF CLANS FIELDS
    // =====================================

    function renderCocFields() {
        const gemOptions = cocGemPackages()
            .map((item) => `
                <option value="${esc(item[3])}">
                    ${esc(item[0])} —
                    ${item[2] == null
                        ? "السعر بعد المراجعة"
                        : "$" + moneyUSD(item[2])}
                </option>
            `)
            .join("");

        return `
            <div class="form-group">

                <label for="playerName">
                    اسم القرية داخل اللعبة
                </label>

                <input
                    class="form-control"
                    id="playerName"
                    required
                    placeholder="اسم قريتك داخل اللعبة"
                    maxlength="40"
                >

            </div>

            <div class="form-group">

                <label for="playerTag">
                    Player Tag
                </label>

                <input
                    class="form-control"
                    id="playerTag"
                    required
                    placeholder="#XXXXXXXX"
                    maxlength="13"
                    style="direction:ltr;text-align:left;text-transform:uppercase"
                >

            </div>

            <div class="form-group">

                <label for="townHall">
                    مستوى Town Hall
                </label>

                <select
                    class="form-control"
                    id="townHall"
                    required
                >
                    <option value="">
                        اختر مستوى القرية
                    </option>

                    ${Array.from(
                        { length: 16 },
                        (_, index) => `
                            <option value="${index + 3}">
                                Town Hall ${index + 3}
                            </option>
                        `
                    ).join("")}

                </select>

            </div>

            <div class="form-group">

                <label for="productType">
                    نوع الطلب
                </label>

                <select
                    class="form-control"
                    id="productType"
                >
                    <option value="gems">
                        جواهر Gems
                    </option>

                    <option value="goldpass">
                        Gold Pass
                    </option>

                    <option value="eventpass">
                        Event Pass
                    </option>

                    <option value="special">
                        عرض أو عنصر خاص
                    </option>
                </select>

            </div>

            <div
                class="form-group"
                id="cocGemsGroup"
            >

                <label for="packageSelect">
                    باقة الجواهر
                </label>

                <select
                    class="form-control"
                    id="packageSelect"
                >
                    ${gemOptions || `
                        <option value="">
                            لا توجد باقات مسجلة
                        </option>
                    `}
                </select>

            </div>

            <div
                class="form-group hidden"
                id="cocPassGroup"
            >

                <label for="passQuantity">
                    عدد التصاريح
                </label>

                <select
                    class="form-control"
                    id="passQuantity"
                >
                    <option value="1">تصريح واحد</option>
                    <option value="2">تصريحان</option>
                    <option value="3">3 تصاريح</option>
                </select>

                <div class="form-hint">
                    يتطلب إهداء التصريح رمز صداقة صالحاً داخل اللعبة.
                </div>

                <input
                    class="form-control"
                    id="friendCode"
                    style="margin-top:8px"
                    placeholder="Supercell ID Friend Code"
                >

                <label
                    class="check-row"
                    style="margin-top:10px"
                >
                    <input
                        type="checkbox"
                        id="friendConfirm"
                    >

                    أؤكد أنني أفهم شروط إهداء التصاريح
                </label>

            </div>

            <div
                class="form-group hidden"
                id="cocSpecialGroup"
            >

                <label for="specialName">
                    اسم العرض أو العنصر
                </label>

                <input
                    class="form-control"
                    id="specialName"
                    placeholder="اكتب اسم العرض أو العنصر"
                >

                <textarea
                    class="form-control"
                    id="specialDetails"
                    style="margin-top:8px"
                    placeholder="تفاصيل إضافية للطلب"
                ></textarea>

            </div>
        `;
    }

    // =====================================
    // 5. PLAYER INPUT FIELDS
    // =====================================

    function renderPlayerFields() {
        if (product.special === "coc") {
            return renderCocFields();
        }

        return `
            <div class="form-group">

                <label for="playerId">
                    ${esc(product.fieldLabel || "معرّف اللاعب")}
                </label>

                <input
                    class="form-control"
                    id="playerId"
                    required
                    placeholder="${esc(product.fieldPlaceholder || "أدخل معرّف الحساب")}"
                    ${product.validation === "digits"
                        ? 'inputmode="numeric"'
                        : ""}
                    autocomplete="off"
                    maxlength="80"
                >

            </div>
        `;
    }

    // =====================================
    // 6. PACKAGE FIELDS
    // =====================================

    function renderPackageFields() {
        if (product.special === "coc") {
            return "";
        }

        if (product.custom === "bigo") {
            return `
                <div class="form-group">

                    <label for="customQuantity">
                        عدد الألماسات
                    </label>

                    <input
                        class="form-control"
                        id="customQuantity"
                        type="number"
                        min="1"
                        max="1000000"
                        step="1"
                        inputmode="numeric"
                        placeholder="مثلاً: 500"
                        required
                    >

                </div>
            `;
        }

        if (product.custom === "soulchill") {
            return `
                <div class="form-group">

                    <label for="customQuantity">
                        عدد الكريستالات
                    </label>

                    <input
                        class="form-control"
                        id="customQuantity"
                        type="number"
                        min="1"
                        max="1000000"
                        step="1"
                        inputmode="numeric"
                        placeholder="مثلاً: 5000"
                        required
                    >

                </div>
            `;
        }

        if (product.custom === "quote") {
            return `
                <div class="form-group">

                    <label for="customQuantity">
                        الكمية أو الباقة المطلوبة
                    </label>

                    <input
                        class="form-control"
                        id="customQuantity"
                        type="text"
                        maxlength="120"
                        placeholder="اكتب الكمية أو اسم الباقة"
                        required
                    >

                    <div class="form-hint">
                        سيتم تأكيد التوفر والسعر قبل تنفيذ الطلب.
                    </div>

                </div>
            `;
        }

        const packages = productPackages();

        if (!packages.length) {
            return `
                <div class="notice">
                    لا توجد باقات متاحة حالياً لهذا المنتج.
                </div>
            `;
        }

        return `
            <div class="form-group">

                <label for="packageSelect">
                    ${product.customCP
                        ? "باقة CP الرسمية"
                        : "اختر الباقة"}
                </label>

                <select
                    class="form-control"
                    id="packageSelect"
                >

                    ${packages.map((item, index) => `
                        <option value="${index}">
                            ${esc(item[0])} —
                            ${item[2] == null
                                ? "السعر بعد المراجعة"
                                : "$" + moneyUSD(item[2])}
                        </option>
                    `).join("")}

                </select>

                ${product.customCP ? `
                    <div class="form-hint">
                        يمكنك إدخال كمية CP مخصصة عند ضبط سعر كل 100 CP في إعدادات المتجر.
                    </div>

                    <input
                        class="form-control"
                        id="customCP"
                        style="margin-top:8px"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="كمية CP مخصصة"
                    >
                ` : ""}

            </div>
        `;
    }

    // =====================================
    // 7. CLASH OF CLANS PACKAGE LOGIC
    // =====================================

    function getCocSelection() {
        const type = $("productType").value;

        if (type === "gems") {
            const packageId = $("packageSelect").value;

            const pack = cocGemPackages().find(
                (item) => item[3] === packageId
            );

            if (!pack) {
                throw new Error("اختر باقة الجواهر.");
            }

            const quantity = Number(pack[1]);

            const saved =
                cocPrices?.gems?.[String(quantity)];

            const usd = saved == null
                ? Number(pack[2])
                : Number(saved);

            return {
                name: pack[0],
                usd: Number.isFinite(usd) ? usd : null,
                details: {
                    type,
                    quantity
                }
            };
        }

        if (type === "goldpass" || type === "eventpass") {
            const quantity = Number($("passQuantity").value);

            const basePrice = type === "goldpass"
                ? cocPrices?.goldpass
                : cocPrices?.eventpass;

            const usd = basePrice == null
                ? null
                : Number(basePrice) * quantity;

            return {
                name:
                    (type === "goldpass" ? "Gold Pass" : "Event Pass") +
                    ` × ${quantity}`,
                usd: Number.isFinite(usd) ? usd : null,
                details: {
                    type,
                    quantity
                }
            };
        }

        const name = $("specialName").value.trim();

        return {
            name: name || "طلب خاص",
            usd: null,
            details: {
                type: "special",
                quantity: 1,
                description: $("specialDetails").value.trim()
            }
        };
    }

    // =====================================
    // 8. SOULCHILL PRICE CALCULATION
    // =====================================

    function interpolateSoulchill(quantity) {
        const points = [
            { quantity: 2160, cents: 436 },
            { quantity: 4450, cents: 897 },
            { quantity: 13700, cents: 2759 },
            { quantity: 23500, cents: 4732 },
            { quantity: 48300, cents: 9725 }
        ];

        let lower = points[0];
        let upper = points[1];

        if (quantity >= points[points.length - 1].quantity) {
            lower = points[points.length - 2];
            upper = points[points.length - 1];
        } else {
            for (let index = 0; index < points.length - 1; index++) {
                if (
                    quantity >= points[index].quantity &&
                    quantity <= points[index + 1].quantity
                ) {
                    lower = points[index];
                    upper = points[index + 1];
                    break;
                }
            }
        }

        const qDiff = BigInt(
            upper.quantity - lower.quantity
        );

        const cDiff = BigInt(
            upper.cents - lower.cents
        );

        const offset = BigInt(
            quantity - lower.quantity
        );

        const numerator =
            BigInt(lower.cents) * qDiff +
            offset * cDiff;

        const cents =
            (numerator + qDiff - 1n) / qDiff;

        return Number(cents) / 100;
    }

    // =====================================
    // 9. GET SELECTED PACKAGE AND PRICE
    // =====================================

    function getSelected() {
        if (product.special === "coc") {
            return getCocSelection();
        }

        if (
            product.custom === "bigo" ||
            product.custom === "soulchill"
        ) {
            const raw = $("customQuantity").value.trim();

            if (!/^\d+$/.test(raw)) {
                throw new Error("أدخل كمية صحيحة.");
            }

            const quantity = Number(raw);

            if (
                !Number.isSafeInteger(quantity) ||
                quantity < 1 ||
                quantity > 1000000
            ) {
                throw new Error(
                    "أدخل كمية بين 1 و1,000,000."
                );
            }

            const usd = product.custom === "bigo"
                ? Number((quantity / 28).toFixed(2))
                : interpolateSoulchill(quantity);

            return {
                name:
                    `${quantity.toLocaleString("en-US")} ` +
                    (product.custom === "bigo"
                        ? "ألماسة"
                        : "كريستالة"),
                usd,
                details: { quantity }
            };
        }

        if (product.custom === "quote") {
            const requested =
                $("customQuantity").value.trim();

            if (!requested) {
                throw new Error(
                    "اكتب الكمية أو الباقة المطلوبة."
                );
            }

            return {
                name: requested,
                usd: null,
                details: {
                    quantity: requested
                }
            };
        }

        if (
            product.customCP &&
            $("customCP")?.value.trim()
        ) {
            const quantity = Number($("customCP").value);

            if (
                !Number.isSafeInteger(quantity) ||
                quantity <= 0
            ) {
                throw new Error(
                    "أدخل كمية CP صحيحة."
                );
            }

            if (
                !Number.isFinite(codCustomRate) ||
                codCustomRate <= 0
            ) {
                throw new Error(
                    "سعر CP المخصص غير مضبوط في إعدادات المتجر. اختر باقة رسمية."
                );
            }

            return {
                name:
                    `${quantity.toLocaleString("en-US")} CP (كمية مخصصة)`,
                usd: Number(
                    ((quantity / 100) * codCustomRate).toFixed(2)
                ),
                details: { quantity }
            };
        }

        const index = Number($("packageSelect").value);
        const pack = productPackages()[index];

        if (!pack) {
            throw new Error("اختر باقة الشحن.");
        }

        return {
            name: pack[0],
            usd: pack[2] == null ? null : Number(pack[2]),
            details: {
                packageIndex: index,
                quantity: pack[1],
                packageId: pack[3] || null
            }
        };
    }

    // =====================================
    // 10. UPDATE PRICE DISPLAY
    // =====================================

    function refreshPrice() {
        try {
            const item = getSelected();
            selectedItem = item;

            if (
                item.usd === null ||
                item.usd === undefined ||
                !Number.isFinite(Number(item.usd))
            ) {
                $("priceSYP").textContent =
                    "يحدد بعد مراجعة الطلب";

                $("priceUSD").textContent =
                    "السعر بالدولار: بعد التأكيد";

            } else {
                $("priceUSD").textContent =
                    `السعر الأصلي بالدولار: $${moneyUSD(item.usd)}`;

                $("priceSYP").textContent = exchangeRate
                    ? `${toSYP(item.usd)} ل.س`
                    : "جارٍ تحميل السعر...";
            }

        } catch (error) {
            selectedItem = null;

            $("priceSYP").textContent =
                "اختر الباقة أو أدخل الكمية";

            $("priceUSD").textContent = "—";
        }
    }

    // =====================================
    // 11. PAYMENT METHODS
    // =====================================

    function paymentChanged() {
        const method = $("paymentMethod").value;
        const notice = $("paymentNotice");
        const googleGroup = $("googleCodeGroup");

        notice.classList.toggle("hidden", !method);

        googleGroup.classList.toggle(
            "hidden",
            method !== "بطاقات جوجل بلاي"
        );

        $("googleCode").required =
            method === "بطاقات جوجل بلاي";

        notice.textContent =
            method === "شام كاش"
                ? "ستظهر نافذة التحويل ورقم ملاحظة خاص بطلبك بعد المتابعة."

                : method === "بطاقات جوجل بلاي"
                    ? "أدخل رمز البطاقة، وسيُرفق برسالة الطلب التي تفتحها عبر واتساب."

                    : method === "الطلب عبر واتساب"
                        ? "سيتم إرسال تفاصيل الطلب دون دفع مسبق، والاتفاق على الدفع لاحقاً."

                        : "";
    }

    // =====================================
    // 12. COC PRODUCT TYPE DISPLAY
    // =====================================

    function updateCocSections() {
        const type = $("productType").value;

        $("cocGemsGroup").classList.toggle(
            "hidden",
            type !== "gems"
        );

        $("cocPassGroup").classList.toggle(
            "hidden",
            !["goldpass", "eventpass"].includes(type)
        );

        $("cocSpecialGroup").classList.toggle(
            "hidden",
            type !== "special"
        );

        refreshPrice();
    }

    // =====================================
    // 13. VALIDATE PLAYER INFORMATION
    // =====================================

    function collectPlayer() {
        if (product.special === "coc") {
            const name = $("playerName").value.trim();

            const tag = $("playerTag")
                .value
                .trim()
                .toUpperCase();

            const townHall = $("townHall").value;

            if (name.length < 2) {
                throw new Error("أدخل اسم القرية.");
            }

            if (!/^#[A-Z0-9]{3,12}$/.test(tag)) {
                throw new Error(
                    "تحقق من Player Tag. مثال: #ABC123"
                );
            }

            if (!townHall) {
                throw new Error("اختر مستوى Town Hall.");
            }

            const result = {
                name,
                tag,
                townHall
            };

            const type = $("productType").value;

            if (["goldpass", "eventpass"].includes(type)) {
                const friendCode =
                    $("friendCode").value.trim();

                if (!friendCode) {
                    throw new Error(
                        "أدخل Supercell ID Friend Code للتصاريح."
                    );
                }

                if (!$("friendConfirm").checked) {
                    throw new Error(
                        "يرجى تأكيد فهم شروط إهداء التصاريح."
                    );
                }

                result.friendCode = friendCode;
            }

            return result;
        }

        const id = $("playerId").value.trim();

        if (!id) {
            throw new Error("أدخل معرّف الحساب أولاً.");
        }

        if (
            product.validation === "digits" &&
            !/^\d{4,22}$/.test(id)
        ) {
            throw new Error(
                "يجب أن يتكون المعرّف من أرقام فقط (4 إلى 22 رقماً)."
            );
        }

        if (
            product.validation === "cod" &&
            !/^(?:[A-Za-z0-9]{6}|\d{19,20})$/.test(id)
        ) {
            throw new Error(
                "تحقق من UID الخاص باللعبة."
            );
        }

        if (
            product.validation === "username" &&
            !/^[A-Za-z0-9_.]{3,30}$/.test(id)
        ) {
            throw new Error(
                "تحقق من اسم المستخدم."
            );
        }

        return { id };
    }

    // =====================================
    // 14. LOGIN CHECK
    // =====================================

    async function requireLogin() {
        const { data, error } =
            await client.auth.getSession();

        if (error) {
            throw error;
        }

        if (!data.session) {
            localStorage.setItem(
                "returnAfterLogin",
                window.location.href
            );

            window.location.href = "login.html";

            return false;
        }

        return true;
    }

    // =====================================
    // 15. SHAM CASH NOTE
    // =====================================

    async function createNote() {
        const { data, error } =
            await client.rpc("generate_shamcash_note");

        if (error) {
            throw error;
        }

        const value = String(data ?? "");

        if (!/^\d{8}$/.test(value)) {
            throw new Error(
                "لم يتم إنشاء رقم ملاحظة صالح من Supabase."
            );
        }

        return value;
    }

    // =====================================
    // 16. BUILD WHATSAPP ORDER MESSAGE
    // =====================================

    function orderMessage(method, note) {
        const player = collectPlayer();
        const item = selectedItem || getSelected();

        const lines = [
            "🛒 *طلب جديد — JAKO STORE*",
            "",
            `🎮 المنتج: ${product.title} (${product.en || ""})`
        ];

        if (product.special === "coc") {
            lines.push(
                `👤 اسم القرية: ${player.name}`,
                `🏷️ Player Tag: ${player.tag}`,
                `🏰 Town Hall: ${player.townHall}`
            );

            if (player.friendCode) {
                lines.push(
                    `🤝 Friend Code: ${player.friendCode}`
                );
            }

            if (item.details?.description) {
                lines.push(
                    `📝 تفاصيل إضافية: ${item.details.description}`
                );
            }

        } else {
            lines.push(`🆔 المعرّف: ${player.id}`);
        }

        lines.push(`📦 الباقة: ${item.name}`);

        if (
            item.usd !== null &&
            item.usd !== undefined &&
            Number.isFinite(Number(item.usd))
        ) {
            lines.push(
                `💵 السعر الأصلي بالدولار: $${moneyUSD(item.usd)}`
            );

            if (exchangeRate) {
                lines.push(
                    `💰 السعر بالليرة السورية: ${toSYP(item.usd)} ل.س`
                );
            }

        } else {
            lines.push(
                "💵 السعر: يحدد بعد مراجعة الطلب"
            );
        }

        lines.push(`💳 طريقة الدفع: ${method}`);

        if (method === "شام كاش") {
            lines.push(
                `🔢 رقم الملاحظة: ${note}`,
                "📌 حالة الدفع: بانتظار تأكيد التحويل"
            );
        }

        if (method === "بطاقات جوجل بلاي") {
            lines.push(
                `🎟️ كود البطاقة: ${$("googleCode").value.trim()}`,
                "📌 حالة البطاقة: بانتظار المراجعة"
            );
        }

        if (method === "الطلب عبر واتساب") {
            lines.push(
                "📌 لم يتم الدفع مسبقاً — يتم الاتفاق على الدفع لاحقاً"
            );
        }

        lines.push(
            "",
            "يرجى تأكيد الطلب."
        );

        return lines.join("\n");
    }

    function openWhatsApp(message) {
        if (!WHATSAPP_NUMBER) {
            throw new Error(
                "رقم واتساب المتجر غير مضبوط."
            );
        }

        const url =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        window.location.href = url;
    }

    // =====================================
    // 17. SHAM CASH MODAL
    // =====================================

    function openCashModal() {
        const modal = $("qrModal");

        if (!modal) {
            throw new Error(
                "نافذة شام كاش غير موجودة في صفحة المنتج."
            );
        }

        $("noteCode").textContent = noteCode;
        $("qrAccount").textContent =
            SHAM_CASH_ACCOUNT || "—";

        modal.classList.add("open");
    }

    // =====================================
    // 18. SUBMIT ORDER
    // =====================================

    async function handleSubmit(event) {
        event.preventDefault();

        clearMessages();

        if (busy) {
            return;
        }

        busy = true;

        const button = $("submitBtn");

        button.disabled = true;
        button.textContent = "جارٍ تجهيز الطلب...";

        try {
            if (!await requireLogin()) {
                return;
            }

            const method = $("paymentMethod").value;

            if (!method) {
                throw new Error("اختر طريقة الدفع.");
            }

            collectPlayer();

            selectedItem = getSelected();

            if (
                method === "بطاقات جوجل بلاي" &&
                !$("googleCode").value.trim()
            ) {
                throw new Error(
                    "أدخل رمز بطاقة Google Play."
                );
            }

            if (
                selectedItem.usd !== null &&
                selectedItem.usd !== undefined &&
                !exchangeRate
            ) {
                await loadSettings();
                refreshPrice();
            }

            if (method === "شام كاش") {
                noteCode = await createNote();
                openCashModal();

            } else if (method === "الطلب عبر واتساب") {
                if (!window.confirm(
                    "سيتم إرسال الطلب دون دفع مسبق. هل تريد المتابعة؟"
                )) {
                    return;
                }

                openWhatsApp(
                    orderMessage(method, null)
                );

            } else {
                openWhatsApp(
                    orderMessage(method, null)
                );
            }

        } catch (error) {
            console.error(
                "JAKO STORE order error:",
                error
            );

            showError(
                error.message || "تعذر تجهيز الطلب."
            );

        } finally {
            busy = false;

            button.disabled = false;
            button.textContent = "متابعة وإكمال الطلب";
        }
    }

    // =====================================
    // 19. COPY SHAM CASH NOTE
    // =====================================

    async function copyNote() {
        if (!noteCode) {
            return;
        }

        try {
            await navigator.clipboard.writeText(noteCode);

            $("modalCopy").textContent =
                "تم النسخ ✓";

        } catch (error) {
            showError(
                "تعذر النسخ تلقائياً. انسخ رقم الملاحظة يدوياً."
            );
        }
    }

    // =====================================
    // 20. CONFIRM SHAM CASH PAYMENT
    // =====================================

    async function confirmCash() {
        if (!noteCode) {
            showError(
                "رقم الملاحظة غير موجود. أعد المحاولة."
            );

            return;
        }

        try {
            const { data, error } =
                await client.auth.getSession();

            if (error || !data.session) {
                localStorage.setItem(
                    "returnAfterLogin",
                    window.location.href
                );

                window.location.href = "login.html";
                return;
            }

            openWhatsApp(
                orderMessage("شام كاش", noteCode)
            );

        } catch (error) {
            showError(
                error.message || "تعذر فتح رسالة الطلب."
            );
        }
    }

    function closeModal() {
        $("qrModal")?.classList.remove("open");

        noteCode = null;

        if ($("noteCode")) {
            $("noteCode").textContent = "--------";
        }

        if ($("modalCopy")) {
            $("modalCopy").textContent =
                "نسخ رقم الملاحظة";
        }
    }

    // =====================================
    // 21. BIND PAGE EVENTS
    // =====================================

    function bindEvents() {
        $("orderForm").addEventListener(
            "submit",
            handleSubmit
        );

        $("paymentMethod").addEventListener(
            "change",
            paymentChanged
        );

        [
            "packageSelect",
            "customCP",
            "customQuantity",
            "productType",
            "passQuantity"
        ].forEach((id) => {
            const element = $(id);

            if (!element) {
                return;
            }

            element.addEventListener(
                "input",
                refreshPrice
            );

            element.addEventListener(
                "change",
                refreshPrice
            );
        });

        if (product.special === "coc") {
            $("productType").addEventListener(
                "change",
                updateCocSections
            );
        }

        $("modalCopy")?.addEventListener(
            "click",
            copyNote
        );

        $("modalConfirm")?.addEventListener(
            "click",
            confirmCash
        );

        $("modalClose")?.addEventListener(
            "click",
            closeModal
        );

        $("modalCancel")?.addEventListener(
            "click",
            closeModal
        );

        $("qrModal")?.addEventListener(
            "click",
            (event) => {
                if (event.target === $("qrModal")) {
                    closeModal();
                }
            }
        );
    }

    // =====================================
    // 22. INITIALIZE PRODUCT PAGE
    // =====================================

    async function initialize() {
        root.innerHTML = renderBaseMarkup();

        $("specificFields").innerHTML =
            renderPlayerFields();

        $("dynamicPackageFields").innerHTML =
            renderPackageFields();

        bindEvents();

        if (product.special === "coc") {
            updateCocSections();
        }

        try {
            await loadSettings();

            refreshPrice();

            $("submitBtn").disabled = false;
            $("submitBtn").textContent =
                "متابعة وإكمال الطلب";

        } catch (error) {
            console.error(
                "JAKO STORE settings error:",
                error
            );

            $("priceSYP").textContent =
                "تعذر تحميل السعر";

            $("priceUSD").textContent =
                "تحقق من إعدادات المتجر";

            $("submitBtn").disabled = false;
            $("submitBtn").textContent =
                "متابعة وإكمال الطلب";

            showError(
                error.message ||
                "تعذر تحميل إعدادات الأسعار."
            );
        }
    }

    // =====================================
    // 23. START
    // =====================================

    initialize();

})();
