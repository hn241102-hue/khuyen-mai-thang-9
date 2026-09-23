import {
  BANKS,
  CAMPAIGN,
  CUSTOMER_LABELS,
  INSTALLMENT_TERMS,
  MAX_ROWS,
  TIERS,
  calculateInstallment,
  calculatePromotion,
  formatInputMoney,
  formatMoney,
  parseMoney,
} from "./pricing.js";

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `row-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const state = {
  customer: "personal",
  includeFlash: true,
  bankIndex: 0,
  rows: [
    { id: createId(), amount: 5_000_000, packageName: "Gói Khởi động", packageDetail: "Phương án 5 triệu" },
    { id: createId(), amount: 20_000_000, packageName: "Gói Bứt phá", packageDetail: "Phương án 20 triệu" },
    { id: createId(), amount: 50_000_000, packageName: "Gói Dẫn đầu", packageDetail: "Phương án 50 triệu" },
  ],
};

const els = {
  customerSwitcher: document.querySelector("#customerSwitcher"),
  bankSelect: document.querySelector("#bankSelect"),
  flashToggle: document.querySelector("#flashToggle"),
  advisorPhone: document.querySelector("#advisorPhone"),
  advisorName: document.querySelector("#advisorName"),
  boardContact: document.querySelector("#boardContact"),
  lookupRows: document.querySelector("#lookupRows"),
  offerRows: document.querySelector("#offerRows"),
  lookupCounter: document.querySelector("#lookupCounter"),
  offerCounter: document.querySelector("#offerCounter"),
  addLookupRow: document.querySelector("#addLookupRow"),
  addOfferRow: document.querySelector("#addOfferRow"),
  policyGrid: document.querySelector("#policyGrid"),
  maxOfferValue: document.querySelector("#maxOfferValue"),
  installmentAmount: document.querySelector("#installmentAmount"),
  installmentRate: document.querySelector("#installmentRate"),
  installmentPromo: document.querySelector("#installmentPromo"),
  installmentRows: document.querySelector("#installmentRows"),
  bankRateHeading: document.querySelector("#bankRateHeading"),
  bankNotice: document.querySelector("#bankNotice"),
  downloadPng: document.querySelector("#downloadPng"),
  toast: document.querySelector("#toast"),
};

let toastTimer;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => els.toast.classList.remove("is-visible"), 2600);
}

function renderBankOptions() {
  els.bankSelect.innerHTML = BANKS.map(
    (bank, index) =>
      `<option value="${index}">${escapeHtml(bank.name)}${bank.restricted ? " (*) — hạn chế tư vấn" : ""}</option>`,
  ).join("");
  els.bankSelect.value = String(state.bankIndex);
}

function renderCustomerState() {
  document.querySelectorAll("[data-customer]").forEach((button) => {
    const active = button.dataset.customer === state.customer;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  document.querySelectorAll("[data-customer-label]").forEach((element) => {
    element.textContent = CUSTOMER_LABELS[state.customer];
  });

  const maxTier = TIERS[state.customer].at(-1);
  els.maxOfferValue.textContent = `${maxTier.regular + (state.includeFlash ? maxTier.flash : 0)}%`;
}

function createLookupRow(row, index) {
  const calculation = calculatePromotion(state.customer, row.amount, state.includeFlash);
  return `
    <tr data-row-id="${row.id}">
      <td>
        <div class="amount-control">
          <label class="money-input">
            <span class="sr-only">Số tiền phương án ${index + 1}</span>
            <input class="lookup-amount" inputmode="numeric" value="${formatInputMoney(row.amount)}" data-action="amount" />
            <span>đ</span>
          </label>
          <button class="remove-row" type="button" data-action="remove" aria-label="Xóa dòng ${index + 1}">×</button>
        </div>
      </td>
      <td><span class="rate-badge">${calculation.regularRate}%</span></td>
      <td><span class="rate-badge flash">${calculation.flashRate ? `+${calculation.flashRate}%` : "0%"}</span></td>
      <td><span class="rate-badge total">${calculation.totalRate}%</span></td>
      <td><span class="promo-money">+${formatMoney(calculation.totalPromo)}<small>trên giá chưa VAT</small></span></td>
    </tr>
  `;
}

function createOfferRow(row, index) {
  const calculation = calculatePromotion(state.customer, row.amount, state.includeFlash);
  return `
    <tr data-row-id="${row.id}">
      <td>
        <div class="amount-control">
          <div style="min-width:0;flex:1">
            <input class="offer-amount" inputmode="numeric" value="${formatInputMoney(row.amount)}" data-action="amount" aria-label="Giá trị hợp đồng ${index + 1}" />
            <div class="package-fields">
              <input value="${escapeHtml(row.packageName)}" data-action="package-name" aria-label="Tên gói ${index + 1}" />
              <input value="${escapeHtml(row.packageDetail)}" data-action="package-detail" aria-label="Chi tiết gói ${index + 1}" />
            </div>
          </div>
          <button class="remove-row" type="button" data-action="remove" aria-label="Xóa dòng ${index + 1}">×</button>
        </div>
      </td>
      <td class="regular-value">${formatMoney(calculation.regularMoney)}</td>
      <td class="flash-value">${formatMoney(calculation.flashMoney)}</td>
      <td class="total-value">${formatMoney(calculation.totalPromo)}</td>
    </tr>
  `;
}

function renderRows() {
  els.lookupRows.innerHTML = state.rows.map(createLookupRow).join("");
  els.offerRows.innerHTML = state.rows.map(createOfferRow).join("");
  const label = `${state.rows.length}/${MAX_ROWS} dòng`;
  els.lookupCounter.textContent = label;
  els.offerCounter.textContent = label;
  const atLimit = state.rows.length >= MAX_ROWS;
  els.addLookupRow.disabled = atLimit;
  els.addOfferRow.disabled = atLimit;
}

function renderPolicyTables() {
  els.policyGrid.innerHTML = Object.entries(TIERS)
    .map(([customer, tiers]) => {
      const rows = tiers
        .map((tier) => {
          const flash = state.includeFlash ? tier.flash : 0;
          return `
            <tr>
              <td>${escapeHtml(tier.label)}</td>
              <td>${tier.regular}%</td>
              <td>${flash}%</td>
              <td>${tier.regular + flash}%</td>
            </tr>`;
        })
        .join("");

      return `
        <article class="policy-card ${customer === state.customer ? "is-current" : ""}">
          <h4>${CUSTOMER_LABELS[customer]}</h4>
          <div class="table-scroll">
            <table class="policy-table">
              <thead><tr><th>Mức nạp (gồm VAT)</th><th>Thường</th><th>Flash</th><th>Tổng</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </article>`;
    })
    .join("");
}

function renderContact() {
  const parts = [els.advisorName.value.trim(), els.advisorPhone.value.trim()].filter(Boolean);
  els.boardContact.textContent = parts.length ? parts.join(" · ") : "";
}

function renderInstallments() {
  const amount = parseMoney(els.installmentAmount.value);
  const promotion = calculatePromotion(state.customer, amount, state.includeFlash);
  const bank = BANKS[state.bankIndex];

  els.installmentRate.textContent = `${promotion.totalRate}%`;
  els.installmentPromo.textContent = formatMoney(promotion.totalPromo);
  els.bankRateHeading.textContent = `Phí ${bank.name}`;
  els.bankNotice.textContent = bank.restricted
    ? `(*) ${bank.name} thuộc nhóm hạn chế tư vấn. Vui lòng kiểm tra lại chính sách ngân hàng trước khi chốt với khách.`
    : "Phí trả góp được tính trên số tiền gồm VAT. Các mức phí nằm trong cấu hình và có thể cập nhật tại pricing.js.";

  els.installmentRows.innerHTML = INSTALLMENT_TERMS.map((months, index) => {
    const rate = bank.rates[index];
    const result = calculateInstallment(amount, rate, months, promotion.totalPromo);
    if (!result) {
      return `<tr><td>${months} tháng</td><td>—</td><td>—</td><td>${formatMoney(promotion.totalPromo)}</td><td>—</td><td>—</td></tr>`;
    }
    const netClass = result.netBenefit >= 0 ? "net-positive" : "net-negative";
    const netPrefix = result.netBenefit >= 0 ? "+" : "−";
    return `
      <tr>
        <td><strong>${months} tháng</strong></td>
        <td>${Number.isInteger(rate) ? rate : rate.toFixed(2)}%</td>
        <td>${formatMoney(result.fee)}</td>
        <td>${formatMoney(promotion.totalPromo)}</td>
        <td class="${netClass}">${netPrefix}${formatMoney(Math.abs(result.netBenefit))}</td>
        <td>~${formatMoney(result.monthly)}</td>
      </tr>`;
  }).join("");
}

function renderAll() {
  renderCustomerState();
  renderRows();
  renderPolicyTables();
  renderContact();
  renderInstallments();
}

function addRow() {
  if (state.rows.length >= MAX_ROWS) {
    showToast(`Bạn đã đạt tối đa ${MAX_ROWS} phương án.`);
    return;
  }
  state.rows.push({
    id: createId(),
    amount: 0,
    packageName: `Phương án ${state.rows.length + 1}`,
    packageDetail: "",
  });
  renderRows();
  requestAnimationFrame(() => {
    const input = els.lookupRows.querySelector(`tr:last-child [data-action="amount"]`);
    input?.focus();
  });
}

function removeRow(id) {
  if (state.rows.length === 1) {
    showToast("Cần giữ lại ít nhất 1 phương án.");
    return;
  }
  state.rows = state.rows.filter((row) => row.id !== id);
  renderRows();
}

function updateRow(id, action, value) {
  const row = state.rows.find((item) => item.id === id);
  if (!row) return;
  if (action === "amount") row.amount = parseMoney(value);
  if (action === "package-name") row.packageName = value;
  if (action === "package-detail") row.packageDetail = value;
}

function handleRowsInput(event) {
  const action = event.target.dataset.action;
  if (!action || action === "remove") return;
  const tr = event.target.closest("tr[data-row-id]");
  if (!tr) return;
  const rowId = tr.dataset.rowId;
  const sourceBodyId = event.currentTarget.id;
  updateRow(tr.dataset.rowId, action, event.target.value);
  if (action === "amount") {
    renderRows();
    const refreshedInput = document.querySelector(
      `#${sourceBodyId} tr[data-row-id="${rowId}"] [data-action="amount"]`,
    );
    if (refreshedInput) {
      refreshedInput.focus();
      const cursor = refreshedInput.value.length;
      refreshedInput.setSelectionRange(cursor, cursor);
    }
  } else {
    const matchingInput = document.querySelector(
      `${event.currentTarget.id === "offerRows" ? "#offerRows" : "#lookupRows"} tr[data-row-id="${tr.dataset.rowId}"] [data-action="${action}"]`,
    );
    if (matchingInput && matchingInput !== event.target) matchingInput.value = event.target.value;
  }
}

