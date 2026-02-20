import {
  HomeScreen,
  OnBoardingScreen,
  InitScreen,
  LoginScreen,
  ProfileScreen,
  SettingScreen,
  SearchBLEScreen,
  ScanCompleteScreen,
} from '@/screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
      <Stack.Screen name="ScanComplete" component={ScanCompleteScreen} />
      <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Init" component={InitScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="SearchBLE" component={SearchBLEScreen} />
      <Stack.Screen name="Setting" component={SettingScreen} />
    </Stack.Navigator>
  );
}
