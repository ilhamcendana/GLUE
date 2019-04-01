import React, { Component } from 'react';
import { Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Animated, View, ScrollView, Dimensions, Text, FlatList } from 'react-native';
import { Header, Container, Toast, Left, Body, Right, Title, Content, Button, Spinner, Drawer, Icon, H2 } from 'native-base';
import fire from './config';


//COMPONENTS
import SignInPage from './components/SignInPage/SignInPage';
import Feed from './components/LandingLayout/LandingLayout';
import InputPengaduan from './components/InputPengaduan/InputPengaduan';
import SignUpPage from './components/SignUpPage/SignUpPage';


export default class App extends React.Component {
  state = {
    user: {},
    signEmailValue: '',
    signPassValue: '',
    signupEmailValue: '',
    signPassValue: '',
    post: [],
    postOpen: false,
    InputPengaduan: false,
    loaded: 10,
    spinner: false,
    gotoSignup: false,
    showToast: false,
    errorLoginMessage: '',
    toastAnim: new Animated.Value(0)
  }

  fetching = () => {
    // const getData = fire.database().ref('data/');
    // getData.on('value', (snapshot) => {
    //   console.log(snapshot.val().aduan);
    // });
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.fetching();
    this.authListener();
  };

  authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null, signEmailValue: '', signPassValue: '' });
      }
    })
  };

  signOut = () => {
    fire.auth().signOut().then(() => this.setState({ spinner: false }));
  }

  //ALL LOGIN EVENT
  inputEmailValChange = (e) => {
    this.setState({ signEmailValue: e });
  };

  inputPassValChange = (e) => {
    this.setState({ signPassValue: e });
  };

  loginEvent = () => {
    const { signEmailValue, signPassValue } = this.state;
    this.setState({ spinner: true });
    fire.auth().signInWithEmailAndPassword(signEmailValue, signPassValue)
      .then()
      .catch((e) => {
        if (e === 'The email address is badly formatted.' || 'The password is invalid or the user does not have a password.') {
          this.setState({ errorLoginMessage: 'Wrong email or password!' });
        } else {
          this.setState({ errorLoginMessage: e });
        }
        this.setState({ showToast: true, spinner: false });
        setTimeout(() => this.setState({ showToast: false }), 2000);
      });
  }
  //END ALL LOGIN EVENT -----------------------------

  //ALL SIGNUP EVENT
  signupEmailValChange = (e) => {
    this.setState({ signupEmailValue: e });
  };

  signupPassValChange = (e) => {
    this.setState({ signupPassValue: e });
  };

  signupEvent = () => {
    const { signupEmailValue, signupPassValue } = this.state;
    fire.auth().createUserWithEmailAndPassword(signupEmailValue, signupPassValue);
    this.setState({ spinner: true });
  }
  //END ALL SIGNUP EVENT -----------------------------



  render() {
    let toast = (
      <View style={{
        width: '100%',
        backgroundColor: '#e51624',
        position: 'absolute',
        zIndex: 100,
        top: 0,
        paddingVertical: 20
      }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>{this.state.errorLoginMessage}</Text>
      </View>
    );
    // if (this.state.showToast) {

    // }
    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Body>
            <Title style={{ color: '#fff' }}>GLUE</Title>
          </Body>
        </Header>
        {this.state.showToast ? toast : null}
        {this.state.user !== null ? (
          <>
            <LandingLayout signout={this.signOut} />
          </>
        ) : (
            <>
              {!this.state.gotoSignup ? (
                <SignInPage
                  loginEvent={this.loginEvent}
                  inputEmailValChange={this.inputEmailValChange}
                  inputPassValChange={this.inputPassValChange}
                  signEmailValue={this.state.signEmailValue}
                  signPassValue={this.state.signPassValue}
                  spinner={this.state.spinner}
                  gotoSignup={() => !this.state.gotoSignup ? this.setState({ gotoSignup: true }) : this.setState({ gotoSignup: false })}
                />
              ) : (
                  <SignUpPage
                    signupEvent={this.signupEvent}
                    signupEmailValChange={this.signupEmailValChange}
                    signupPassValChange={this.signupPassValChange}
                    signupEmailValue={this.state.signupEmailValue}
                    signupPassValue={this.state.signupPassValue}
                    spinner={this.state.spinner}
                    gotoSignup={() => !this.state.gotoSignup ? this.setState({ gotoSignup: true }) : this.setState({ gotoSignup: false })}
                  />
                )}
            </>
          )}


      </Container>






    );
  }
}
let screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue'
  },
  posts: {
    width: '100%',
    backgroundColor: '#6e8272',
  },
  header: {
    backgroundColor: '#0a78af',

  }
});

