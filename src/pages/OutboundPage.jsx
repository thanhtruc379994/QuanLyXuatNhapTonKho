import {useMemo,useState} from 'react'
import {Icon} from './Icon'
import {ConfirmDialog} from './ConfirmDialog'
import {ReceiptActionModal} from './ReceiptActionModal'
import {OutboundModal} from './OutboundModal'
import {outboundReceipts} from '../data/outboundReceipts'
import {exportExcel,exportPdf,printWarehouseReceipt} from '../utils/exportInventory'
import './style/OutboundPage.css'
import {useIndexedDBCollection} from '../hooks/useIndexedDBCollection'

const money=new Intl.NumberFormat('vi-VN')
export function OutboundPage(){
  const [rows,setRows]=useIndexedDBCollection('outboundReceipts',outboundReceipts)
  const [query,setQuery]=useState(''),[product,setProduct]=useState('all')
  const [addOpen,setAddOpen]=useState(false),[selected,setSelected]=useState(null),[deleting,setDeleting]=useState(null)
  const filtered=useMemo(()=>rows.filter((row)=>(product==='all'||row.product===product)&&(!query.trim()||`${row.code} ${row.product} ${row.sku} ${row.customer}`.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')))),[product,query,rows])
  const productNames=[...new Set(rows.map((row)=>row.product))]
  const printable=filtered.map((r)=>({...r,supplier:r.customer}))
  const printRow=(row)=>printWarehouseReceipt({title:'PHIẾU XUẤT KHO',code:row.code,dateLabel:'Ngày xuất',date:row.date,partnerLabel:'Khách hàng',partner:row.customer,note:row.note,rows:[row],receiverLabel:'Người nhận hàng'})
  return <main className="page-content"><div className="toolbar"><label className="search-box"><Icon name="search" size={25}/><input placeholder="Tìm kiếm..." value={query} onChange={(e)=>setQuery(e.target.value)}/></label>
    <select className="product-filter" value={product} onChange={(e)=>setProduct(e.target.value)}><option value="all">Tất cả sản phẩm</option>{productNames.map((name)=><option key={name}>{name}</option>)}</select>
    <div className="toolbar-actions"><button className="outline-button" onClick={()=>exportExcel(printable,'danh-sach-xuat-kho.csv')}><Icon name="fileSpreadsheet"/>Excel</button><button className="outline-button" onClick={()=>exportPdf(printable,'DANH SÁCH XUẤT KHO')}><Icon name="file"/>PDF</button><button className="primary-button" onClick={()=>setAddOpen(true)}><Icon name="plus"/>Xuất kho</button></div></div>
    <div className="table-card"><div className="table-scroll"><table className="outbound-table"><thead><tr>{['Mã phiếu','Ngày xuất','Sản phẩm','Số lượng','Giá xuất','Thành tiền','Khách hàng'].map((label)=><th key={label}>{label}<span className="sort">↕</span></th>)}<th>Thao tác</th></tr></thead>
      <tbody>{filtered.map((row)=><tr key={row.id}><td className="receipt-code">{row.code}</td><td>{row.date}</td><td><strong>{row.product}</strong><small>{row.sku}</small></td><td className="number">{row.quantity}</td><td className="number">{money.format(row.price)} ₫</td><td className="number">{money.format(row.quantity*row.price)} ₫</td><td>{row.customer}</td>
        <td><div className="row-actions"><button className="table-action cyan" onClick={()=>printRow(row)}><Icon name="print"/></button><button className="table-action indigo" onClick={()=>setSelected({mode:'view',receipt:row})}><Icon name="eye"/></button><button className="table-action blue" onClick={()=>setSelected({mode:'edit',receipt:row})}><Icon name="edit"/></button><button className="table-action red" onClick={()=>setDeleting(row)}><Icon name="trash"/></button></div></td></tr>)}</tbody></table></div></div>
    {addOpen&&<OutboundModal onClose={()=>setAddOpen(false)} onSave={(items)=>{setRows((old)=>[...items,...old]);setAddOpen(false)}}/>}
    {selected&&<ReceiptActionModal transactionType="Xuất" mode={selected.mode} receipt={{...selected.receipt,supplier:selected.receipt.customer}} onClose={()=>setSelected(null)} onSave={(updated)=>{setRows((old)=>old.map((r)=>r.id===updated.id?{...updated,customer:updated.supplier}:r));setSelected(null)}}/>}
    {deleting&&<ConfirmDialog message={`Bạn có chắc muốn xóa ${deleting.product} khỏi phiếu ${deleting.code}?`} onCancel={()=>setDeleting(null)} onConfirm={()=>{setRows((old)=>old.filter((r)=>r.id!==deleting.id));setDeleting(null)}}/>}
  </main>
}
