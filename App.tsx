/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { store } from './src/store';
import HomeScreen from './src/screens/HomeScreen';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar translucent backgroundColor={'transparent'} />
        <HomeScreen />
      </SafeAreaProvider>
    </Provider>
  );
}


export default App;
