import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ImageBackground,
    Alert,
    TouchableOpacity,
    StyleSheet, FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Preference from 'react-native-preference'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment'
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

import Button from '../../../components/Button'
import InputField from '../../../components/InputField'
import images from '../../../assets/images'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';
import BackGround from '../../../components/HomeBackGround';
import Header from '../../../components/Header';



export default class MyJobsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            mainHeading: "My Jobs",
            mainText: "My medical career",
            jobsList: [
                {
                    jobTitle: 'Chief of Surgery',
                    organization: 'Bulleford General Hospital',
                    startingDate: moment().subtract(1, 'year'),
                    endingDate: null,
                    department: 'Manage the organizational aspect of Department of Surgery'
                },
                {
                    jobTitle: 'Social Media Manager',
                    organization: 'Numford University Hospital',
                    startingDate: moment().subtract(3, 'year'),
                    endingDate: moment().subtract(2, 'year'),
                    department: 'Created dianostic and therapeutic plans for surgical patients'
                },
            ]
        }
    }

    componentDidMount() {

    }

    renderJobItem = (item, index) => {
        const { navigation } = this.props
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.jobItemStyle}
                onPress={() => {
                    if (item.jobTitle === 'Social Media Manager')
                        navigation.navigate('SocialMedia')
                }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, color: colors.black, fontWeight: "bold" }}>{item.jobTitle}</Text>
                    <Text style={{ fontSize: 11, color: colors.primary, marginTop: 5 }}>
                        {item.organization} | {moment(item.startingDate).format('MMM YYYY')} - {item.endingDate ? moment(item.endingDate).format('MMM YYYY') : 'Present'}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.mediumGrey, marginTop: 5 }}>{item.organization}</Text>
                </View>
                <View style={{
                    width: 20,
                    height: 20,
                    backgroundColor: colors.transparentGrey,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: 'center'
                }}>
                    <Image source={require('../../../assets/icons/right_arrow.png')} style={{
                        width: 10,
                        height: 10,
                        resizeMode: 'contain'
                    }} />
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        const { jobsList } = this.state
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <BackGround blueView={'20%'} whiteView={'80%'} />
                <Header
                    onLeftAction={() => {
                        navigation.goBack()
                    }}
                    leftIcon={icons.backArrow}
                    leftButtonIconStyle={{ tintColor: colors.white }}
                />
                <View style={{ height: 60 }}>
                    <Text style={styles.hearderText}>{this.state.mainHeading}</Text>
                    <Text style={styles.hearderBelowText}>{this.state.mainText}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        listKey={moment().format('x').toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={jobsList}
                        style={{ marginBottom: 0 }}
                        extraData={jobsList}
                        keyExtractor={(item, index) => index}
                        numColumns={1}
                        renderItem={({ item, index }) => {
                            return this.renderJobItem(item, index)
                        }}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.transparentGrey,
        // alignItems: 'center'
    },
    jobItemStyle: {
        backgroundColor: "white",
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        marginHorizontal: 15,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
    horizontalDivider: {
        flex: 1,
        backgroundColor: colors.mediumGrey,
        height: 1
    },
    hearderText: {
        width: '100%',
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.white,
        marginLeft: 40
    },
    hearderBelowText: {
        width: '80%',
        fontSize: 12,
        color: colors.white,
        marginLeft: 40,
        marginTop: 5,
    },
});

