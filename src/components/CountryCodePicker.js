import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Alert,
    TouchableOpacity,
    Dimensions,
    Modal,
    StatusBar,
    StyleSheet,
    Keyboard,
    FlatList,
} from 'react-native';
import nodeEmoji from 'node-emoji';
import moment from 'moment';

import InputField from './InputField'
import countries from '../utils/countries-emoji.json'
import colors from '../utils/colors';
const listOfContries = Object.values(countries)
const { height } = Dimensions.get('screen');

export default class CountryCodePicker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filteredList: listOfContries,
            searchText: '',
        }
    }

    render() {
        const { searchText, filteredList } = this.state
        const { onSelectCountryCode } = this.props
        return (
            <View style={styles.bottomSheetStyle} >
                <View style={{ width: 80, height: 5, alignSelf: 'center', marginTop: 10, marginBottom: 20, backgroundColor: colors.grey }} />
                <Text style={{ fontWeight: '600', fontSize: 16, color: 'black', alignSelf: 'center' }}>{'Select Your Country'}</Text>
                <InputField
                    inputContainer={{ backgroundColor: 'white', marginVertical: 20 }}
                    placeholder={'Search'}
                    value={searchText}
                    onChangeText={(text) => {
                        let listOfContriesTemp = listOfContries
                        if (text !== '') {
                            listOfContriesTemp = listOfContriesTemp.filter((item) => {
                                return ((item.callingCode[0]).toLowerCase().indexOf((text + "").toLowerCase()) >= 0)
                                    ||
                                    (('+' + item.callingCode[0]).toLowerCase().indexOf((text + "").toLowerCase()) >= 0)
                                    ||
                                    ((item.name.common).toLowerCase().indexOf((text + "").toLowerCase()) >= 0)
                            })
                        }
                        this.setState({
                            filteredList: listOfContriesTemp,
                            searchText: text
                        })
                    }}
                />
                <FlatList
                    data={filteredList}
                    keyExtractor={item => item.flag}
                    listKey={moment().format('x').toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps='always'
                    contentContainerStyle={{ marginBottom: 20, width: '100%' }}
                    extraData={this.state}
                    style={{ width: '100%' }}
                    ItemSeparatorComponent={() => <View style={{ flex: 1, backgroundColor: '#DDDDDDAA', height: 2 }} />}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity
                                style={styles.countryCodeItem}
                                onPress={() => {
                                    // onTextClick()
                                    onSelectCountryCode(item)
                                    this.setState({
                                        filteredList: listOfContries,
                                        searchText: ''
                                    })
                                }}>
                                <Text style={{ fontWeight: '600', fontSize: 30, color: 'black' }}>{nodeEmoji.get(item.flag)}</Text>
                                <View style={{ flex: 1, marginHorizontal: 5 }}>
                                    <Text style={{ fontWeight: '600', fontSize: 14, color: 'black' }}>{item.name.common}</Text>
                                </View>
                                <Text style={{ fontWeight: '600', fontSize: 14, color: 'black' }}>{'+' + item.callingCode[0]}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bottomSheetStyle: {
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderColor: '#00000022',
        borderTopWidth: 0.25,
        borderLeftWidth: 0.25,
        borderRightWidth: 0.25,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: height * 0.9,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        elevation: 24,
    },
    countryCodeItem: {
        width: '100%',
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
    },
});

