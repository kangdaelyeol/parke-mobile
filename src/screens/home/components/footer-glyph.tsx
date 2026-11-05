import { HomeFooterIconProps } from '@home/types'
import {
  HomeIllustration,
  MyIllustration,
  QrIllustration,
  SettingIllustration,
} from './illustrations'

interface FooterGlyphProps {
  iconName: HomeFooterIconProps['iconName']
  iconSize: number
  color: string
}

// 탭바 아이콘 그림 (두 테마 공통)
export const FooterGlyph = ({
  iconName,
  iconSize,
  color,
}: FooterGlyphProps) => {
  switch (iconName) {
    case 'house':
      return (
        <HomeIllustration width={iconSize} height={iconSize} color={color} />
      )
    case 'user':
      return <MyIllustration width={iconSize} height={iconSize} color={color} />
    case 'qrcode':
      return <QrIllustration width={iconSize} height={iconSize} color={color} />
    case 'gear':
      return (
        <SettingIllustration width={iconSize} height={iconSize} color={color} />
      )
  }
}
