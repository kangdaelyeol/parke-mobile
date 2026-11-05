import { ComponentProps } from 'react'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'

// FontAwesome6 solid 아이콘 이름
export type SolidIconName = Extract<
  ComponentProps<typeof FontAwesome6>,
  { iconStyle: 'solid' }
>['name']
