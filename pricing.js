export const VAT_RATE = 0.08;
export const MAX_ROWS = 10;

export const CAMPAIGN = Object.freeze({
  name: "Nạp tiền hôm nay – Nhận thêm tới 35% ưu đãi",
  headline: ["Nạp tiền hôm nay", "Nhận thêm tới 35% ưu đãi"],
  start: "03/10/2026",
  end: "11/10/2026",
  short: "03/10–11/10",
  period: "03/10 – 11/10/2026",
  month: "10",
  year: "2026",
  bonusLabel: "Ontop",
  bannerLabel: "ƯU ĐÃI",
});

// The supplied October policy applies to personal customers only.
// Keep the previous business policy and its own dates separate.
export const CAMPAIGNS = Object.freeze({
  personal: CAMPAIGN,
  business: Object.freeze({
    name: "Nạp nhanh kẻo lỡ – Ưu đãi đang chờ",
    headline: ["Nạp nhanh kẻo lỡ", "Ưu đãi đang chờ"],
    start: "23/09/2026",
    end: "29/09/2026",
    short: "23–29/9",
    period: "23/9 – 29/9/2026",
    month: "9",
    year: "2026",
    bonusLabel: "Flash Sale",
    bannerLabel: "FLASH SALE",
  }),
});

export const CUSTOMER_LABELS = Object.freeze({
  personal: "Khách hàng cá nhân",
  business: "Khách hàng doanh nghiệp",
});

export const TIERS = Object.freeze({
  personal: [
    { label: "500.000 – < 1 triệu", min: 500_000, max: 1_000_000, regular: 0, flash: 10 },
    { label: "1 – < 2 triệu", min: 1_000_000, max: 2_000_000, regular: 0, flash: 15 },
    { label: "2 – < 5 triệu", min: 2_000_000, max: 5_000_000, regular: 2, flash: 18 },
    { label: "5 – < 10 triệu", min: 5_000_000, max: 10_000_000, regular: 4, flash: 21 },
    { label: "10 – < 20 triệu", min: 10_000_000, max: 20_000_000, regular: 6, flash: 24 },
    { label: "20 – < 50 triệu", min: 20_000_000, max: 50_000_000, regular: 8, flash: 24 },
    { label: "≥ 50 triệu", min: 50_000_000, max: null, regular: 10, flash: 25 },
  ],
  business: [
    { label: "5 – < 10 triệu", min: 5_000_000, max: 10_000_000, regular: 0, flash: 15 },
    { label: "10 – < 20 triệu", min: 10_000_000, max: 20_000_000, regular: 5, flash: 25 },
    { label: "20 – < 50 triệu", min: 20_000_000, max: 50_000_000, regular: 7, flash: 25 },
    { label: "50 – < 100 triệu", min: 50_000_000, max: 100_000_000, regular: 10, flash: 25 },
    { label: "100 – < 300 triệu", min: 100_000_000, max: 300_000_000, regular: 12, flash: 25 },
    { label: "≥ 300 triệu", min: 300_000_000, max: null, regular: 14, flash: 25 },
  ],
});

