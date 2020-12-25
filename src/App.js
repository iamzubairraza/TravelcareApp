/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { LogBox, StatusBar } from 'react-native'

import Routing from './Routing'
import colors from './utils/colors';

LogBox.ignoreAllLogs(true)
StatusBar.setTranslucent(true)
StatusBar.setBackgroundColor(colors.transparent)

export default class App extends Component {
  render() {
    return (
      <Routing />
    );
  }
}