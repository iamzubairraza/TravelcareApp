import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';
import colors from '../utils/colors';

export default HomeBackGround = (props) => {

    return (
        <View style={styles.container}>
            <View style={[styles.upperContainer,{height:props.blueView}]}/>
            <View style={[styles.lowerContainer,{height:props.whiteView}]}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position:'absolute',
        flexDirection: 'column',
        height: "100%",
        width: '100%',
        backgroundColor: 'white',
    },
    upperContainer:{

        width:"100%",
        backgroundColor:colors.primary
    },
    lowerContainer:{
        width:"100%",
        backgroundColor:colors.transparentGrey
    }
})
