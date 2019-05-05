import React, { Component } from 'react';
import { View, KeyboardAvoidingView, Dimensions, Alert } from 'react-native';
import {
    Container,
    Content,
    Form,
    Item,
    Input,
    Button,
    Text,
    Label,
    Spinner,
    Picker,
    Icon,
} from 'native-base';
import * as firebase from 'firebase';
import 'firebase/firestore';

export default class SignUpPage extends Component {
    state = {
        spinner: false,
        signupEmailValue: '',
        signupPassValue: '',
        signupRePassValue: '',
        inputNamaProfile: '',
        inputKelasProfile: '',
        inputJurusanProfile: ''
    }

    static navigationOptions = {
        header: null
    }

    //ALL SIGNUP EVENT
    signupEmailValChange = (e) => {
        this.setState({ signupEmailValue: e });
    };

    signupPassValChange = (e) => {
        this.setState({ signupPassValue: e });
    };

    signupRePassValChange = (e) => {
        this.setState({ signupRePassValue: e });
    };

    inputNamaProfileEvent = e => {
        this.setState({ inputNamaProfile: e });
    };
    inputKelasProfileEvent = e => {
        this.setState({ inputKelasProfile: e });
    };
    inputNPMProfileEvent = e => {
        this.setState({ inputNPMProfile: e });
    };
    inputJurusanProfileEvent = e => {
        this.setState({ inputJurusanProfile: e });
    };

