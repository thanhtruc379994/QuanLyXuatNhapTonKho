const DB_NAME = 'nhap-xuat-ton-kho'
const DB_VERSION = 2
const STORE_NAME = 'collections'

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = (event) => {
      const store = request.result.objectStoreNames.contains(STORE_NAME)
        ? request.transaction.objectStore(STORE_NAME)
        : request.result.createObjectStore(STORE_NAME)

      if (event.oldVersion > 0 && event.oldVersion < 2) {
        const productsRequest = store.get('products')
        productsRequest.onsuccess = () => {
          const products = productsRequest.result
          if (!Array.isArray(products) || products.some((product) => product.code === 'SP009')) return
          store.put([...products, {
            id: 'SP009', code: 'SP009', name: 'Sản phẩm 9', unit: 'Hộp',
            importPrice: 30000, exportPrice: 39000, openingStock: 18,
            quota: '', createdAt: '9/8/2025', status: 'Đang bán',
          }], 'products')
        }
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getCollection(key, fallbackValue) {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(key)
    request.onsuccess = () => {
      if (request.result === undefined) {
        store.put(fallbackValue, key)
        resolve(fallbackValue)
      } else resolve(request.result)
    }
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => database.close()
  })
}

export async function saveCollection(key, value) {
  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).put(value, key)
    transaction.oncomplete = () => { database.close(); resolve() }
    transaction.onerror = () => reject(transaction.error)
  })
}
