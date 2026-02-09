import { useOnBoardContext } from '@/contexts';
import {
  HomeScreen,
  OnBoardingScreen,
  InitScreen,
  LoginScreen,
} from '@/screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// ToDo => move to screens dir with renew
import SearchBLEScreen from '@/components/search-ble-screen';
import ScanComplete from '@/components/scan-complete-screen';
import SettingScreen from '@/components/setting-screen';

type RootStackParamList = {
  Home: undefined;
  OnBoarding: undefined;
  Init: undefined;
  Login: undefined;
  SearchBLE: undefined;
  ScanComplete: undefined;
  Setting: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { hasSeenOnBoarding } = useOnBoardContext();
  

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasSeenOnBoarding ? (
        <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
      ) : (
        <>
          <Stack.Screen name="Init" component={InitScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SearchBLE" component={SearchBLEScreen} />
          <Stack.Screen name="ScanComplete" component={ScanComplete} />
          <Stack.Screen name="Setting" component={SettingScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
