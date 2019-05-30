import React, { Component } from 'react';
import { View, KeyboardAvoidingView, Dimensions, Alert } from 'react-native';
import {
    Container,
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
import { ScrollView } from 'react-native-gesture-handler';

export default class SignUpPage extends Component {
    state = {
        spinner: false,
        signupEmailValue: '',
        signupPassValue: '',
        signupRePassValue: '',
        inputNamaProfile: '',
        inputTingkat: '1',
        inputKJ: 'DB',
        inputKK: '01',
        inputJurusanProfile: 'D3 Manajemen Informatika',
        selectedJurusan: 0
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

    inputNPMProfileEvent = e => {
        this.setState({ inputNPMProfile: e });
    };

    signupEvent = () => {
        const { selectedJurusan, signupEmailValue, inputTingkat, inputKJ, inputKK, signupRePassValue, signupPassValue, inputNamaProfile, inputNPMProfile, inputJurusanProfile } = this.state;
        this.setState({ spinner: true });
        if (inputNamaProfile === '' || signupEmailValue === '' || signupPassValue === '' || inputNPMProfile === '' || inputJurusanProfile === '') {
            Alert.alert('INVALID', 'Semua kolom tidak boleh kosong atau NPM kurang dari 8 karakter');
            this.setState({ spinner: false });
        } else if (signupRePassValue !== signupPassValue) {
            Alert.alert('Password tidak sama');
            this.setState({ spinner: false });
        } else if (inputNPMProfile.length !== 8) {
            Alert.alert('NPM kurang atau lebih dari 8 karakter');
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
                            kelas: inputTingkat + inputKJ + inputKK,
                            tingkat: inputTingkat,
                            kode_jur: inputKJ,
                            kode_kel: inputKK,
                            selected_jur: selectedJurusan,
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
                                inputNPMProfile: '',
                                inputJurusanProfile: '',
                                signupEmailValue: '',
                                signupPassValue: '',
                                spinner: false,
                            });
                        });
                        Alert.alert('Email verifikasi telah dikirim ke email anda');
                    }).catch((error) => {
                        alert(error);
                        this.setState({ spinner: false });
                    });
                })
        }
    }
    //END ALL SIGNUP EVENT ---------------------------

    render() {
        const jurusan = ['D3 Manajemen Informatika', 'D3 Teknik Komputer', 'D3 Akuntansi', 'D3 Manajemen', 'D3 Kebidanan', 'S1 Sistem Informasi', 'S1 Sistem Komputer', 'S1 Teknik Informatika', 'S1 Teknik Elektro', 'S1 Teknik Mesin', 'S1 Teknik Industri', 'S1 Manajemen', 'S1 Akuntansi', 'S1 Teknik Sipil', 'S1 Teknik Arsitektur', 'S1 Psikologi', 'S1 Sastra'];
        const tingkat = ['1', '2', '3', '4'];
        const kode_jur = ['DB', 'DC', 'DA', 'DD', 'DE', 'KA', 'KB', 'IA', 'IB', 'IC', 'ID', 'EA', 'EB', 'TA', 'TB', 'PA', 'SA'];
        const kode_kel = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
        // const screenWidth = Dimensions.get('window').width;
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

                <View style={{ flex: 1, justifyContent: 'space-evenly', }}>
                    <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={20}>
                        <ScrollView>
                            <Text style={{
                                textAlign: 'center',
                                fontWeight: '500',
                                fontSize: 50,
                                marginVertical: 20
                            }}>Buat akun</Text>
                            <Form style={{
                                padding: 20,
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
                                <Item style={{ borderColor: '#598c5f', paddingBottom: 10, alignItems: 'center' }}>
                                    <Label>Kelas</Label>
                                    <Picker
                                        note={false}
                                        placeholder='Kelas'
                                        mode="dialog"
                                        iosIcon={<Icon name="arrow-down" />}
                                        headerBackButtonText="Back"
                                        onValueChange={(e) => this.setState({ inputTingkat: e })}
                                        selectedValue={this.state.inputTingkat}>

                                        {tingkat.map(t => <Picker.Item label={t} key={t} value={t} />)}

                                    </Picker>
                                    <Picker
                                        note={false}
                                        placeholder='Kelas'
                                        mode="dialog"
                                        iosIcon={<Icon name="arrow-down" />}
                                        headerBackButtonText="Back"
                                        onValueChange={(e, i) => this.setState({ inputKJ: e, selectedJurusan: i, inputJurusanProfile: jurusan[i] })}
                                        selectedValue={this.state.inputKJ}>

                                        {kode_jur.map(kj => <Picker.Item label={kj} key={kj} value={kj} />)}

                                    </Picker>
                                    <Picker
                                        note={false}
                                        placeholder='Kelas'
                                        mode="dialog"
                                        iosIcon={<Icon name="arrow-down" />}
                                        headerBackButtonText="Back"
                                        onValueChange={(e) => this.setState({ inputKK: e })}
                                        selectedValue={this.state.inputKK}>

                                        {kode_kel.map(kk => <Picker.Item label={kk} key={kk} value={kk} />)}

                                    </Picker>

                                </Item>
                                <Item style={{ marginTop: 10, borderColor: '#598c5f', paddingVertical: 20 }}>
                                    <Text>Jurusan: {jurusan[this.state.selectedJurusan]}</Text>
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
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </Container>
        );
    }
}


