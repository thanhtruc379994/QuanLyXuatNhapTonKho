const source = [
  ['SP001', 'Sản phẩm 1', 'Chai', 10000, 13000, 6, '09/25: 10 · 10/25: 15', '9/8/2025', 'Đang bán'],
  ['SP010', 'Sản phẩm 10', 'Hộp', 30000, 39000, 4, '09/25: 3', '10/8/2025', 'Đang bán'],
  ['SP011', 'Sản phẩm 11', 'Hộp', 30000, 39000, 6, '', '10/8/2025', 'Đang bán'],
  ['SP012', 'Sản phẩm 12', 'Hộp', 30000, 39000, 4, '', '10/8/2025', 'Đang bán'],
  ['SP002', 'Sản phẩm 2', 'Chai', 20000, 26000, 3, '', '9/8/2025', 'Đang bán'],
  ['SP003', 'Sản phẩm 3', 'Hộp', 30000, 39000, 8, '', '9/8/2025', 'Đang bán'],
  ['SP004', 'Sản phẩm 4', 'Hộp', 10000, 13000, 11, '', '9/8/2025', 'Đang bán'],
  ['SP005', 'Sản phẩm 5', 'Hộp', 20000, 26000, 30, '', '9/8/2025', 'Đang bán'],
  ['SP006', 'Sản phẩm 6', 'Cây', 60000, 78000, 4, '', '9/8/2025', 'Đang bán'],
  ['SP007', 'Sản phẩm 7', 'Hộp', 30000, 39000, 5, '', '9/8/2025', 'Ngừng bán'],
  ['SP008', 'Sản phẩm 8', 'Chai', 25000, 33000, 9, '', '9/8/2025', 'Đang bán'],
]

export const initialProducts = source.map((item) => ({
  id: item[0], code: item[0], name: item[1], unit: item[2], importPrice: item[3],
  exportPrice: item[4], openingStock: item[5], quota: item[6], createdAt: item[7], status: item[8],
}))
