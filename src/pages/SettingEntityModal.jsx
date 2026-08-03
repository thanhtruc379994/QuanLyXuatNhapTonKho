import {useState} from 'react'
import {Icon} from './Icon'
import './style/SettingEntityModal.css'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton } from '@mui/material'

export function SettingEntityModal({title,value='',onClose,onSave}){
  const [name,setName]=useState(value)
  const submit=(event)=>{event.preventDefault();if(name.trim())onSave(name.trim())}
  return <Dialog open onClose={onClose} fullWidth maxWidth="sm"><form onSubmit={submit}><DialogTitle sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>{title}<IconButton onClick={onClose}><Icon name="close"/></IconButton></DialogTitle><DialogContent><TextField autoFocus fullWidth label="Tên *" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nhập tên..." sx={{mt:1}}/></DialogContent><DialogActions sx={{p:2}}><Button onClick={onClose}>Hủy</Button><Button type="submit" variant="contained" disabled={!name.trim()}>Lưu</Button></DialogActions></form></Dialog>
}
