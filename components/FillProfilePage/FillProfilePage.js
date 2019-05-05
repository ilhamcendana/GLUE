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
        inputKelasProfile: '',
        inputNPMProfile: '',
        inputJurusanProfile: '',
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
                inputKelasProfile: snap.data().profile.kelas,
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
            aspect: [3, 3]
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
            .ref('PROFILE-PICTURE/' + 'PP_' + date.getDay() + '-' + date.getMonth() + '-' + date.getFullYear() + '::' + date.getMilliseconds());
        const snapshot = await ref.put(blob);

        // We're done with the blob, close and release it
        blob.close();
        const profilPictUrl = await snapshot.ref.getDownloadURL();
        return this.setState({ profilePictUrl: profilPictUrl });
    }
    //END IMAGE FROM PHONE EVENT SIGNUP------------------------------

    changeEditProfile = () => {
        const { inputJurusanProfile, inputKelasProfile, inputNPMProfile, inputNamaProfile, profilePictUrl } = this.state;
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
                                kelas: inputKelasProfile,
                                npm: inputNPMProfile,
                                jurusan: inputJurusanProfile,
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
                        kelas: inputKelasProfile,
                        npm: inputNPMProfile,
                        jurusan: inputJurusanProfile,
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


    render() {
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        const jurusan = ['Manajemen Informatika', 'Teknik Komputer', 'Manajemen Keuangan', 'Manajemen Pemasaran', 'Akuntansi', 'Teknik Informatika', 'Teknik Industri', 'Teknik Mesin', 'Teknik Elektro', 'Teknik Sipil', 'Arsitektur', 'Sistem Informasi', 'Sistem Komputer', 'Manajemen', 'Akuntansi D3', 'Psikologi', 'Sastra Inggris', 'Manajemen Sistem Informasi', 'Magister Manajemen', 'Teknik Elektro', 'Teknologi Informasi'];


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
                                <Item floatingLabel style={{ borderColor: '#598c5f', paddingBottom: 10 }}>
                                    <Label>Kelas</Label>
                                    <Input
                                        onChangeText={(e) => this.setState({ inputKelasProfile: e })}
                                        value={this.state.inputKelasProfile}
                                        autoCapitalize='none'

                                    />
                                </Item>
                                <Item style={{ marginTop: 10, borderColor: '#598c5f' }}>
                                    <Label>Jurusan</Label>
                                    <Picker
                                        note={this.state.inputJurusanProfile === '' ? true : false}
                                        placeholder='Pilih Jurusan'
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down" />}
                                        headerBackButtonText="Back"
                                        selectedValue={this.state.inputJurusanProfile}
                                        onValueChange={(e) => this.setState({ inputJurusanProfile: e })}
                                    >
                                        {jurusan.sort().map(j => <Picker.Item label={j} key={j} value={j} />
                                        )}
                                    </Picker>
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

