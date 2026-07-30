import {useState} from 'react'
import {Icon} from './Icon'
import {ConfirmDialog} from './ConfirmDialog'
import {SettingEntityModal} from './SettingEntityModal'
import './style/SettingsPage.css'
import {useWarehouse} from '../context/WarehouseContext'

function SettingList({title,type,items,onOpen,onDelete}){
  return <section className="settings-card"><header><h3>{title}</h3><button onClick={()=>onOpen(type)}><Icon name="plus" size={18}/>Thêm</button></header>
    <div className="settings-list">{items.map((name,index)=><div key={`${name}-${index}`}><span>{name}</span><span className="setting-row-actions"><button className="edit-setting" onClick={()=>onOpen(type,index,name)}>Sửa</button><button className="delete-setting" onClick={()=>onDelete(type,index,name)}>Xóa</button></span></div>)}</div>
  </section>
}

export function SettingsPage(){
  const {units,setUnits,suppliers,setSuppliers,customers,setCustomers,account,setAccount}=useWarehouse()
  const [entityModal,setEntityModal]=useState(null),[deleting,setDeleting]=useState(null)
  const [password,setPassword]=useState(''),[confirmPassword,setConfirmPassword]=useState(''),[message,setMessage]=useState(null)
  const [showPassword,setShowPassword]=useState(false),[showConfirmPassword,setShowConfirmPassword]=useState(false)
  const config={unit:{title:'đơn vị tính',items:units,setItems:setUnits},supplier:{title:'nhà cung cấp',items:suppliers,setItems:setSuppliers},customer:{title:'khách hàng',items:customers,setItems:setCustomers}}
  const open=(type,index=null,value='')=>setEntityModal({type,index,value})
  const remove=()=>{const cfg=config[deleting.type];cfg.setItems((items)=>items.filter((_,i)=>i!==deleting.index));setDeleting(null)}
  const changePassword=async(event)=>{
    event.preventDefault()
    if(password.length<6){setMessage({error:true,text:'Mật khẩu phải có ít nhất 6 ký tự.'});return}
    if(password!==confirmPassword){setMessage({error:true,text:'Mật khẩu xác nhận không khớp.'});return}
    try{
      const bytes=new TextEncoder().encode(password)
      const digest=await crypto.subtle.digest('SHA-256',bytes)
      const passwordHash=Array.from(new Uint8Array(digest),(byte)=>byte.toString(16).padStart(2,'0')).join('')
      setAccount((current)=>({...current,passwordHash,passwordUpdatedAt:new Date().toISOString()}))
      setPassword('');setConfirmPassword('');setMessage({text:'Đổi mật khẩu thành công và đã lưu vào IndexedDB.'})
      setTimeout(()=>setMessage(null),3000)
    }catch{
      setMessage({error:true,text:'Không thể lưu mật khẩu trên trình duyệt này.'})
    }
  }
  return <main className="settings-page"><div className="settings-grid">
    <SettingList title="Đơn vị tính" type="unit" items={units} onOpen={open} onDelete={(type,index,name)=>setDeleting({type,index,name})}/>
    <section className="settings-card password-card"><header><h3>Đổi mật khẩu đăng nhập</h3></header><form onSubmit={changePassword}>
      <label><span>Tên đăng nhập hiện tại</span><input value={account.username} readOnly/></label><label><span>Mật khẩu mới</span><span className="password-input"><input type={showPassword?'text':'password'} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Nhập mật khẩu mới"/><button type="button" onClick={()=>setShowPassword((value)=>!value)} aria-label={showPassword?'Ẩn mật khẩu':'Hiện mật khẩu'}><Icon name="eye" size={18}/></button></span></label>
      <label><span>Xác nhận mật khẩu</span><span className="password-input"><input type={showConfirmPassword?'text':'password'} value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu mới"/><button type="button" onClick={()=>setShowConfirmPassword((value)=>!value)} aria-label={showConfirmPassword?'Ẩn mật khẩu':'Hiện mật khẩu'}><Icon name="eye" size={18}/></button></span></label>
      {message&&<p className={`password-message ${message.error?'error':''}`}>{message.text}</p>}<button className="change-password-button">Đổi mật khẩu</button></form></section>
    <SettingList title="Nhà cung cấp" type="supplier" items={suppliers} onOpen={open} onDelete={(type,index,name)=>setDeleting({type,index,name})}/>
    <SettingList title="Khách hàng" type="customer" items={customers} onOpen={open} onDelete={(type,index,name)=>setDeleting({type,index,name})}/>
  </div>
  {entityModal&&<SettingEntityModal title={`${entityModal.index===null?'Thêm':'Sửa'} ${config[entityModal.type].title}`} value={entityModal.value} onClose={()=>setEntityModal(null)} onSave={(name)=>{const cfg=config[entityModal.type];cfg.setItems((items)=>entityModal.index===null?[...items,name]:items.map((item,i)=>i===entityModal.index?name:item));setEntityModal(null)}}/>}
  {deleting&&<ConfirmDialog message={`Bạn có chắc muốn xóa “${deleting.name}”? Hành động này không thể hoàn tác.`} onCancel={()=>setDeleting(null)} onConfirm={remove}/>}
  </main>
}