    signupEvent = () => {
        const { signupEmailValue, signupRePassValue, signupPassValue, inputNamaProfile, inputKelasProfile, inputNPMProfile, inputJurusanProfile } = this.state;
        this.setState({ spinner: true });
        if (inputNamaProfile === '' || signupRePassValue !== signupPassValue || inputKelasProfile === '' || inputNPMProfile === '' || inputJurusanProfile === '' || inputNPMProfile.length !== 8) {
            alert('Semua kolom tidak boleh kosong atau NPM dkurang dari 8 karakter');
            this.setState({ spinner: false });
        } else {
            firebase.auth().createUserWithEmailAndPassword(signupEmailValue, signupPassValue)
                .then(() => {
                    firebase.auth().currentUser.sendEmailVerification().then(() => {
                        firebase.auth().currentUser.updateProfile({
                            displayName: inputNamaProfile,
                            photoURL: 'https://firebasestorage.googleapis.com/v0/b/forumpengaduan.appspot.com/o/defaultProfilePict%2FProfileIcon.png?alt=media&token=64afa9bb-ec14-4710-a298-bd2df8df457c'
                        });
                        const userData = {
                            nama: inputNamaProfile,
                            profilePict: 'https://firebasestorage.googleapis.com/v0/b/forumpengaduan.appspot.com/o/defaultProfilePict%2FProfileIcon.png?alt=media&token=64afa9bb-ec14-4710-a298-bd2df8df457c',
                            npm: inputNPMProfile,
                            kelas: inputKelasProfile,
                            jurusan: inputJurusanProfile,
                            totalPost: 0,
                            totalVote: 0,
                            totalTrends: 0,
                            isVerified: false
                        }

                        firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
                            profile: userData
                        }).then(() => {
                            this.setState({
                                inputNamaProfile: '',
                                inputKelasProfile: '',
                                inputNPMProfile: '',
                                inputJurusanProfile: '',
                                signupEmailValue: '',
                                signupPassValue: '',
                                spinner: false,
                            });
                        });
                        Alert.alert('an email verification has been sent to your email address');
                    }).catch((error) => {
                        alert(error);
                        this.setState({ spinner: false });
                    });
                })
        }
    }
    //END ALL SIGNUP EVENT ---------------------------

    render() {
        const jurusan = ['Manajemen Informatika', 'Teknik Komputer', 'Manajemen Keuangan', 'Manajemen Pemasaran', 'Akuntansi', 'Teknik Informatika', 'Teknik Industri', 'Teknik Mesin', 'Teknik Elektro', 'Teknik Sipil', 'Arsitektur', 'Sistem Informasi', 'Sistem Komputer', 'Manajemen', 'Akuntansi D3', 'Psikologi', 'Sastra Inggris', 'Manajemen Sistem Informasi', 'Magister Manajemen', 'Teknik Elektro', 'Teknologi Informasi'];
        const screenWidth = Dimensions.get('window').width;
        return (
            <Container style={{
                flex: 1,
                width: '100%'
            }}>
                {this.state.spinner ? (
                    <View style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        top: 40,
                        backgroundColor: '#fff'
                    }}>
                        <Spinner color='#598c5f' />
                    </View>
                ) : null}
                <Content style={{
                    flex: 1,
                }}>

                    <View style={{ flex: 1, justifyContent: 'space-evenly', }}>
                        <Text style={{
                            textAlign: 'center',
                            fontWeight: '400',
                            fontSize: 50,
                            marginVertical: 40
                        }}>Buat akun</Text>

                        <KeyboardAvoidingView behavior="padding" enabled>
                            <Form style={{
                                padding: 20,
                                flex: 1,
                                justifyContent: 'center'
                            }}>


                                <Item floatingLabel style={{ borderColor: '#598c5f', paddingBottom: 10 }}>
                                    <Label>Email</Label>
                                    <Input
                                        autoCapitalize='none'
                                        keyboardType='email-address'
                                        returnKeyType='done'
                                        onChangeText={this.signupEmailValChange}
                                        value={this.state.signupEmailValue} />
                                </Item>
                                <Item floatingLabel style={{ borderColor: '#598c5f', paddingBottom: 10 }}>
                                    <Label>Password atleast 6 characters</Label>
                                    <Input
                                        returnKeyType='done'
                                        secureTextEntry={true}
                                        onChangeText={this.signupPassValChange}
                                        value={this.state.signupPassValue}
                                        autoCapitalize='none'
                                    />
                                </Item>

                                <Item floatingLabel style={{ borderColor: '#598c5f', paddingBottom: 10 }}>
                                    <Label>Re-enter Password</Label>
                                    <Input
                                        returnKeyType='done'
                                        secureTextEntry={true}
                                        onChangeText={this.signupRePassValChange}
                                        value={this.state.signupRePassValue}
                                        autoCapitalize='none'
                                    />
                                </Item>

                                <Item floatingLabel style={{ borderColor: '#598c5f', paddingBottom: 10 }}>
                                    <Label>Nama</Label>
                                    <Input
                                        onChangeText={this.inputNamaProfileEvent}
                                        value={this.state.inputNamaProfile} />
                                </Item>
                                <Item floatingLabel style={{ borderColor: '#598c5f', paddingBottom: 10 }}>
                                    <Label>NPM</Label>
                                    <Input
                                        onChangeText={this.inputNPMProfileEvent}
                                        value={this.state.inputNPMProfile}
                                        autoCapitalize='none'
                                        keyboardType='number-pad' />
                                </Item>
                                <Item floatingLabel style={{ borderColor: '#598c5f', paddingBottom: 10 }}>
                                    <Label>Kelas</Label>
                                    <Input
                                        onChangeText={this.inputKelasProfileEvent}
                                        value={this.state.inputKelasProfile}
                                        autoCapitalize='sentences'

                                    />
                                </Item>
                                <Item style={{ marginTop: 10, borderColor: '#598c5f' }}>
                                    <Picker
                                        note={this.state.inputJurusanProfile === '' ? true : false}
                                        placeholder='Pilih Jurusan'
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down" />}
                                        headerBackButtonText="Back"
                                        selectedValue={this.state.inputJurusanProfile}
                                        onValueChange={this.inputJurusanProfileEvent}
                                    >
                                        {jurusan.sort().map(j => <Picker.Item label={j} key={j} value={j} />
                                        )}
                                    </Picker>
                                </Item>

                                <Button block rounded onPress={this.signupEvent}
                                    style={{
                                        marginTop: 40,
                                        backgroundColor: '#598c5f',
                                        alignSelf: 'center',
                                        width: 150,
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                    <Text>Daftar</Text>
                                </Button>
                                <Text style={{ textAlign: 'center', marginVertical: 15 }}>Sudah punya akun ?</Text>
                                <Button
                                    rounded
                                    style={{ borderColor: '#598c5f', width: 150, borderWidth: 1, display: 'flex', justifyContent: 'center', backgroundColor: 'none', alignSelf: 'center' }}
                                    bordered onPress={() => this.props.navigation.navigate('Login')} block><Text style={{ color: '#598c5f' }}>Masuk</Text></Button>
                            </Form>
                        </KeyboardAvoidingView>
                    </View>
                </Content>
            </Container>
        );
    }
}


