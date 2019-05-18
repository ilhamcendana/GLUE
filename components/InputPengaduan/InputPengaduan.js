import React, { Component } from 'react';
import { View, Dimensions, Animated, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { Spinner, Form, Textarea, Input, Item, Content, Icon, Left, Right, Button, Text, Toast, Header, Body, Thumbnail, Container, Picker } from 'native-base';
import { ImagePicker, Permissions } from 'expo';
import * as firebase from 'firebase';
import 'firebase/firestore';
import ImageResizer from 'react-native-image-resizer';


export default class InputPengaduan extends Component {
    state = {
        spinner: false,
        postPict: '',
        postPictUrl: '',
        resizedImageUri: '',
        postedAnim: new Animated.Value(0),
        success: false,
        caption: '',
        username: '',
        uid: '',
        profilePictUrl: '',
        selectCategory: 'Info',
        currentTotal: 0,
        disablePostButton: false,
    }

    componentDidMount() {
        const { displayName, uid, photoURL } = firebase.auth().currentUser;
        this.setState({
            username: displayName,
            uid: uid,
            profilePictUrl: photoURL
        });
        firebase.firestore().collection('users').doc(uid).get().then(snap => this.setState({ currentTotal: snap.data().profile.totalPost }));
    }


    postedAnim = () => {
        Animated.timing(this.state.postedAnim, {
            toValue: 1,
            duration: 200,
        }).start(() => {
            this.postedClosedAnim();
        })
    }

    postedClosedAnim = () => {
        Animated.timing(this.state.postedAnim, {
            toValue: 1,
            duration: 500,
            delay: 800
        }).start(() => {
            this.setState({
                success: false
            });
            this.props.navigation.navigate('FeedComponent')
        })
    }


    // IMAGE FROM PHONE EVENT SIGNUP
    pickImage = async () => {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 5]
        });
        if (!result.cancelled) {
            this.setState({ postPict: result.uri });
        }
    }


    takeImage = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 5]
        });
        if (!result.cancelled) {
            this.setState({ postPict: result.uri });
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
            .ref('POST-PICTURE/' + 'POSTP_' + date.getDay() + '-' + date.getMonth() + '-' + date.getFullYear() + '::' + date.getMilliseconds());
        const snapshot = await ref.put(blob);

        // We're done with the blob, close and release it
        blob.close();
        const postPictUrl = await snapshot.ref.getDownloadURL();
        return this.setState({ postPictUrl });
    }
    //END IMAGE FROM PHONE EVENT SIGNUP------------------------------


    POSTING = () => {
        this.setState({ spinner: true, disablePostButton: true });
        const date = new Date();
        const monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const month = date.getMonth();
        const todayDate = date.getDate() + '-' + monthName[month] + '-' + date.getFullYear();
        const todayTime = date.getHours() + ':' + date.getMinutes();
        const mergeDate = `${date.getFullYear()}${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`;
        if (firebase.auth().currentUser.emailVerified === true) {
            if (this.state.postPict !== '') {
                this.uploadProfilPict(this.state.postPict)
                    .then(() => {
                        const { username, uid, caption, postPictUrl, profilePictUrl, selectCategory } = this.state;
                        firebase.firestore().collection("posts").add({
                            nama: username,
                            uid: uid,
                            caption: caption,
                            category: selectCategory,
                            postPict: postPictUrl,
                            profilePict: profilePictUrl,
                            totalUpVote: 0,
                            postInfo: {
                                totalReported: 0,
                                totalComments: 0
                            },
                            userWhoLiked: {},
                            userWhoReported: {},
                            todayDate: todayDate,
                            todayTime: todayTime,
                            mergeDate: mergeDate,
                            key: '',
                            isTrend: false,
                        }).then((docRef) => {
                            firebase.firestore().collection('posts').doc(docRef.id).set({ key: docRef.id }, { merge: true });
                        })
                            .then(() => {
                                const ref = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
                                ref.set({
                                    profile: { totalPost: this.state.currentTotal + 1 }
                                }, { merge: true })
                            })
                            .then(() => {
                                this.setState({ success: true, spinner: false });
                                this.postedAnim();
                            })
                            .catch((err) => {
                                alert.alert(err);
                                this.setState({ disablePostButton: false });
                                console.log(err)
                            });
                    })
                    .catch(err => console.log(err));


            } else {
                const { username, uid, caption, postPictUrl, profilePictUrl, selectCategory } = this.state;
                firebase.firestore().collection("posts").add({
                    nama: username,
                    uid: uid,
                    caption: caption,
                    postPict: postPictUrl,
                    profilePict: profilePictUrl,
                    category: selectCategory,
                    totalUpVote: 0,
                    postInfo: {
                        totalReported: 0,
                        totalComments: 0
                    },
                    userWhoLiked: {},
                    userWhoReported: {},
                    todayDate: todayDate,
                    todayTime: todayTime,
                    mergeDate: mergeDate,
                    key: '',
                    isTrend: false,
                }).then((docRef) => {
                    firebase.firestore().collection('posts').doc(docRef.id).set({ key: docRef.id }, { merge: true });
                })
                    .then(() => {
                        const ref = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
                        ref.set({
                            profile: { totalPost: this.state.currentTotal + 1 }
                        }, { merge: true })
                    })
                    .then(() => {
                        this.setState({ success: true, spinner: false });
                        this.postedAnim();
                    })
                    .catch((err) => {
                        Alert.alert(err);
                        this.setState({ disablePostButton: false });
                        console.log(err)
                    });
            }
        } else {
            Alert.alert('Email belum diverifikasi', 'Anda harus verifikasi email agar dapat membuat post');
            this.setState({ spinner: false })
        }
    }
    render() {
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;


        const spinner = this.state.spinner ? (
            <View style={{ width: screenWidth, alignItems: 'center', position: 'absolute', zIndex: 100, }}>
                <Spinner color='green' />
            </View>
        ) : null;

        const success = this.state.success ? (
            <Animated.View style={{ opacity: this.state.postedAnim, zIndex: 101, width: screenWidth, height: screenHeight, position: 'absolute', backgroundColor: '#598c5f', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 45 }}>POSTED !</Text>
            </Animated.View>
        ) : null;

        const PreviewPict = this.state.postPict !== '' ? (
            <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>
                <Thumbnail square source={{ uri: this.state.postPict }} style={{ width: 250, height: 250 }} />
            </View>
        ) : null;
        return (
            <Container>
                {success}
                <Header style={{ backgroundColor: '#598c5f' }}>
                    <Left style={{ flex: 1 }}>
                        <Button bordered rounded onPress={() => this.props.navigation.navigate('FeedComponent')} style={{ alignItems: 'center', borderColor: '#fff' }} small>
                            <Text style={{ color: '#fff' }}>Cancel</Text>
                        </Button>
                    </Left>
                    <Body style={{ alignItems: 'center', flex: 1 }}><Text style={{ color: '#fff' }}>Create Post</Text></Body>
                    <Right style={{ flex: 1 }}>
                        <Button rounded small
                            disabled={this.state.caption === '' || this.state.disablePostButton === true ? true : false}
                            onPress={this.POSTING}
                            style={this.state.caption === '' || this.state.disablePostButton === true ? { backgroundColor: '#47684a', color: '#fff', alignItems: 'center' } : { backgroundColor: '#fff', alignItems: 'center' }}>
                            <Text style={{ color: '#598c5f' }}>Post</Text>
                        </Button>
                    </Right>
                </Header>
                <Content padder>
                    {spinner}
                    <ScrollView>
                        <KeyboardAvoidingView enabled behavior='padding'>
                            <Form style={{ marginTop: 20 }}>
                                <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
                                    <Button small rounded style={{ backgroundColor: '#598c5f', marginRight: 20, alignSelf: 'center' }} onPress={this.takeImage}>
                                        <Icon type='Feather' name='camera' />
                                    </Button>
                                    <Button small rounded style={{ backgroundColor: '#598c5f', marginRight: 20, alignSelf: 'center' }} onPress={this.pickImage}>
                                        <Icon type='Feather' name='image' />
                                    </Button>
                                    <Picker
                                        note
                                        mode='dialog'
                                        onValueChange={(e) => this.setState({ selectCategory: e })}
                                        selectedValue={this.state.selectCategory}

                                    >
                                        <Picker.Item label='Info' value='Info' />
                                        <Picker.Item label='Fasilitas' value='Fasilitas' />
                                        <Picker.Item label='Sosial' value='Sosial' />
                                    </Picker>
                                </View>
                                <Textarea style={{ borderRadius: 10, paddingVertical: 10 }} bordered
                                    rowSpan={5}
                                    autoFocus={true}
                                    placeholder='isi pengaduan'
                                    returnKeyType='default'
                                    onChangeText={(e) => {
                                        this.setState({ caption: e });
                                    }} value={this.state.caption} />
                            </Form>
                            {PreviewPict}
                        </KeyboardAvoidingView>
                    </ScrollView>
                </Content>
            </Container>
        );
    }
}





