import React, { Component } from 'react';
import { Font, AppLoading, ImagePicker, Permissions } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Platform, Animated, View, ScrollView, Alert, Dimensions, Text, FlatList, StatusBar } from 'react-native';
import { Header, Container, Toast, Left, Body, Right, Title, Content, Button, Spinner, Drawer, Icon, H2 } from 'native-base';
import ApiKeys from './config';
import * as firebase from 'firebase';
import { createAppContainer, createStackNavigator } from 'react-navigation';


//COMPONENTS
// import SignInPage from './components/Auth/SignInPage';
// import Feed from './components/LandingLayout/LandingLayout';
// import InputPengaduan from './components/InputPengaduan/InputPengaduan';
// import SignUpPage from './components/Auth/SignUpPage';
// import FillProfilePage from './components/FillProfilePage/FillProfilePage';
// import HeaderWei from './components/HeaderWei/HeaderWei';
// import Info from './components/Info/Info';
import LandingLayout from './components/LandingLayout/LandingLayout';
// import ProfilePage from './components/ProfilePage/ProfilePage';
import RootNavigation from './components/RootNavigation';




export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      isAuthenticatedReady: false,
      isAuthenticated: false,
      user: {},
      signEmailValue: '',
      signPassValue: '',
      signupEmailValue: '',
      signupPassValue: '',
      post: [],
      postOpen: false,
      InputPengaduan: false,
      loaded: 10,
      spinner: false,
      gotoSignup: false,
      showToast: false,
      errorLoginSignupMessage: '',
      loading: true,
      fillProfilePage: false,
      inputNamaProfile: '',
      inputKelasProfile: '',
      inputNPMProfile: '',
      inputJurusanProfile: '',
      profilPictUrl: '',
      image: null,
      profilePictCondition: 'Lengkapi profil anda',
      indexLanding: 1,
      infoClicked: new Animated.Value(-1000),
      cancelOnFill: false,
      namaUser: '',
      kelasUser: '',
      npmUser: '',
      jurusanUser: '',
      profilPictUrlFetch: '',
      MoreOptionX: new Animated.Value(400)
    }

    // Initialize firebase...
    if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.FirebaseConfig); }
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  onAuthStateChanged = (user) => {
    this.setState({ isAuthenticatedReady: true });
    this.setState({ isAuthenticated: !!user })
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
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {Platform.OS === 'android' && <View style={{ height: 24, backgroundColor: 'rgba(0,0,0,0.2)' }} />}
          {(this.state.isAuthenticated) ? <LandingLayout /> : <RootNavigation />}
        </View>
      );
    }
  }
}










