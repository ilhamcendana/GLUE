import React, { Component } from 'react';
import { Font, AppLoading, ImagePicker, Permissions } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Animated, View, ScrollView, Dimensions, Text, FlatList, StatusBar } from 'react-native';
import { Header, Container, Toast, Left, Body, Right, Title, Content, Button, Spinner, Drawer, Icon, H2 } from 'native-base';
import fire from './config';



//COMPONENTS
import SignInPage from './components/SignInPage/SignInPage';
import Feed from './components/LandingLayout/LandingLayout';
import InputPengaduan from './components/InputPengaduan/InputPengaduan';
import SignUpPage from './components/SignUpPage/SignUpPage';
import FillProfilePage from './components/FillProfilePage/FillProfilePage';



export default class App extends React.Component {
  state = {
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
    toastAnim: new Animated.Value(0),
    loading: true,
    fillProfilePage: true,
    inputNamaProfile: '',
    inputKelasProfile: '',
    inputNPMProfile: '',
    inputJurusanProfile: '',
    image: null

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
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
    });
    this.setState({ loading: false, });
    StatusBar.setHidden(true);
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
          this.setState({ errorLoginSignupMessage: 'Email atau Password salah!' });
        } else {
          this.setState({ errorLoginSignupMessage: e });
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
    this.setState({ spinner: true });
    fire.auth().createUserWithEmailAndPassword(signupEmailValue, signupPassValue)
      .then(() => this.setState({ fillProfilePage: true }))
      .catch(e => {
        this.setState({ errorLoginSignupMessage: 'Invalid email or password', spinner: false, showToast: true });
        setTimeout(() => this.setState({ showToast: false }), 2000);
      });
  }
  //END ALL SIGNUP EVENT ---------------------------

  //FILL PROFILE EVENT
  inputNamaProfileEvent = e => {
    this.setState({ inputNamaProfile: e });
  }
  inputKelasProfileEvent = e => {
    this.setState({ inputKelasProfile: e });
  }
  inputNPMProfileEvent = e => {
    this.setState({ inputNPMProfile: e });
  }
  inputJurusanProfileEvent = e => {
    this.setState({ inputJurusanProfile: e });
  }

  saveProfileEvent = () => {
    const { inputNamaProfile, inputKelasProfile, inputNPMProfile, inputJurusanProfile, image } = this.state;
    const uid = this.state.user ? this.state.user.uid : '';
    if (inputNamaProfile === '' || inputKelasProfile === '' || inputNPMProfile === '' || inputJurusanProfile === '' || inputNPMProfile.length < 8) {
      alert('Semua kolom tidak boleh kosong atau NPM dkurang dari 8 karakter');
    } else {
      fire.database().ref('users/' + uid + '/profile/').set({
        nama: inputNamaProfile,
        npm: inputNPMProfile,
        kelas: inputKelasProfile,
        jurusan: inputJurusanProfile
      }).then(() => this.setState({
        fillProfilePage: true,
        inputNamaProfile: '',
        inputKelasProfile: '',
        inputNPMProfile: '',
        inputJurusanProfile: '',
        signupEmailValue: '',
        signupPassValue: ''
      }));
      fire.storage().ref('users/' + uid + '/profile/').put(image)
        .then()
        .catch(() => console.log(image))
    }
  };
  //END FILL PROFILE EVENT---------------------------------

  // IMAGE FROM PHONE EVENT
  _pickImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
    console.log(this.state.image);
  }

  _takeImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    let resultCamera = await ImagePicker.launchCameraAsync({
      allowsEditing: false
    });
    if (!resultCamera.cancelled) {
      this.setState({ image: resultCamera.uri });
    };
  }
  //END IMAGE FROM PHONE EVENT------------------------------

  render() {
    if (this.state.loading) {
      return <AppLoading />;
    }
    let toast = (
      <View style={{
        width: '100%',
        backgroundColor: '#e51624',
        position: 'absolute',
        zIndex: 100,
        top: 0,
        paddingVertical: 20
      }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>{this.state.errorLoginSignupMessage}</Text>
      </View>
    );

    return (
      <Container style={styles.container}>
        <Header style={styles.header}>
          <Body style={{ alignItems: 'center' }}>
            <Title style={{ color: '#fff' }}>GLUE</Title>
          </Body>
        </Header>
        {this.state.showToast ? toast : null}
        {this.state.user !== null ? (
          <>
            {this.state.fillProfilePage ? (
              <FillProfilePage
                inputNamaProfileEvent={this.inputNamaProfileEvent}
                inputNamaProfile={this.state.inputNamaProfile}
                inputNPMProfileEvent={this.inputNPMProfileEvent}
                inputNPMProfile={this.state.inputNPMProfile}
                inputKelasProfileEvent={this.inputKelasProfileEvent}
                inputKelasProfile={this.state.inputKelasProfile}
                inputJurusanProfileEvent={this.inputJurusanProfileEvent}
                inputJurusanProfile={this.state.inputJurusanProfile}
                saveProfileEvent={this.saveProfileEvent}
                _pickImage={this._pickImage}
                image={this.state.image}
                _takeImage={this._takeImage}
              />
            ) : <LandingLayout signout={this.signOut} />}
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
    backgroundColor: '#640164',

  }
});

