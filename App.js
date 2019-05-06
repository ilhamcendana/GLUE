import React, { Component } from 'react';
import { Font, AppLoading, } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Animated, View, StatusBar } from 'react-native';
import { Root } from 'native-base';
import ApiKeys from './config';
import * as firebase from 'firebase';


//COMPONENTS
import LandingLayout from './components/LandingLayout/LandingLayout';
import RootNavigation from './components/RootNavigation';




export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      isAuthenticatedReady: false,
      isAuthenticated: false,
      user: {},
      spinner: false,
      gotoSignup: false,
      showToast: false,
      errorLoginSignupMessage: '',
      loading: true,
      fillProfilePage: false,
      image: null,
      infoClicked: new Animated.Value(-1000),
      cancelOnFill: false,
      namaUser: '',
      kelasUser: '',
      npmUser: '',
      jurusanUser: '',
      profilPictUrlFetch: '',
      MoreOptionX: new Animated.Value(400),
      loginSuccess: false
    }

    // Initialize firebase...
    if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.FirebaseConfig); }
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  onAuthStateChanged = (user) => {
    this.setState({ isAuthenticatedReady: true });
    this.setState({ isAuthenticated: !!user });
  }

  componentDidMount() {

  }



  _loadResourcesAsync = async (e) => {
    return Promise.all([
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
      }),
    ]);
  };

  render() {
    if ((!this.state.isLoadingComplete || !this.state.isAuthenticatedReady) && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={(error) => console.log(error)}
          onFinish={() => this.setState({ isLoadingComplete: true })}
        />
      );
    } else {
      return (
        <Root>
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            {Platform.OS === 'android' && <View style={{ height: 24, backgroundColor: '#598c5f' }} />}

            {(this.state.isAuthenticated) ? <LandingLayout /> : <RootNavigation />}
          </View>
        </Root>
      );
    }
  }
}










