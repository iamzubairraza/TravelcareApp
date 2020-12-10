import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    TouchableOpacity,
    StyleSheet, FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Preference from 'react-native-preference'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment'


import Button from '../../../components/Button'
import InputField from '../../../components/InputField'
import images from '../../../assets/images'
import icons from '../../../assets/icons'
import colors from '../../../utils/colors';
import BackGround from '../../../components/HomeBackGround';
import Header from '../../../components/Header';

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';


export default class GroupTravel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            mainHeading: "Group Travel Promo",
            mainText: "All 27 reciepents",
            traveler: [{
                userImage: require('../../../assets/images/top_traveller.png'),
                userName: 'Kevin E.Parker',
                jobTitle: 'CNA',
                jobsDone: '80 jobs done',
                statusOffer: true,
                selected: false
            }, {
                userImage: require('../../../assets/images/top_traveller.png'),
                userName: 'Kevin E.Parker',
                jobTitle: 'CNA',
                jobsDone: '80 jobs done',
                statusOffer: true,
                selected: false
            }, {
                userImage: require('../../../assets/images/top_traveller.png'),
                userName: 'Kevin E.Parker',
                jobTitle: 'CNA',
                jobsDone: '80 jobs done',
                statusOffer: true,
                selected: false
            }, {
                userImage: require('../../../assets/images/top_traveller.png'),
                userName: 'Kevin E.Parker',
                jobTitle: 'CNA',
                jobsDone: '80 jobs done',
                statusOffer: false,
                selected: false
            },]
        }
    }

    componentDidMount() {
    }

    tarvelerBox = (item, index) => {
        const { navigation } = this.props
        return (
            <View style={styles.containerBox}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={{ height: 80, width: "100%" }}
                    onPress={() => {
                        navigation.navigate('OfferAcceptorDetailScreen')
                    }}>
                    <View style={{
                        flexDirection: 'row',
                        paddingBottom: 15
                    }}>
                        <View style={{
                            width: 80,
                            borderColor: item.statusOffer ? colors.green : colors.yellow,
                            height: 80,
                            alignItems: 'center',
                            borderRadius: 40,
                            borderWidth: 1
                        }}>
                            <Image source={item.userImage} style={{
                                width: 70,
                                height: 70,
                                resizeMode: 'contain',
                                borderRadius: 35
                            }} />
                        </View>
                        <View style={{
                            width: "70%",
                            height: 80,
                            justifyContent: 'center',
                            marginStart: 15,
                            //backgroundColor: "yellow"
                        }}>
                            <Text style={{
                                fontSize: 20,
                                color: colors.black,
                                width: '100%',
                                fontWeight: "bold"
                            }}>{item.userName}</Text>
                            <Text style={{
                                fontSize: 11,
                                width: '40%',
                                color: colors.primary
                            }}>{item.jobTitle}</Text>
                            <Text style={{
                                fontSize: 11,
                                width: '40%',
                                color: colors.grey
                            }}>{item.jobsDone}</Text>
                        </View>
                        <View style={{
                            width: 20,
                            height: 20,
                            position: 'absolute',
                            right: 0,
                            top: 30,
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
                    </View>

                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const { displayBottomSheet } = this.state
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <BackGround blueView={'30%'} whiteView={'80%'} />
                <Header
                    onLeftAction={() => {
                        navigation.goBack()
                    }}
                    leftIcon={icons.backArrow}
                    leftButtonIconStyle={{ tintColor: colors.white }}
                />
                <View style={{ flex: 1 }}>
                    <View style={{ height: 60, marginBottom: 20 }}>
                        <Text style={styles.hearderText}>{this.state.mainHeading}</Text>
                        <Text style={styles.hearderBelowText}>{this.state.mainText}</Text>
                    </View>
                    <FlatList
                        listKey={moment().format('x').toString()}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={this.state.traveler}
                        style={{ marginBottom: 10 }}
                        extraData={this.state}
                        keyExtractor={(item, index) => index}
                        numColumns={1}
                        renderItem={({ item, index }) => this.tarvelerBox(item, index)}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        alignItems: 'center'
    },
    containerBoxMain: {
        height: '100%',
        width: '100%',
        flexDirection: "column",
        //backgroundColor:'yellow'
    },
    containerBox: {
        backgroundColor: "white",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
        padding: 20,
        marginTop: 10,
        marginHorizontal: 15
    },
    bottomContainer: {
        width: '100%',
        height: 80,
        position: 'absolute',
        paddingHorizontal: 30,
        bottom: 0,
    },
    buttonTextStyle: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 14,
        color: colors.white,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: 'grey',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        borderRadius: 5,
        top: 10,
        right: 0,
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
        marginTop: 5
    }
});

