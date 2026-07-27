import { Icon } from './Icon'
import './style/DashboardPage.css'

const months=['04/2025','05/2025','06/2025','07/2025','08/2025','09/2025']
const money=new Intl.NumberFormat('vi-VN')

function Panel({title,children,className=''}){return <section className={`dashboard-panel ${className}`}><h3>{title}</h3><div className="panel-content">{children}</div></section>}
function BarChart({groups=false}){
  const values=groups?[[0,0,0],[0,0,0],[0,0,0],[0,0,0],[5,12,92],[130,18,205]]:[[0],[0],[0],[0],[16],[150]]
  const series=groups?['Nhập','Xuất','Tồn']:['Số lượng']
  return <div className="bar-chart"><div className="chart-grid"/><div className="bars">{values.map((group,i)=><div className="bar-group" key={months[i]}>
    {group.map((value,j)=><i key={j} style={{height:`${Math.max(2,value/2.2)}%`}} className={`bar-${j}`}/>)}
    <div className="group-tooltip"><strong>{months[i]}</strong>{group.map((value,j)=><span key={series[j]}><i className={`legend-${j}`}/>{series[j]}: <b>{value}</b></span>)}</div>
  </div>)}</div><div className="chart-labels">{months.map((m)=><span key={m}>{m}</span>)}</div></div>
}
function LineChart(){
  return <div className="line-chart"><div className="chart-grid"/><svg viewBox="0 0 500 145" preserveAspectRatio="none"><path d="M5 132 L40 133 L75 132 L110 133 L145 131 L180 132 L215 132 L250 131 L285 130 L320 132 L350 126 L370 112 L385 12 L400 86 L420 111 L445 126 L465 128 L485 70 L498 91" fill="none" stroke="#3675d3" strokeWidth="3"/><path d="M5 132 L40 133 L75 132 L110 133 L145 131 L180 132 L215 132 L250 131 L285 130 L320 132 L350 126 L370 112 L385 12 L400 86 L420 111 L445 126 L465 128 L485 70 L498 91 L498 140 L5 140Z" fill="rgba(54,117,211,.12)"/></svg></div>
}
function HorizontalBars(){const items=[['SP004',34],['SP005',34],['SP001',30],['SP009',25],['SP008',10],['SP012',1]];return <div className="horizontal-bars">{items.map(([label,value])=><div key={label}><span>{label}</span><i><b style={{width:`${value/34*100}%`}} className={`${value<3?'danger':''} chart-column`} data-tooltip={`${label} · Tồn kho: ${value}`}/></i><em>{value}</em></div>)}</div>}

export function DashboardPage(){
  const activities=[['Sản phẩm 1',2,20000],['Sản phẩm 3',4,120000],['Sản phẩm 4',3,30000]]
  const warnings=[['Sản phẩm 6','SP006',0],['Sản phẩm 12','SP012',1],['Sản phẩm 7','SP007',2],['Sản phẩm 8','SP008',10],['Sản phẩm 3','SP003',8]]
  return <main className="dashboard-page">
    <div className="kpi-grid">
      <article className="kpi-card"><div className="kpi-icon"><Icon name="trend"/></div><div><strong>558.816</strong><span>Doanh thu tháng này</span><small className="positive">+72.4% so với tháng trước</small></div></article>
      <article className="kpi-card"><div className="kpi-icon"><Icon name="dollar"/></div><div><strong>-2.011.737</strong><span>Lợi nhuận tháng này</span><small className="negative">-794.4% so với tháng trước</small></div></article>
      <article className="kpi-card"><div className="kpi-icon"><Icon name="shoppingBag"/></div><div><strong>3</strong><span>Đơn hàng hôm nay</span><small className="positive">+0.0% so với hôm qua</small></div></article>
      <article className="kpi-card"><div className="kpi-icon"><Icon name="box"/></div><div><strong>4.267.222</strong><span>Giá trị tồn kho</span><small>10 sản phẩm</small></div></article>
    </div>
    <div className="dashboard-layout"><div className="charts-grid">
      <Panel title="Nhập - Xuất - Tồn"><BarChart groups/></Panel>
      <Panel title="Số lượng & Doanh thu"><div className="combo-chart"><BarChart/><svg viewBox="0 0 500 150" preserveAspectRatio="none"><polyline points="0,135 100,135 200,135 300,135 400,65 500,15" fill="none" stroke="#2dab79" strokeWidth="3"/></svg></div></Panel>
      <Panel title="Xu hướng doanh thu"><LineChart/></Panel>
      <Panel title="Tỷ trọng sản phẩm"><div className="donut-wrap"><div className="donut"/><div className="donut-legend"><span>SP006</span><span>SP010</span><span>SP002</span><span>SP007</span><span>SP012</span></div></div></Panel>
      <Panel title="Diễn biến tồn kho"><div className="inventory-bars"><i className="chart-column" data-tooltip="Tồn đầu: 2.700.000 ₫" style={{height:'58%'}}/><i className="chart-column" data-tooltip="Giá trị nhập: 3.000.000 ₫" style={{height:'66%'}}/><i className="red chart-column" data-tooltip="Giá trị xuất: 1.000.000 ₫" style={{height:'25%'}}/><i className="chart-column" data-tooltip="Tồn cuối: 4.700.000 ₫" style={{height:'96%'}}/></div></Panel>
      <Panel title="So sánh tồn kho"><HorizontalBars/></Panel>
    </div><aside className="dashboard-side">
      <Panel title="Hoạt động gần đây" className="activity-panel">{activities.map(([name,quantity,value])=><div className="activity-item" key={name}><span className="activity-icon"><Icon name="download" size={18}/></span><div><strong>Nhập {quantity} {name}</strong><small>15/9/2025</small></div><b>{money.format(value)} ₫</b></div>)}</Panel>
      <Panel title="Cảnh báo sản phẩm" className="warning-panel">{warnings.map(([name,code,stock])=><div className="warning-item" key={code}><div><strong>{name}</strong><small>{code}</small></div><b className={stock===0?'empty':''}>{stock}<small>{stock===0?'hết':'sắp hết'}</small></b></div>)}</Panel>
    </aside></div>
  </main>
}
