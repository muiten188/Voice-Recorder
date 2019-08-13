/**
 * Linearicons-Free icon set component.
 * Usage: <Linearicons-Free name="icon-name" size={20} color="#4F8EF7" />
 */

import createIconSet from 'react-native-vector-icons/lib/create-icon-set';
const glyphMap = {
    "home": 59392,
    "alarm": 59480,
    "cart": 59438,
    "pie-chart": 59458,
    "store": 59437,
    "chevron-right": 59510,
    "chevron-down": 59508,
    "checkmark-circle": 59519,
    "pencil": 59394,
    "chevron-left": 59509,
    "arrow-right": 59514
};

const iconSet = createIconSet(glyphMap, 'Linearicons-Free', 'Linearicons-Free.ttf');

export default iconSet;

export const Button = iconSet.Button;
export const TabBarItem = iconSet.TabBarItem;
export const TabBarItemIOS = iconSet.TabBarItemIOS;
export const ToolbarAndroid = iconSet.ToolbarAndroid;
export const getImageSource = iconSet.getImageSource;

