import React, { Component } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, Dimensions, Image, ScrollView, Animated, Easing } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { Container, Header, Content, Right, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, ActionSheet, Spinner } from 'native-base';
import Info from '../Info/Info';
import * as firebase from 'firebase';
import Swiper from 'react-native-swiper';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import InputPengaduan from '../InputPengaduan/InputPengaduan';

class Feed extends Component {
    state = {
        spinner: false,
        uid: '',
        username: '',
        swiperHeaderTitle: 'GLUE',
        isVoteUp: false,
        isVoteDown: false,
        trendsInfo: false,
        translate: new Animated.Value(100),
        selectedTdkpantasReport: false,
        selectedHoaxReport: false,
        openReport: new Animated.Value(-500),
        btnPostDisabled: false,
        feedAnimation: new Animated.Value(0),
        welcomePage: new Animated.Value(Dimensions.get('window').height),
        headerAnimation: new Animated.Value(-400),
        trendAnimated: new Animated.Value(250),
        //BELOW IS A POST
        loading: false,
        refreshing: false,
        posts: [],
        previewImagePost: '',
        clickedActionSheet: null,
        selectedVoted: ''
    }

    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        this.welcome();
        this.setState({ uid: firebase.auth().currentUser.uid })
        firebase.database().ref(`users/${firebase.auth().currentUser.uid}/profile`).once(('value'), (snap) => this.setState({ username: snap.val().nama }))
        this.fetchingPost();
    }

    fetchingPost = () => {
        this.setState({ loading: true, posts: [] });
        const ref = firebase.database().ref('posts/');
        ref.once('value', (snap) => {
            const newData = Object.values(snap.val()).reverse();
            const newPost = newData;
            this.setState({ posts: newPost, loading: false, refreshing: false });
        }).catch(() => {
            this.setState({ loading: false, refreshing: false });
            alert(err);
        })
    };

    onRefreshEvent = () => {
        this.setState({ refreshing: true }, () => this.fetchingPost())
    };

    updatingPostEvent = () => {
        const ref = firebase.database().ref('posts/');
        ref.once('value', (snap) => {
            const newData = Object.values(snap.val()).reverse();
            const newPost = newData;
            this.setState({ posts: newPost, loading: false, refreshing: false, spinner: false });
        }).catch(() => {
            this.setState({ loading: false, refreshing: false });
            alert(err);
        })
    }

    feedAnimation = () => {
        Animated.timing(this.state.feedAnimation, {
            toValue: 1,
            duration: 800
        }).start();
    };

    headerAnimation = () => {
        Animated.timing(this.state.headerAnimation, {
            toValue: 0,
            duration: 800
        }).start(() => this.feedAnimation());
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
        }).start(() => this.headerAnimation())
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
            toValue: 250,
            duration: 500,
            delay: 1000
        }).start(() => this.setState({ trendsInfo: false }));
    };

    voteUp = (e) => {
        console.log(e);
    }

    openPreviewImagePost = () => {
        alert('ee')
    }

    render() {
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        const voteColorUp = this.state.isVoteUp ? { color: '#22d62b' } : { color: '#333' };
        var BUTTONS = ["Lapor", "Hapus Post", "Kembali"];
        var DESTRUCTIVE_INDEX = 1;
        var CANCEL_INDEX = 2;
        if (this.state.clickedActionSheet === 0) {
            alert('lapor')
        };

        return (
            <>
                <Animated.View style={{ translateY: this.state.welcomePage, zIndex: 100, position: 'absolute', justifyContent: 'center', alignItems: 'center', width: Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundColor: '#598c5f' }}>
                    <Text style={{ fontWeight: '100', fontSize: 55, color: '#fff' }}>WELCOME</Text>
                </Animated.View>

                <Animated.View style={{ position: 'absolute', zIndex: 150, bottom: 0, translateY: this.state.trendAnimated, backgroundColor: '#598c5f', paddingVertical: 15, width: screenWidth }}>
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

                {this.state.spinner ? <Spinner size='large' color='#598c5f' style={{ position: 'absolute', zIndex: 100, alignSelf: 'center', top: 55 }} /> : null}

                <Swiper loop={false} showsPagination={false}
                    index={0}
                    bounces={true}
                    onIndexChanged={(e) => e === 1 ? this.setState({ swiperHeaderTitle: 'TRENDS' }) : this.setState({ swiperHeaderTitle: 'GLUE' })}>
                    <Container>
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefreshEvent}
                                />
                            }
                        >
                            {this.state.posts.map(item => (
                                <Animated.View style={{ opacity: this.state.feedAnimation }} key={item.key}>
                                    <Content padder>
                                        <Card style={{ borderRadius: 20, borderWidth: 5, }}>
                                            <CardItem bordered header style={{ borderRadius: 20 }}>
                                                <Left>
                                                    <Thumbnail source={require('../../assets/ProfileIcon.png')} />
                                                    <Body>
                                                        <Text>{item.username}</Text>
                                                        <Text note>{item.date.todayDate}</Text>
                                                    </Body>
                                                    <Right>
                                                        <View style={{ justifyContent: 'space-between' }}>
                                                            <Button transparent onPress={() =>
                                                                ActionSheet.show(
                                                                    {
                                                                        options: BUTTONS,
                                                                        cancelButtonIndex: CANCEL_INDEX,
                                                                        destructiveButtonIndex: DESTRUCTIVE_INDEX,
                                                                    },
                                                                    buttonIndex => {
                                                                        this.setState({ clickedActionSheet: BUTTONS[buttonIndex] });
                                                                    }
                                                                )}>
                                                                <Icon type='Feather' name='chevron-down'
                                                                    style={{ color: '#598c5f' }} />
                                                            </Button>
                                                            <Text note>{item.date.todayTime}</Text>
                                                        </View>
                                                    </Right>
                                                </Left>
                                            </CardItem>
                                            <CardItem>
                                                <Body>
                                                    {item.postPict !== '' ?
                                                        <Image source={{ uri: item.postPict }} style={{ height: 200, width: '100%', marginBottom: 10, flex: 1 }} />
                                                        :
                                                        null}
                                                    <Text>{item.caption}</Text>
                                                </Body>
                                            </CardItem>
                                            <CardItem bordered style={{ borderRadius: 20, flexDirection: 'column' }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Left>

                                                    </Left>

                                                    <Body>
                                                        <Button transparent style={{ justifyContent: 'center' }}
                                                            onPress={() => {
                                                                this.setState({ spinner: true });
                                                                firebase.database().ref('posts/' + item.key + '/postInfo/').set({
                                                                    totalUpVote: item.postInfo.totalUpVote + 1,
                                                                    isTrend: item.postInfo.isTrend,
                                                                    totalRepor: item.postInfo.totalRepor,
                                                                });
                                                                let likeData = {
                                                                    uid: this.state.uid,
                                                                    username: this.state.username
                                                                }
                                                                let updates = {};
                                                                updates['posts/' + item.key + '/postInfo/userWhoLiked/' + this.state.uid] = likeData;
                                                                firebase.database().ref().update(updates)
                                                                    .then(() => this.updatingPostEvent(item.key))
                                                            }}>
                                                            <Icon name="arrow-up-circle" type='Feather'
                                                                style={
                                                                    //fix this shit man
                                                                    firebase.database().ref('posts/' + item.key + '/postInfo/userWhoLiked/' + firebase.auth().currentUser.uid).on('value', snap => snap.val().uid)
                                                                }
                                                            />
                                                            <Text style={this.state.selectedVoted === item.key ? { color: '#22d62b' } : { color: '#333' }}>
                                                                {item.postInfo.totalUpVote} Vote</Text>
                                                        </Button>
                                                    </Body>

                                                    <Right>
                                                    </Right>
                                                </View>
                                                <View style={{ width: '100%', marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Button transparent style={{ justifyContent: 'center' }} onPress={() => this.animated()}>
                                                        <Text style={{ color: '#598c5f', fontSize: 10 }}>21 Comments</Text>
                                                    </Button>
                                                    {item.isTrend ?
                                                        <Button rounded onPress={this.trendAnimated} style={{ backgroundColor: '#598c5f' }}>
                                                            <Icon type='Ionicons' name='star'
                                                                style={{ color: '#fff' }} />
                                                        </Button>
                                                        : null}
                                                </View>
                                            </CardItem>
                                        </Card>
                                    </Content>
                                </Animated.View>
                            ))}
                        </ScrollView>

                        {/* CREATE POST BUTTON */}
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