import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Typography, Tooltip } from '@mui/material'
import { Icon } from './Icon'

const menuItems = [['home','Dashboard'],['box','Sản phẩm'],['download','Nhập kho'],['upload','Xuất kho'],['archive','Tồn kho'],['settings','Cài đặt']]

export function Sidebar({ collapsed, activePage, onNavigate, username, onLogout }) {
  return <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper': { width: collapsed ? 68 : 240, boxSizing: 'border-box', bgcolor: '#1A1E26', color: '#fff', transition: 'width .25s' } }}>
    <Box sx={{height:72,display:'flex',alignItems:'center',gap:1.5,px:2,color:'#E9C97C'}}><Icon name="box" size={27}/>{!collapsed&&<Typography fontWeight={700}>Nhập Xuất Tồn</Typography>}</Box>
    <Divider sx={{borderColor:'#303845'}}/>
    <List sx={{px:1,pt:2}}>{menuItems.map(([icon,label])=><Tooltip title={collapsed?label:''} placement="right" key={label}><ListItemButton selected={label===activePage} onClick={()=>onNavigate(label)} sx={{borderRadius:2,mb:.5,'&.Mui-selected':{bgcolor:'rgba(211,173,95,.16)',color:'#F4E4BE'},'&:hover':{bgcolor:'#303845'}}}><ListItemIcon sx={{minWidth:40,color:'inherit'}}><Icon name={icon} size={23}/></ListItemIcon>{!collapsed&&<ListItemText primary={label}/>}</ListItemButton></Tooltip>)}</List>
    <Box sx={{mt:'auto',p:1}}>{!collapsed&&<Typography variant="caption" sx={{display:'block',px:1,mb:1,color:'#C8CED8'}}>Đăng nhập: {username}</Typography>}<ListItemButton onClick={onLogout} sx={{borderRadius:2,'&:hover':{bgcolor:'#303845'}}}><ListItemIcon sx={{minWidth:40,color:'inherit'}}><Icon name="logout" size={22}/></ListItemIcon>{!collapsed&&<ListItemText primary="Đăng xuất"/>}</ListItemButton></Box>
  </Drawer>
}
