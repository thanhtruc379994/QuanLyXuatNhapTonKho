import { Icon } from './Icon'
import './style/InventoryTable.css'

const columns = ['Mã phiếu', 'Ngày nhập', 'Sản phẩm', 'Số lượng', 'Giá nhập', 'Thành tiền', 'Nhà cung cấp']
const currency = new Intl.NumberFormat('vi-VN')

function ActionButton({ name, label, tone, onClick }) {
  return (
    <button type="button" className={`table-action ${tone}`} aria-label={label} title={label} onClick={onClick}>
      <Icon name={name} size={22} />
    </button>
  )
}

export function InventoryTable({ rows, onDelete, onPrint, onView, onEdit, sort, onSort }) {
  return (
    <div className="table-card">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={column}>
                  <button className="sort-button" type="button" onClick={() => onSort(index)}>
                    {column}<span className={`sort ${sort.index === index ? 'selected' : ''}`}>{sort.index === index ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}</span>
                  </button>
                </th>
              ))}
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="receipt-code">{row.code}</td>
                <td>{row.date}</td>
                <td><strong>{row.product}</strong><small>{row.sku}</small></td>
                <td className="number">{row.quantity}</td>
                <td className="number">{currency.format(row.price)} ₫</td>
                <td className="number">{currency.format(row.quantity * row.price)} ₫</td>
                <td>{row.supplier || ''}</td>
                <td>
                  <div className="row-actions">
                    <ActionButton name="print" label="In phiếu" tone="cyan" onClick={() => onPrint(row)} />
                    <ActionButton name="eye" label="Xem chi tiết" tone="indigo" onClick={() => onView(row)} />
                    <ActionButton name="edit" label="Chỉnh sửa" tone="blue" onClick={() => onEdit(row)} />
                    <ActionButton name="trash" label="Xóa" tone="red" onClick={() => onDelete(row.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div className="empty-state">Không tìm thấy dữ liệu phù hợp.</div>}
      </div>
    </div>
  )
}
