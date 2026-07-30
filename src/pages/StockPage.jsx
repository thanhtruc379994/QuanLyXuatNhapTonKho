import {useMemo, useState} from 'react'
import {Icon} from './Icon'
import './style/StockPage.css'
import {useWarehouse} from '../context/WarehouseContext'

const money = new Intl.NumberFormat('vi-VN')
const columns = [
    ['Mã SP', 'code'], ['Tên sản phẩm', 'name'], ['Đơn vị', 'unit'], ['Tồn đầu', 'opening'],
    ['Nhập', 'imported'], ['Xuất', 'exported'], ['Tồn cuối', 'closing'], ['Giá trị tồn', 'value'], ['Trạng thái', 'status'],
]

function downloadExcel(rows) {
    const labels = ['Mã SP', 'Tên sản phẩm', 'Đơn vị', 'Tồn đầu', 'Nhập', 'Xuất', 'Tồn cuối', 'Giá trị tồn', 'Trạng thái']
    const keys = ['code', 'name', 'unit', 'opening', 'imported', 'exported', 'closing', 'value', 'status']
    const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
    const csv = [labels.map(quote).join(','), ...rows.map((row) => keys.map((key) => quote(row[key])).join(','))].join('\r\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], {type: 'text/csv;charset=utf-8'}))
    const link = document.createElement('a')
    link.href = url;
    link.download = 'bao-cao-ton-kho.csv';
    link.click();
    URL.revokeObjectURL(url)
}

function printPdf(rows) {
    const popup = window.open('', '_blank', 'width=1100,height=760')
    if (!popup) return
    const total = rows.reduce((sum, row) => ({
        opening: sum.opening + row.opening, imported: sum.imported + row.imported,
        exported: sum.exported + row.exported, closing: sum.closing + row.closing, value: sum.value + row.value,
    }), {opening: 0, imported: 0, exported: 0, closing: 0, value: 0})
    popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Báo cáo tồn kho</title><style>
  body{font:12px Arial;padding:24px;color:#222}h1{text-align:center;font-size:21px}table{width:100%;border-collapse:collapse}
  th,td{border:1px solid #aaa;padding:7px}th{background:#eee}.n{text-align:right}tfoot{font-weight:bold}@page{size:A4 landscape}
  </style></head><body><h1>BÁO CÁO TỒN KHO</h1><p>Ngày in: ${new Date().toLocaleString('vi-VN')}</p><table><thead><tr>${columns.map(([label]) => `<th>${label}</th>`).join('')}</tr></thead>
  <tbody>${rows.map((r) => `<tr><td>${r.code}</td><td>${r.name}</td><td>${r.unit}</td><td class="n">${r.opening}</td><td class="n">${r.imported}</td><td class="n">${r.exported}</td><td class="n">${r.closing}</td><td class="n">${money.format(r.value)} ₫</td><td>${r.status}</td></tr>`).join('')}</tbody>
  <tfoot><tr><td colspan="3">TỔNG CỘNG</td><td class="n">${total.opening}</td><td class="n">${total.imported}</td><td class="n">${total.exported}</td><td class="n">${total.closing}</td><td class="n">${money.format(total.value)} ₫</td><td></td></tr></tfoot></table>
  <script>window.onload=()=>window.print()</script></body></html>`);
    popup.document.close()
}

export function StockPage() {
    const {stockRows, products, inboundRows, outboundRows} = useWarehouse()
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('all')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [sort, setSort] = useState({key: '', direction: 'asc'})

    const periodStockRows = useMemo(() => {
        if (!startDate && !endDate) return stockRows
        const parseDate = (value) => {
            const [day, month, year] = String(value).split('/').map(Number)
            return year && month && day ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` : ''
        }
        const sumBySku = (rows, sku, predicate) => rows
            .filter((row) => row.sku === sku && predicate(parseDate(row.date)))
            .reduce((sum, row) => sum + Number(row.quantity || 0), 0)
        return products.map((product) => {
            const beforeStart = (date) => startDate && date && date < startDate
            const inPeriod = (date) => (!startDate || date >= startDate) && (!endDate || date <= endDate)
            const opening = Number(product.openingStock || 0)
                + sumBySku(inboundRows, product.code, beforeStart)
                - sumBySku(outboundRows, product.code, beforeStart)
            const imported = sumBySku(inboundRows, product.code, inPeriod)
            const exported = sumBySku(outboundRows, product.code, inPeriod)
            const closing = opening + imported - exported
            const price = Number(product.importPrice || 0)
            return {
                code: product.code, name: product.name, unit: product.unit,
                opening, imported, exported, closing, price, value: closing * price,
                status: closing <= 0 ? 'Hết hàng' : closing <= 10 ? 'Sắp hết' : 'Bình thường',
            }
        })
    }, [endDate, inboundRows, outboundRows, products, startDate, stockRows])

    const rows = useMemo(() => {
        const keyword = query.trim().toLocaleLowerCase('vi')
        const filtered = periodStockRows.filter((row) => (status === 'all' || row.status === status)
            && (!keyword || `${row.code} ${row.name} ${row.unit}`.toLocaleLowerCase('vi').includes(keyword)))
        if (!sort.key) return filtered
        return [...filtered].sort((a, b) => String(a[sort.key]).localeCompare(String(b[sort.key]), 'vi', {numeric: true})
            * (sort.direction === 'asc' ? 1 : -1))
    }, [periodStockRows, query, sort, status])
    const totals = rows.reduce((sum, row) => ({
        opening: sum.opening + row.opening, imported: sum.imported + row.imported,
        exported: sum.exported + row.exported, closing: sum.closing + row.closing, value: sum.value + row.value,
    }), {opening: 0, imported: 0, exported: 0, closing: 0, value: 0})
    return <main className="page-content stock-page">
        <div className="toolbar stock-toolbar">
            <label className="search-box"><Icon name="search" size={25}/><input placeholder="Tìm kiếm..." value={query}
                                                                                onChange={(e) => setQuery(e.target.value)}/></label>
            <input className="date-filter" type="date" aria-label="Từ ngày" value={startDate}
                   onChange={(e) => setStartDate(e.target.value)}/>
            <input className="date-filter" type="date" aria-label="Đến ngày" min={startDate} value={endDate}
                   onChange={(e) => setEndDate(e.target.value)}/>
            <select className="product-filter" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="all">Tất cả trạng thái</option>
                <option>Hết hàng</option>
                <option>Sắp hết</option>
                <option>Bình thường</option>
            </select>
            <div className="toolbar-actions">
                <button className="outline-button" onClick={() => downloadExcel(rows)}><Icon name="fileSpreadsheet"/>Excel
                </button>
                <button className="outline-button" onClick={() => printPdf(rows)}><Icon name="file"/>PDF</button>
            </div>
        </div>
        <div className="table-card">
            <div className="table-scroll">
                <table className="stock-table">
                    <thead>
                    <tr>{columns.map(([label, key]) => <th key={key}>
                        <button className="sort-button" onClick={() => setSort((old) => ({
                            key,
                            direction: old.key === key && old.direction === 'asc' ? 'desc' : 'asc'
                        }))}>{label}<span
                            className={`sort ${sort.key === key ? 'selected' : ''}`}>{sort.key === key ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
                        </button>
                    </th>)}</tr>
                    </thead>
                    <tbody>{rows.map((row) => <tr key={row.code}>
                        <td className="receipt-code">{row.code}</td>
                        <td>{row.name}</td>
                        <td>{row.unit}</td>
                        <td className="number">{row.opening}</td>
                        <td className="number">{row.imported}</td>
                        <td className="number stock-out">{row.exported}</td>
                        <td className="number stock-closing">{row.closing}</td>
                        <td className="number">{money.format(row.value)} ₫</td>
                        <td><span
                            className={`stock-status ${row.status === 'Hết hàng' ? 'empty' : row.status === 'Sắp hết' ? 'low' : 'normal'}`}>{row.status}</span>
                        </td>
                    </tr>)}</tbody>
                    <tfoot>
                    <tr>
                        <td colSpan="3">TỔNG CỘNG</td>
                        <td className="number">{totals.opening}</td>
                        <td className="number">{totals.imported}</td>
                        <td className="number stock-out">{totals.exported}</td>
                        <td className="number">{totals.closing}</td>
                        <td className="number">{money.format(totals.value)} ₫</td>
                        <td/>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </main>
}
