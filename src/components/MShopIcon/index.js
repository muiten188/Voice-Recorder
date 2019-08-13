/**
 * mshop icon set component.
 * Usage: <mshop name="icon-name" size={20} color="#4F8EF7" />
 */

import createIconSet from 'react-native-vector-icons/lib/create-icon-set';
const glyphMap = {
  "add-image": 59660,
  "deal": 59661,
  "delete": 59662,
  "home": 59663,
  "image": 59664,
  "location": 59665,
  "noti": 59666,
  "qrcode": 59667,
  "report": 59668,
  "sale": 59669,
  "scan": 59670,
  "setting": 59671,
  "shop": 59672,
  "an-uong": 59648,
  "cua-hang-tien-ich": 59649,
  "dien-thoai-may-tinh-bang": 59650,
  "dien-tu-dien-lanh": 59651,
  "do-choi-me-be": 59652,
  "laptop-may-tinh": 59653,
  "may-anh-may-quay": 59654,
  "my-pham-lam-dep": 59655,
  "nha-cua-do-gia-dung": 59656,
  "oto-xe-may-xe-dap": 59657,
  "thiet-bi-so-phu-kien": 59658,
  "thoi-trang": 59659
};

const iconSet = createIconSet(glyphMap, 'mshop', 'mshop.ttf');

export default iconSet;

export const Button = iconSet.Button;
export const TabBarItem = iconSet.TabBarItem;
export const TabBarItemIOS = iconSet.TabBarItemIOS;
export const ToolbarAndroid = iconSet.ToolbarAndroid;
export const getImageSource = iconSet.getImageSource;

