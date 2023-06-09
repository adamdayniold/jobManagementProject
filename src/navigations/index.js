import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoginScreen from "../screens/login";
import RegisterScreen from "../screens/register";
import UserDashboardScreen from "../screens/dashboard/user";
import AdminDashboardScreen from "../screens/dashboard/admin";
import ConstructorDashboardScreen from "../screens/dashboard/constructor";
import EmployeeDashboardScreen from "../screens/dashboard/employee";
import ManageUserScreen from "../screens/manage/user";
import ManageZoneScreen from "../screens/manage/zone";
import ManagePICScreen from "../screens/manage/pic";
import UsersListScreen from "../screens/list/users";
import ZonesListScreen from "../screens/list/zone";
import PICListScreen from "../screens/list/pic";
import ArchiveZonesListScreen from "../screens/archive/zone";

import AdminUserDashboardScreen from "../screens/dashboard/admin/user";
import AdminZoneDashboardScreen from "../screens/dashboard/admin/zone";

import ConstructorUserDashboardScreen from "../screens/dashboard/constructor/user";
import ConstructorZoneDashboardScreen from "../screens/dashboard/constructor/zone";

import { Icon } from "@rneui/themed";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { Navigator, Screen } = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Navigator
      initialRouteName="Login"
      screenOptions={{ headerTintColor: '#9A6BA0', headerTitleStyle: { fontWeight: 'bold' } }}
    >
      <Screen name="Login" component={LoginScreen} options={{ headerShown: false }}></Screen>
      <Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}></Screen>
      <Screen name="UserDashboard" component={UserDashboardScreen} options={{ headerTitle: 'Dashboard', headerBackVisible: false, headerTitleAlign: 'center' }}></Screen>
      <Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ headerTitle: 'Admin', headerBackVisible: false, headerTitleAlign: 'center' }}></Screen>
      <Screen name="ConstructorDashboard" component={ConstructorDashboardScreen} options={{ headerTitle: 'Constructor', headerBackVisible: false, headerTitleAlign: 'center' }}></Screen>
      <Screen name="EmployeeDashboard" component={EmployeeDashboardScreen} options={{ headerTitle: 'Employee', headerBackVisible: false, headerTitleAlign: 'center' }}></Screen>
      <Screen name="ZoneCreation" component={ManageZoneScreen} options={{ headerTitle: 'Manage Event', headerBackVisible: true, headerTitleAlign: 'center' }} ></Screen>
      <Screen name="UserCreation" component={ManageUserScreen} options={{ headerTitle: 'Manage User', headerBackVisible: true, headerTitleAlign: 'center' }} ></Screen>
      <Screen name="PICCreation" component={ManagePICScreen} options={{ headerTitle: 'Manage PIC', headerBackVisible: true, headerTitleAlign: 'center' }}></Screen>
      <Screen name="UsersList" component={UsersListScreen} options={{ headerTitle: 'Users List', headerBackVisible: true, headerTitleAlign: 'center' }}></Screen>
      <Screen name="ZonesList" component={ZonesListScreen} options={{ headerTitle: 'Events List', headerBackVisible: true, headerTitleAlign: 'center' }}></Screen>
      <Screen name="PICList" component={PICListScreen} options={{ headerTitle: 'PIC List', headerBackVisible: true, headerTitleAlign: 'center' }}></Screen>
      <Screen name="ArchiveZone" component={ArchiveZonesListScreen} options={{ headerTitle: 'Archived Events', headerBackVisible: true, headerTitleAlign: 'center' }}></Screen>
    </Navigator>
  </NavigationContainer>
)

const AdminNavigator = () => (
  <Tab.Navigator
    screenOptions={{ tabBarActiveTintColor: '#570861' }}
  >
    <Tab.Screen name="Users" component={AdminUserDashboardScreen} options={{ headerTitleAlign: 'center', tabBarIcon: ({ color }) => (<FontAwesome raised name="user" color={color} />) }} />
    <Tab.Screen name="Zone" component={AdminZoneDashboardScreen} options={{ headerTitleAlign: 'center', tabBarIcon: ({ color }) => (<FontAwesome raised name="map" color={color} />) }} />
  </Tab.Navigator>
)

const ConstructorNavigator = () => (
  <Tab.Navigator
    screenOptions={{ tabBarActiveTintColor: '#570861' }}
  >
    <Tab.Screen name="Users" component={ConstructorUserDashboardScreen} options={{ headerTitleAlign: 'center', tabBarIcon: ({ color }) => (<FontAwesome raised name="user" color={color} />) }} />
    <Tab.Screen name="Zone" component={ConstructorZoneDashboardScreen} options={{ headerTitleAlign: 'center', tabBarIcon: ({ color }) => (<FontAwesome raised name="map" color={color} />) }} />
  </Tab.Navigator>
)

export default AppNavigator;