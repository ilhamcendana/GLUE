import React, { Component } from 'react';
import { View, Picker, Dimensions, Image, ScrollView, Animated, Easing } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { Container, Header, Content, Right, Card, CardItem, Input, ListItem, Radio, Textarea, Form, Thumbnail, Text, Button, Icon, Left, Body, Fab, Item } from 'native-base';
import Info from '../Info/Info';
import fire from '../../config';
import Swiper from 'react-native-swiper';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import InputPengaduan from '../InputPengaduan/InputPengaduan';
import InputPengaduanCustomHeader from '../InputPengaduan/InputPengaduanCustomHeader';

class Feed extends Component {
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
        btnPostDisabled: false,
        feedAnimation: new Animated.Value(-Dimensions.get('window').width),
        welcomePage: new Animated.Value(Dimensions.get('window').height),
        headerAnimation: new Animated.Value(-400),
        trendAnimated: new Animated.Value(Dimensions.get('window').width)
    }

    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        this.fetchingPost();
        this.welcome();
    }

    fetchingPost = () => {
        // fire.database().ref('posts').on('value', (snapshot) => {
        //     const pushing = this.state.posts.push(snapshot.val());
        //     this.setState({ posts: pushing });
        // });
        // console.log(this.state.post);
    }

    feedAnimation = () => {
        Animated.timing(this.state.feedAnimation, {
            toValue: 0,
            duration: 800
        }).start();

        Animated.timing(this.state.headerAnimation, {
            toValue: 0,
            duration: 800
        }).start();
    };

    welcome = () => {
        Animated.timing(this.state.welcomePage, {
            toValue: 0,
            duration: 500,
        }).start(() => this.closeWelcome())
    };

    closeWelcome = () => {
        const screenHeight = Dimensions.get('window').height;
        Animated.timing(this.state.welcomePage, {
            toValue: screenHeight,
            duration: 500,
            delay: 1000
        }).start(() => this.feedAnimation())
    };

    trendAnimated = () => {
        this.setState({ trendsInfo: true });
        Animated.timing(this.state.trendAnimated, {
            toValue: 0,
            duration: 500,
            easing: Easing.circle
        }).start(() => this.closeTrendAnimation());
    };

    closeTrendAnimation = () => {
        const screenWidth = Dimensions.get('window').width;
        Animated.timing(this.state.trendAnimated, {
            toValue: screenWidth,
            duration: 500,
            delay: 1000
        }).start(() => this.setState({ trendsInfo: false }));
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
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        const voteColorUp = this.state.isVoteUp ? { color: '#22d62b' } : { color: '#660066' };
        const voteColorDown = this.state.isVoteDown ? { color: '#f2101c' } : { color: '#660066' };

        const CardFeed = (
            <Animated.View style={{ translateX: this.state.feedAnimation }}>
                <Card style={{ borderRadius: 20, borderWidth: 5, }}>
                    <CardItem bordered header style={{ borderRadius: 20 }}>
                        <Left>
                            <Thumbnail source={require('../../assets/ProfileIcon.png')} />
                            <Body>
                                <Text>Ilham Cendana</Text>
                                <Text note>April 15, 2019</Text>
                            </Body>
                            <Right>
                                <Button transparent onPress={() => this.trendAnimated()}>
                                    <Icon type='Ionicons' name={this.state.trendsInfo ? 'star' : 'star-outline'} style={{ color: '#598c5f' }} />
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
            </Animated.View>
        );
        return (
            <>
                <Animated.View style={{ translateY: this.state.welcomePage, zIndex: 100, position: 'absolute', justifyContent: 'center', alignItems: 'center', width: Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundColor: '#598c5f' }}>
                    <Text style={{ fontWeight: '100', fontSize: 55, color: '#fff' }}>WELCOME</Text>
                </Animated.View>

                <Animated.View style={{ position: 'absolute', zIndex: 150, translateY: screenHeight / 2, translateX: this.state.trendAnimated, backgroundColor: '#598c5f', paddingVertical: 15, width: screenWidth }}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>This post is trend</Text>
                </Animated.View>

                <Animated.View style={{ translateY: this.state.headerAnimation }}>
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
                </Animated.View>
                <Swiper loop={false} showsPagination={false}
                    index={0}
                    bounces={true}
                    onIndexChanged={(e) => e === 1 ? this.setState({ swiperHeaderTitle: 'TRENDS' }) : this.setState({ swiperHeaderTitle: 'GLUE' })}>
                    <Container>
                        <Content padder>
                            <ScrollView>
                                {CardFeed}
                                {CardFeed}
                                {CardFeed}
                                {CardFeed}
                                {CardFeed}
                                {CardFeed}
                            </ScrollView>

                        </Content>

                        {/* WRITE POST BUTTON */}
                        <Button onPress={() => this.props.navigation.navigate('CreatePostComponent')}
                            style={{ position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 56 / 2, backgroundColor: '#598c5f' }}>
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

const stackFeed = createStackNavigator({
    FeedComponent: Feed,
    CreatePostComponent: {
        screen: InputPengaduan,
        navigationOptions: {
            header: null
        }
    }
})

export default createAppContainer(stackFeed);