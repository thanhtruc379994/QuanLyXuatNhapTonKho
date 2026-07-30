import { useEffect, useState } from 'react'
import { Icon } from './Icon'
import './style/StockEntryModal.css'
import { useWarehouse } from '../context/WarehouseContext'

const createLine = (products, productIndex = 0) => ({
  key: `${Date.now()}-${Math.random()}`,
  productIndex,
  quantity: 1,
  price: products[productIndex]?.importPrice || 0,
})
const localDateTime = () => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

export function StockEntryModal({ onClose, onSave }) {
  const { products: allProducts, suppliers } = useWarehouse()
  const products = allProducts.filter((product) => product.status === 'Đang bán')
  const [supplier, setSupplier] = useState('')
  const [note, setNote] = useState('')
  const [entryDate, setEntryDate] = useState(localDateTime)
  const [lines, setLines] = useState(() => products.length ? [createLine(products)] : [])

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const updateLine = (key, field, value) => setLines((items) => items.map((line) => {
    if (line.key !== key) return line
    if (field === 'productIndex') {
      const productIndex = Number(value)
      return { ...line, productIndex, price: products[productIndex].importPrice }
    }
    return { ...line, [field]: Math.max(0, Number(value)) }
  }))

  const save = () => {
    const now = new Date(entryDate)
    const code = `NK${entryDate.slice(0, 10).replaceAll('-', '')}_${String(Date.now()).slice(-3)}`
    onSave(lines.map((line, index) => ({
      id: Date.now() + index, code, date: now.toLocaleDateString('vi-VN'),
      product: products[line.productIndex].name, sku: products[line.productIndex].code,
      quantity: line.quantity, price: line.price, supplier, note,
    })))
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="stock-modal" role="dialog" aria-modal="true" aria-labelledby="stock-entry-title">
        <header className="modal-header">
          <h2 id="stock-entry-title">Nhập kho</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Đóng"><Icon name="close" size={23} /></button>
        </header>
        <div className="modal-body">
          <div className="form-grid">
            <label><span>Ngày nhập</span><div className="date-field"><input type="datetime-local" value={entryDate} onChange={(event) => setEntryDate(event.target.value)} /><Icon name="calendar" size={18} /></div></label>
            <label><span>Nhà cung cấp</span><select value={supplier} onChange={(event) => setSupplier(event.target.value)}>
              <option value="">Chọn nhà cung cấp</option>
              {suppliers.map((name) => <option key={name}>{name}</option>)}
            </select></label>
          </div>
          <label className="products-label">Sản phẩm *</label>
          <div className="product-editor">
            <div className="product-editor-head"><span>Sản phẩm</span><span>Số lượng</span><span>Giá nhập</span><span>Thành tiền</span><span /></div>
            {lines.map((line) => (
              <div className="product-line" key={line.key}>
                <select value={line.productIndex} onChange={(event) => updateLine(line.key, 'productIndex', event.target.value)}>
                  {products.map((product, index) => <option value={index} key={product.code}>{product.name} ({product.code})</option>)}
                </select>
                <input type="number" min="0" value={line.quantity} onChange={(event) => updateLine(line.key, 'quantity', event.target.value)} />
                <input type="number" min="0" value={line.price} onChange={(event) => updateLine(line.key, 'price', event.target.value)} />
                <input readOnly value={line.quantity * line.price} />
                <button type="button" className="remove-product" onClick={() => setLines((items) => items.filter((item) => item.key !== line.key))} aria-label="Xóa sản phẩm"><Icon name="trash" size={19} /></button>
              </div>
            ))}
            <button type="button" className="add-product" disabled={!products.length} onClick={() => setLines((items) => [...items, createLine(products)])}><Icon name="plus" size={20} /> Thêm sản phẩm</button>
          </div>
          <label className="note-field"><span>Ghi chú</span><textarea value={note} onChange={(event) => setNote(event.target.value)} /></label>
        </div>
        <footer className="modal-footer">
          <button type="button" className="cancel-button" onClick={onClose}>Hủy</button>
          <button type="button" className="save-button" onClick={save} disabled={!lines.length || !entryDate}>Lưu</button>
        </footer>
      </section>
    </div>
  )
}
