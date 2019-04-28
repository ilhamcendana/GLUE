import React, { Component } from 'react';
import { View, Dimensions, Animated, KeyboardAvoidingView } from 'react-native';
import { Spinner, Form, Textarea, Input, Item, Content, Icon, Left, Right, Button, Text, Toast, Header, Body, Thumbnail, Container } from 'native-base';
import { ImagePicker, Permissions } from 'expo';
import * as firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';


export default class InputPengaduan extends Component {
    state = {
        spinner: false,
        postPict: '',
        postPictUrl: '',
        postedAnim: new Animated.Value(0),
        success: false,
        caption: '',
        username: '',
        disablePostButton: false
    }

    componentDidMount() {
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/profile')
            .on('value', (snapshot) => {
                this.setState({
                    username: snapshot.val().nama
                })
            });
    }


    postedAnim = () => {
        Animated.timing(this.state.postedAnim, {
            toValue: 1,
            duration: 500,
            delay: 150
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
        if (this.state.postPict !== '') {
            this.uploadProfilPict(this.state.postPict)
                .then(() => {
                    // A post entry.
                    const uid = firebase.auth().currentUser.uid;
                    // Get a key for a new Post.
                    let newPostKey = firebase.database().ref().child('posts').push().key;
                    let postData = {
                        username: this.state.username,
                        uid: uid,
                        caption: this.state.caption,
                        postPict: this.state.postPictUrl,
                        postInfo: {
                            totalUpVote: 0,
                            totalDownVote: 0,
                            totalRepor: 0,
                            isTrend: false,
                        },
                        date: {
                            todayDate: todayDate,
                            todayTime: todayTime,
                        },
                        key: newPostKey
                    };

                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    let updates = {};
                    updates['posts/' + newPostKey] = postData;
                    updates['users/' + uid + '/posts/' + '/' + newPostKey] = postData;

                    firebase.database().ref().update(updates);
                }).then(() => {
                    this.setState({ success: true, spinner: false });
                    this.postedAnim();
                })
                .catch((err) => console.log(err));
        } else {
            // A post entry.
            const uid = firebase.auth().currentUser.uid;
            // Get a key for a new Post.
            let newPostKey = firebase.database().ref().child('posts').push().key;
            let postData = {
                username: this.state.username,
                uid: uid,
                caption: this.state.caption,
                postPict: this.state.postPictUrl,
                postInfo: {
                    totalUpVote: 0,
                    totalDownVote: 0,
                    totalRepor: 0,
                    isTrend: false,
                },
                date: {
                    todayDate: todayDate,
                    todayTime: todayTime,
                },
                key: newPostKey
            };


            // Write the new post's data simultaneously in the posts list and the user's post list.
            let updates = {};
            updates['posts/' + newPostKey] = postData;
            updates['users/' + uid + '/posts/' + '/' + newPostKey] = postData;

            firebase.database().ref().update(updates).then(() => {
                this.setState({ success: true, spinner: false, disablePostButton: false });
                this.postedAnim();
            })
                .catch((err) => console.log(err));
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
                            disabled={this.state.disablePostButton}
                            onPress={this.POSTING}
                            style={{ backgroundColor: '#fff', alignItems: 'center' }}>
                            <Text style={{ color: '#598c5f' }}>Post</Text>
                        </Button>
                    </Right>
                </Header>
                <Content padder>
                    {spinner}
                    <ScrollView>
                        <KeyboardAvoidingView enabled behavior='padding'>
                            <Form style={{ marginTop: 20 }}>
                                <View style={{ flexDirection: 'row', marginBottom: 15, }}>
                                    <Button small rounded style={{ backgroundColor: '#598c5f', marginRight: 20 }} onPress={this.takeImage}>
                                        <Icon type='Feather' name='camera' />
                                    </Button>
                                    <Button small rounded style={{ backgroundColor: '#598c5f' }} onPress={this.pickImage}>
                                        <Icon type='Feather' name='image' />
                                    </Button>
                                </View>
                                <Textarea style={{ borderRadius: 10, paddingVertical: 10 }} bordered
                                    rowSpan={5}
                                    autoFocus={true}
                                    placeholder='isi pengaduan'
                                    returnKeyType='default' onChangeText={(e) => this.setState({ caption: e })} value={this.state.caption} />
                            </Form>
                            {PreviewPict}
                        </KeyboardAvoidingView>
                    </ScrollView>
                </Content>
            </Container>
        );
    }
}





