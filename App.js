import React, { Component } from 'react';
import { Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, ScrollView, Dimensions, Text, FlatList } from 'react-native';
import { Header, Container, Left, Body, Right, Title, Content, Button, Spinner, Drawer, Icon, H2 } from 'native-base';
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
    gotoSignup: false
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
        this.setState({ user: null, signEmailValue: '', signPassValue: '', spinner: false });
      }
    })
  };


  //ALL LOGIN EVENT
  inputEmailValChange = (e) => {
    this.setState({ signEmailValue: e });
  };

  inputPassValChange = (e) => {
    this.setState({ signPassValue: e });
  };

  loginEvent = () => {
    const { signEmailValue, signPassValue } = this.state;
    fire.auth().signInWithEmailAndPassword(signEmailValue, signPassValue);
    this.setState({ spinner: true });
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
    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Body>
            <Title style={{ color: '#fff' }}>GLUE</Title>
          </Body>
        </Header>

        {this.state.user !== null ? (
          <>
            <LandingLayout />
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
        {/*
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.state.postOpen ? this.setState({ InputPengaduan: true, postOpen: false }) : this.setState({ InputPengaduan: false, postOpen: true })}>
              <Icon type='AntDesign' name={this.state.InputPengaduan ? 'home' : 'form'} style={{ color: '#fff', fontSize: 25 }} />
            </Button>
          </Left>
          <Body>
            <Text style={{ fontWeight: '100', color: '#fff', fontSize: 25 }}>Glue</Text>
          </Body>
          <Right>
            <Button transparent>
              <Icon type='Ionicons' name='refresh' style={{ color: '#fff', fontSize: 25 }} onPress={this.fetching} />
            </Button>
          </Right>
        </Header>
        <ScrollView>
          
          {this.state.postOpen ? posts : null}
          {this.state.postOpen && this.state.loaded <= this.state.post.length ? <Button block light style={{ marginVertical: 30 }} onPress={() => this.setState({
            loaded: this.state.loaded + 10
          })}>
            <Text>See More</Text>
          </Button> : <H2 style={{ textAlign: 'center', marginVertical: 20 }}>That's it</H2>}
          {this.state.InputPengaduan ? <InputPengaduan /> : null}

        </ScrollView> */}


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

