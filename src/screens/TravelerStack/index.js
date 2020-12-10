import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ScrollView
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, useIsDrawerOpen } from '@react-navigation/drawer';
import Preference from 'react-native-preference'

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

//Screens
import HomeScreen from './HomeScreen'
import ProfileSetting from '../AuthStack/SignUpScreen'
import MyJobsScreen from './MyJobsScreen'
import TravelCompaniesScreen from './TravelCompaniesScreen'
import TravelCompanyDetailsScreen from './TravelCompanyDetailsScreen'
import ReceivedOffersScreen from './ReceivedOffersScreen'
import ReceivedOfferDetailsScreen from './ReceivedOfferDetailsScreen'

//Utils
import images from '../../assets/images';
import colors from '../../utils/colors';
import { TRAVELER, COMPANY } from '../../utils/constants'
import preferenceKeys from '../../utils/preferenceKeys';

const DrawerItem = (props) => {
    return (
        <TouchableOpacity
            activeOpacity={0.5}
            style={[styles.drawerItemContainer, props.containerStyle]}
            onPress={() => {
                if (props.onPress && typeof props.onPress == 'function') props.onPress()
            }}>
            <Text style={[{ color: colors.mediumGrey }, props.titleStyle]}>{props.title}</Text>
        </TouchableOpacity>
    )
}

const CompanyDrawerContent = (props) => {
    const { navigation } = props
    const currentUser = Preference.get(preferenceKeys.CURRENT_USER)
    const { profileImage, name, userType, email, phoneNumber, selectedTypeOfOrganization, password } = currentUser

    const navigateTo = (key, params) => {
        navigation.closeDrawer();
        navigation.navigate(key, params)
    }

    return (
        <ScrollView
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.drawerContainer}>
                <View style={styles.profileImageContainerStyle}>
                    <Image
                        style={{ width: 110, height: 110, borderRadius: 55, resizeMode: 'cover' }}
                        source={profileImage ? { uri: profileImage.uri } : images.dummyProfile}
                    />
                </View>
                <Text style={{ color: colors.primary, fontSize: 18, fontWeight: 'bold' }}>{name}</Text>
                <Text style={{ color: colors.mediumGrey }}>{'Doctor'}</Text>
                <DrawerItem
                    title={'Profile Setting'}
                    onPress={() => {
                        navigateTo('ProfileSetting', {
                            email: email,
                            userType: userType,
                            isModeEdit: true,
                            name: name,
                            phoneNumber: phoneNumber,
                            selectedTypeOfOrganization: selectedTypeOfOrganization,
                            password: password
                        })
                    }}
                />
                <DrawerItem
                    title={'My Jobs'}
                    onPress={() => {
                        navigateTo('MyJobsScreen')
                    }}
                />
                <DrawerItem
                    title={'Travel Companies'}
                    onPress={() => {
                        navigateTo('TravelCompaniesScreen')
                    }}
                />
                <View style={{ flex: 1 }} />
                <DrawerItem
                    title={'Logout'}
                    titleStyle={{ color: colors.red }}
                    onPress={() => {
                        Preference.clear()
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'AuthStack' }],
                        });
                    }}
                />
            </View>
        </ScrollView>
    )
}

/** Travel Agency Stack of the app */
const TravelerDrawerStack = () => (
    <Drawer.Navigator
        drawerStyle={{ backgroundColor: colors.background }}
        headerMode="none"
        initialRouteName='HomeScreen'
        drawerContent={CompanyDrawerContent}>
        <Drawer.Screen name="HomeScreen" component={HomeScreen} />
    </Drawer.Navigator>
);

export default TravelerStack = () => (
    <Stack.Navigator
        headerMode="none"
        initialRouteName='TravelerDrawerStack'>
        <Stack.Screen name="TravelerDrawerStack" component={TravelerDrawerStack} />
        <Stack.Screen name="ProfileSetting" component={ProfileSetting} />
        <Stack.Screen name="MyJobsScreen" component={MyJobsScreen} />
        <Stack.Screen name="TravelCompaniesScreen" component={TravelCompaniesScreen} />
        <Stack.Screen name="TravelCompanyDetailsScreen" component={TravelCompanyDetailsScreen} />
        <Stack.Screen name="ReceivedOffersScreen" component={ReceivedOffersScreen} />
        <Stack.Screen name="ReceivedOfferDetailsScreen" component={ReceivedOfferDetailsScreen} />
    </Stack.Navigator>
);

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        backgroundColor: colors.background,
        paddingVertical: 70,
        alignItems: 'center',
        paddingHorizontal: 20
    },
    profileImageContainerStyle: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: 122,
        height: 122,
        padding: 10,
        borderRadius: 60,
        borderWidth: 1,
        borderColor: colors.primary,
        marginTop: 30,
        marginBottom: 20,
    },
    drawerItemContainer: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        marginTop: 10,
    }
})