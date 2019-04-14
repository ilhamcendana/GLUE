import React, { Component } from 'react';
import { View, Picker, Dimensions, Image, ScrollView, Animated, Easing } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { Container, Header, Content, Right, Card, CardItem, Input, ListItem, Radio, Textarea, Form, Thumbnail, Text, Button, Icon, Left, Body, Fab, Item } from 'native-base';
import Info from '../Info/Info';
import fire from '../../config';


export default class Feed extends Component {
    state = {
        isVoteUp: false,
        isVoteDown: false,
        voteUpValue: 10,
        voteDownValue: 1,
        trendsInfo: false,
        selectedKategori: 'INFO',
        translate: new Animated.Value(100),
        selectedTdkpantasReport: false,
        selectedHoaxReport: false,
        openReport: new Animated.Value(-500),
        postImage: 'empty',
        inputPost: '',
        posts: [],
        btnPostDisabled: false
    }

    componentDidMount() {
        this.fetchingPost();
    }

    fetchingPost = () => {
        // fire.database().ref('posts').on('value', (snapshot) => {
        //     const pushing = this.state.posts.push(snapshot.val());
        //     this.setState({ posts: pushing });
        // });
        // console.log(this.state.post);
    }


    animated = () => {
        Animated.timing(this.state.translate, {
            toValue: 0,
            duration: 500,
            easing: Easing.ease
        }).start();
        this.setState({ trendsInfo: true });
        setTimeout(() => {
            Animated.timing(this.state.translate, {
                toValue: 200,
                duration: 3000,
            }).start();
            this.setState({ trendsInfo: false })
        }, 2000);
    };

    animatedBack = () => {

    };

    openReport = () => {
        Animated.timing(this.state.openReport, {
            toValue: 0,
            duration: 300
        }).start();
    };

    closeReport = () => {
        Animated.timing(this.state.openReport, {
            toValue: -500,
            duration: 500,
            easing: Easing.bounce
        }).start();
    };

    voteUp = () => {
        if (this.state.isVoteUp === false && this.state.isVoteDown === false) {
            this.setState({ isVoteUp: true, voteUpValue: this.state.voteUpValue + 1 });
        } else if (this.state.isVoteUp === true && this.state.isVoteDown === false) {
            this.setState({ isVoteUp: false, voteUpValue: this.state.voteUpValue - 1 });
        } else if (this.state.isVoteUp === false && this.state.isVoteDown === true) {
            this.setState({ isVoteUp: true, isVoteDown: false, voteUpValue: this.state.voteUpValue + 1, voteDownValue: this.state.voteDownValue - 1 });
        }
    }

    voteDown = () => {
        if (this.state.isVoteUp === false && this.state.isVoteDown === false) {
            this.setState({ isVoteDown: true, voteDownValue: this.state.voteDownValue + 1 });
        } else if (this.state.isVoteUp === false && this.state.isVoteDown === true) {
            this.setState({ isVoteDown: false, voteDownValue: this.state.voteDownValue - 1 });
        } else if (this.state.isVoteUp === true && this.state.isVoteDown === false) {
            this.setState({ isVoteUp: false, isVoteDown: true, voteDownValue: this.state.voteDownValue + 1, voteUpValue: this.state.voteUpValue - 1 });
        }
    }


    InputChangePost = (e) => {
        this.setState({ inputPost: e })
    }

    // IMAGE FROM PHONE EVENT POST
    PickImagePost = async () => {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        if (!result.cancelled) {
            this.setState({ postImage: resultCamera.uri });
            // const response = await fetch(result.uri);
            // const blob = await response.blob();
            // let ref = fire.storage().ref('users/' + uid + '/profilePict/').child("profilePict");
            // return ref.put(blob).then(() => {
            //   this.setState({ profilePictCondition: 'Uploaded!!!' });
            // }).catch((error) => {
            //   this.setState({ profilePictCondition: 'Upload error' });
            // });
        }
    }

