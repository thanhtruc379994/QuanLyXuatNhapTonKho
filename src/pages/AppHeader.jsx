import { Icon } from './Icon'
import './style/AppHeader.css'

export function AppHeader({ onMenuClick, title }) {
  return (
    <header className="app-header">
      <div className="page-title">
        <button className="icon-button menu-button" type="button" onClick={onMenuClick} aria-label="Thu gọn menu">
          <Icon name="menu" size={26} />
        </button>
        <h1>{title}</h1>
      </div>
      <div className="account">
        <button className="icon-button refresh-button" type="button" aria-label="Làm mới trang" onClick={() => window.location.reload()}>
          <Icon name="refresh" size={25} />
        </button>
        <span>Xin chào, Admin</span>
        <Icon name="user" size={28} />
      </div>
    </header>
  )
}
