import React, { Component } from 'react';
import {
    View,
    Text,
    Alert,
    Dimensions,
    FlatList,
    StyleSheet,
} from 'react-native';
import moment from 'moment'

import Button from '../../../components/Button'
import PlanCard from '../../../components/PlanCard'
import Loader from '../../../components/Loader'

import icons from '../../../assets/icons'
import colors from '../../../utils/colors';

import { API, requestGet } from '../../../utils/API';

const { width, height } = Dimensions.get('screen');

export default class PaymentPlanScreen extends Component {
    constructor(props) {
        super(props);

        const { params } = this.props.route
        let isModeEdit = false
        let plan = "0"
        if (params) {
            if (params.isModeEdit) isModeEdit = params.isModeEdit
            if (params.plan) plan = params.plan
        }

        console.log("params", params)

        this.state = {
            loading: false,
            plansList: [],
            activeIndex: 0,
            isModeEdit: isModeEdit,
            plan: plan
        }
    }

    componentDidMount() {
        this.getPlans()
    }

    getPlans = () => {
        const { plan } = this.state
        this.setState({ loading: true })
        requestGet(API.GET_PLANS).then((response) => {
            this.setState({ loading: false })
            if (response.status == 200) {
                console.log('getPlans', 'response.data', response.data, plan)
                this.setState({ plansList: response.data }, () => [
                    response.data?.map((item, index) => {
                        if (plan == item.id) {
                            this.setState({ activeIndex: index })
                        }
                    })
                ])
            } else {
                Alert.alert(null, response.message)
            }
        }).catch((error) => {
            this.setState({ loading: false })
            console.log('getPlans', 'error', error)
        })
    }

    render() {
        const {
            loading,
            plansList,
            activeIndex,
            isModeEdit
        } = this.state
        const { navigation } = this.props

        return (
            <View style={styles.container}>
                <Header
                    leftIcon={isModeEdit ? icons.backArrow : null}
                    onLeftAction={() => {
                        if (isModeEdit) navigation.goBack()
                    }}
                    hearderText={"Plans & Payments"}
                />
                <View style={{ flex: 1, width: '100%', paddingHorizontal: 30, paddingTop: 20, paddingBottom: 50 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', width: '80%', alignSelf: 'center', justifyContent: 'center' }}>
                            <View style={{ alignItems: 'center', width: 80 }}>
                                <View style={[styles.stepStype, {}]}>
                                    <Text style={{ color: colors.white, fontWeight: '600' }}>{'1'}</Text>
                                </View>
                                <Text style={{ marginTop: 10 }}>{'Select Plan'}</Text>
                            </View>
                            <View style={{ position: 'absolute', width: (width * 0.80) - (120), height: 1, backgroundColor: colors.primary, marginTop: 15, zIndex: -1 }} />
                            <View style={{ flex: 1 }} />
                            <View style={{ alignItems: 'center', width: 90 }}>
                                <View style={[styles.stepStype, { backgroundColor: colors.background }]}>
                                    <Text style={{ color: colors.primary, fontWeight: '600' }}>{'2'}</Text>
                                </View>
                                <Text style={{ marginTop: 10 }}>{'Payment Info'}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, paddingVertical: 20, marginTop: 20 }}>
                            <Text style={{ fontSize: 23, fontWeight: '600' }}>{'Select a plan'}</Text>
                            <Text style={{ color: colors.mediumGrey }}>{'Select offer that best suits your needs'}</Text>
                            <FlatList
                                listKey={moment().format('x').toString()}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                data={plansList}
                                style={{ marginBottom: 10 }}
                                extraData={plansList}
                                keyExtractor={(item, index) => (item.id).toString()}
                                numColumns={1}
                                renderItem={({ item, index }) => {
                                    return (
                                        <PlanCard
                                            key={item.id}
                                            containerStyle={{ marginTop: 15 }}
                                            isChecked={activeIndex == index}
                                            buttonTitleText={item.title}
                                            buttonDesctiptionText={item.description}
                                            peckageText={item.amount}
                                            onPressButton={() => {
                                                this.setState({ activeIndex: index })
                                            }}
                                        />
                                    )
                                }}
                            />

                            <Button
                                containerStyle={{ backgroundColor: colors.primary, marginTop: 30 }}
                                buttonTextStyle={{ color: colors.white }}
                                buttonText={'Step 2: Payment Info'}
                                onPressButton={() => {
                                    const selectedPeckage = plansList[activeIndex]
                                    navigation.navigate('PaymentInfoScreen', { selectedPeckage, isModeEdit: isModeEdit })
                                }}
                            />
                        </View>
                    </View>
                </View>
                <Loader loading={loading} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        width: '100%',
        backgroundColor: colors.background,
    },
    stepStype: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderWidth: 1,
        borderColor: colors.primary
    }
});

