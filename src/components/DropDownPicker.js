import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Platform,
    TextInput,
    Image,
    ViewPropTypes
} from 'react-native';

import icons from '../assets/icons';
import colors from '../utils/colors';
import CheckBoxRound from './CheckBoxRound'

class DropDownPicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchableText: null,
            isVisible: props.isVisible,
            initialScroll: props?.autoScrollToDefaultValue,
            defaultValueIndex: 0,
            dropdownListMarginTop: 56
        };
        this.dropdownCoordinates = [];
    }

    componentDidMount() {
        // this.props.controller(this);
    }

    componentDidUpdate() {
        // ScrollView scrollTo() can only be used after the ScrollView is rendered
        // Automatic scrolling to first defaultValue occurs on first render of dropdown ScrollView
        const item = this.props.items[this.state.defaultValueIndex];
        const isItemVisible = item && (typeof item.hidden === 'undefined' || item.hidden === false);
        if (this.state.initialScroll && this.state.isVisible && isItemVisible) {
            setTimeout(() => {
                this.scrollViewRef.scrollTo({
                    x: 0,
                    y: this.dropdownCoordinates[this.state.defaultValueIndex],
                    animated: true,
                });
                this.setState({ initialScroll: false });
            }, 200);
        }
    }

    toggle() {
        this.setState({
            isVisible: !this.state.isVisible,
        }, () => {
            const isVisible = this.state.isVisible;
            if (isVisible) {
                this.open(false);
            } else {
                this.close(false);
            }
        });
    }

    isOpen() {
        return this.state.isVisible;
    }

    open(setState = true) {
        this.setState({
            ...(setState && { isVisible: true })
        }, () => this.props.onOpen());
    }

    close(setState = true) {
        this.setState({
            ...(setState && { isVisible: false }),
            searchableText: null
        }, () =>
            this.props.onClose()
        );
    }

    getLayout(layout) {
        let height = layout.height < 56 ? 56 : layout.height
        this.setState({
            dropdownListMarginTop: height
        });
    }

    onChangeItemPress = (item, index) => {
        const { onChangeItem, multiple } = this.props
        if (multiple) {
            onChangeItem(item, index)
        } else {
            this.close()
            onChangeItem(item, index)
        }
    }

    render() {
        const {
            items,
            onChangeItem,
            disabled,
            containerStyle,
            style,
            selectedItem,
            multiple,
            dropDownStyle,
            showArrow,
            dropDownMaxHeight,
            searchable,
            searchableStyle,
            placeholder,
            searchablePlaceholder,
            searchablePlaceholderTextColor,
            searchTextInputProps,
            activeItemStyle,
            scrollViewProps,
            itemStyle,
            labelStyle,
            activeLabelStyle,
            searchableError,
        } = this.props

        const { searchableText, dropdownListMarginTop, isVisible } = this.state

        return (
            <View style={[containerStyle, { zIndex: 5000 }]}>
                <TouchableOpacity
                    onLayout={(event) => this.getLayout(event.nativeEvent.layout)}
                    disabled={disabled}
                    onPress={() => this.toggle()}
                    activeOpacity={1}
                    style={[styles.dropDown, { flexDirection: 'row', flex: 1 }, style, this.state.isVisible && styles.noBottomRadius]}>
                    <View style={{ flex: 1 }}>
                        {multiple ?
                            selectedItem.length > 0 ?
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                                        {selectedItem.map((item, index) => {
                                            if (item.isChecked == true) {
                                                return (
                                                    <View key={index} style={{ margin: 5, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.primary, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ color: colors.white }}>{item.name}</Text>
                                                    </View>
                                                )
                                            } else return null
                                        })}
                                    </View>
                                </View>
                                :
                                <Text style={{ color: colors.mediumGrey }}>{placeholder}</Text>
                            :
                            <Text style={{ color: selectedItem.name ? colors.primary : colors.mediumGrey }}>{selectedItem.name ? selectedItem.name : placeholder}</Text>
                        }
                    </View>
                    {showArrow && (
                        <View style={isVisible ? styles.closeIconStyle : styles.downArrowStyle}>
                            <Image
                                style={{ width: '100%', height: '100%', resizeMode: 'contain', tintColor: colors.mediumGrey }}
                                source={isVisible ? icons.cross : icons.downArrow}
                            />
                        </View>
                    )}
                </TouchableOpacity>
                <View style={[
                    styles.dropDown,
                    styles.dropDownBox,
                    dropDownStyle,
                    !this.state.isVisible && styles.hidden, {
                        top: dropdownListMarginTop,
                        width: '100%',
                        maxHeight: dropDownMaxHeight,
                    }
                ]}>
                    {
                        searchable && (
                            <View style={{ width: '100%', flexDirection: 'row' }}>
                                <TextInput
                                    style={[styles.input, searchableStyle]}
                                    value={searchableText}
                                    placeholder={searchablePlaceholder}
                                    placeholderTextColor={searchablePlaceholderTextColor}
                                    {...searchTextInputProps}
                                    onChangeText={(text) => {
                                        this.setState({ searchableText: text })
                                        if (searchTextInputProps.onChangeText) searchTextInputProps.onChangeText(text);
                                    }}
                                />
                            </View>
                        )
                    }

                    <ScrollView
                        style={{ width: '100%' }}
                        nestedScrollEnabled={true}
                        ref={ref => {
                            this.scrollViewRef = ref;
                        }}
                        {...scrollViewProps}>
                        {items?.filter(item => typeof item.hidden === 'undefined' || item.hidden === false).length > 0 ?
                            items?.map((item, index) => (
                                <View
                                    key={index}
                                    onLayout={event => {
                                        const layout = event.nativeEvent.layout;
                                        this.dropdownCoordinates[index] = layout.y;
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {/* {multiple && */}
                                        <CheckBoxRound
                                            isChecked={item.isChecked}
                                            onPress={() => {
                                                this.onChangeItemPress(item, index)
                                            }}
                                        />
                                        {/* } */}
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                this.onChangeItemPress(item, index)
                                            }}
                                            style={[styles.dropDownItem, itemStyle]}
                                            disabled={multiple}>
                                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                                <Text style={[labelStyle]}>
                                                    {item.name}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    {index + 1 != items.length && <View style={{ flex: 1, backgroundColor: '#DDDDDDAA', height: 1 }} />}
                                </View>
                            )) : (
                                <View style={styles.notFound}>
                                    {this.props.searchableError()}
                                </View>
                            )}
                    </ScrollView>
                </View>
            </View>
        );
    }
}

