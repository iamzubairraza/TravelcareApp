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

export default class SocialMedia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            title: 'Social Media Manager',
            posted: 'Posted 02/10/2020',
            textTile: "We're looking for topnotch social media manager who is creative, has great and interesting writing skill, and love work cross a team to amplify the Xcompany brand.",
            mainData: [
                {
                    title: 'What you will be doing',
                    points: [
                        {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        },

                    ]
                },
                {
                    title: 'What will help you to be successfull:',
                    points: [
                        {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        }, {
                            text: 'Making digital campaigns come to life accross all platform'
                        },
                    ]
                }
            ]

        }
    }

    componentDidMount() {
    }

    renderPoints = (item, index) => {
        return (
            <View style={{ width: "100%", flexDirection: "column", justifyContent: "center" }}>
                <Text style={{ fontSize: 14, color: colors.black, marginTop: 5 }}>{item.title}</Text>
                <FlatList
                    listKey={moment().format('x').toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={item.points}
                    
                    extraData={this.state}
                    keyExtractor={(item, index) => index}
                    numColumns={1}
                    renderItem={({ item, index }) => this.renderPointsDetail(item, index)}
                />
            </View>
        )
    }

    renderPointsDetail= (item, index) => {
        return (
            <View style={{ width: "100%", flexDirection: "row",}}>
                <View style={{ width: 20, height: 20, justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "black", marginTop:0 }} />
                </View>
                <Text style={{ fontSize: 12, color: colors.mediumGrey}}>{item.text}</Text>
            </View>
        )
    }

    render() {
        const { title, posted, textTile } = this.state
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <Header
                    onLeftAction={() => {
                        navigation.goBack()
                    }}
                    leftIcon={icons.backArrow}
                    leftButtonIconStyle={{ tintColor: colors.black }}
                />
                <View style={styles.containerBoxMain}>
                    <View style={{ width: '100%', }}>
                        <Image source={images.logo} style={{ width: '100%', height: 180,resizeMode:"contain" }} />
                    </View>
                    <View style={{ marginHorizontal: 30 }}>
                        <Text style={{ fontSize: 20, color: colors.primary,marginTop:10 }}>{title}</Text>
                        <Text style={{ fontSize: 14, color: colors.black, marginTop: 5 }}>{posted}</Text>
                        <Text style={{ fontSize: 12, color: colors.mediumGrey, marginTop: 5 }}>{textTile}</Text>
                        <FlatList
                            listKey={moment().format('x').toString()}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={this.state.mainData}
                            extraData={this.state}
                            style={{marginBottom:400}}
                            keyExtractor={(item, index) => index}
                            numColumns={1}
                            renderItem={({ item, index }) => this.renderPoints(item, index)}
                        />
                    </View>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: 'center'
    },
    containerBoxMain: {
        height: '100%',
        width: '100%',
        flexDirection: "column",
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

