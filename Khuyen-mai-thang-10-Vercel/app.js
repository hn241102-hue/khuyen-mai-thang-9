import {
  BANKS,
  CAMPAIGNS,
  CUSTOMER_LABELS,
  INSTALLMENT_TERMS,
  MAX_ROWS,
  TIERS,
  calculateInstallment,
  calculatePromotion,
  formatInputMoney,
  formatMoney,
  parseMoney,
} from "./pricing.js?v=20261003";

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
  const campaign = CAMPAIGNS[state.customer];
  document.querySelectorAll("[data-customer]").forEach((button) => {
    const active = button.dataset.customer === state.customer;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  document.querySelectorAll("[data-customer-label]").forEach((element) => {
    element.textContent = CUSTOMER_LABELS[state.customer];
  });

  document.title = campaign.name;
  document.querySelector('#pageHeading').textContent = `Tư vấn ưu đãi tháng ${campaign.month}`;
  document.querySelector('#campaignPeriod').textContent = `${campaign.start} – ${campaign.end}`;
  document.querySelector('#campaignName').textContent = campaign.name;
  document.querySelectorAll('[data-bonus-label]').forEach(element => { element.textContent = campaign.bonusLabel; });
  document.querySelector('#toggleCampaignLabel').textContent = `${campaign.bonusLabel} ${campaign.short}`;
  document.querySelector('#lookupBonusHeading').textContent = `${campaign.bonusLabel} ${campaign.short}`;
  document.querySelector('.campaign-season').textContent = `ƯU ĐÃI THÁNG ${campaign.month} / ${campaign.year}`;
  document.querySelector('#boardHeadlineMain').textContent = campaign.headline[0];
  document.querySelector('#boardHeadlineBenefit').textContent = campaign.headline[1];
  document.querySelector('#boardHeadlineBenefit').style.fontSize = state.customer === 'personal' ? '34px' : '';
  document.querySelector('#boardDateText').textContent = campaign.period;
  document.querySelector('#boardBonusPeriod').textContent = `${campaign.short} · HSD 90 ngày`;
  document.querySelector('.column-resizer[data-column="2"]').setAttribute('aria-label', `Độ rộng cột ${campaign.bonusLabel}`);
  document.querySelector('#footerCampaign').textContent = `Công cụ khuyến mãi · Tháng ${campaign.month}/${campaign.year}`;
  document.querySelector("#boardCampaignTitle").innerHTML = state.includeFlash ? `${escapeHtml(campaign.bannerLabel)}<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 10-13h-7z"/></svg>` : 'ƯU ĐÃI THƯỜNG';
  document.querySelector("#boardCampaignDate").style.visibility = state.includeFlash ? "visible" : "hidden";
  document.querySelector(".max-offer small").textContent = state.includeFlash ? `Ưu đãi thường + ${campaign.bonusLabel}` : "Chỉ tính ưu đãi thường";
  const status = state.includeFlash ? `Đang tính ưu đãi thường + ${campaign.bonusLabel}.` : `Đã tắt ${campaign.bonusLabel}. Chỉ tính ưu đãi thường.`;
  document.querySelector("#campaignStatus").textContent = state.customer === 'business' ? `Bảng doanh nghiệp cũ ${campaign.period}. ${status}` : status;
  document.querySelector("#campaignAlert").classList.toggle("is-disabled", !state.includeFlash);
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
      <td class="regular-value"><span class="board-rate regular">${calculation.regularRate}%</span><span class="board-money">${formatMoney(calculation.regularMoney)}</span></td>
      <td class="flash-value"><span class="board-rate flash">+${calculation.flashRate}%</span><span class="board-money">${formatMoney(calculation.flashMoney)}</span></td>
      <td class="total-rate-value"><span class="board-rate total">${calculation.totalRate}%</span></td>
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
      const campaign = CAMPAIGNS[customer];
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
          <h4>${CUSTOMER_LABELS[customer]} · ${campaign.short}/${campaign.year}${customer === 'business' ? ' (bảng cũ)' : ''}</h4>
          <div class="table-scroll">
            <table class="policy-table">
              <thead><tr><th>Mức nạp (gồm VAT)</th><th>Thường</th><th>${campaign.bonusLabel}</th><th>Tổng</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </article>`;
    })
    .join("");
}

function renderContact() {
  const parts = [els.advisorName.value.trim(), els.advisorPhone.value.trim()].filter(Boolean);
  els.boardContact.textContent = parts.length ? parts.join(" · ") : "Chọn phương án phù hợp với bạn";
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
    : "Phí trả góp được tính trên số tiền gồm VAT. Kiểm tra mức phí áp dụng với ngân hàng trước khi chốt phương án.";

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

function addRow(event) {
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
    const body = event?.currentTarget === els.addOfferRow ? els.offerRows : els.lookupRows;
    const input = body.querySelector(`tr:last-child [data-action="amount"]`);
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

const defaultColumns = [28, 19, 19, 15, 19];
const boardLayout = { width: 1120, rowHeight: 124, columns: [...defaultColumns] };
const board = document.querySelector('#promoBoard');
const widthControl = document.querySelector('#boardWidth');
const rowControl = document.querySelector('#boardRowHeight');
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function applyBoardLayout() {
  board.style.width = `${boardLayout.width}px`;
  board.style.setProperty('--board-row-height', `${boardLayout.rowHeight}px`);
  widthControl.value = String(boardLayout.width);
  rowControl.value = String(boardLayout.rowHeight);
  document.querySelector('#boardWidthValue').value = `${boardLayout.width.toLocaleString('vi-VN')} px`;
  document.querySelector('#boardRowHeightValue').value = `${boardLayout.rowHeight} px`;
  document.querySelectorAll('#offerColumns col').forEach((col, index) => { col.style.width = `${boardLayout.columns[index]}%`; });
  document.querySelectorAll('.column-resizer').forEach((handle, index) => {
    const min = columnMinimum(index);
    const max = boardLayout.columns[index] + boardLayout.columns[index + 1] - columnMinimum(index + 1);
    handle.setAttribute('aria-valuenow', String(Math.round(boardLayout.columns[index])));
    handle.setAttribute('aria-valuemin', String(Math.ceil(min)));
    handle.setAttribute('aria-valuemax', String(Math.floor(max)));
    handle.setAttribute('aria-valuetext', `${Math.round(boardLayout.columns[index])}% chiều rộng bảng`);
  });
}
function columnMinimum(index) { return [23, 15, 15, 13, 18][index]; }
function resizeColumn(index, desired, original = boardLayout.columns) {
  const total = original[index] + original[index + 1];
  boardLayout.columns[index] = clamp(desired, columnMinimum(index), total - columnMinimum(index + 1));
  boardLayout.columns[index + 1] = total - boardLayout.columns[index];
  applyBoardLayout();
}
widthControl.addEventListener('input', () => { boardLayout.width = Number(widthControl.value); applyBoardLayout(); });
rowControl.addEventListener('input', () => { boardLayout.rowHeight = Number(rowControl.value); applyBoardLayout(); });
document.querySelector('#resetBoardSize').addEventListener('click', () => {
  Object.assign(boardLayout, { width: 1120, rowHeight: 124, columns: [...defaultColumns] });
  applyBoardLayout();
  showToast('Đã đặt lại kích thước và độ rộng các cột.');
});

function bindDrag(handle, onStart, onMove) {
  let drag = null;
  handle.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    drag = { x: event.clientX, y: event.clientY, ...onStart() };
    handle.setPointerCapture(event.pointerId);
    document.body.classList.add('is-resizing');
    handle.focus({ preventScroll: true });
  });
  handle.addEventListener('pointermove', (event) => { if (drag) onMove(event, drag); });
  const finish = () => { drag = null; document.body.classList.remove('is-resizing'); };
  handle.addEventListener('pointerup', finish);
  handle.addEventListener('pointercancel', finish);
  handle.addEventListener('lostpointercapture', finish);
}
document.querySelectorAll('.column-resizer').forEach((handle) => {
  const index = Number(handle.dataset.column);
  bindDrag(handle, () => ({ columns: [...boardLayout.columns], tableWidth: document.querySelector('.board-table').getBoundingClientRect().width }), (event, drag) => {
    resizeColumn(index, drag.columns[index] + (event.clientX - drag.x) / drag.tableWidth * 100, drag.columns);
  });
  handle.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    resizeColumn(index, boardLayout.columns[index] + (event.key === 'ArrowRight' ? 1 : -1) * (event.shiftKey ? 3 : 1));
  });
});
const boardHandle = document.querySelector('#boardResizeHandle');
bindDrag(boardHandle, () => ({ width: boardLayout.width, rowHeight: boardLayout.rowHeight, count: state.rows.length }), (event, drag) => {
  boardLayout.width = clamp(Math.round((drag.width + event.clientX - drag.x) / 10) * 10, 980, 1600);
  boardLayout.rowHeight = clamp(Math.round((drag.rowHeight + (event.clientY - drag.y) / drag.count) / 2) * 2, 110, 180);
  applyBoardLayout();
});
boardHandle.addEventListener('keydown', (event) => {
  if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return;
  event.preventDefault();
  if (event.key === 'ArrowLeft') boardLayout.width = clamp(boardLayout.width - 10, 980, 1600);
  if (event.key === 'ArrowRight') boardLayout.width = clamp(boardLayout.width + 10, 980, 1600);
  if (event.key === 'ArrowUp') boardLayout.rowHeight = clamp(boardLayout.rowHeight - 2, 110, 180);
  if (event.key === 'ArrowDown') boardLayout.rowHeight = clamp(boardLayout.rowHeight + 2, 110, 180);
  applyBoardLayout();
});
applyBoardLayout();

const campaignImage = document.querySelector('#campaignAsset');
document.querySelectorAll('.campaign-logo,.campaign-art').forEach(element => {
  element.style.backgroundImage = `url("${campaignImage.src}")`;
});

function drawCanvasIcon(ctx,type,x,y,size,color) {
  ctx.save();ctx.translate(x,y);ctx.scale(size/24,size/24);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=2.5;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
  if(type==='bolt'){ctx.moveTo(13,2);ctx.lineTo(4,14);ctx.lineTo(11,14);ctx.lineTo(10,22);ctx.lineTo(20,9);ctx.lineTo(13,9);ctx.closePath();ctx.fill();}
  else{ctx.moveTo(5,12);ctx.lineTo(9,16);ctx.lineTo(19,6);ctx.stroke();}
  ctx.restore();
}
function canvasText(ctx, text, x, y, size, weight, color, maxWidth, align = 'left') {
  ctx.textAlign = align;
  ctx.fillStyle = color;
  let actualSize = size;
  ctx.font = `${weight} ${actualSize}px Manrope, Arial`;
  while (maxWidth && ctx.measureText(text).width > maxWidth && actualSize > 11) {
    actualSize -= .5;
    ctx.font = `${weight} ${actualSize}px Manrope, Arial`;
  }
  ctx.fillText(maxWidth ? fitText(ctx, text, maxWidth) : text, x, y);
  ctx.textAlign = 'left';
}
function canvasPill(ctx, text, cx, y, width, height, fill, color, size = 20) {
  drawRoundRect(ctx, cx - width / 2, y, width, height, 9, fill);
  canvasText(ctx, text, cx, y + height / 2 + size * .35, size, 800, color, width - 12, 'center');
}
function createPromotionCanvas() {
  const campaign = CAMPAIGNS[state.customer];
  const width = boardLayout.width;
  const tableY = 410, headerHeight = 72, rowHeight = boardLayout.rowHeight;
  const tableX = 24, tableWidth = width - 48;
  const tableBottom = tableY + headerHeight + state.rows.length * rowHeight;
  const height = tableBottom + 130;
  const canvas = document.createElement('canvas');
  canvas.width = width * 2; canvas.height = height * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2,2);
  const background = ctx.createLinearGradient(0,0,width,height);
  background.addColorStop(0,'#ffffff'); background.addColorStop(.5,'#fffafa'); background.addColorStop(1,'#fff0f3');
  drawRoundRect(ctx,0,0,width,height,24,background);
  ctx.save(); ctx.beginPath(); ctx.roundRect(0,0,width,height,24); ctx.clip();
  if (campaignImage.complete && campaignImage.naturalWidth) {
    ctx.drawImage(campaignImage,54,16,230,59,32,24,230,59);
    ctx.save(); ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(campaignImage,820,0,430,420,width-398,60,390,381);
    ctx.restore();
    const fadeLeft=ctx.createLinearGradient(width-398,0,width-330,0);fadeLeft.addColorStop(0,'#fffafa');fadeLeft.addColorStop(1,'#fffafa00');ctx.fillStyle=fadeLeft;ctx.fillRect(width-398,60,68,381);
    const fadeTop=ctx.createLinearGradient(0,60,0,95);fadeTop.addColorStop(0,'#fffafa');fadeTop.addColorStop(1,'#fffafa00');ctx.fillStyle=fadeTop;ctx.fillRect(width-398,60,390,35);
  }
  canvasText(ctx,`ƯU ĐÃI THÁNG ${campaign.month} / ${campaign.year}`,width-32,57,12,800,'#c70529',260,'right');
  const customer = CUSTOMER_LABELS[state.customer];
  ctx.font = '700 14px Manrope, Arial';
  const customerWidth = ctx.measureText(customer).width + 28;
  drawRoundRect(ctx,32,108,customerWidth,31,16,'#fff0f2','#f7dbe1');
  canvasText(ctx,customer,46,129,14,700,'#cf0725');
  canvasText(ctx,state.includeFlash ? campaign.bannerLabel : 'ƯU ĐÃI THƯỜNG',32,207,state.includeFlash ? 62 : 44,800,'#e40024',width*.54-48);
  if (state.includeFlash) {
    ctx.font='800 62px Manrope, Arial';
    const boltX=32+ctx.measureText(campaign.bannerLabel).width+12;
    drawCanvasIcon(ctx,'bolt',boltX,153,38,'#e40024');
  }
  canvasText(ctx,campaign.headline[0],32,261,44,800,'#111b35',width*.53-42);
  canvasText(ctx,campaign.headline[1],32,314,state.customer === 'personal' ? 34 : 44,800,'#111b35',width*.53-42);
  if (state.includeFlash) {
    drawRoundRect(ctx,32,337,216,34,8,'#fff0f3','#f4bac6');
    canvasText(ctx,campaign.period,140,360,16,700,'#d60a30',200,'center');
  }
  const maxTier = TIERS[state.customer].at(-1);
  const maxRate = maxTier.regular + (state.includeFlash ? maxTier.flash : 0);
  const offerX = width*.7-196, offerY=222;
  ctx.save(); ctx.translate(offerX+98,offerY+68); ctx.rotate(-5*Math.PI/180);
  drawRoundRect(ctx,-98,-68,196,136,15,'#fffffff5','#f4cbd3');
  canvasText(ctx,'TỔNG ƯU ĐÃI ĐẾN',0,-39,13,800,'#1d2842',174,'center');
  canvasText(ctx,`${maxRate}%`,0,27,68,800,'#df0629',174,'center');
  canvasText(ctx,state.includeFlash ? `Ưu đãi thường + ${campaign.bonusLabel}` : 'Chỉ tính ưu đãi thường',0,49,10,600,'#67718a',176,'center');
  ctx.restore();
  const columns = boardLayout.columns.map(v => v/100);
  ctx.save(); ctx.beginPath(); ctx.roundRect(tableX,tableY,tableWidth,headerHeight + state.rows.length*rowHeight,15); ctx.clip();
  const tableGradient = ctx.createLinearGradient(tableX,tableY,width,tableY+80);
  tableGradient.addColorStop(0,'#ed1535');tableGradient.addColorStop(1,'#a9001c');
  ctx.fillStyle=tableGradient; ctx.fillRect(tableX,tableY,tableWidth,headerHeight);
  const headers = [['Giá trị HĐ','(gồm VAT)'],['Ưu đãi thường','HSD 180 ngày'],[campaign.bonusLabel,`${campaign.short} · HSD 90 ngày`],['Tổng %','khuyến mãi'],['Tổng tiền KM','Trên giá chưa VAT']];
  let x = tableX;
  headers.forEach(([title,subtitle],i) => {
    const cw=tableWidth*columns[i], cx=x+cw/2;
    canvasText(ctx,title,i?cx:x+20,tableY+30,14,700,'#fff',cw-24,i?'center':'left');
    canvasText(ctx,subtitle,i?cx:x+20,tableY+50,12,500,'#ffe4ea',cw-24,i?'center':'left');
    if(i){ctx.fillStyle='#ffffff25';ctx.fillRect(x,tableY,1,headerHeight);}
    x+=cw;
  });
  state.rows.forEach((row,ri) => {
    const y=tableY+headerHeight+ri*rowHeight, calc=calculatePromotion(state.customer,row.amount,state.includeFlash);
    ctx.fillStyle=ri%2?'#fff7f8':'#ffffff';ctx.fillRect(tableX,y,tableWidth,rowHeight);
    ctx.fillStyle='#f4dfe4';ctx.fillRect(tableX,y,tableWidth,1);
    const col0=tableWidth*columns[0], mid=y+rowHeight/2;
    canvasText(ctx,`${formatInputMoney(row.amount)||'0'}đ`,tableX+18,mid-16,21,800,'#111b3c',col0-34);
    canvasText(ctx,row.packageName,tableX+18,mid+9,12,600,'#4f5d76',col0-34);
    canvasText(ctx,row.packageDetail,tableX+18,mid+29,12,400,'#67738a',col0-34);
    let vx=tableX+col0;
    for(let i=1;i<5;i++){
      const cw=tableWidth*columns[i],cx=vx+cw/2;
      ctx.fillStyle='#f8e9ed';ctx.fillRect(vx,y,1,rowHeight);
      if(i===1||i===2){
        const regular=i===1;
        canvasPill(ctx,`${regular?'':'+'}${regular?calc.regularRate:calc.flashRate}%`,cx,mid-33,70,34,regular?'#eef0f6':'#ffe9ee',regular?'#263352':'#df0629',19);
        canvasText(ctx,formatMoney(regular?calc.regularMoney:calc.flashMoney),cx,mid+27,14,600,regular?'#263352':'#c9082d',cw-20,'center');
      }else if(i===3){canvasPill(ctx,`${calc.totalRate}%`,cx,mid-22,82,44,'#d8062b','#fff',23);}
      else {canvasText(ctx,formatMoney(calc.totalPromo),cx,mid+7,20,800,'#067749',cw-20,'center');}
      vx+=cw;
    }
  });
  ctx.restore();
  ctx.strokeStyle='#f1cad2'; ctx.lineWidth=1; ctx.beginPath();ctx.roundRect(tableX,tableY,tableWidth,headerHeight+state.rows.length*rowHeight,15);ctx.stroke();
  const footerY=tableBottom+25;
  [[32,'✓','Ưu đãi thường','Sử dụng trong 180 ngày'],[290,'ϟ',campaign.bonusLabel,'Sử dụng trong 90 ngày']].forEach(([x,icon,title,detail])=>{
    drawRoundRect(ctx,x,footerY,42,42,21,'#ffe8ee'); drawCanvasIcon(ctx,icon==='✓'?'check':'bolt',x+10,footerY+10,22,'#dd0830');
    canvasText(ctx,title,x+54,footerY+14,12,500,'#5e687e',210);
    canvasText(ctx,detail,x+54,footerY+35,13,700,'#26324d',210);
  });
  const contact=[els.advisorName.value.trim(),els.advisorPhone.value.trim()].filter(Boolean).join(' · ') || 'Chọn phương án phù hợp với bạn';
  const contactWidth=Math.min(380,width*.36),contactX=width-32-contactWidth;
  drawRoundRect(ctx,contactX,footerY-5,contactWidth,59,12,'#d10a32');
  canvasText(ctx,'Liên hệ tư vấn',contactX+16,footerY+14,11,500,'#ffe5ee',contactWidth-32);
  canvasText(ctx,contact,contactX+16,footerY+37,14,700,'#fff',contactWidth-32);
  canvasText(ctx,'Tiền KM = (Giá trị HĐ ÷ 1,08) × Tổng % khuyến mãi. Mức ưu đãi thay đổi theo giá trị HĐ.',32,height-23,11,400,'#788198',width-64);
  ctx.restore();
  return canvas;
}
async function downloadPromotionPng() {
  const button=els.downloadPng;
  button.disabled=true; button.setAttribute('aria-busy','true');
  try {
    await Promise.all([document.fonts?.ready, campaignImage.decode()]);
    const canvas = createPromotionCanvas();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve,'image/png'));
    if(!blob) throw new Error('PNG unavailable');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const customerName = state.customer === 'personal' ? 'ca-nhan' : 'doanh-nghiep';
    const campaign = CAMPAIGNS[state.customer];
    const bonusSlug = campaign.bonusLabel === 'Ontop' ? 'ontop' : 'flash-sale';
    link.download = `bang-uu-dai-${customerName}-${state.includeFlash?bonusSlug:'thuong'}-thang-${campaign.month}-${campaign.year}.png`;
    link.href = url; document.body.append(link);link.click();link.remove();
    window.setTimeout(()=>URL.revokeObjectURL(url),30000);
    showToast('Đã tạo PNG với đầy đủ phần trăm, trang trí và kích thước bạn chọn.');
  } catch(error) {
    showToast('Chưa tạo được ảnh. Bạn tải lại trang rồi thử lại nhé.');
    console.error('Không thể xuất PNG:',error);
  } finally {button.disabled=false;button.removeAttribute('aria-busy');}
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
