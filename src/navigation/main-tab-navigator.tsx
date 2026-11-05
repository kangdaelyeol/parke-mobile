import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { HomeScreen, ProfileScreen, SettingScreen } from '@/screens'
import { CardSettingProvider } from '@home/contexts'
import { Footer } from '@home/components'
import { MainTabParamList } from '@/navigation/types'

const Tab = createBottomTabNavigator<MainTabParamList>()

const renderTabBar = (props: BottomTabBarProps) => <Footer {...props} />

// 홈 · My · 설정을 오가는 동안 아래 유리 탭바(Footer)는 그대로 떠 있다.
// 탭바는 카드 수정 중에 숨어야 해서 카드 수정 상태(CardSettingProvider)를 탭 전체에 둔다
export default function MainTabNavigator() {
  return (
    <CardSettingProvider>
      <Tab.Navigator
        tabBar={renderTabBar}
        screenOptions={{
          headerShown: false,
          // 탭을 누르면 전환 효과 없이 바로 바꾼다
          animation: 'none',
          sceneStyle: { backgroundColor: 'black' },
        }}
      >
        <Tab.Screen name="HomeTab" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Setting" component={SettingScreen} />
      </Tab.Navigator>
    </CardSettingProvider>
  )
}
