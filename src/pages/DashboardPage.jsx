import { Icon } from './Icon'
import './style/DashboardPage.css'
import { useWarehouse } from '../context/WarehouseContext'

const money=new Intl.NumberFormat('vi-VN')

function Panel({title,children,className=''}){return <section className={`dashboard-panel ${className}`}><h3>{title}</h3><div className="panel-content">{children}</div></section>}
function BarChart({groups=false,values,months}){
  const maxValue=Math.max(1,...values.flat())
  const series=groups?['Nhập','Xuất','Tồn']:['Số lượng']
  return <div className="bar-chart"><div className="chart-grid"/><div className="bars">{values.map((group,i)=><div className="bar-group" key={months[i]}>
    {group.map((value,j)=><i key={j} style={{height:`${Math.max(2,value/maxValue*92)}%`}} className={`bar-${j}`}/>)}
    <div className="group-tooltip"><strong>{months[i]}</strong>{group.map((value,j)=><span key={series[j]}><i className={`legend-${j}`}/>{series[j]}: <b>{value}</b></span>)}</div>
  </div>)}</div><div className="chart-labels">{months.map((m)=><span key={m}>{m}</span>)}</div></div>
}
function LineChart(){
  return <div className="line-chart"><div className="chart-grid"/><svg viewBox="0 0 500 145" preserveAspectRatio="none"><path d="M5 132 L40 133 L75 132 L110 133 L145 131 L180 132 L215 132 L250 131 L285 130 L320 132 L350 126 L370 112 L385 12 L400 86 L420 111 L445 126 L465 128 L485 70 L498 91" fill="none" stroke="#3675d3" strokeWidth="3"/><path d="M5 132 L40 133 L75 132 L110 133 L145 131 L180 132 L215 132 L250 131 L285 130 L320 132 L350 126 L370 112 L385 12 L400 86 L420 111 L445 126 L465 128 L485 70 L498 91 L498 140 L5 140Z" fill="rgba(54,117,211,.12)"/></svg></div>
}
function HorizontalBars({items}){const max=Math.max(1,...items.map(([,value])=>value));return <div className="horizontal-bars">{items.map(([label,value])=><div key={label}><span>{label}</span><i><b style={{width:`${Math.max(0,value)/max*100}%`}} className={`${value<3?'danger':''} chart-column`} data-tooltip={`${label} · Tồn kho: ${value}`}/></i><em>{value}</em></div>)}</div>}

