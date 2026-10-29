import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {
  HomeScreen,
  OnBoardingScreen,
  InitScreen,
  LoginScreen,
  ProfileScreen,
  SettingScreen,
  ConsentSettingScreen,
  SearchBleScreen,
  ScanCompleteScreen,
  PermissionScreen,
  DriveScreen,
  DriveRecordsScreen,
  DriveRecordScreen,
  LegalDocScreen,
} from '@/screens'
import { RootStackParamList } from '@/navigation/types'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
      <Stack.Screen name="Permission" component={PermissionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Init" component={InitScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Setting" component={SettingScreen} />
      <Stack.Screen name="ConsentSetting" component={ConsentSettingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SearchBLE" component={SearchBleScreen} />
      <Stack.Screen name="ScanComplete" component={ScanCompleteScreen} />
      <Stack.Screen name="Drive" component={DriveScreen} />
      <Stack.Screen name="DriveRecords" component={DriveRecordsScreen} />
      <Stack.Screen name="DriveRecord" component={DriveRecordScreen} />
      {/* 법률 문서: 동의 시트·주행 화면 위로 뜨도록 모달로 표시 */}
      <Stack.Screen
        name="LegalDoc"
        component={LegalDocScreen}
        options={{ presentation: 'fullScreenModal' }}
      />
    </Stack.Navigator>
  )
}