function handleRowsChange(event) {
  if (event.target.dataset.action !== "amount") return;
  const tr = event.target.closest("tr[data-row-id]");
  const row = state.rows.find((item) => item.id === tr?.dataset.rowId);
  if (row) event.target.value = formatInputMoney(row.amount);
}

function handleRowsClick(event) {
  const button = event.target.closest("[data-action='remove']");
  if (!button) return;
  const row = button.closest("tr[data-row-id]");
  if (row) removeRow(row.dataset.rowId);
}

function drawRoundRect(ctx, x, y, width, height, radius, fill, stroke = null) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, safeRadius);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

function fitText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let result = text;
  while (result.length > 2 && ctx.measureText(`${result}…`).width > maxWidth) result = result.slice(0, -1);
  return `${result}…`;
}

function createPromotionCanvas() {
  const width = 1600;
  const rowHeight = 122;
  const height = 540 + state.rows.length * rowHeight;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const left = 100;
  const contentWidth = width - left * 2;
  const red = "#c20000";
  const deepRed = "#8e0710";
  const ink = "#172237";
  const green = "#007a50";
  const muted = "#748096";
  const cream = "#fff8ea";

  ctx.fillStyle = "#f7f8fa";
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(left, 60, width - left, 450);
  gradient.addColorStop(0, "#d91f28");
  gradient.addColorStop(0.58, red);
  gradient.addColorStop(1, deepRed);
  drawRoundRect(ctx, left, 60, contentWidth, height - 120, 38, gradient);

  const glow = ctx.createRadialGradient(1290, 200, 0, 1290, 200, 330);
  glow.addColorStop(0, "rgba(255,214,126,.46)");
  glow.addColorStop(1, "rgba(255,214,126,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(920, 60, 580, 500);

  ctx.fillStyle = "rgba(255,255,255,.95)";
  ctx.font = "700 24px Poppins, Arial";
  ctx.fillText("ƯU ĐÃI THÁNG 9", left + 46, 122);

  ctx.fillStyle = "#ffe1a1";
  ctx.font = "600 25px Poppins, Arial";
  ctx.fillText("FLASH SALE · 23–29/9/2026", left + 46, 185);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 66px Poppins, Arial";
  ctx.fillText("Nạp nhanh kẻo lỡ", left + 46, 268);
  ctx.fillText("Ưu đãi đang chờ", left + 46, 344);

  const maxTier = TIERS[state.customer].at(-1);
  const maxRate = maxTier.regular + (state.includeFlash ? maxTier.flash : 0);
  ctx.textAlign = "right";
  ctx.fillStyle = "#ffe1a1";
  ctx.font = "600 24px Poppins, Arial";
  ctx.fillText("ƯU ĐÃI ĐẾN", width - left - 48, 192);
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 110px Poppins, Arial";
  ctx.fillText(`${maxRate}%`, width - left - 48, 305);
  ctx.textAlign = "left";

  ctx.fillStyle = cream;
  ctx.font = "700 23px Poppins, Arial";
  ctx.fillText(CUSTOMER_LABELS[state.customer], left + 46, 405);
  const contact = [els.advisorName.value.trim(), els.advisorPhone.value.trim()].filter(Boolean).join(" · ");
  if (contact) {
    ctx.textAlign = "right";
    ctx.fillText(fitText(ctx, contact, 560), width - left - 46, 405);
    ctx.textAlign = "left";
  }

  const tableX = left + 38;
  const tableY = 438;
  const tableWidth = contentWidth - 76;
  const headerHeight = 72;
  const columns = [0.34, 0.2, 0.22, 0.24];
  drawRoundRect(ctx, tableX, tableY, tableWidth, headerHeight + state.rows.length * rowHeight, 22, "#ffffff");

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(tableX, tableY, tableWidth, headerHeight + state.rows.length * rowHeight, 22);
  ctx.clip();
  ctx.fillStyle = "#a7141a";
  ctx.fillRect(tableX, tableY, tableWidth, headerHeight);

  const headers = ["GIÁ TRỊ HĐ (GỒM VAT)", "ƯU ĐÃI THƯỜNG", "FLASH SALE 23–29/9", "TỔNG TIỀN KM"];
  let x = tableX;
  headers.forEach((header, index) => {
    const colWidth = tableWidth * columns[index];
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 18px Poppins, Arial";
    ctx.fillText(header, x + 22, tableY + 43);
    if (index > 0) {
      ctx.strokeStyle = "rgba(255,255,255,.18)";
      ctx.beginPath();
      ctx.moveTo(x, tableY);
      ctx.lineTo(x, tableY + headerHeight + state.rows.length * rowHeight);
      ctx.stroke();
    }
    x += colWidth;
  });

  state.rows.forEach((row, rowIndex) => {
    const y = tableY + headerHeight + rowIndex * rowHeight;
    const calc = calculatePromotion(state.customer, row.amount, state.includeFlash);
    ctx.fillStyle = rowIndex % 2 ? "#f7f8fa" : "#ffffff";
    ctx.fillRect(tableX, y, tableWidth, rowHeight);
    ctx.strokeStyle = "#e7eaf0";
    ctx.beginPath();
    ctx.moveTo(tableX, y);
    ctx.lineTo(tableX + tableWidth, y);
    ctx.stroke();

    ctx.fillStyle = ink;
    ctx.font = "800 27px Poppins, Arial";
    ctx.fillText(formatInputMoney(row.amount), tableX + 22, y + 45);
    ctx.fillStyle = muted;
    ctx.font = "600 14px Poppins, Arial";
    const packageLine = [row.packageName, row.packageDetail].filter(Boolean).join(" · ");
    ctx.fillText(fitText(ctx, packageLine, tableWidth * columns[0] - 44), tableX + 22, y + 79);

    const values = [
      { text: formatMoney(calc.regularMoney), color: ink },
      { text: formatMoney(calc.flashMoney), color: "#e3262f" },
      { text: formatMoney(calc.totalPromo), color: green },
    ];
    let valueX = tableX + tableWidth * columns[0];
    values.forEach((value, valueIndex) => {
      const colWidth = tableWidth * columns[valueIndex + 1];
      ctx.textAlign = "center";
      ctx.fillStyle = value.color;
      ctx.font = "800 27px Poppins, Arial";
      ctx.fillText(value.text, valueX + colWidth / 2, y + 62);
      ctx.textAlign = "left";
      valueX += colWidth;
    });
  });
  ctx.restore();

  return canvas;
}

async function downloadPromotionPng() {
  await document.fonts?.ready;
  const canvas = createPromotionCanvas();
  const link = document.createElement("a");
  const customerName = state.customer === "personal" ? "ca-nhan" : "doanh-nghiep";
  link.download = `bang-uu-dai-${customerName}-23-29-9-2026.png`;
  link.href = canvas.toDataURL("image/png", 1);
  link.click();
  showToast("Đã tạo ảnh PNG theo các phương án đang hiển thị.");
}

els.customerSwitcher.addEventListener("click", (event) => {
  const button = event.target.closest("[data-customer]");
  if (!button) return;
  state.customer = button.dataset.customer;
  renderAll();
});

els.bankSelect.addEventListener("change", () => {
  state.bankIndex = Number(els.bankSelect.value);
  renderInstallments();
});

els.flashToggle.addEventListener("change", () => {
  state.includeFlash = els.flashToggle.checked;
  renderAll();
});

[els.advisorName, els.advisorPhone].forEach((input) => input.addEventListener("input", renderContact));

[els.addLookupRow, els.addOfferRow].forEach((button) => button.addEventListener("click", addRow));

[els.lookupRows, els.offerRows].forEach((body) => {
  body.addEventListener("input", handleRowsInput);
  body.addEventListener("change", handleRowsChange);
  body.addEventListener("click", handleRowsClick);
});

els.installmentAmount.addEventListener("input", renderInstallments);
els.installmentAmount.addEventListener("change", () => {
  els.installmentAmount.value = formatInputMoney(parseMoney(els.installmentAmount.value));
});

els.downloadPng.addEventListener("click", downloadPromotionPng);

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav-pill").forEach((pill) => pill.classList.remove("is-active"));
    button.classList.add("is-active");
    document.querySelector(`#${button.dataset.scroll}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

renderBankOptions();
renderAll();