export function DashboardPage(){
  const {products,inboundRows,outboundRows,stockRows}=useWarehouse()
  const revenue=outboundRows.reduce((sum,row)=>sum+Number(row.quantity||0)*Number(row.price||0),0)
  const outboundCost=outboundRows.reduce((sum,row)=>{
    const product=products.find((item)=>item.code===row.sku)
    return sum+Number(row.quantity||0)*Number(product?.importPrice||0)
  },0)
  const inventoryValue=stockRows.reduce((sum,row)=>sum+row.value,0)
  const activities=[...inboundRows].slice(0,3).map((row)=>[row.product,row.quantity,row.quantity*row.price,row.date])
  const warnings=stockRows.filter((row)=>row.closing<=10).sort((a,b)=>a.closing-b.closing).slice(0,5)
  const topStock=[...stockRows].sort((a,b)=>b.closing-a.closing).slice(0,6).map((row)=>[row.code,row.closing])
  const monthKeys=[...new Set([...inboundRows,...outboundRows].map((row)=>{
    const parts=String(row.date).split('/')
    return parts.length===3?`${parts[1].padStart(2,'0')}/${parts[2]}`:''
  }).filter(Boolean))].sort((a,b)=>{
    const [am,ay]=a.split('/').map(Number),[bm,by]=b.split('/').map(Number)
    return ay-by||am-bm
  }).slice(-6)
  while(monthKeys.length<6)monthKeys.unshift('—')
  const monthly=monthKeys.map((month)=>{
    const matches=(row)=>{const parts=String(row.date).split('/');return parts.length===3&&`${parts[1].padStart(2,'0')}/${parts[2]}`===month}
    const imported=inboundRows.filter(matches).reduce((sum,row)=>sum+Number(row.quantity||0),0)
    const exported=outboundRows.filter(matches).reduce((sum,row)=>sum+Number(row.quantity||0),0)
    return [imported,exported,Math.max(0,stockRows.reduce((sum,row)=>sum+row.closing,0))]
  })
  const outboundMonthly=monthly.map(([,exported])=>[exported])
  return <main className="dashboard-page">
    <div className="kpi-grid">
      <article className="kpi-card"><div className="kpi-icon"><Icon name="trend"/></div><div><strong>{money.format(revenue)}</strong><span>Tổng doanh thu</span><small>{outboundRows.length} dòng xuất kho</small></div></article>
      <article className="kpi-card"><div className="kpi-icon"><Icon name="dollar"/></div><div><strong>{money.format(revenue-outboundCost)}</strong><span>Lợi nhuận ước tính</span><small>Theo giá nhập sản phẩm</small></div></article>
      <article className="kpi-card"><div className="kpi-icon"><Icon name="shoppingBag"/></div><div><strong>{new Set(outboundRows.map((row)=>row.code)).size}</strong><span>Phiếu xuất kho</span><small>{outboundRows.reduce((sum,row)=>sum+Number(row.quantity||0),0)} sản phẩm đã xuất</small></div></article>
      <article className="kpi-card"><div className="kpi-icon"><Icon name="box"/></div><div><strong>{money.format(inventoryValue)}</strong><span>Giá trị tồn kho</span><small>{products.length} sản phẩm</small></div></article>
    </div>
    <div className="dashboard-layout"><div className="charts-grid">
      <Panel title="Nhập - Xuất - Tồn"><BarChart groups values={monthly} months={monthKeys}/></Panel>
      <Panel title="Số lượng xuất"><div className="combo-chart"><BarChart values={outboundMonthly} months={monthKeys}/></div></Panel>
      <Panel title="Xu hướng doanh thu"><LineChart/></Panel>
      <Panel title="Tỷ trọng sản phẩm"><div className="donut-wrap"><div className="donut"/><div className="donut-legend"><span>SP006</span><span>SP010</span><span>SP002</span><span>SP007</span><span>SP012</span></div></div></Panel>
      <Panel title="Diễn biến tồn kho"><div className="inventory-bars"><i className="chart-column" data-tooltip="Tồn đầu: 2.700.000 ₫" style={{height:'58%'}}/><i className="chart-column" data-tooltip="Giá trị nhập: 3.000.000 ₫" style={{height:'66%'}}/><i className="red chart-column" data-tooltip="Giá trị xuất: 1.000.000 ₫" style={{height:'25%'}}/><i className="chart-column" data-tooltip="Tồn cuối: 4.700.000 ₫" style={{height:'96%'}}/></div></Panel>
      <Panel title="So sánh tồn kho"><HorizontalBars items={topStock}/></Panel>
    </div><aside className="dashboard-side">
      <Panel title="Hoạt động gần đây" className="activity-panel">{activities.map(([name,quantity,value,date],index)=><div className="activity-item" key={`${name}-${index}`}><span className="activity-icon"><Icon name="download" size={18}/></span><div><strong>Nhập {quantity} {name}</strong><small>{date}</small></div><b>{money.format(value)} ₫</b></div>)}</Panel>
      <Panel title="Cảnh báo sản phẩm" className="warning-panel">{warnings.map((row)=><div className="warning-item" key={row.code}><div><strong>{row.name}</strong><small>{row.code}</small></div><b className={row.closing<=0?'empty':''}>{row.closing}<small>{row.closing<=0?'hết':'sắp hết'}</small></b></div>)}</Panel>
    </aside></div>
  </main>
}
