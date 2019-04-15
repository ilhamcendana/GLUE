import React, { Component } from 'react';
import { Font, AppLoading, ImagePicker, Permissions } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Animated, View, ScrollView, Alert, Dimensions, Text, FlatList, StatusBar } from 'react-native';
import { Header, Container, Toast, Left, Body, Right, Title, Content, Button, Spinner, Drawer, Icon, H2 } from 'native-base';
import fire from './config';
import { createStackNavigator } from 'react-navigation';


//COMPONENTS
import SignInPage from './components/SignInPage/SignInPage';
import Feed from './components/LandingLayout/LandingLayout';
import InputPengaduan from './components/InputPengaduan/InputPengaduan';
import SignUpPage from './components/SignUpPage/SignUpPage';
import FillProfilePage from './components/FillProfilePage/FillProfilePage';
import HeaderWei from './components/HeaderWei/HeaderWei';
import Info from './components/Info/Info';
import LandingLayout from './components/LandingLayout/LandingLayout';

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
    loading: true,
    fillProfilePage: false,
    inputNamaProfile: '',
    inputKelasProfile: '',
    inputNPMProfile: '',
    inputJurusanProfile: '',
    image: null,
    profilePictCondition: 'Lengkapi profil anda',
    indexLanding: 1,
    infoClicked: new Animated.Value(-1000),
    cancelOnFill: false,
    namaUser: '',
    kelasUser: '',
    npmUser: '',
    jurusanUser: ''

  }

  //WARNING! To be deprecated in React v17. Use componentDidMount instead.
  componentWillMount() {
    StatusBar.setHidden(true);
    this.authListener();
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
    });
    this.setState({ loading: false, });
    StatusBar.setHidden(false);
    await Permissions.askAsync(Permissions.CAMERA);
  };

  authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
        this.fetchingProfileData();
      } else {
        this.setState({ user: null, signEmailValue: '', signPassValue: '', spinner: false });
      }
    })
  };

  fetchingProfileData = () => {
    const uid = this.state.user ? this.state.user.uid : '';
    const getData = fire.database().ref('users/' + uid + '/profile/');
    getData.on('value', (snapshot) => {
      this.setState({
        namaUser: snapshot.val().nama,
        npmUser: snapshot.val().npm,
        kelasUser: snapshot.val().kelas,
        jurusanUser: snapshot.val().jurusan
      })
    });
  }

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
      .then(() => {
        if (fire.auth().currentUser.emailVerified) {
          alert('welcome')
        } else {
          this.setState({ spinner: false });
          alert('verifikasi dulu');
        }
      })

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
    const { signupEmailValue, signupPassValue, inputNamaProfile, inputKelasProfile, inputNPMProfile, inputJurusanProfile } = this.state;
    this.setState({ spinner: true });
    if (inputNamaProfile === '' || inputKelasProfile === '' || inputNPMProfile === '' || inputJurusanProfile === '' || inputNPMProfile.length < 8) {
      alert('Semua kolom tidak boleh kosong atau NPM dkurang dari 8 karakter');
      this.setState({ spinner: false });
    } else {
      fire.auth().createUserWithEmailAndPassword(signupEmailValue, signupPassValue)
        .then(() => {

          fire.auth().currentUser.sendEmailVerification().then(function () {
            alert('an email verification has been sent to your email address');

          }).catch(function (error) {
            alert(error);
            this.setState({ errorLoginSignupMessage: error, spinner: false, showToast: true });
            setTimeout(() => this.setState({ showToast: false }), 2000);
          });


          fire.database().ref('users/' + fire.auth().currentUser.uid + '/profile/').set({
            email: signupEmailValue,
            nama: inputNamaProfile,
            npm: inputNPMProfile,
            kelas: inputKelasProfile,
            jurusan: inputJurusanProfile
          }).then(() => this.setState({
            inputNamaProfile: '',
            inputKelasProfile: '',
            inputNPMProfile: '',
            inputJurusanProfile: '',
            signupEmailValue: '',
            signupPassValue: '',
            spinner: false,
            gotoSignup: false
          }));


        })
    }
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
    // const { inputNamaProfile, inputKelasProfile, inputNPMProfile, inputJurusanProfile, image } = this.state;

    // this.setState({ spinner: true });
    //  else {

    // }
  };
  //END FILL PROFILE EVENT---------------------------------

  // IMAGE FROM PHONE EVENT SIGNUP
  _pickImage = async () => {
    const uid = this.state.user ? this.state.user.uid : '';
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      this.uploadProfilPict(result.uri, 'test.jpg')
        .then(() => {
          alert('success');
        })
        .catch((error) => {
          alert(error);
        })
    }
  }

  _takeImage = async () => {
    const uid = this.state.user ? this.state.user.uid : '';
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri, profilePictCondition: 'Uploading...' });
      this.uploadProfilPict(result.uri)
        .then(() => {
          alert('success');
        })
        .catch((error) => {
          alert(error);
        })
    };
  };

  uploadProfilPict = async (uri, name) => {
    const response = await fetch(uri);
    const blop = await response.blob();

    let ref = fire.storage().ref().child('images/' + name);
    return ref.put(blop);
  }

  //END IMAGE FROM PHONE EVENT SIGNUP------------------------------

  infoClicked = () => {
    Animated.timing(this.state.infoClicked, {
      toValue: -1000,
      duration: 400
    }).start();
  };

  infoClickedOpen = () => {
    Animated.timing(this.state.infoClicked, {
      toValue: 0,
      duration: 400
    }).start()

  };


  render() {
    const user = this.state.user ? this.state.user : null;
    // const AppStackNavigator = createStackNavigator({
    //   Home:LandingLayout
    // });

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
        <Info infoClicked={() => this.infoClicked()} translateInfo={this.state.infoClicked} />
        <HeaderWei
          infoClickedOpen={() => this.infoClickedOpen()}
          fillProfilePage={this.state.fillProfilePage}
        />

        {this.state.showToast ? toast : null}
        {this.state.user === null ?
          (
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
                    inputNamaProfileEvent={this.inputNamaProfileEvent}
                    inputNamaProfile={this.state.inputNamaProfile}
                    inputNPMProfileEvent={this.inputNPMProfileEvent}
                    inputNPMProfile={this.state.inputNPMProfile}
                    inputKelasProfileEvent={this.inputKelasProfileEvent}
                    inputKelasProfile={this.state.inputKelasProfile}
                    inputJurusanProfileEvent={this.inputJurusanProfileEvent}
                    inputJurusanProfile={this.state.inputJurusanProfile}
                    _takeImage={this._takeImage}
                    _pickImage={this._pickImage}
                    image={this.state.image}
                  />
                )}
            </>
          ) : (
            <LandingLayout
              signout={this.signOut}
              indexLanding={this.state.indexLanding}
              indexChange={(index) => this.setState({ indexLanding: index })}
              openEdit={() => this.setState({ fillProfilePage: true, cancelOnFill: true })}
              uid={this.state.user ? this.state.user.uid : ''}
              emailVerified={this.state.user ? this.state.user.emailVerified : ''}
              namaUser={this.state.namaUser}
              npmUser={this.state.npmUser}
              kelasUser={this.state.kelasUser}
              jurusanUser={this.state.jurusanUser}
            />
          )}


      </Container>






    );
  }
}
let screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  posts: {
    width: '100%',
    backgroundColor: '#6e8272',
  },
});

