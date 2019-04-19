import React, { Component } from 'react';
import { View, Picker, Dimensions, Image, ScrollView, Animated, Easing } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { Container, Header, Content, Right, Card, CardItem, Input, ListItem, Radio, Textarea, Form, Thumbnail, Text, Button, Icon, Left, Body, Fab, Item } from 'native-base';
import Info from '../Info/Info';
import fire from '../../config';
import Swiper from 'react-native-swiper';


export default class Feed extends Component {
    state = {
        swiperHeaderTitle: 'GLUE',
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
        const screenWidth = Dimensions.get('window').width;
        const voteColorUp = this.state.isVoteUp ? { color: '#22d62b' } : { color: '#660066' };
        const voteColorDown = this.state.isVoteDown ? { color: '#f2101c' } : { color: '#660066' };

        const CardFeed = (
            <Card style={{ borderRadius: 20, borderWidth: 5 }}>
                <CardItem bordered header style={{ borderRadius: 20 }}>
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
                <CardItem bordered style={{ borderRadius: 20 }}>
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
        );
        return (
            <>
                <Header style={{ justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#598c5f' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()} style={{ zIndex: 100 }}>
                            <Icon name='menu' type='Feather' />
                        </Button>
                    </Left>
                    <Body style={{ alignItems: 'center', flex: 1 }}><Text style={{ color: '#fff' }}>{this.state.swiperHeaderTitle}</Text></Body>
                    <Right style={{ flex: 1 }}>
                        <Button transparent>
                            <Icon type='Feather' name='more-horizontal' />
                        </Button>
                    </Right>
                </Header>
                <Swiper loop={false} showsPagination={false}
                    index={0}
                    bounces={true}
                    onIndexChanged={(e) => e === 1 ? this.setState({ swiperHeaderTitle: 'TRENDS' }) : this.setState({ swiperHeaderTitle: 'GLUE' })}>
                    <Container>
                        <Content padder>
                            <ScrollView>
                                {/* <View style={{ width: '100%', paddingHorizontal: 20, paddingTop: 10, backgroundColor: '#660066', height: 220, justifyContent: 'space-between' }}>
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

                            </View> */}


                                {CardFeed}
                                {CardFeed}
                                {CardFeed}
                                {CardFeed}
                                {CardFeed}
                                {CardFeed}
                            </ScrollView>

                        </Content>

                        <Button style={{ position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 56 / 2, backgroundColor: '#598c5f' }}>
                            <Icon type='Feather' name='plus-circle' />
                        </Button>

                    </Container>
                    <View style={{
                        backgroundColor: 'pink',
                        flex: 1,
                        width: screenWidth,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{ fontSize: 50, color: '#fff', fontWeight: "bold", textAlign: 'center' }}>TRENDS IS ON UNDER CONSTRUCTION</Text>
                        <Button block onPress={() => fire.auth().signOut()} style={{ backgroundColor: '#fff', marginTop: 50 }}>
                            <Text style={{ color: 'black' }}>Sign out</Text>
                        </Button>
                    </View>
                </Swiper>
            </>
        );
    }

}

