import { useState } from 'react'
import { Icon } from './Icon'
import './style/OutboundModal.css'
import { useWarehouse } from '../context/WarehouseContext'
const localDateTime=()=>{const now=new Date();now.setMinutes(now.getMinutes()-now.getTimezoneOffset());return now.toISOString().slice(0,16)}

export function OutboundModal({onClose,onSave}){
  const {products:allProducts,customers,stockRows}=useWarehouse()
  const products=allProducts.filter((product)=>product.status==='Đang bán').map((product)=>({
    ...product,sku:product.code,price:product.exportPrice,
    stock:stockRows.find((row)=>row.code===product.code)?.closing||0,
  }))
  const newLine=()=>({key:`${Date.now()}-${Math.random()}`,productIndex:0,quantity:1,price:products[0]?.price||0})
  const [customer,setCustomer]=useState('')
  const [note,setNote]=useState('')
  const [outboundDate,setOutboundDate]=useState(localDateTime)
  const [lines,setLines]=useState(()=>products.length?[newLine()]:[])
  const update=(key,field,value)=>setLines((items)=>items.map((line)=>{
    if(line.key!==key)return line
    if(field==='productIndex'){const productIndex=Number(value);return{...line,productIndex,price:products[productIndex].price}}
    return{...line,[field]:Math.max(0,Number(value))}
  }))
  const save=()=>{
    const invalid=lines.some((line)=>line.quantity>products[line.productIndex].stock)
    if(invalid)return
    const now=new Date(outboundDate),code=`XK${outboundDate.slice(0,10).replaceAll('-','')}_${String(Date.now()).slice(-3)}`
    onSave(lines.map((line,index)=>({id:Date.now()+index,code,date:now.toLocaleDateString('vi-VN'),product:products[line.productIndex].name,
      sku:products[line.productIndex].sku,quantity:line.quantity,price:line.price,customer,note})))
  }
  const hasError=lines.some((line)=>line.quantity>products[line.productIndex].stock)
  return <div className="modal-backdrop" onMouseDown={(e)=>e.target===e.currentTarget&&onClose()}>
    <section className="stock-modal outbound-modal"><header className="modal-header"><h2>Xuất kho</h2><button className="modal-close" onClick={onClose}><Icon name="close"/></button></header>
      <div className="modal-body"><div className="form-grid"><label><span>Ngày xuất</span><input type="datetime-local" value={outboundDate} onChange={(e)=>setOutboundDate(e.target.value)}/></label>
        <label><span>Khách hàng</span><select value={customer} onChange={(e)=>setCustomer(e.target.value)}><option value="">Chọn khách hàng</option>{customers.map((name)=><option key={name}>{name}</option>)}</select></label></div>
        <label className="products-label">Sản phẩm *</label><div className="product-editor">
          <div className="product-editor-head"><span>Sản phẩm</span><span>Số lượng</span><span>Giá xuất</span><span>Thành tiền</span><span/></div>
          {lines.map((line)=>{const product=products[line.productIndex],remaining=product.stock-line.quantity,error=remaining<0;return <div className="outbound-line-wrap" key={line.key}>
            <div className="product-line"><select value={line.productIndex} onChange={(e)=>update(line.key,'productIndex',e.target.value)}>{products.map((p,i)=><option value={i} key={p.sku}>{p.name} ({p.sku})</option>)}</select>
              <input type="number" min="0" value={line.quantity} onChange={(e)=>update(line.key,'quantity',e.target.value)}/><input type="number" min="0" value={line.price} onChange={(e)=>update(line.key,'price',e.target.value)}/><input readOnly value={line.quantity*line.price}/>
              <button className="remove-product" onClick={()=>setLines((items)=>items.filter((item)=>item.key!==line.key))}><Icon name="trash" size={19}/></button></div>
            <div className={`stock-hint ${error?'error':''}`}><span>Tồn kho hiện tại: {product.stock}</span><span>Còn lại: {remaining}</span></div>
          </div>})}
          <button className="add-product" disabled={!products.length} onClick={()=>setLines((items)=>[...items,newLine()])}><Icon name="plus" size={20}/>Thêm sản phẩm</button>
        </div><label className="note-field"><span>Ghi chú</span><textarea value={note} onChange={(e)=>setNote(e.target.value)}/></label></div>
      <footer className="modal-footer"><button className="cancel-button" onClick={onClose}>Hủy</button><button className="save-button" disabled={!lines.length||hasError||!outboundDate} onClick={save}>Lưu</button></footer>
    </section></div>
}