    TakeImagePost = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        let resultCamera = await ImagePicker.launchCameraAsync({
            allowsEditing: false
        });
        if (!resultCamera.cancelled) {
            this.setState({ postImage: resultCamera.uri });
            // const response = await fetch(resultCamera.uri);
            // const blob = await response.blob();
            // let ref = fire.storage().ref('users/' + uid + '/profilePict/').child("profilePict");
            // return ref.put(blob).then(() => {
            //   this.setState({ profilePictCondition: 'Uploaded!!!' });
            // }).catch((error) => {
            //   this.setState({ profilePictCondition: 'Upload error' });
            // });
        };
    };

    //END IMAGE FROM PHONE EVENT POST------------------------------


    //SEND POST TO DATABASE
    sendpost = () => {
        this.setState({ btnPostDisabled: true });
        const { inputPost, selectedKategori } = this.state;
        const uid = this.props.uid;
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!
        let yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        let todayDate = mm + '-' + dd + '-' + yyyy;
        const postData = {
            caption: inputPost,
            category: selectedKategori,
            date: todayDate,
            name: fire.database().ref('users' + fire.auth().currentUser.uid + '/profile/nama'),
            totalUp: null,
            totalDown: null,
            totalComment: null,
            totalReport: null,
            isTrend: false,
            isReported: false
        }
        let newPostKey = fire.database().ref().child('posts').push().key;
        let updates = {};
        updates['/posts/' + newPostKey] = postData;
        updates['/users/' + uid + '/posts/' + newPostKey] = postData;
        return fire.database().ref().update(updates).then(() => this.setState({ btnPostDisabled: false }));
    };
    //END SEND POST TO DATABASE----------

    render() {
        const voteColorUp = this.state.isVoteUp ? { color: '#22d62b' } : { color: '#660066' };
        const voteColorDown = this.state.isVoteDown ? { color: '#f2101c' } : { color: '#660066' };
        return (
            <Container>
                <Content>
                    <ScrollView>
                        <View style={{ width: '100%', paddingHorizontal: 20, paddingTop: 10, backgroundColor: '#660066', height: 220, justifyContent: 'space-between' }}>
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
                                <View style={{ width: '15%', marginTop: 10 }}>
                                    <Thumbnail source={require('../../assets/ProfileIcon.png')} small />
                                </View>
                                <Form style={{ width: '85%', }}>
                                    <Textarea
                                        onChangeText={this.InputChangePost}
                                        bordered placeholder="Write something"
                                        placeholderTextColor="#660066"
                                        value={this.state.inputPost}
                                        style={{ borderRadius: 10, borderColor: '#fff', paddingTop: 8, backgroundColor: '#fff', color: '#660066', height: 40 }} />
                                    <View style={{ flexDirection: 'row', paddingVertical: 15, marginTop: 15, alignItems: 'center' }}>

                                        <View>
                                            <Text style={{ color: '#fff', }}>Pilih kategori</Text>
                                            <View style={{ backgroundColor: '#fff', borderRadius: 10, width: 150, padding: 0, height: 30 }}>
                                                <Picker
                                                    selectedValue={this.state.selectedKategori}
                                                    style={{ height: 50, color: '#660066', maxHeight: 30 }}
                                                    onValueChange={(itemValue, itemIndex) =>
                                                        this.setState({ selectedKategori: itemValue })
                                                    }
                                                >
                                                    <Picker.Item label='INFO' value='INFO' />
                                                    <Picker.Item label='PENGADUAN' value='PENGADUAN' />
                                                </Picker>
                                            </View>
                                        </View>
                                        <Image source={{ uri: this.state.postImage }} style={{ width: 50, height: 50, marginLeft: 15 }} />
                                    </View>
                                </Form>
                            </View>

                            <View style={{ width: '100%', backgroundColor: '#660066', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10 }}>
                                <View style={{ flexDirection: 'row', width: '50%' }}>
                                    <Button style={{ marginRight: 10, backgroundColor: '#fff' }} small rounded onPress={this.TakeImagePost}>
                                        <Icon type='Feather' name='camera' style={{ color: '#660066' }} />
                                    </Button>
                                    <Button small rounded style={{ backgroundColor: '#fff' }} onPress={this.PickImagePost}>
                                        <Icon type='Feather' name='image' style={{ color: '#660066' }} />
                                    </Button>
                                </View>
                                <Button rounded style={{ backgroundColor: '#fff' }} onPress={this.sendpost} disabled={this.state.btnPostDisabled}>
                                    <Text style={{ color: '#660066' }}>POST</Text>
                                </Button>
                            </View>

                        </View>


                        <Card style={{ flex: 0, }}>
                            <CardItem>
                                <Left>
                                    <Thumbnail source={require('../../assets/ProfileIcon.png')} />
                                    <Body>
                                        <Text>Ilham Cendana</Text>
                                        <Text note>April 15, 2019</Text>
                                    </Body>
                                    <Right>
                                        <Button transparent onPress={() => this.animated()}>
                                            <Icon type='Ionicons' name={this.state.trendsInfo ? 'star' : 'star-outline'} style={{ color: '#660066' }} />
                                        </Button>
                                    </Right>
                                </Left>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Image source={{ uri: 'https://placeimg.com/740/580/tech' }} style={{ height: 200, width: '100%', marginBottom: 10, flex: 1 }} />
                                    <Text>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero recusandae, reprehenderit, delectus itaque inventore, reiciendis est ratione repellat facere cupiditate assumenda harum quae ducimus quibusdam. Ex, fugit! A, rem quo.
                                            </Text>
                                </Body>
                            </CardItem>
                            <CardItem>
                                <Left>
                                    <Button transparent style={{ justifyContent: 'center' }} onPress={this.voteUp}>
                                        <Icon name="arrow-up-circle" type='Feather'
                                            style={voteColorUp} /><Text style={voteColorUp}>{this.state.voteUpValue}</Text>

                                    </Button>

                                    <Button transparent style={{ justifyContent: 'center' }} onPress={this.voteDown}>
                                        <Icon name="arrow-down-circle" type='Feather'
                                            style={voteColorDown} /><Text style={voteColorDown}>{this.state.voteDownValue}</Text>
                                    </Button>

                                    <Button transparent style={{ justifyContent: 'center' }} onPress={() => this.animated()}>
                                        <Icon name="chatbubbles" style={{ color: '#660066' }} /><Text style={{ color: '#660066' }}>123</Text>
                                    </Button>
                                </Left>

                                <Body></Body>

                                <Right>
                                    <Button transparent style={{ justifyContent: 'center', width: 40 }} onPress={() => this.openReport()}>
                                        <Icon name="alert" type='Ionicons' style={{ color: '#660066' }} />
                                    </Button>
                                </Right>
                            </CardItem>
                        </Card>
                    </ScrollView>

                </Content>

                <Animated.View style={{ backgroundColor: '#fff', translateX: this.state.openReport, position: 'absolute', bottom: 0, width: '100%', paddingVertical: 10 }}>
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
                </Animated.View>

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
            </Container>
        );
    }

}

