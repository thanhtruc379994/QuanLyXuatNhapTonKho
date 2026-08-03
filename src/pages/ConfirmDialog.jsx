import './style/ConfirmDialog.css'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'

export function ConfirmDialog({
                                  title = 'Xác nhận xóa',
                                  message,
                                  onCancel,
                                  onConfirm,
                              }) {
    return <Dialog open onClose={onCancel} maxWidth="xs" fullWidth><DialogTitle>{title}</DialogTitle><DialogContent><Typography color="text.secondary">{message}</Typography></DialogContent><DialogActions sx={{p:2}}><Button onClick={onCancel}>Hủy</Button><Button color="error" variant="contained" onClick={onConfirm}>Xóa</Button></DialogActions></Dialog>
}
