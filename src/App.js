/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { View, SafeAreaView, Text, StyleSheet } from 'react-native'

import Routing from './Routing'

console.disableYellowBox = true
console.ignoredYellowBox = true

export default class App extends Component {
  render() {
    return (
      <Routing />
    );
  }
}
const styles = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    height: 60,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bannerText: { color: 'white' }
})