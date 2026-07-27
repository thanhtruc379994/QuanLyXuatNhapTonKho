import { useState } from 'react'
import { Icon } from './Icon'
import './style/ProductModal.css'

export function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product || {
    code: '', name: '', unit: 'Hộp', importPrice: 0, exportPrice: 0,
    openingStock: 0, quota: '', status: 'Đang bán',
  })
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event) => {
    event.preventDefault()
    if (!form.code.trim() || !form.name.trim()) return
    onSave({
      ...form, id: product?.id || form.code.trim().toUpperCase(),
      code: form.code.trim().toUpperCase(), importPrice: Number(form.importPrice),
      exportPrice: Number(form.exportPrice), openingStock: Number(form.openingStock),
      createdAt: product?.createdAt || new Date().toLocaleDateString('vi-VN'),
    })
  }
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="product-modal" onSubmit={submit}>
        <header className="modal-header"><h2>{product ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
          <button type="button" className="modal-close" onClick={onClose}><Icon name="close" /></button>
        </header>
        <div className="product-form">
          <label><span>Mã sản phẩm *</span><input value={form.code} onChange={(e) => update('code', e.target.value)} /></label>
          <label><span>Tên sản phẩm *</span><input value={form.name} onChange={(e) => update('name', e.target.value)} /></label>
          <label><span>Đơn vị</span><select value={form.unit} onChange={(e) => update('unit', e.target.value)}><option>Hộp</option><option>Chai</option><option>Cây</option><option>Cái</option></select></label>
          <label><span>Trạng thái</span><select value={form.status} onChange={(e) => update('status', e.target.value)}><option>Đang bán</option><option>Ngừng bán</option></select></label>
          <label><span>Giá nhập</span><input type="number" min="0" value={form.importPrice} onChange={(e) => update('importPrice', e.target.value)} /></label>
          <label><span>Giá xuất</span><input type="number" min="0" value={form.exportPrice} onChange={(e) => update('exportPrice', e.target.value)} /></label>
          <label><span>Tồn ban đầu</span><input type="number" min="0" value={form.openingStock} onChange={(e) => update('openingStock', e.target.value)} /></label>
          <label><span>Định mức tháng</span><input placeholder="Ví dụ: 09/25: 10" value={form.quota} onChange={(e) => update('quota', e.target.value)} /></label>
        </div>
        <footer className="modal-footer"><button type="button" className="cancel-button" onClick={onClose}>Hủy</button><button className="save-button">Lưu</button></footer>
      </form>
    </div>
  )
}
