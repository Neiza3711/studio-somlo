import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import CatalogStack from './CatalogStack';
import SearchScreen from '../screens/SearchScreen';
import CartStack  from './CartStack';
import FavoritesScreen from '../screens/FavoritesScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileStack from './ProfileStack';
import ArtistScreen from '../screens/ArtistScreen';
import CustomTabBar from './CustomTabBar';
import { AuthContext }  from '../contexts/AuthContext';


    const Tab = createBottomTabNavigator();
    export default function AppTabs() {
    const { user } = useContext(AuthContext);
    const isGuest = user?.isAnonymous;
    return (
        <Tab.Navigator
          tabBar={props => <CustomTabBar {...props} />}
          screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
 
    <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="Cart"
        component={CartStack} 
        options={{ tabBarButton: () => null }}
      />
      {/* Catálogo */}
      <Tab.Screen
        name="Catalog"
        component={CatalogStack}
        options={{ tabBarButton: () => null }}
      />
       
       {/* Pantalla de artista */}
      <Tab.Screen
        name="Artist"
        component={ArtistScreen}
        options={{ tabBarButton: () => null }}
      />
       {/* Solo para usuarios registrados */}
      {!isGuest && (
        <>
          <Tab.Screen name="Favorites" component={FavoritesScreen} />
          <Tab.Screen name="Profile" component={ProfileStack} />
        </>
      )}
    </Tab.Navigator>
  );
}

