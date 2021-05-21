import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    StyleSheet,
    ScrollView
} from 'react-native';
import Preference from 'react-native-preference'

//Utils
import colors from '../utils/colors';
import images from '../assets/images';
import preferenceKeys from '../utils/preferenceKeys';

//Components
import DrawerItem from './DrawerItem';

import { requestGetWithToken, API } from '../utils/API'
import { TRAVELER } from '../utils/constants';

export default class CompanyDrawerContent extends Component {
    constructor(props) {
        super(props)

        const currentUser = Preference.get(preferenceKeys.CURRENT_USER)

        this.state = {
            loadingOnLogout: false,
            currentUser: currentUser
        }
    }

    componentDidMount() {
        const { navigation } = this.props
        this.onFocusListener = navigation.addListener('focus', () => {
            const currentUser = Preference.get(preferenceKeys.CURRENT_USER)
            this.setState({ currentUser })
        });
    }

    componentWillUnmount() {
        if (this.onFocusListener) this.onFocusListener = null
    }

    navigateTo = (key, params) => {
        const { navigation } = this.props
        navigation.closeDrawer();
        navigation.navigate(key, params)
    }

    onLogoutPress = () => {
        // Preference.clear()
        const { navigation } = this.props
        this.setState({ loadingOnLogout: true })
        requestGetWithToken(API.LOGOUT).then((response) => {
            this.setState({ loadingOnLogout: false })
            if (response.status == 200) {
                Preference.clear()
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'AuthStack' }],
                });
            } else {
                Alert.alert(null, response.message)
            }
        }).catch(() => {
            this.setState({ loadingOnLogout: false })
            Alert.alert(null, 'Something went wrong')
        })
    }

    render() {
        const { navigation } = this.props
        const { currentUser, loadingOnLogout } = this.state
        const { image, name, services, service } = currentUser
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
                            source={image ? { uri: image } : images.user}
                        />
                    </View>
                    <Text style={{ color: colors.primary, fontSize: 18, fontWeight: 'bold' }}>{name}</Text>
                    <Text style={{ color: colors.mediumGrey }}>
                        {Array.isArray(services) ? services[0]?.name : service}
                    </Text>
                    <DrawerItem
                        title={'Profile Setting'}
                        onPress={() => {
                            this.navigateTo('ProfileSetting', { isModeEdit: true, userType: TRAVELER })
                        }}
                    />
                    <DrawerItem
                        title={'My Jobs'}
                        onPress={() => {
                            this.navigateTo('MyJobsScreen')
                        }}
                    />
                    <DrawerItem
                        title={'Travel Companies'}
                        onPress={() => {
                            this.navigateTo('TravelCompaniesScreen')
                        }}
                    />
                    <DrawerItem
                        title={'Reviews'}
                        onPress={() => {
                            this.navigateTo('ReviewsScreen')
                        }}
                    />
                    <View style={{ flex: 1 }} />
                    <DrawerItem
                        loading={loadingOnLogout}
                        containerStyle={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}
                        titleStyle={{ color: colors.red }}
                        title={'Logout'}
                        onPress={() => {
                            this.onLogoutPress()
                        }}
                    />
                </View>
            </ScrollView>
        )
    }
}

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
    }
})