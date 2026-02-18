import {
  HomeScreen,
  OnBoardingScreen,
  InitScreen,
  LoginScreen,
  ProfileScreen,
  SettingScreen,
  SearchBLEScreen,
} from '@/screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// ToDo => move to screens dir with renew
import ScanComplete from '@/components/scan-complete-screen';

type RootStackParamList = {
  Home: undefined;
  OnBoarding: undefined;
  Init: undefined;
  Login: undefined;
  SearchBLE: undefined;
  ScanComplete: undefined;
  Setting: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Init" component={InitScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="SearchBLE" component={SearchBLEScreen} />
      <Stack.Screen name="ScanComplete" component={ScanComplete} />
      <Stack.Screen name="Setting" component={SettingScreen} />
    </Stack.Navigator>
  );
}
