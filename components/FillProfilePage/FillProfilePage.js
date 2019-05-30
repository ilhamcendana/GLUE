import React, { Component } from 'react';
import { View, KeyboardAvoidingView, Dimensions, ScrollView } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
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
    Thumbnail,
    Header,
    Left,
    Body,
    Right
} from 'native-base';
import firebase from 'firebase';
import 'firebase/firestore';

class FillProfilePage extends Component {
    state = {
        inputNamaProfile: '',
        inputNPMProfile: '',
        inputTingkat: '',
        inputKJ: '',
        inputKK: '',
        inputJurusanProfile: '',
        selectedJurusan: null,
        profilePictUrl: '',
        isVerified: '',
        userEmail: '',
        totalPost: '',
        totalTrends: '',
        totalVote: '',
        spinner: false,
        posts: [],
        oldProfilePictUrl: ''
    }

    componentDidMount() {
        this.fetchProfileData();
        const { displayName, photoURL } = firebase.auth().currentUser;
        this.setState({
            inputNamaProfile: displayName,
            profilePictUrl: photoURL,
            oldProfilePictUrl: photoURL
        });
        let posts = [];
        firebase.firestore().collection('posts').where('uid', '==', firebase.auth().currentUser.uid)
            .onSnapshot(snap => {
                snap.forEach(child => posts.push(child.id))
            })
        this.setState({ posts });
    };

