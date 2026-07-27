import { useMemo, useState } from 'react'
import { Icon } from './Icon'
import { ProductModal } from './ProductModal'
import { initialProducts } from '../data/products'
import { ConfirmDialog } from './ConfirmDialog'
import './style/ProductsPage.css'
import { useIndexedDBCollection } from '../hooks/useIndexedDBCollection'

const PAGE_SIZE = 10
const columns = [
  ['Mã SP', 'code'], ['Tên sản phẩm', 'name'], ['Đơn vị', 'unit'], ['Giá nhập', 'importPrice'],
  ['Giá xuất', 'exportPrice'], ['Tồn ban đầu', 'openingStock'], ['Định mức tháng', 'quota'],
  ['Ngày tạo', 'createdAt'], ['Trạng thái', 'status'],
]
const money = new Intl.NumberFormat('vi-VN')

export function ProductsPage() {
  const [products, setProducts] = useIndexedDBCollection('products', initialProducts)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState({ key: '', direction: 'asc' })
  const [editing, setEditing] = useState(undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteProduct, setDeleteProduct] = useState(null)

  const filtered = useMemo(() => {
    const keyword = query.toLocaleLowerCase('vi').trim()
    const result = products.filter((item) => (status === 'all' || item.status === status)
      && (!keyword || `${item.code} ${item.name} ${item.unit}`.toLocaleLowerCase('vi').includes(keyword)))
    if (!sort.key) return result
    return [...result].sort((a, b) => String(a[sort.key]).localeCompare(String(b[sort.key]), 'vi', { numeric: true })
      * (sort.direction === 'asc' ? 1 : -1))
  }, [products, query, sort, status])
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const changeFilter = (setter, value) => { setter(value); setPage(1) }

  return (
    <main className="page-content products-page">
      <div className="toolbar products-toolbar">
        <label className="search-box"><Icon name="search" size={25} /><input placeholder="Tìm kiếm..." value={query} onChange={(e) => changeFilter(setQuery, e.target.value)} /></label>
        <select className="product-filter" value={status} onChange={(e) => changeFilter(setStatus, e.target.value)}>
          <option value="all">Tất cả trạng thái</option><option>Đang bán</option><option>Ngừng bán</option>
        </select>
        <button className="primary-button add-product-main" type="button" onClick={() => { setEditing(undefined); setModalOpen(true) }}><Icon name="plus" />Thêm sản phẩm</button>
      </div>
      <div className="table-card"><div className="table-scroll"><table className="products-table">
        <thead><tr>{columns.map(([label, key]) => <th key={key}><button className="sort-button" onClick={() => setSort((old) => ({ key, direction: old.key === key && old.direction === 'asc' ? 'desc' : 'asc' }))}>{label}<span className={`sort ${sort.key === key ? 'selected' : ''}`}>{sort.key === key ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}</span></button></th>)}<th>Thao tác</th></tr></thead>
        <tbody>{visible.map((item) => <tr key={item.id}>
          <td className="receipt-code">{item.code}</td><td>{item.name}</td><td>{item.unit}</td>
          <td className="number">{money.format(item.importPrice)} ₫</td><td className="number">{money.format(item.exportPrice)} ₫</td>
          <td className="number">{item.openingStock}</td><td>{item.quota || <span className="no-quota">Chưa có</span>}</td>
          <td>{item.createdAt}</td><td><span className={`status-badge ${item.status === 'Đang bán' ? 'selling' : 'stopped'}`}>{item.status}</span></td>
          <td><div className="row-actions"><button className="table-action blue" title="Sửa" onClick={() => { setEditing(item); setModalOpen(true) }}><Icon name="edit" /></button>
            <button className="table-action red" title="Xóa" onClick={() => setDeleteProduct(item)}><Icon name="trash" /></button></div></td>
        </tr>)}</tbody>
      </table></div></div>
      <nav className="pagination"><button disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)}><Icon name="chevronLeft" /></button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => <button className={number === currentPage ? 'active' : ''} key={number} onClick={() => setPage(number)}>{number}</button>)}
        <button disabled={currentPage === pageCount} onClick={() => setPage((p) => p + 1)}><Icon name="chevronRight" /></button></nav>
      {modalOpen && <ProductModal product={editing} onClose={() => setModalOpen(false)} onSave={(value) => {
        setProducts((list) => editing ? list.map((item) => item.id === editing.id ? value : item) : [value, ...list])
        setModalOpen(false)
      }} />}
      {deleteProduct && <ConfirmDialog
        message={`Bạn có chắc muốn xóa sản phẩm “${deleteProduct.name}” (${deleteProduct.code})? Hành động này không thể hoàn tác.`}
        onCancel={() => setDeleteProduct(null)}
        onConfirm={() => {
          setProducts((list) => list.filter((item) => item.id !== deleteProduct.id))
          setDeleteProduct(null)
        }}
      />}
    </main>
  )
}
