const source = [
  ['SP006', 'Sản phẩm 6', 'Cây', 4, 0, 4, 60000],
  ['SP012', 'Sản phẩm 12', 'Hộp', 4, 0, 3, 30000],
  ['SP007', 'Sản phẩm 7', 'Hộp', 5, 0, 3, 30000],
  ['SP003', 'Sản phẩm 3', 'Hộp', 8, 0, 0, 30000],
  ['SP008', 'Sản phẩm 8', 'Chai', 10, 0, 0, 30000],
  ['SP009', 'Sản phẩm 9', 'Hộp', 18, 4, 0, 30000],
  ['SP001', 'Sản phẩm 1', 'Chai', 6, 24, 7, 10000],
  ['SP002', 'Sản phẩm 2', 'Chai', 3, 27, 5, 20000],
  ['SP011', 'Sản phẩm 11', 'Hộp', 6, 23, 1, 30000],
  ['SP005', 'Sản phẩm 5', 'Hộp', 30, 0, 0, 20000],
  ['SP004', 'Sản phẩm 4', 'Hộp', 11, 25, 5, 10000],
  ['SP010', 'Sản phẩm 10', 'Hộp', 4, 34, 4, 30000],
]

export const stockInventory = source.map(([code, name, unit, opening, imported, exported, price]) => {
  const closing = opening + imported - exported
  return {
    code, name, unit, opening, imported, exported, closing, price,
    value: closing * price,
    status: closing === 0 ? 'Hết hàng' : closing <= 10 ? 'Sắp hết' : 'Bình thường',
  }
})
