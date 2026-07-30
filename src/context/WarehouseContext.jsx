import { createContext, useContext, useMemo } from 'react'
import { useIndexedDBCollection } from '../hooks/useIndexedDBCollection'
import { initialProducts } from '../data/products'
import { inventoryReceipts } from '../data/inventoryReceipts'
import { outboundReceipts } from '../data/outboundReceipts'

const initialUnits = ['Chai', 'Hộp', 'Kg', 'Túi', 'Vỉ', 'Cái', 'Gói', 'Lọ', 'Miếng']
const initialSuppliers = Array.from({ length: 7 }, (_, index) => `Nhà cung cấp ${String(index + 1).padStart(2, '0')}`)
const initialCustomers = Array.from({ length: 7 }, (_, index) => `Khách hàng ${String(index + 1).padStart(2, '0')}`)
const initialAccount = { username: 'admin', passwordHash: '', passwordUpdatedAt: null }

const WarehouseContext = createContext(null)

function buildStock(products, inboundRows, outboundRows) {
  const inboundBySku = new Map()
  const outboundBySku = new Map()

  inboundRows.forEach((row) => inboundBySku.set(row.sku, (inboundBySku.get(row.sku) || 0) + Number(row.quantity || 0)))
  outboundRows.forEach((row) => outboundBySku.set(row.sku, (outboundBySku.get(row.sku) || 0) + Number(row.quantity || 0)))

  return products.map((product) => {
    const opening = Number(product.openingStock || 0)
    const imported = inboundBySku.get(product.code) || 0
    const exported = outboundBySku.get(product.code) || 0
    const closing = opening + imported - exported
    const price = Number(product.importPrice || 0)
    return {
      code: product.code,
      name: product.name,
      unit: product.unit,
      opening,
      imported,
      exported,
      closing,
      price,
      value: closing * price,
      status: closing <= 0 ? 'Hết hàng' : closing <= 10 ? 'Sắp hết' : 'Bình thường',
    }
  })
}

export function WarehouseProvider({ children }) {
  const [products, setProducts] = useIndexedDBCollection('products', initialProducts)
  const [inboundRows, setInboundRows] = useIndexedDBCollection('inboundReceipts', inventoryReceipts)
  const [outboundRows, setOutboundRows] = useIndexedDBCollection('outboundReceipts', outboundReceipts)
  const [units, setUnits] = useIndexedDBCollection('units', initialUnits)
  const [suppliers, setSuppliers] = useIndexedDBCollection('suppliers', initialSuppliers)
  const [customers, setCustomers] = useIndexedDBCollection('customers', initialCustomers)
  const [account, setAccount, accountState] = useIndexedDBCollection('account', initialAccount)

  const stockRows = useMemo(
    () => buildStock(products, inboundRows, outboundRows),
    [inboundRows, outboundRows, products],
  )

  const value = useMemo(() => ({
    products, setProducts,
    inboundRows, setInboundRows,
    outboundRows, setOutboundRows,
    units, setUnits,
    suppliers, setSuppliers,
    customers, setCustomers,
    account, setAccount,
    accountState,
    stockRows,
  }), [
    account, accountState, customers, inboundRows, outboundRows, products, stockRows, suppliers, units,
    setAccount, setCustomers, setInboundRows, setOutboundRows, setProducts, setSuppliers, setUnits,
  ])

  return <WarehouseContext.Provider value={value}>{children}</WarehouseContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWarehouse() {
  const context = useContext(WarehouseContext)
  if (!context) throw new Error('useWarehouse must be used inside WarehouseProvider')
  return context
}