export const BANKS = Object.freeze([
  { name: "ACB", rates: [2.1, 3.6, 5.1, 6.6] },
  { name: "BIDV", rates: [2.1, 3.5, 4.4, 5.6] },
  { name: "UOB/Citibank", rates: [3, 4, 6, 7] },
  { name: "Eximbank", rates: [1.8, 3.5, 4.6, 6.5] },
  { name: "HD Bank", rates: [2.4, 2.9, 4.5, 4.9], restricted: true },
  { name: "HomeCredit", rates: [3.9, 5, 7, 8], restricted: true },
  { name: "HSBC", rates: [2.5, 4.1, 5.5, 7.2] },
  { name: "KienLong", rates: [1.65, 2.7, 3.75, 5] },
  { name: "LPB", rates: [1.6, 2.7, 3.5, 4.1] },
  { name: "Maritime Bank", rates: [1.6, 2.6, 3.6, 4.6], restricted: true },
  { name: "MBBank", rates: [2.6, 3.6, 5.2, 5.4] },
  { name: "mCredit", rates: [1.92, 2.25, 3.57, null], restricted: true },
  { name: "Nam Á", rates: [null, 1.9, 2.2, 3.1] },
  { name: "OCB", rates: [1.8, 2.1, 2.6, 3.1] },
  { name: "PVComBank", rates: [1.6, 2.4, 3.6, 4.6] },
  { name: "Sacombank", rates: [2.5, 4.4, 6.4, 8.3] },
  { name: "SCB", rates: [2.14, 3.24, 4.2, 5.3] },
  { name: "SeaBank", rates: [1.9, 2.8, 4.6, 5.6] },
  { name: "SHB", rates: [1.8, 2, 3.1, 4.1] },
  { name: "Shinhan Bank", rates: [null, 3.1, 3.6, 4.6] },
  { name: "Standard Chartered", rates: [2.25, 3.35, 4.45, 6.1] },
  { name: "Techcombank", rates: [2.8, 3.76, 5.2, 6.06] },
  { name: "TPBank", rates: [2.25, 3.9, 5.22, 6.65] },
  { name: "VIB", rates: [3.25, 3.9, 5.55, 6.65] },
  { name: "BVBank", rates: [3, 4, 6, 7] },
  { name: "Vietcombank", rates: [3.25, 4.9, 6, 7.65] },
  { name: "VietinBank", rates: [2.1, 3.1, 4.5, 6] },
  { name: "VPBank", rates: [2.79, 2.8, null, 7.2] },
  { name: "Lotte Finance", rates: [1.81, 2.47, 3.57, 4.56] },
  { name: "Shinhan Finance", rates: [1.6, 3.1, 3.6, 4.6] },
  { name: "WooriBank", rates: [1.6, 2.1, 3.1, 3.6] },
  { name: "NCB", rates: [2.5, 4.2, 5.8, 7.5] },
  { name: "VietBank", rates: [2, 2.7, 4.2, 5.6] },
]);

export const INSTALLMENT_TERMS = Object.freeze([3, 6, 9, 12]);

export function parseMoney(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
}

export function formatMoney(value, suffix = "đ") {
  const rounded = Math.round(Number(value) || 0);
  return `${rounded.toLocaleString("vi-VN")}${suffix}`;
}

export function formatInputMoney(value) {
  const number = Number(value) || 0;
  return number ? Math.round(number).toLocaleString("vi-VN") : "";
}

export function findTier(customer, amount) {
  const safeCustomer = TIERS[customer] ? customer : "personal";
  const safeAmount = Number(amount) || 0;
  return (
    TIERS[safeCustomer].find(
      (tier) => safeAmount >= tier.min && (tier.max === null || safeAmount < tier.max),
    ) ?? null
  );
}

export function calculatePromotion(customer, amount, includeFlash = true) {
  const safeAmount = Math.max(0, Number(amount) || 0);
  const tier = findTier(customer, safeAmount);
  const regularRate = tier?.regular ?? 0;
  const flashRate = includeFlash ? (tier?.flash ?? 0) : 0;
  const totalRate = regularRate + flashRate;
  const beforeVat = safeAmount / (1 + VAT_RATE);
  const regularMoney = Math.round((beforeVat * regularRate) / 100);
  const flashMoney = Math.round((beforeVat * flashRate) / 100);
  const totalPromo = Math.round((beforeVat * totalRate) / 100);

  return {
    amount: safeAmount,
    tier,
    beforeVat,
    regularRate,
    flashRate,
    totalRate,
    regularMoney,
    flashMoney,
    totalPromo,
  };
}

export function calculateInstallment(amount, feeRate, months, promoMoney) {
  if (feeRate === null || feeRate === undefined) return null;
  const safeAmount = Math.max(0, Number(amount) || 0);
  const fee = Math.round((safeAmount * feeRate) / 100);
  const monthly = Math.round((safeAmount + fee) / months);
  const netBenefit = Math.round((Number(promoMoney) || 0) - fee);
  return { fee, monthly, netBenefit };
}
