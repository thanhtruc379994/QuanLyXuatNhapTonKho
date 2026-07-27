import {useState} from 'react'
import {Icon} from './Icon'
import './style/SettingEntityModal.css'

export function SettingEntityModal({title,value='',onClose,onSave}){
  const [name,setName]=useState(value)
  const submit=(event)=>{event.preventDefault();if(name.trim())onSave(name.trim())}
  return <div className="modal-backdrop" onMouseDown={(e)=>e.target===e.currentTarget&&onClose()}>
    <form className="setting-entity-modal" onSubmit={submit}><header className="modal-header"><h2>{title}</h2><button type="button" className="modal-close" onClick={onClose}><Icon name="close"/></button></header>
      <div className="setting-entity-body"><label><span>Tên *</span><input autoFocus value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nhập tên..."/></label></div>
      <footer className="modal-footer"><button type="button" className="cancel-button" onClick={onClose}>Hủy</button><button className="save-button" disabled={!name.trim()}>Lưu</button></footer>
    </form></div>
}
