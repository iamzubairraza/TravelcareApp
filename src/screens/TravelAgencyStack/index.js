import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

//Screens
import HomeScreen from './HomeScreen'
import TravelerListScreen from './TravelerListScreen'
import AcceptedListScreen from './AcceptedListScreen'
import ProfileSetting from '../AuthStack/SignUpScreen'
import PaymentPlanScreen from '../AuthStack/PaymentPlanScreen'
import PaymentInfoScreen from '../AuthStack/PaymentInfoScreen'
import OfferAcceptorDetailScreen from './OfferAcceptorDetailScreen'
import ManageOffersScreen from './ManageOffersScreen'
import NewOfferScreen from './NewOfferScreen'
import AllJobsScreen from './AllJobsScreen'
import OfferRecipientsScreen from './OfferRecipientsScreen'
import JobDetailsScreen from './JobDetailsScreen'

//Utils
import colors from '../../utils/colors';

//Components
import TravelAgencyDrawerComponent from '../../components/TravelAgencyDrawerComponent';

/** Travel Agency Drawer */
const TravelAgencyDrawerStack = () => (
    <Drawer.Navigator
        drawerStyle={{ backgroundColor: colors.background }}
        headerMode="none"
        initialRouteName='HomeScreen'
        drawerContent={(props) => <TravelAgencyDrawerComponent {...props} />}>
        <Drawer.Screen name="HomeScreen" component={HomeScreen} />
    </Drawer.Navigator>
);

/** Travel Agency Stack */
export default TravelAgencyStack = () => (
    <Stack.Navigator
        headerMode="none"
        initialRouteName='TravelAgencyDrawerStack'>
        <Stack.Screen name="TravelAgencyDrawerStack" component={TravelAgencyDrawerStack} />
        <Stack.Screen name="TravelerListScreen" component={TravelerListScreen} />
        <Stack.Screen name="AcceptedListScreen" component={AcceptedListScreen} />
        <Stack.Screen name="ProfileSetting" component={ProfileSetting} />
        <Stack.Screen name="PaymentPlanScreen" component={PaymentPlanScreen} />
        <Stack.Screen name="PaymentInfoScreen" component={PaymentInfoScreen} />
        <Stack.Screen name="OfferAcceptorDetailScreen" component={OfferAcceptorDetailScreen} />
        <Stack.Screen name="ManageOffersScreen" component={ManageOffersScreen} />
        <Stack.Screen name="NewOfferScreen" component={NewOfferScreen} />
        <Stack.Screen name="AllJobsScreen" component={AllJobsScreen} />
        <Stack.Screen name="OfferRecipientsScreen" component={OfferRecipientsScreen} />
        <Stack.Screen name="JobDetailsScreen" component={JobDetailsScreen} />
    </Stack.Navigator>
);