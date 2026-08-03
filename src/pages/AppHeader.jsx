import { Icon } from './Icon'
import './style/AppHeader.css'
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar } from '@mui/material'

export function AppHeader({ onMenuClick, title, username }) {
  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{borderBottom:'1px solid #E7E0D4'}}><Toolbar sx={{justifyContent:'space-between'}}>
      <div className="page-title">
        <IconButton onClick={onMenuClick} aria-label="Thu gọn menu">
          <Icon name="menu" size={26} />
        </IconButton><Typography variant="h5" fontWeight={700}>{title}</Typography>
      </div>
      <Box sx={{display:'flex',alignItems:'center',gap:1,color:'#5B6470'}}>
        {/*<button className="icon-button refresh-button" type="button" aria-label="Làm mới trang" onClick={() => window.location.reload()}>*/}
        {/*  <Icon name="refresh" size={25} />*/}
        {/*</button>*/}
        <span>Xin chào, {username}</span>
        <Avatar sx={{width:32,height:32,bgcolor:'#D3AD5F',color:'#1A1E26'}}><Icon name="user" size={20}/></Avatar></Box>
    </Toolbar></AppBar>
  )
}
