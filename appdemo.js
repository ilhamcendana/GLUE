fetchingProfileData = () => {
    const uid = this.state.user ? this.state.user.uid : '';
    const getData = fire.database().ref('users/' + uid + '/profile/');
    getData.on('value', (snapshot) => {
        this.setState({
            namaUser: snapshot.val().nama,
            npmUser: snapshot.val().npm,
            kelasUser: snapshot.val().kelas,
            jurusanUser: snapshot.val().jurusan,
            profilPictUrlFetch: snapshot.val().profilPictUrl
        })
    });
};



signOut = () => {
    fire.auth().signOut().then(() => this.setState({ spinner: false }));
}





//FILL PROFILE EVENT


saveProfileEvent = () => {
    // const { inputNamaProfile, inputKelasProfile, inputNPMProfile, inputJurusanProfile, image } = this.state;

    // this.setState({ spinner: true });
    //  else {

    // }
};
//END FILL PROFILE EVENT---------------------------------

// IMAGE FROM PHONE EVENT SIGNUP
_pickImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [3, 3]
    });

    if (!result.cancelled) {
        this.setState({ image: result.uri });
        this.uploadProfilPict(result.uri)
            .then(() => alert('success'))
            .catch((err) => console.log(err));
    }
}


_takeImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 3]
    });
    if (!result.cancelled) {
        this.setState({ image: result.uri });
        this.uploadProfilPict(result.uri)
            .then(() => alert('success'))
            .catch((err) => console.log(err));
    };
};

uploadProfilPict = async (uri) => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });

    const date = new Date();
    const ref = fire
        .storage()
        .ref('PROFILE-PICTURE/' + 'PP_' + date.getDay() + '-' + date.getMonth() + '-' + date.getFullYear() + '::' + date.getMilliseconds());
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();
    const profilPictUrl = await snapshot.ref.getDownloadURL();
    return this.setState({ profilPictUrl });
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

openMoreOption = () => {
    Animated.timing(this.state.MoreOptionX, {
        toValue: 0,
        duration: 200
    }).start();
};

closeMoreOption = () => {
    Animated.timing(this.state.MoreOptionX, {
        toValue: 400,
        duration: 500
    }).start();
}

SignInComponent = () => {
    return <SignInPage
        loginEvent={this.loginEvent}
        inputEmailValChange={this.inputEmailValChange}
        inputPassValChange={this.inputPassValChange}
        signEmailValue={this.state.signEmailValue}
        signPassValue={this.state.signPassValue}
        spinner={this.state.spinner}
        gotoSignup={() => this.props.navigation.navigate('SignUpComponent')}
    />
};

signupgoto = () => this.props.navigation.navigate('SignUpComponent');

render() {

    const user = this.state.user ? this.state.user : null;
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
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
        <>
            <RootNavigation />
            {/* <Container style={styles.container}> */}
            {/* <Info infoClicked={() => this.infoClicked()} translateInfo={this.state.infoClicked} /> */}
            {/* <HeaderWei
          infoClickedOpen={() => this.infoClickedOpen()}
          fillProfilePage={this.state.fillProfilePage}
          moreOptionEvent={() => this.setState({ moreOption: true })}
          islogin={this.state.user}
          openMoreOption={this.openMoreOption}
        /> */}

            {/* <Animated.View style={{ translateX: this.state.MoreOptionX, position: 'absolute', zIndex: 100, width: screenWidth / 2, right: 0, justifyContent: 'center', backgroundColor: '#fff', height: screenHeight }}>
            <Button rounded bordered style={{ alignSelf: 'center', marginBottom: 25, paddingHorizontal: 40 }}>
              <Text style={{ textAlign: 'center' }}>Log out</Text>
            </Button>
            <Button onPress={this.closeMoreOption} rounded style={{ alignSelf: 'center', paddingHorizontal: 40, }}>
              <Text style={{ color: '#fff', textAlign: 'center' }}>Close</Text>
            </Button>
          </Animated.View>

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
                openEdit={() => this.setState({ fillProfilePage: true })}
                uid={this.state.user ? this.state.user.uid : ''}
                emailVerified={this.state.user ? this.state.user.emailVerified : ''}
                namaUser={this.state.namaUser}
                npmUser={this.state.npmUser}
                kelasUser={this.state.kelasUser}
                jurusanUser={this.state.jurusanUser}
                profilPictUrlFetch={this.state.profilPictUrlFetch}
                navigateToEditProfile={() => this.props.navigation.navigate('fillProfilePage')}
              />
            )}


        </Container> */}
            {/* <AppStackNavigator /> */}
        </>





    );
}
}




SignUpComponent = () => {
    return <SignUpPage
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






//////////dari feed

{/* <Animated.View style={{ backgroundColor: '#fff', translateX: this.state.openReport, position: 'absolute', bottom: 0, width: '100%', paddingVertical: 10 }}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 23, color: 'red' }}>LAPOR!</Text>
                    <Text style={{ textAlign: 'center' }}>Post ini mengandung hal yang</Text>
                    <ListItem onPress={() => this.setState({ selectedTdkpantasReport: true, selectedHoaxReport: false })} >
                        <Left>
                            <Text>Tidak pantas</Text>
                        </Left>
                        <Right>
                            <Radio selected={this.state.selectedTdkpantasReport} selectedColor='red' />
                        </Right>
                    </ListItem>

                    <ListItem onPress={() => this.setState({ selectedTdkpantasReport: false, selectedHoaxReport: true })}>
                        <Left>
                            <Text>Hoax</Text>
                        </Left>
                        <Right>
                            <Radio selected={this.state.selectedHoaxReport} selectedColor='red' />
                        </Right>
                    </ListItem>

                    <View style={{ marginVertical: 15, flexDirection: 'row', justifyContent: 'center' }}>
                        <Button small rounded style={{ backgroundColor: '#660066', alignSelf: 'center', marginRight: 20 }} >
                            <Text>Submit</Text>
                        </Button>

                        <Button onPress={() => this.closeReport()} rounded bordered style={{ borderColor: '#660066', alignSelf: 'center' }} small>
                            <Text style={{ color: '#660066' }}>Close</Text>
                        </Button>
                    </View>
                </Animated.View>

                <Animated.View style={{ position: 'absolute', bottom: 0, backgroundColor: '#4848ea', width: '100%', paddingVertical: 10, translateY: this.state.translate }}>
                    <Text style={{ color: '#fff', textAlign: 'center' }}>This post is trend</Text>
                </Animated.View> */}

{/* <Button rounded style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                justifyContent: 'center',
                backgroundColor: '#660066',
                width: 70,
                height: 70,
                marginBottom: 20,
                marginRight: 20
            }}
                onPress={() => alert('aaa')}
            >
                <Icon name="feather" type='Feather' style={{ color: '#fff' }} />
            </Button> */}