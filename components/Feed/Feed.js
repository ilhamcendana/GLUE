import React, { Component } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, Dimensions, Image, ScrollView, Animated, Easing } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { Container, Header, Content, Right, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, ActionSheet, Spinner } from 'native-base';
import Info from '../Info/Info';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Swiper from 'react-native-swiper';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import InputPengaduan from '../InputPengaduan/InputPengaduan';
import OpenedPost from './OpenedPost';

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
        liked: null,
        uidLiked: '',
        a: [
            { a: 'a' },
            { b: 'b' }
        ]
    }

    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        this.welcome();
        this.setState({ uid: firebase.auth().currentUser.uid })
        // firebase.database().ref(`users/${firebase.auth().currentUser.uid}/profile`).once(('value'), (snap) => this.setState({ username: snap.val().nama }))
        this.fetchingPost();
        if (!this.state.loading) this.feedAnimation();
    }

    fetchingPost = () => {
        this.setState({ loading: true, posts: [] });
        const ref = firebase.firestore().collection('posts').orderBy('mergeDate').get();
        const data = [];
        ref.then(snap => {
            snap.forEach((doc) => {
                data.push(doc.data())
            });
            data.reverse();
            if (data.length == 0) {
                this.setState({ posts: 'empty', loading: false, refreshing: false });
            } else {
                this.setState({ posts: data, loading: false, refreshing: false });
            }
        }).catch((err) => {
            alert(err);
            this.setState({ loading: false, refreshing: false })
        });
    };

    onRefreshEvent = () => {
        this.setState({ refreshing: true }, () => this.fetchingPost());
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
            duration: 1000
        }).start();
    };

    headerAnimation = () => {
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

    footerComponent = () => {
        if (!this.state.loading) return null;
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size='large' animating />
            </View>
        )
    }

    voteColor = () => {

    }

    openPreviewImagePost = () => {
        alert('ee')
    }

    render() {
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        const voteColor = this.state.isVoteUp ? { color: '#22d62b' } : { color: '#333' };
        var BUTTONS = ["Lapor", "Hapus Post", "Kembali"];
        var DESTRUCTIVE_INDEX = 1;
        var CANCEL_INDEX = 2;
        const { state } = this;
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
                        {this.state.posts === 'empty' ? (
                            <ScrollView
                                refreshControl={<RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefreshEvent} />}>
                                <View style={{ width: screenWidth, paddingVertical: 15, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Belum ada post</Text>
                                    <Text style={{ textAlign: 'center' }}>Buat post dengan cara ke halaman beranda lalu ketuk tombol dengan icon tambah di bawah kanan layar anda</Text>
                                </View>
                            </ScrollView>
                        ) : (
                                <FlatList
                                    data={this.state.posts}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefreshEvent}
                                    ListFooterComponent={this.footerComponent}
                                    renderItem={({ item }) => (

                                        <Animated.View style={{ opacity: this.state.feedAnimation }}>
                                            <Content padder>
                                                <Card style={{ borderRadius: 20, borderWidth: 5, }} key={item.key}>
                                                    <CardItem bordered header style={{ borderRadius: 20 }}>
                                                        <Left>
                                                            <Thumbnail source={{ uri: item.profilePict }} />
                                                            <Body>
                                                                <Text>{item.nama}</Text>
                                                                <Text note>{item.todayDate}</Text>
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
                                                                    <Text note>{item.todayTime}</Text>
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
                                                                        const uid = firebase.auth().currentUser.uid;
                                                                        const ref = firebase.firestore().collection('posts').doc(item.key);
                                                                        ref.get().then(snap => {
                                                                            if (snap.data().userWhoLiked[uid] !== undefined) {
                                                                                if (snap.data().userWhoLiked[uid] === false) {
                                                                                    ref.set({
                                                                                        postInfo: {
                                                                                            totalUpVote: item.postInfo.totalUpVote + 1
                                                                                        },
                                                                                        userWhoLiked: {
                                                                                            [uid]: true
                                                                                        }
                                                                                    }, { merge: true })
                                                                                } else {
                                                                                    ref.set({
                                                                                        postInfo: {
                                                                                            totalUpVote: item.postInfo.totalUpVote - 1
                                                                                        },
                                                                                        userWhoLiked: {
                                                                                            [uid]: false
                                                                                        }
                                                                                    }, { merge: true })
                                                                                }
                                                                            } else {
                                                                                ref.set({
                                                                                    postInfo: {
                                                                                        totalUpVote: item.postInfo.totalUpVote + 1
                                                                                    },
                                                                                    userWhoLiked: {
                                                                                        [uid]: true
                                                                                    }
                                                                                }, { merge: true })
                                                                            }
                                                                        }).then(() => {
                                                                            let sample = [...this.state.posts];
                                                                            for (let i = 0; sample.length; i++) {
                                                                                if (sample[i].key === item.key) {
                                                                                    sample[i].postInfo.totalUpVote = item.postInfo.totalUpVote + 1
                                                                                }
                                                                            }
                                                                            this.setState({ posts: sample })
                                                                        })
                                                                    }}>
                                                                    <Icon name="arrow-up-circle" type='Feather'
                                                                        style={{ color: '#598c5f' }}
                                                                    />
                                                                    <Text style={{ color: '#598c5f' }}>
                                                                        {item.postInfo.totalUpVote} Vote</Text>
                                                                </Button>
                                                            </Body>

                                                            <Right>
                                                            </Right>
                                                        </View>
                                                        <View style={{ width: '100%', marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <Button transparent style={{ justifyContent: 'center' }} onPress={() => this.props.navi}>
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
                                    )}
                                />
                            )}


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
    },
    OpenedPostComponent: OpenedPost
})

export default createAppContainer(stackFeed);