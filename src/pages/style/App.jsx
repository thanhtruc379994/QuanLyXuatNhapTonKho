import { useMemo, useState } from 'react'
import { AppHeader } from '../AppHeader.jsx'
import { Sidebar } from '../Sidebar.jsx'
import { InventoryTable } from '../InventoryTable.jsx'
import { StockEntryModal } from '../StockEntryModal.jsx'
import { ProductsPage } from '../ProductsPage.jsx'
import { ConfirmDialog } from '../ConfirmDialog.jsx'
import { ReceiptActionModal } from '../ReceiptActionModal.jsx'
import { StockPage } from '../StockPage.jsx'
import { OutboundPage } from '../OutboundPage.jsx'
import { DashboardPage } from '../DashboardPage.jsx'
import { SettingsPage } from '../SettingsPage.jsx'
import { Icon } from '../Icon.jsx'
import { inventoryReceipts } from '../../data/inventoryReceipts.js'
import { exportExcel, exportPdf, printReceipt } from '../../utils/exportInventory.js'
import { useIndexedDBCollection } from '../../hooks/useIndexedDBCollection.js'
import '../../App.css'

const PAGE_SIZE = 10

function App() {
  const [collapsed, setCollapsed] = useState(false)
  const [query, setQuery] = useState('')
  const [product, setProduct] = useState('all')
  const [page, setPage] = useState(1)
  const [rows, setRows] = useIndexedDBCollection('inboundReceipts', inventoryReceipts)
  const [isEntryOpen, setIsEntryOpen] = useState(false)
  const [sort, setSort] = useState({ index: -1, direction: 'asc' })
  const [activePage, setActivePage] = useState('Dashboard')
  const [deleteReceipt, setDeleteReceipt] = useState(null)
  const [receiptAction, setReceiptAction] = useState(null)

  const products = [...new Set(inventoryReceipts.map((item) => item.product))]
  const filteredRows = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase('vi')
    const matched = rows.filter((row) => {
      const matchesProduct = product === 'all' || row.product === product
      const matchesQuery =
        !keyword ||
        [row.code, row.product, row.sku, row.supplier]
          .join(' ')
          .toLocaleLowerCase('vi')
          .includes(keyword)
      return matchesProduct && matchesQuery
    })
    if (sort.index < 0) return matched
    const keys = ['code', 'date', 'product', 'quantity', 'price', 'total', 'supplier']
    const key = keys[sort.index]
    return [...matched].sort((a, b) => {
      const first = key === 'total' ? a.quantity * a.price : a[key]
      const second = key === 'total' ? b.quantity * b.price : b[key]
      return String(first ?? '').localeCompare(String(second ?? ''), 'vi', { numeric: true }) * (sort.direction === 'asc' ? 1 : -1)
    })
  }, [product, query, rows, sort])

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visibleRows = filteredRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  const updateFilter = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} activePage={activePage} onNavigate={(pageName) => {
        if (['Dashboard', 'Sản phẩm', 'Nhập kho', 'Xuất kho', 'Tồn kho', 'Cài đặt'].includes(pageName)) setActivePage(pageName)
      }} />
      <div className="app-main">
        <AppHeader
          title={activePage}
          collapsed={collapsed}
          onMenuClick={() => setCollapsed((value) => !value)}
        />
        {activePage === 'Dashboard' ? <DashboardPage /> : activePage === 'Cài đặt' ? <SettingsPage /> : activePage === 'Sản phẩm' ? <ProductsPage /> : activePage === 'Xuất kho' ? <OutboundPage /> : activePage === 'Tồn kho' ? <StockPage /> : <main className="page-content">
          <div className="toolbar">
            <label className="search-box">
              <Icon name="search" size={25} />
              <input
                value={query}
                onChange={(event) => updateFilter(setQuery)(event.target.value)}
                placeholder="Tìm kiếm..."
              />
            </label>

            <select
              className="product-filter"
              value={product}
              onChange={(event) => updateFilter(setProduct)(event.target.value)}
            >
              <option value="all">Tất cả sản phẩm</option>
              {products.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <div className="toolbar-actions">
              <button className="outline-button" type="button" onClick={() => exportExcel(filteredRows)}>
                <Icon name="fileSpreadsheet" />
                Excel
              </button>
              <button className="outline-button" type="button" onClick={() => exportPdf(filteredRows)}>
                <Icon name="file" />
                PDF
              </button>
              <button className="primary-button" type="button" onClick={() => setIsEntryOpen(true)}>
                <Icon name="plus" />
                Nhập kho
              </button>
            </div>
          </div>

          <InventoryTable
            rows={visibleRows}
            sort={sort}
            onSort={(index) => setSort((current) => ({
              index,
              direction: current.index === index && current.direction === 'asc' ? 'desc' : 'asc',
            }))}
            onPrint={(row) => printReceipt(row, rows)}
            onView={(row) => setReceiptAction({ mode: 'view', receipt: row })}
            onEdit={(row) => setReceiptAction({ mode: 'edit', receipt: row })}
            onDelete={(id) => setDeleteReceipt(rows.find((item) => item.id === id))}
          />

          <nav className="pagination" aria-label="Phân trang">
            <button
              type="button"
              aria-label="Trang trước"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <Icon name="chevronLeft" />
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  type="button"
                  className={pageNumber === currentPage ? 'active' : ''}
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ),
            )}
            <button
              type="button"
              aria-label="Trang sau"
              disabled={currentPage === pageCount}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            >
              <Icon name="chevronRight" />
            </button>
          </nav>
        </main>}
      </div>
      {isEntryOpen && (
        <StockEntryModal
          onClose={() => setIsEntryOpen(false)}
          onSave={(newRows) => {
            setRows((items) => [...newRows, ...items])
            setIsEntryOpen(false)
            setPage(1)
          }}
        />
      )}
      {deleteReceipt && (
        <ConfirmDialog
          message={`Bạn có chắc muốn xóa ${deleteReceipt.product} khỏi phiếu ${deleteReceipt.code}? Hành động này không thể hoàn tác.`}
          onCancel={() => setDeleteReceipt(null)}
          onConfirm={() => {
            setRows((items) => items.filter((item) => item.id !== deleteReceipt.id))
            setDeleteReceipt(null)
          }}
        />
      )}
      {receiptAction && (
        <ReceiptActionModal
          mode={receiptAction.mode}
          receipt={receiptAction.receipt}
          onClose={() => setReceiptAction(null)}
          onSave={(updatedReceipt) => {
            setRows((items) => items.map((item) => item.id === updatedReceipt.id ? updatedReceipt : item))
            setReceiptAction(null)
          }}
        />
      )}
    </div>
  )
}

export default App