DropDownPicker.defaultProps = {
    placeholder: 'Select an item',
    dropDownMaxHeight: 200,
    style: {},
    dropDownStyle: {},
    containerStyle: {},
    itemStyle: {},
    labelStyle: {},
    selectedLabelStyle: {},
    placeholderStyle: {},
    activeItemStyle: {},
    activeLabelStyle: {},
    arrowStyle: {},
    arrowColor: '#000',
    showArrow: true,
    arrowSize: 15,
    customArrowUp: (size, color) => <Image style={{ width: size, height: size, resizeMode: 'contain', tintColor: color }} source={icons.check} />,
    customArrowDown: (size, color) => <Image style={{ width: size, height: size, resizeMode: 'contain', tintColor: color }} source={icons.check} />,
    customTickIcon: (size, color) => <Image style={{ width: size, height: size, resizeMode: 'contain', tintColor: color }} source={icons.check} />,
    zIndex: 5000,
    disabled: false,
    searchable: false,
    searchablePlaceholder: 'Search for an item',
    searchableError: () => <Text>Not Found</Text>,
    searchableStyle: {},
    searchablePlaceholderTextColor: 'gray',
    isVisible: false,
    autoScrollToDefaultValue: false,
    multiple: false,
    multipleText: '%d items have been selected',
    min: 0,
    max: 10000000,
    selectedLabelLength: 1000,
    labelLength: 1000,
    scrollViewProps: {},
    searchTextInputProps: {},
    controller: () => { },
    onOpen: () => { },
    onClose: () => { },
    onChangeItem: () => { },
    onChangeList: () => { },
};

const styles = StyleSheet.create({
    arrow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    dropDown: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#dfdfdf',
        alignItems: 'center'
    },
    dropDownBox: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    dropDownItem: {
        paddingHorizontal: 10,
        height: 55,
        justifyContent: 'center',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    input: {
        flex: 1,
        borderColor: '#dfdfdf',
        borderBottomWidth: 1,
        paddingHorizontal: 0,
        paddingVertical: 8,
        marginBottom: 10,
    },
    hidden: {
        position: 'relative',
        display: 'none',
        borderWidth: 0
    },
    noBottomRadius: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    notFound: {
        marginVertical: 10,
        marginBottom: 15,
        alignItems: 'center'
    },
    checkBox: {
        marginHorizontal: 5,
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    shadowElevation: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.10,
        shadowRadius: 10.84,

        elevation: 5,
    },
    downArrowStyle: {
        width: 15,
        height: 15,
    },
    closeIconStyle: {
        width: 20,
        height: 20,
        backgroundColor: colors.white,
        padding: 5,
        borderRadius: 10,
        marginRight: -2
    }
});

export default DropDownPicker;