const money = new Intl.NumberFormat('vi-VN')

const columns = [
    ['Mã phiếu', 'code'], ['Ngày nhập', 'date'], ['Sản phẩm', 'product'],
    ['Mã SP', 'sku'], ['Số lượng', 'quantity'], ['Giá nhập', 'price'],
    ['Thành tiền', 'total'], ['Nhà cung cấp', 'supplier'],
]

export function exportExcel(rows, filename = 'danh-sach-nhap-kho.csv') {
    const output = rows.map((row) => ({...row, total: row.quantity * row.price}))
    const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
    const csv = [
        columns.map(([label]) => escape(label)).join(','),
        ...output.map((row) => columns.map(([, key]) => escape(row[key])).join(',')),
    ].join('\r\n')
    download(new Blob([`\uFEFF${csv}`], {type: 'text/csv;charset=utf-8'}), filename)
}

export function exportPdf(rows, title = 'DANH SÁCH NHẬP KHO') {
    printDocument(title, rows)
}

export function printReceipt(row, allRows) {
    const receiptRows = allRows.filter((item) => item.id === row.id)
    printWarehouseReceipt({
        title: 'PHIẾU NHẬP KHO',
        code: row.code,
        dateLabel: 'Ngày nhập',
        date: row.date,
        partnerLabel: 'Nhà cung cấp',
        partner: row.supplier,
        note: row.note,
        rows: receiptRows,
        receiverLabel: 'Người giao hàng',
    })
}

function printDocument(title, rows) {
    const popup = window.open('', '_blank', 'width=1100,height=760')
    if (!popup) {
        window.alert('Trình duyệt đang chặn cửa sổ in. Vui lòng cho phép popup và thử lại.')
        return
    }
    const body = rows.map((row) => `
    <tr><td>${row.code}</td><td>${row.date}</td><td>${row.product}<small>${row.sku}</small></td>
    <td class="num">${row.quantity}</td><td class="num">${money.format(row.price)} ₫</td>
    <td class="num">${money.format(row.quantity * row.price)} ₫</td><td>${row.supplier || ''}</td></tr>`).join('')
    popup.document.write(`<!doctype html><html><head><title>${title}</title><style>
    body{font:14px Arial;color:#222;padding:28px}h1{text-align:center;font-size:22px;margin:0 0 28px}
    table{width:100%;border-collapse:collapse}th,td{border:1px solid #bbb;padding:9px;text-align:left}
    th{background:#f1f3f5}.num{text-align:right}small{display:block;color:#777;margin-top:3px}
    .date{text-align:right;margin:0 0 12px}@page{size:A4 landscape;margin:15mm}
  </style></head><body><h1>${title}</h1><p class="date">Ngày in: ${new Date().toLocaleString('vi-VN')}</p>
  <table><thead><tr><th>Mã phiếu</th><th>Ngày nhập</th><th>Sản phẩm</th><th>Số lượng</th>
  <th>Giá nhập</th><th>Thành tiền</th><th>Nhà cung cấp</th></tr></thead><tbody>${body}</tbody></table>
  <script>window.onload=()=>{window.print();window.onafterprint=()=>window.close()}</script></body></html>`)
    popup.document.close()
}

export function printWarehouseReceipt({
                                          title,
                                          code,
                                          dateLabel,
                                          date,
                                          partnerLabel,
                                          partner,
                                          note,
                                          rows,
                                          receiverLabel,
                                      }) {
    const popup = window.open('', '_blank', 'width=1050,height=800')
    if (!popup) {
        window.alert('Trình duyệt đang chặn cửa sổ in. Vui lòng cho phép popup và thử lại.')
        return
    }
    const total = rows.reduce((sum, row) => sum + row.quantity * row.price, 0)
    const body = rows.map((row) => `
    <tr>
      <td>${row.product}</td><td>${row.sku}</td><td class="center">${row.quantity}</td>
      <td class="num">${money.format(row.price)}</td><td class="num">${money.format(row.quantity * row.price)}</td>
    </tr>`).join('')

    popup.document.write(`<!doctype html><html lang="vi"><head><meta charset="UTF-8">
    <title>${title} - ${code}</title><style>
    *{box-sizing:border-box}body{margin:0;background:#fff;color:#111;font:13px Arial,sans-serif}
    .sheet{width:180mm;min-height:260mm;margin:0 auto;padding:13mm 12mm}
    .top{display:flex;justify-content:space-between;font-size:9px;margin-bottom:9mm}
    h1{text-align:center;font-size:22px;margin:0 0 5mm} .code{text-align:center;font-weight:bold;margin-bottom:9mm}
    .info{line-height:1.9;margin-bottom:4mm}.info b{display:inline-block;min-width:110px}
    table{width:100%;border-collapse:collapse;margin-top:4mm}th,td{border:1px solid #222;padding:6px 7px}
    th{text-align:center;background:#f5f5f5}.num{text-align:right}.center{text-align:center}
    tfoot td{font-weight:bold}.total-label{text-align:right}.signatures{display:grid;grid-template-columns:1fr 1fr;gap:35mm;margin-top:12mm;text-align:center}
    .signature-title{font-weight:bold}.signature-note{font-size:11px;font-style:italic;margin-top:3px}
    .signature-line{width:42mm;border-top:1px solid #222;margin:27mm auto 0}
    @page{size:A4 portrait;margin:0}@media print{.sheet{margin:0}}
  </style></head><body><main class="sheet">
    <div class="top"><span>${new Date().toLocaleString('vi-VN')}</span><span>${title} - ${code}</span></div>
    <h1>${title}</h1><div class="code">Mã phiếu: ${code}</div>
    <div class="info">
      <div><b>${dateLabel}:</b> ${date || ''}</div>
      <div><b>${partnerLabel}:</b> ${partner || ''}</div>
      <div><b>Ghi chú:</b> ${note || ''}</div>
    </div>
    <table><thead><tr><th>Tên sản phẩm</th><th>Mã SP</th><th>Số lượng</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>
      <tbody>${body}</tbody><tfoot><tr><td colspan="4" class="total-label">Tổng cộng:</td><td class="num">${money.format(total)}</td></tr></tfoot>
    </table>
    <div class="signatures">
      <div><div class="signature-title">Người lập phiếu</div><div class="signature-note">(Ký, ghi rõ họ tên)</div><div class="signature-line"></div></div>
      <div><div class="signature-title">${receiverLabel}</div><div class="signature-note">(Ký, ghi rõ họ tên)</div><div class="signature-line"></div></div>
    </div>
  </main><script>window.onload=()=>{window.print();window.onafterprint=()=>window.close()}</script></body></html>`)
    popup.document.close()
}

function download(blob, filename) {
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(url)
}
