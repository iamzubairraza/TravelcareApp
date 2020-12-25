import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Preference from 'react-native-preference'

//Creating Instance of Stack
const Stack = createStackNavigator();

//Screens
import Splash from './screens/Splash'

//Stacks
import AuthStack from './screens/AuthStack'
import TravelAgencyStack from './screens/TravelAgencyStack'
import TravelerStack from './screens/TravelerStack'
import preferenceKeys from './utils/preferenceKeys';

//Constants
import {
    TRAVELER,
    COMPANY,
} from './utils/constants'

/** Main Stack of the app */
const MainStack = () => {
    let initialRouteName = 'Splash'
    const hassSession = Preference.get(preferenceKeys.HAS_SESSION)
    console.log('hassSession', hassSession)
    if (hassSession) {
        const Token = Preference.get(preferenceKeys.AUTH_TOKEN)
        const userType = Preference.get(preferenceKeys.USER_TYPE)
        // console.log('AUTH_TOKEN', Token)
        if (userType == COMPANY) initialRouteName = 'TravelAgencyStack'
        else if (userType == TRAVELER) initialRouteName = 'TravelerStack'
    }
    return (
        <Stack.Navigator headerMode="none" initialRouteName={initialRouteName}>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="AuthStack" component={AuthStack} />
            <Stack.Screen name="TravelAgencyStack" component={TravelAgencyStack} />
            <Stack.Screen name="TravelerStack" component={TravelerStack} />
        </Stack.Navigator>
    );
}

/** Theme will help to change app light mode to dark mode */
export default AppNavigator = () => {

    const MyTheme = {
        dark: false,
        colors: {
            primary: 'rgb(255, 45, 85)',
            background: 'rgb(255, 255, 255)',
            card: 'rgb(255, 255, 255)',
            text: 'rgb(28, 28, 30)',
            border: 'rgb(199, 199, 204)',
            notification: 'rgb(255, 69, 58)',
        },
    };

    return (
        <NavigationContainer theme={MyTheme}>
            <MainStack />
        </NavigationContainer>
    )
};
