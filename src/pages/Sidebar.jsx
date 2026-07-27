import { Icon } from './Icon'
import './style/Sidebar.css'

const menuItems = [
  ['home', 'Dashboard'],
  ['box', 'Sản phẩm'],
  ['download', 'Nhập kho'],
  ['upload', 'Xuất kho'],
  ['archive', 'Tồn kho'],
  ['settings', 'Cài đặt'],
]

export function Sidebar({ collapsed, activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <Icon name="box" size={27} />
        {!collapsed && <strong>Nhập Xuất Tồn</strong>}
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(([icon, label]) => (
          <button
            type="button"
            title={collapsed ? label : undefined}
            className={label === activePage ? 'active' : ''}
            key={label}
            onClick={() => onNavigate(label)}
          >
            <Icon name={icon} size={25} />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  )
}
