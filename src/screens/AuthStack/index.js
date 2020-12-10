import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

//Screens
import LoginScreen from './LoginScreen'
import ForgotPasswordScreen from './ForgotPasswordScreen'
import VerificationScreen from './VerificationScreen'
import SetupNewPasswordScreen from './SetupNewPasswordScreen'
import SignUpScreen from './SignUpScreen'
import PaymentPlanScreen from './PaymentPlanScreen'
import PaymentInfoScreen from './PaymentInfoScreen'

/** Auth Stack of the app */
export default AuthStack = () => (
    <Stack.Navigator headerMode="none" initialRouteName='LoginScreen'>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
        <Stack.Screen name="SetupNewPasswordScreen" component={SetupNewPasswordScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="PaymentPlanScreen" component={PaymentPlanScreen} />
        <Stack.Screen name="PaymentInfoScreen" component={PaymentInfoScreen} />
        
    </Stack.Navigator>
);