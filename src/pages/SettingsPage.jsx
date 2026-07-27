import {useState} from 'react'
import {Icon} from './Icon'
import {ConfirmDialog} from './ConfirmDialog'
import {SettingEntityModal} from './SettingEntityModal'
import './style/SettingsPage.css'
import {useIndexedDBCollection} from '../hooks/useIndexedDBCollection'

const initialUnits=['Chai','Hộp','Kg','Túi','Vỉ','Cái','Gói','Lọ','Miếng']
const initialSuppliers=Array.from({length:7},(_,i)=>`Nhà cung cấp ${String(i+1).padStart(2,'0')}`)
const initialCustomers=Array.from({length:7},(_,i)=>`Khách hàng ${String(i+1).padStart(2,'0')}`)

function SettingList({title,type,items,onOpen,onDelete}){
  return <section className="settings-card"><header><h3>{title}</h3><button onClick={()=>onOpen(type)}><Icon name="plus" size={18}/>Thêm</button></header>
    <div className="settings-list">{items.map((name,index)=><div key={`${name}-${index}`}><span>{name}</span><span className="setting-row-actions"><button className="edit-setting" onClick={()=>onOpen(type,index,name)}>Sửa</button><button className="delete-setting" onClick={()=>onDelete(type,index,name)}>Xóa</button></span></div>)}</div>
  </section>
}

export function SettingsPage(){
  const [units,setUnits]=useIndexedDBCollection('units',initialUnits)
  const [suppliers,setSuppliers]=useIndexedDBCollection('suppliers',initialSuppliers)
  const [customers,setCustomers]=useIndexedDBCollection('customers',initialCustomers)
  const [entityModal,setEntityModal]=useState(null),[deleting,setDeleting]=useState(null)
  const [password,setPassword]=useState(''),[confirmPassword,setConfirmPassword]=useState(''),[message,setMessage]=useState(null)
  const config={unit:{title:'đơn vị tính',items:units,setItems:setUnits},supplier:{title:'nhà cung cấp',items:suppliers,setItems:setSuppliers},customer:{title:'khách hàng',items:customers,setItems:setCustomers}}
  const open=(type,index=null,value='')=>setEntityModal({type,index,value})
  const remove=()=>{const cfg=config[deleting.type];cfg.setItems((items)=>items.filter((_,i)=>i!==deleting.index));setDeleting(null)}
  const changePassword=(event)=>{event.preventDefault();if(password.length<6){setMessage({error:true,text:'Mật khẩu phải có ít nhất 6 ký tự.'});return}if(password!==confirmPassword){setMessage({error:true,text:'Mật khẩu xác nhận không khớp.'});return}setPassword('');setConfirmPassword('');setMessage({text:'Đổi mật khẩu thành công.'});setTimeout(()=>setMessage(null),3000)}
  return <main className="settings-page"><div className="settings-grid">
    <SettingList title="Đơn vị tính" type="unit" items={units} onOpen={open} onDelete={(type,index,name)=>setDeleting({type,index,name})}/>
    <section className="settings-card password-card"><header><h3>Đổi mật khẩu đăng nhập</h3></header><form onSubmit={changePassword}>
      <label><span>Tên đăng nhập hiện tại</span><input value="admin" readOnly/></label><label><span>Mật khẩu mới</span><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Nhập mật khẩu mới"/></label>
      <label><span>Xác nhận mật khẩu</span><input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu mới"/></label>
      {message&&<p className={`password-message ${message.error?'error':''}`}>{message.text}</p>}<button className="change-password-button">Đổi mật khẩu</button></form></section>
    <SettingList title="Nhà cung cấp" type="supplier" items={suppliers} onOpen={open} onDelete={(type,index,name)=>setDeleting({type,index,name})}/>
    <SettingList title="Khách hàng" type="customer" items={customers} onOpen={open} onDelete={(type,index,name)=>setDeleting({type,index,name})}/>
  </div>
  {entityModal&&<SettingEntityModal title={`${entityModal.index===null?'Thêm':'Sửa'} ${config[entityModal.type].title}`} value={entityModal.value} onClose={()=>setEntityModal(null)} onSave={(name)=>{const cfg=config[entityModal.type];cfg.setItems((items)=>entityModal.index===null?[...items,name]:items.map((item,i)=>i===entityModal.index?name:item));setEntityModal(null)}}/>}
  {deleting&&<ConfirmDialog message={`Bạn có chắc muốn xóa “${deleting.name}”? Hành động này không thể hoàn tác.`} onCancel={()=>setDeleting(null)} onConfirm={remove}/>}
  </main>
}