    fetchProfileData = () => {
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).onSnapshot(snap => {
            this.setState({
                selectedJurusan: snap.data().profile.selected_jur,
                inputTingkat: snap.data().profile.tingkat,
                inputKJ: snap.data().profile.kode_jur,
                inputKK: snap.data().profile.kode_kel,
                inputNPMProfile: snap.data().profile.npm,
                inputJurusanProfile: snap.data().profile.jurusan,
            });
        });
    };

    // IMAGE FROM PHONE EVENT SIGNUP
    _pickImage = async () => {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3]
        });

        if (!result.cancelled) {
            this.setState({ profilePictUrl: result.uri });
        }
    }


    _takeImage = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3]
        });
        if (!result.cancelled) {
            this.setState({ profilePictUrl: result.uri });
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
        const ref = firebase
            .storage()
            .ref('PROFILE-PICTURE/' + 'PP_' + firebase.auth().currentUser.uid);
        const snapshot = await ref.put(blob);

        // We're done with the blob, close and release it
        blob.close();
        const profilPictUrl = await snapshot.ref.getDownloadURL();
        return this.setState({ profilePictUrl: profilPictUrl });
    }
    //END IMAGE FROM PHONE EVENT SIGNUP------------------------------

    changeEditProfile = () => {
        const { selectedJurusan, inputTingkat, inputKJ, inputKK, inputNamaProfile, inputNPMProfile, inputJurusanProfile, profilePictUrl } = this.state;

        if (inputNamaProfile === '' || inputNPMProfile === '' || inputJurusanProfile === '') {
            Alert.alert('INVALID', 'Semua kolom tidak boleh kosong atau NPM kurang dari 8 karakter');
            this.setState({ spinner: false });
        } else if (inputNPMProfile.length !== 8) {
            Alert.alert('NPM kurang atau lebih dari 8 karakter');
            this.setState({ spinner: false });
        } else {

            this.setState({ spinner: true });

            if (this.state.oldProfilePictUrl !== this.state.profilePictUrl) {
                this.uploadProfilPict(this.state.profilePictUrl)
                    .then(() => {
                        firebase.auth().currentUser.updateProfile({
                            displayName: inputNamaProfile,
                            photoURL: profilePictUrl
                        });

                        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
                            .set({
                                profile: {
                                    nama: inputNamaProfile,
                                    profilePict: profilePictUrl,
                                    npm: inputNPMProfile,
                                    kelas: inputTingkat + inputKJ + inputKK,
                                    tingkat: inputTingkat,
                                    kode_jur: inputKJ,
                                    kode_kel: inputKK,
                                    jurusan: inputJurusanProfile,
                                    selected_jur: selectedJurusan,
                                    profilePictUrl: profilePictUrl
                                }
                            }, { merge: true });

                        for (let i = 0; i < this.state.posts.length; i++) {
                            firebase.firestore().collection('posts').doc(this.state.posts[i]).set({
                                profilePict: profilePictUrl,
                                nama: inputNamaProfile
                            }, { merge: true })
                        }

                    }).then(() => {
                        this.setState({ spinner: false })
                        this.props.navigation.navigate('Profile');
                        alert('success');
                    })
                    .catch((err) => alert(err))
            } else {
                firebase.auth().currentUser.updateProfile({
                    displayName: inputNamaProfile,
                    photoURL: profilePictUrl
                });

                for (let i = 0; i < this.state.posts.length; i++) {
                    firebase.firestore().collection('posts').doc(this.state.posts[i]).set({
                        nama: inputNamaProfile
                    }, { merge: true })
                }

                firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
                    .set({
                        profile: {
                            nama: inputNamaProfile,
                            profilePict: profilePictUrl,
                            npm: inputNPMProfile,
                            kelas: inputTingkat + inputKJ + inputKK,
                            tingkat: inputTingkat,
                            kode_jur: inputKJ,
                            kode_kel: inputKK,
                            jurusan: inputJurusanProfile,
                            selected_jur: selectedJurusan,
                            profilePictUrl: profilePictUrl
                        }
                    }, { merge: true })
                    .then(() => {
                        this.setState({ spinner: false })
                        this.props.navigation.navigate('Profile');
                        alert('success');
                    })
                    .catch((err) => alert(err))
            }
        }

    }


    render() {
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        const jurusan = ['D3 Manajemen Informatika', 'D3 Teknik Komputer', 'D3 Akuntansi', 'D3 Manajemen', 'D3 Kebidanan', 'S1 Sistem Informasi', 'S1 Sistem Komputer', 'S1 Teknik Informatika', 'S1 Teknik Elektro', 'S1 Teknik Mesin', 'S1 Teknik Industri', 'S1 Manajemen', 'S1 Akuntansi', 'S1 Teknik Sipil', 'S1 Teknik Arsitektur', 'S1 Psikologi', 'S1 Sastra'];
        const tingkat = ['1', '2', '3', '4'];
        const kode_jur = ['DB', 'DC', 'DA', 'DD', 'DE', 'KA', 'KB', 'IA', 'IB', 'IC', 'ID', 'EA', 'EB', 'TA', 'TB', 'PA', 'SA'];
        const kode_kel = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

        return (
            <Container style={{
                flex: 1,
                width: '100%',
            }}>
                <Header style={{ backgroundColor: '#598c5f' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu' type='Feather' />
                        </Button>
                    </Left>
                    <Body style={{ alignItems: 'center', flex: 1 }}><Text style={{ color: '#fff' }}>Edit Profile</Text></Body>
                    <Right style={{ flex: 1 }}>
                        <Button transparent>
                            <Icon type='Feather' name='more-horizontal' />
                        </Button>
                    </Right>
                </Header>
                {this.state.spinner ? <Spinner color='#598c5f' style={{ position: 'absolute', alignSelf: 'center', marginTop: 40, zIndex: 100 }} /> : null}
                <ScrollView>
                    <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                        <KeyboardAvoidingView behavior="padding" enabled>
                            <View style={{ width: '100%', alignItems: 'center', marginVertical: 40 }}>
                                <Thumbnail source={{ uri: this.state.profilePictUrl }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                            </View>
                            <View style={{ width: screenWidth, flexDirection: 'row', justifyContent: 'space-around', }}>
                                <Button style={{ backgroundColor: '#598c5f' }} rounded onPress={this._takeImage}>
                                    <Text style={{ color: '#fff' }}>Camera</Text>
                                </Button>
                                <Button style={{ backgroundColor: '#598c5f' }} rounded onPress={this._pickImage}>
                                    <Text style={{ color: '#fff' }}>gallery</Text>
                                </Button>
                            </View>

                            <Form style={{
                                padding: 20,
                                flex: 1,
                                justifyContent: 'center'
                            }}>

                                <Item floatingLabel style={{ borderColor: '#598c5f', paddingBottom: 10 }}>
                                    <Label>Nama</Label>
                                    <Input
                                        onChangeText={(e) => this.setState({ inputNamaProfile: e })}
                                        value={this.state.inputNamaProfile} />
                                </Item>
                                <Item floatingLabel style={{ borderColor: '#598c5f', paddingBottom: 10 }}>
                                    <Label>NPM</Label>
                                    <Input
                                        onChangeText={(e) => this.setState({ inputNPMProfile: e })}
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

                                <View style={{ width: '100%', flexDirection: 'row-reverse', marginVertical: 40, justifyContent: 'space-around' }}>
                                    <Button block rounded onPress={this.changeEditProfile}
                                        style={{
                                            backgroundColor: '#598c5f',
                                            alignSelf: 'center',
                                            width: 100,
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}>
                                        <Text>SIMPAN</Text>
                                    </Button>
                                    <Button
                                        rounded
                                        style={{ borderColor: '#598c5f', width: 100, borderWidth: 1, display: 'flex', justifyContent: 'center', backgroundColor: 'none', alignSelf: 'center' }}
                                        bordered onPress={() => {
                                            this.props.navigation.navigate('Profile');
                                        }} block><Text style={{ color: '#598c5f' }}>Kembali</Text>
                                    </Button>
                                </View>
                            </Form>
                        </KeyboardAvoidingView>
                    </View>
                </ScrollView>
            </Container>
        );
    }
}

export default FillProfilePage;

