

export const calculateDistance = (pointA, pointB) => {
  const R = 6371 // 地球の半径 (km)

  // 緯度と経度をラジアンに変換
  const lat1 = pointA.latitude * (Math.PI / 180)
  const lon1 = pointA.longitude * (Math.PI / 180)
  const lat2 = pointB.latitude * (Math.PI / 180)
  const lon2 = pointB.longitude * (Math.PI / 180)

  // 緯度と経度の差を計算
  const dLat = lat2 - lat1
  const dLon = lon2 - lon1

  // ハバースインの公式
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  // 距離を計算 (km)
  const distance = R * c
  return distance
}