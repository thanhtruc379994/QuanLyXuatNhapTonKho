import { useState } from 'react'
import { Icon } from './Icon'
import './style/ReceiptActionModal.css'
import { useWarehouse } from '../context/WarehouseContext'

const money = new Intl.NumberFormat('vi-VN')

export function ReceiptActionModal({ receipt, mode, onClose, onSave, transactionType = 'Nhập' }) {
  const { stockRows } = useWarehouse()
  const [quantity, setQuantity] = useState(receipt.quantity)
  const [price, setPrice] = useState(receipt.price)
  const isEdit = mode === 'edit'
  const isOutbound = transactionType === 'Xuất'
  const available = (stockRows.find((row) => row.code === receipt.sku)?.closing || 0) + Number(receipt.quantity || 0)
  const exceedsStock = isOutbound && quantity > available
  const total = isEdit ? quantity * price : receipt.quantity * receipt.price

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="receipt-action-modal" role="dialog" aria-modal="true">
        <header className="modal-header">
          <h2>{isEdit ? `Chỉnh sửa phiếu ${transactionType.toLocaleLowerCase('vi')}` : `Chi tiết phiếu ${transactionType.toLocaleLowerCase('vi')}`}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Đóng"><Icon name="close" size={21} /></button>
        </header>
        <div className="receipt-action-body">
          <div className="receipt-summary">
            <div><span>Mã phiếu</span><strong>{receipt.code}</strong></div>
            <div><span>Ngày {transactionType.toLocaleLowerCase('vi')}</span><strong>{receipt.date}</strong></div>
            <div><span>Sản phẩm</span><strong>{receipt.product}</strong></div>
            <div><span>Mã sản phẩm</span><strong>{receipt.sku}</strong></div>
            <div><span>{isOutbound ? 'Khách hàng' : 'Nhà cung cấp'}</span><strong>{receipt.supplier || 'Chưa có'}</strong></div>
            <div><span>Ghi chú</span><strong>{receipt.note || 'Không có'}</strong></div>
          </div>
          <div className="receipt-numbers">
            <label><span>Số lượng</span>{isEdit ? <input type="number" min="0" value={quantity} onChange={(event) => setQuantity(Math.max(0, Number(event.target.value)))} /> : <strong>{receipt.quantity}</strong>}</label>
            <label><span>Giá {transactionType.toLocaleLowerCase('vi')}</span>{isEdit ? <input type="number" min="0" value={price} onChange={(event) => setPrice(Math.max(0, Number(event.target.value)))} /> : <strong>{money.format(receipt.price)} ₫</strong>}</label>
            <label className="receipt-total"><span>Thành tiền</span><strong>{money.format(total)} ₫</strong></label>
            {exceedsStock && <p className="password-message error">Số lượng xuất vượt tồn kho khả dụng ({available}).</p>}
          </div>
        </div>
        <footer className="modal-footer">
          <button type="button" className="cancel-button" onClick={onClose}>{isEdit ? 'Hủy' : 'Đóng'}</button>
          {isEdit && <button type="button" className="save-button" disabled={exceedsStock} onClick={() => onSave({ ...receipt, quantity, price })}>Lưu thay đổi</button>}
        </footer>
      </section>
    </div>
  )
}
