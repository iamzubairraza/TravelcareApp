import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

//Screens
import HomeScreen from './HomeScreen'
import ProfileSetting from '../AuthStack/SignUpScreen'
import PaymentPlanScreen from '../AuthStack/PaymentPlanScreen'
import PaymentInfoScreen from '../AuthStack/PaymentInfoScreen'
import MyJobsScreen from './MyJobsScreen'
import TravelCompaniesScreen from './TravelCompaniesScreen'
import TravelCompanyDetailsScreen from './TravelCompanyDetailsScreen'
import ReceivedOffersScreen from './ReceivedOffersScreen'
import ReceivedOfferDetailsScreen from './ReceivedOfferDetailsScreen'
import SocialMedia from '../TravelAgencyStack/SocialMedia'

//Utils
import colors from '../../utils/colors';

//Components
import TravelerDrawerComponent from '../../components/TravelerDrawerComponent';

/** Traveler Drawer */
const TravelerDrawerStack = (props) => (
    <Drawer.Navigator
        drawerStyle={{ backgroundColor: colors.background }}
        headerMode="none"
        initialRouteName='HomeScreen'
        drawerContent={(props) => <TravelerDrawerComponent {...props} />}>
        <Drawer.Screen name="HomeScreen" component={HomeScreen} />
    </Drawer.Navigator>
);

/** Traveler Stack */
export default TravelerStack = () => (
    <Stack.Navigator
        headerMode="none"
        initialRouteName='TravelerDrawerStack'>
        <Stack.Screen name="TravelerDrawerStack" component={TravelerDrawerStack} />
        <Stack.Screen name="ProfileSetting" component={ProfileSetting} />
        <Stack.Screen name="PaymentPlanScreen" component={PaymentPlanScreen} />
        <Stack.Screen name="PaymentInfoScreen" component={PaymentInfoScreen} />
        <Stack.Screen name="MyJobsScreen" component={MyJobsScreen} />
        <Stack.Screen name="TravelCompaniesScreen" component={TravelCompaniesScreen} />
        <Stack.Screen name="TravelCompanyDetailsScreen" component={TravelCompanyDetailsScreen} />
        <Stack.Screen name="ReceivedOffersScreen" component={ReceivedOffersScreen} />
        <Stack.Screen name="ReceivedOfferDetailsScreen" component={ReceivedOfferDetailsScreen} />
        <Stack.Screen name="SocialMedia" component={SocialMedia} />
    </Stack.Navigator>
);