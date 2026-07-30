import {useState} from 'react'
import {useWarehouse} from '../context/WarehouseContext'
import {Icon} from './Icon'
import './style/AuthGate.css'

const SESSION_KEY = 'warehouse-authenticated'
const DEFAULT_PASSWORD = 'admin123'

async function hashPassword(value) {
    const bytes = new TextEncoder().encode(value)
    const digest = await crypto.subtle.digest('SHA-256', bytes)
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function AuthGate({children}) {
    const {account, setAccount, accountState} = useWarehouse()
    const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true' || localStorage.getItem(SESSION_KEY) === 'true')
    const [username, setUsername] = useState('admin')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [remember, setRemember] = useState(() => localStorage.getItem(SESSION_KEY) === 'true')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const login = async (event) => {
        event.preventDefault()
        setError('')
        setSubmitting(true)
        try {
            const passwordHash = await hashPassword(password)
            const expectedHash = account.passwordHash || await hashPassword(DEFAULT_PASSWORD)
            if (username.trim() !== account.username || passwordHash !== expectedHash) {
                setError('Tên đăng nhập hoặc mật khẩu không đúng.')
                return
            }
            if (!account.passwordHash) {
                setAccount((current) => ({...current, passwordHash, passwordUpdatedAt: new Date().toISOString()}))
            }
            const storage = remember ? localStorage : sessionStorage
            storage.setItem(SESSION_KEY, 'true')
            if (remember) sessionStorage.removeItem(SESSION_KEY)
            else localStorage.removeItem(SESSION_KEY)
            setAuthenticated(true)
            setPassword('')
        } catch {
            setError('Trình duyệt không hỗ trợ chức năng đăng nhập.')
        } finally {
            setSubmitting(false)
        }
    }

    const logout = () => {
        sessionStorage.removeItem(SESSION_KEY)
        localStorage.removeItem(SESSION_KEY)
        setAuthenticated(false)
        setPassword('')
    }

    if (accountState.loading) {
        return <main className="login-page">
            <div className="login-loading">Đang tải dữ liệu tài khoản...</div>
        </main>
    }

    if (accountState.error) {
        return <main className="login-page">
            <div className="login-loading login-failed">Không thể mở IndexedDB. Vui lòng tải lại trang.</div>
        </main>
    }

    if (authenticated) {
        return children({username: account.username, onLogout: logout})
    }

    return (
        <main className="login-page">
            <form className="login-card" onSubmit={login}>
                <div className="login-mark"><Icon name="box" size={34}/></div>
                <div className="login-heading">
                    <span>HỆ THỐNG QUẢN LÝ KHO</span>
                    <h1>Đăng nhập</h1>
                    <p>Nhập thông tin tài khoản để tiếp tục.</p>
                </div>
                <label>
                    <span>Tên đăng nhập</span>
                    <input autoFocus autoComplete="username" value={username}
                           onChange={(event) => setUsername(event.target.value)}/>
                </label>
                <label>
                    <span>Mật khẩu</span>
                    <span className="password-input">
                        <input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password}
                               onChange={(event) => setPassword(event.target.value)}/>
                        <button type="button" onClick={() => setShowPassword((value) => !value)}
                                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
                            <Icon name="eye" size={19}/>
                        </button>
                    </span>
                </label>
                <label className="remember-login">
                    <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)}/>
                    <span>Ghi nhớ đăng nhập trên thiết bị này</span>
                </label>
                {error && <p className="login-error">{error}</p>}
                <button type="submit" disabled={submitting || !username.trim() || !password}>
                    {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
                {!account.passwordHash && <small>Tài khoản mặc định: admin / admin123</small>}
            </form>
        </main>
    )
}
