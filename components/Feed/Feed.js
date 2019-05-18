import React, { Component } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, Dimensions, Image, ScrollView, Animated, Easing, Alert, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Right, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, List, ListItem, Spinner } from 'native-base';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Swiper from 'react-native-swiper';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import InputPengaduan from '../InputPengaduan/InputPengaduan';
import OpenedPost from './OpenedPost';
import OpenedProfile from './OpenedProfile';
import OpenedPostPict from './OpenedPostPict';

class Feed extends Component {
    state = {
        spinner: false,
        uid: '',
        username: '',
        swiperHeaderTitle: 'GLUE',
        trendsInfo: false,
        translate: new Animated.Value(100),
        openReport: new Animated.Value(-500),
        feedAnimation: new Animated.Value(0),
        welcomePage: new Animated.Value(0),
        headerAnimation: new Animated.Value(-400),
        trendAnimated: new Animated.Value(250),
        disableWelcome: false,
        currentTotalPost: null,
        //BELOW IS A POST
        loading: false,
        refreshing: false,
        posts: [],
        openPostOptionKey: '',
        openPostOptionUid: '',
        openPostOptionReport: 0,
        previewImagePost: '',
        btnLikeDisabled: false,
        limit: 10,
        trendingPosts: []
    }

    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        this.welcome();
        this.setState({ uid: firebase.auth().currentUser.uid });
        // firebase.database().ref(`users/${firebase.auth().currentUser.uid}/profile`).once(('value'), (snap) => this.setState({ username: snap.val().nama }))
        this.fetchingPost();
        this.fetchingPostTrend();
    }

    fetchingPost = () => {
        this.setState({ loading: true, posts: [] });
        const ref = firebase.firestore().collection('posts').orderBy('mergeDate').limit(this.state.limit).get();
        const data = [];
        ref.then(snap => {
            snap.forEach((doc) => {
                data.push(doc.data())
            });
            if (data.length == 0) {
                this.setState({ posts: 'empty', loading: false, refreshing: false });
            } else {
                this.setState({ posts: data.reverse(), loading: false, refreshing: false });
                this.feedAnimation();
            }
        }).catch((err) => {
            alert(err);
            this.setState({ loading: false, refreshing: false })
        });
    };

    fetchingPostTrend = () => {
        this.setState({ loading: true, trendingPosts: [] });
        const ref = firebase.firestore().collection('posts').orderBy('totalUpVote').where('totalUpVote', '>=', 20).limit(this.state.limit).get();
        const data = [];
        ref.then(snap => {
            snap.forEach((doc) => {
                data.push(doc.data())
            });
            if (data.length == 0) {
                this.setState({ trendingPosts: 'empty', loading: false, refreshing: false });
            } else {
                this.setState({ trendingPosts: data.reverse(), loading: false, refreshing: false });
                this.feedAnimation();
            }
        }).catch((err) => {
            console.log(err);
            this.setState({ loading: false, refreshing: false })
        });
    };

    onRefreshEvent = () => {
        this.setState({ refreshing: true }, () => {
            this.fetchingPost();
            this.fetchingPostTrend();
        });
    };

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
            toValue: 1,
            duration: 500,
        }).start(() => this.closeWelcome())
    };

    closeWelcome = () => {
        Animated.timing(this.state.welcomePage, {
            toValue: 0,
            duration: 500,
            delay: 1000
        }).start(() => {
            this.setState({ disableWelcome: true });
            this.headerAnimation();
        })
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

    openPostOption = (key, uid, report) => {
        this.setState({ openPostOptionKey: key, openPostOptionUid: uid, openPostOptionReport: report });
    }

    openPreviewImagePost = () => {
        alert('ee')
    }

    render() {
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        const { state } = this;
        return (
            <>
                {!state.disableWelcome ? <Animated.View style={{ opacity: this.state.welcomePage, zIndex: 100, position: 'absolute', justifyContent: 'center', alignItems: 'center', width: Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundColor: '#598c5f' }}>
                    <Icon name='sun' type='Feather' style={{ color: '#fff', marginBottom: 10 }} />
                    <Text style={{ fontWeight: '100', fontSize: 15, color: '#fff', textAlign: 'center' }}>Gunadarma Lounge</Text>
                </Animated.View> : null}

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
                            <Button transparent onPress={() => this.refs.swiper.scrollBy(1)}>
                                <Icon type='Feather' name='star' />
                            </Button>
                        </Right>
                    </Header>
                </Animated.View>

                {this.state.spinner ? <Spinner size='large' color='#598c5f' style={{ position: 'absolute', zIndex: 100, alignSelf: 'center', top: 55 }} /> : null}

                <Swiper loop={false} showsPagination={false}
                    index={0}
                    ref='swiper'
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
                                    renderItem={({ item, index }) => (

                                        <Animated.View style={{ opacity: this.state.feedAnimation }}>
                                            <Content padder>
                                                <Card style={{ borderRadius: 20, borderWidth: 5 }} key={item.key}>
                                                    <CardItem bordered header style={{ borderRadius: 20 }}>
                                                        <Left>
                                                            <Thumbnail source={{ uri: item.profilePict }} />
                                                            <Body>
                                                                <TouchableOpacity
                                                                    onPress={item.uid === firebase.auth().currentUser.uid ? () => this.props.navigation.navigate('Profile') : () => this.props.navigation.navigate('OpenedProfileComponent', { uid: item.uid })}>
                                                                    <Text>{item.nama}</Text>
                                                                    <Text note>{item.todayDate}</Text>
                                                                </TouchableOpacity>
                                                            </Body>
                                                            <Right>
                                                                <View style={{ justifyContent: 'space-between' }}>
                                                                    <Button transparent onPress={() => this.openPostOption(item.key, item.uid, item.postInfo.totalReported)}>
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
                                                                <TouchableOpacity style={{ height: 200, width: '100%' }} onPress={() => this.props.navigation.navigate('OpenedPostPictComponent', { postPictUrl: item.postPict, username: item.nama })}>
                                                                    <Image source={{ uri: item.postPict }} style={{ height: 200, width: '100%', marginBottom: 10, flex: 1 }} />
                                                                </TouchableOpacity>
                                                                :
                                                                null}
                                                            {item.caption.length > 600 ?
                                                                <Text
                                                                    style={{ color: '#333', fontWeight: '100' }}>{item.caption.slice(0, 600)}...</Text>
                                                                :
                                                                <Text style={{ color: '#333', fontWeight: '100' }}>
                                                                    {item.caption}
                                                                </Text>
                                                            }
                                                            <Text style={{ marginTop: 40, color: '#598c5f', paddingVertical: 3, paddingHorizontal: 20, borderRadius: 10, borderWidth: 2, borderColor: '#598c5f', textAlign: 'center' }}>{item.category}</Text>
                                                        </Body>
                                                    </CardItem>
                                                    <CardItem bordered style={{ flexDirection: 'column', borderRadius: 20 }}>
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Button transparent style={{ justifyContent: 'center', width: 150 }}
                                                                onPress={() => {
                                                                    this.setState({ spinner: true }, () => {
                                                                        const uid = firebase.auth().currentUser.uid;
                                                                        const ref = firebase.firestore().collection('posts').doc(item.key);
                                                                        ref.get().then(snap => {
                                                                            if (snap.data().userWhoLiked[uid] !== undefined) {
                                                                                if (snap.data().userWhoLiked[uid] === false) {
                                                                                    ref.set({
                                                                                        totalUpVote: item.totalUpVote + 1,
                                                                                        userWhoLiked: {
                                                                                            [uid]: true
                                                                                        }
                                                                                    }, { merge: true })
                                                                                        .then(() => {
                                                                                            const userRef = firebase.firestore().collection('users').doc(item.uid);
                                                                                            userRef.get().then(snap => {
                                                                                                userRef.set({ profile: { totalVote: snap.data().profile.totalVote + 1 } }, { merge: true });
                                                                                            })
                                                                                        })
                                                                                        .then(() => {
                                                                                            let sample = [...this.state.posts];
                                                                                            for (let i = 0; i < sample.length; i++) {
                                                                                                if (sample[i].key === item.key) {
                                                                                                    sample[i].totalUpVote += 1;
                                                                                                    sample[i].userWhoLiked[uid] = true;
                                                                                                }
                                                                                            }
                                                                                            this.setState({ posts: sample, spinner: false });
                                                                                        })
                                                                                } else {
                                                                                    ref.set({
                                                                                        totalUpVote: item.totalUpVote - 1,
                                                                                        userWhoLiked: {
                                                                                            [uid]: false
                                                                                        }
                                                                                    }, { merge: true })
                                                                                        .then(() => {
                                                                                            const userRef = firebase.firestore().collection('users').doc(item.uid);
                                                                                            userRef.get().then(snap => {
                                                                                                userRef.set({ profile: { totalVote: snap.data().profile.totalVote - 1 } }, { merge: true });
                                                                                            })
                                                                                        })
                                                                                        .then(() => {
                                                                                            let sample = [...this.state.posts];
                                                                                            for (let i = 0; i < sample.length; i++) {
                                                                                                if (sample[i].key === item.key) {
                                                                                                    sample[i].totalUpVote -= 1;
                                                                                                    sample[i].userWhoLiked[uid] = false;
                                                                                                }
                                                                                            }
                                                                                            this.setState({ posts: sample, spinner: false });
                                                                                        })
                                                                                }
                                                                            } else {
                                                                                ref.set({
                                                                                    totalUpVote: item.totalUpVote + 1,
                                                                                    userWhoLiked: {
                                                                                        [uid]: true
                                                                                    }
                                                                                }, { merge: true })
                                                                                    .then(() => {
                                                                                        const userRef = firebase.firestore().collection('users').doc(item.uid);
                                                                                        userRef.get().then(snap => {
                                                                                            userRef.set({ profile: { totalVote: snap.data().profile.totalVote + 1 } }, { merge: true });
                                                                                        })
                                                                                    })
                                                                                    .then(() => {
                                                                                        let sample = [...this.state.posts];
                                                                                        for (let i = 0; i < sample.length; i++) {
                                                                                            if (sample[i].key === item.key) {
                                                                                                sample[i].totalUpVote += 1;
                                                                                                sample[i].userWhoLiked[uid] = true;
                                                                                            }
                                                                                        }
                                                                                        this.setState({ posts: sample, spinner: false });
                                                                                    })

                                                                            }
                                                                            if (item.totalUpVote >= 20) {
                                                                                ref.set({
                                                                                    isTrend: true
                                                                                }, { merge: true });
                                                                            } else {
                                                                                ref.set({
                                                                                    isTrend: false
                                                                                }, { merge: true });
                                                                            }
                                                                        })

                                                                    });
                                                                }}>
                                                                <Icon name="heart" type='Feather'
                                                                    style={item.userWhoLiked ? item.userWhoLiked[firebase.auth().currentUser.uid] === true ? { color: '#598c5f' } : { color: '#333' } : { color: '#333' }}
                                                                />
                                                                <Text style={item.userWhoLiked ? item.userWhoLiked[firebase.auth().currentUser.uid] === true ? { color: '#598c5f' } : { color: '#333' } : { color: '#333' }}>
                                                                    {item.totalUpVote}</Text>
                                                            </Button>
                                                            {item.totalUpVote >= 20 ?
                                                                <Button rounded bordered onPress={this.trendAnimated} style={{ borderColor: '#598c5f' }}>
                                                                    <Icon type='Ionicons' name='star'
                                                                        style={{ color: '#598c5f', fontSize: 15 }} />
                                                                </Button>
                                                                : null}
                                                        </View>
                                                        <View style={{ width: '100%', marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <Button transparent style={{ justifyContent: 'center' }}>
                                                                <Text style={{ color: '#598c5f', fontSize: 10 }}>{item.postInfo.totalComments} komentar</Text>
                                                            </Button>
                                                            <Button small style={{ backgroundColor: '#598c5f' }} onPress={() => this.props.navigation.navigate('OpenedPostComponent', { postKey: item.key, postUsername: item.nama })}>
                                                                <Text style={{ color: '#fff', fontSize: 10 }}>Lihat post</Text>
                                                            </Button>
                                                        </View>
                                                    </CardItem>
                                                </Card>
                                            </Content>
                                        </Animated.View>
                                    )}
                                />
                            )}

                        {state.openPostOptionKey !== '' ? (
                            <View style={{ paddingHorizontal: 40, backgroundColor: 'rgba(0,0,0,.4)', zIndex: 1000, position: 'absolute', width: screenWidth, height: screenHeight }}>
                                <List style={{ marginTop: 50, backgroundColor: '#fff', borderRadius: 15, overflow: 'hidden' }}>
                                    {state.openPostOptionUid === firebase.auth().currentUser.uid ? (
                                        <ListItem>
                                            <Button transparent block style={{ width: '100%' }}
                                                onPress={() => Alert.alert(
                                                    'HAPUS POST',
                                                    'Anda yakin ?',
                                                    [
                                                        { text: 'Tidak', style: 'cancel' },
                                                        {
                                                            text: 'Ya', style: 'destructive', onPress: () => {
                                                                this.setState({ spinner: true });
                                                                const ref = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
                                                                firebase.firestore().collection('posts').doc(state.openPostOptionKey).delete().then(() => {
                                                                    ref.get().then(snap => ref.set({
                                                                        profile: { totalPost: snap.data().profile.totalPost - 1 }
                                                                    }, { merge: true }))
                                                                })
                                                                    .then(() => {
                                                                        this.fetchingPost();
                                                                        this.setState({ openPostOptionKey: '', openPostOptionUid: '', spinner: false });
                                                                        Alert.alert('Post Dihapus');
                                                                    })
                                                            }
                                                        }
                                                    ]
                                                )}>
                                                <Text style={{ color: '#333', }}>Hapus</Text>
                                            </Button>
                                        </ListItem>
                                    ) : (
                                            <ListItem style={{ justifyContent: 'center' }}>
                                                <Button transparent block style={{ width: '100%' }}
                                                    onPress={() => Alert.alert(
                                                        'LAPOR POST',
                                                        'Apakah post ini mengandung salah satu konten pornografi,ujaran kebencian atau hoaks ?',
                                                        [
                                                            { text: 'Tidak', style: 'cancel' },
                                                            {
                                                                text: 'Ya', onPress: () => {
                                                                    this.setState({ spinner: true });
                                                                    const uid = firebase.auth().currentUser.uid;
                                                                    const ref = firebase.firestore().collection('posts').doc(state.openPostOptionKey);
                                                                    ref.get().then(snap => {
                                                                        if (snap.data().userWhoReported[uid] === undefined) {
                                                                            ref.set({
                                                                                totalReported: state.openPostOptionReport + 1,
                                                                                userWhoReported: {
                                                                                    [uid]: true
                                                                                }
                                                                            }, { merge: true }).then(() => {
                                                                                this.fetchingPost();
                                                                                this.setState({ openPostOptionKey: '', openPostOptionUid: '', openPostOptionReport: 0, spinner: false });
                                                                                alert('Post Telah Dilaporkan');
                                                                            })
                                                                        } else {
                                                                            Alert.alert(
                                                                                'Lapor',
                                                                                'Anda sudah pernah melaporkan post ini',
                                                                                [
                                                                                    { text: 'OK' }
                                                                                ]);
                                                                            this.setState({ spinner: false });
                                                                        }
                                                                    }).then(() => {
                                                                        item.totalUpVote + 1
                                                                    })
                                                                }
                                                            }
                                                        ]
                                                    )}>
                                                    <Text style={{ color: '#333', }}>Lapor</Text>
                                                </Button>
                                            </ListItem>
                                        )}
                                    <ListItem>
                                        <Button transparent block
                                            style={{ width: '100%' }}
                                            onPress={() => this.setState({ openPostOptionKey: '', openPostOptionUid: '', openPostOptionReport: 0 })}>
                                            <Text style={{ color: '#333' }}>Kembali</Text>
                                        </Button>
                                    </ListItem>
                                </List>
                            </View>
                        ) : null}


                        {/* CREATE POST BUTTON */}
                        <Button onPress={() => this.props.navigation.navigate('CreatePostComponent')}
                            style={{ position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 56 / 2, backgroundColor: '#598c5f' }}>
                            <Icon type='Feather' name='plus-circle' />
                        </Button>

                    </Container>

                    {/* TRENDS PAGE*/}
                    <Container>
                        {this.state.trendingPosts === 'empty' ? (
                            <ScrollView
                                refreshControl={<RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefreshEvent} />}>
                                <View style={{ width: screenWidth, paddingVertical: 15, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Belum ada trending post</Text>
                                </View>
                            </ScrollView>
                        ) : (
                                <FlatList
                                    data={this.state.trendingPosts}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefreshEvent}
                                    ListFooterComponent={this.footerComponent}
                                    renderItem={({ item, index }) => (

                                        <Content padder>
                                            <Card style={{ borderRadius: 20, borderWidth: 5 }} key={item.key}>
                                                <CardItem bordered header style={{ borderRadius: 20 }}>
                                                    <Left>
                                                        <Thumbnail source={{ uri: item.profilePict }} />
                                                        <Body>
                                                            <TouchableOpacity
                                                                onPress={item.uid === firebase.auth().currentUser.uid ? () => this.props.navigation.navigate('Profile') : () => this.props.navigation.navigate('OpenedProfileComponent', { uid: item.uid })}>
                                                                <Text>{item.nama}</Text>
                                                                <Text note>{item.todayDate}</Text>
                                                            </TouchableOpacity>
                                                        </Body>
                                                        <Right>
                                                            <View style={{ justifyContent: 'space-between' }}>
                                                                <Button transparent onPress={() => this.openPostOption(item.key, item.uid, item.postInfo.totalReported)}>
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
                                                            <TouchableOpacity style={{ height: 200, width: '100%' }} onPress={() => this.props.navigation.navigate('OpenedPostPictComponent', { postPictUrl: item.postPict, username: item.nama })}>
                                                                <Image source={{ uri: item.postPict }} style={{ height: 200, width: '100%', marginBottom: 10, flex: 1 }} />
                                                            </TouchableOpacity>
                                                            :
                                                            null}
                                                        {item.caption.length > 600 ?
                                                            <Text
                                                                style={{ color: '#333', fontWeight: '100' }}>{item.caption.slice(0, 600)}...</Text>
                                                            :
                                                            <Text style={{ color: '#333', fontWeight: '100' }}>
                                                                {item.caption}
                                                            </Text>
                                                        }
                                                        <Text style={{ marginTop: 40, color: '#598c5f', paddingVertical: 3, paddingHorizontal: 20, borderRadius: 10, borderWidth: 2, borderColor: '#598c5f' }}>{item.category}</Text>
                                                    </Body>
                                                </CardItem>
                                                <CardItem bordered style={{ flexDirection: 'column', borderRadius: 20 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Button transparent style={{ justifyContent: 'center', width: 150 }}
                                                            onPress={() => {
                                                                this.setState({ spinner: true }, () => {
                                                                    const uid = firebase.auth().currentUser.uid;
                                                                    const ref = firebase.firestore().collection('posts').doc(item.key);
                                                                    ref.get().then(snap => {
                                                                        if (snap.data().userWhoLiked[uid] !== undefined) {
                                                                            if (snap.data().userWhoLiked[uid] === false) {
                                                                                ref.set({
                                                                                    totalUpVote: item.totalUpVote + 1,
                                                                                    userWhoLiked: {
                                                                                        [uid]: true
                                                                                    }
                                                                                }, { merge: true }).then(() => {
                                                                                    let trendSample = [...this.state.trendingPosts];
                                                                                    for (let i = 0; i < trendSample.length; i++) {
                                                                                        if (trendSample[i].key === item.key) {
                                                                                            trendSample[i].totalUpVote += 1;
                                                                                            trendSample[i].userWhoLiked[uid] = true;
                                                                                        }
                                                                                    }
                                                                                    this.setState({ trendingPosts: trendSample, spinner: false });
                                                                                })
                                                                            } else {
                                                                                ref.set({
                                                                                    totalUpVote: item.totalUpVote - 1,
                                                                                    userWhoLiked: {
                                                                                        [uid]: false
                                                                                    }
                                                                                }, { merge: true }).then(() => {
                                                                                    let trendSample = [...this.state.trendingPosts];
                                                                                    for (let i = 0; i < trendSample.length; i++) {
                                                                                        if (trendSample[i].key === item.key) {
                                                                                            trendSample[i].totalUpVote -= 1;
                                                                                            trendSample[i].userWhoLiked[uid] = false;
                                                                                        }
                                                                                    }
                                                                                    this.setState({ trendingPosts: trendSample, spinner: false });
                                                                                })
                                                                            }
                                                                        } else {
                                                                            ref.set({
                                                                                totalUpVote: item.totalUpVote + 1,
                                                                                userWhoLiked: {
                                                                                    [uid]: true
                                                                                }
                                                                            }, { merge: true }).then(() => {
                                                                                let trendSample = [...this.state.trendingPosts];
                                                                                for (let i = 0; i < trendSample.length; i++) {
                                                                                    if (trendSample[i].key === item.key) {
                                                                                        trendSample[i].totalUpVote += 1;
                                                                                        trendSample[i].userWhoLiked[uid] = true;
                                                                                    }
                                                                                }
                                                                                this.setState({ trendingPosts: trendSample, spinner: false });
                                                                            })

                                                                        }
                                                                        if (item.totalUpVote >= 20) {
                                                                            ref.set({
                                                                                isTrend: true
                                                                            }, { merge: true });
                                                                        } else {
                                                                            ref.set({
                                                                                isTrend: false
                                                                            }, { merge: true });
                                                                        }
                                                                    })

                                                                });
                                                            }}>
                                                            <Icon name="heart" type='Feather'
                                                                style={item.userWhoLiked ? item.userWhoLiked[firebase.auth().currentUser.uid] === true ? { color: '#598c5f' } : { color: '#333' } : { color: '#333' }}
                                                            />
                                                            <Text style={item.userWhoLiked ? item.userWhoLiked[firebase.auth().currentUser.uid] === true ? { color: '#598c5f' } : { color: '#333' } : { color: '#333' }}>
                                                                {item.totalUpVote}</Text>
                                                        </Button>
                                                        {item.totalUpVote >= 20 ?
                                                            <Button rounded bordered onPress={this.trendAnimated} style={{ borderColor: '#598c5f' }}>
                                                                <Icon type='Ionicons' name='star'
                                                                    style={{ color: '#598c5f', fontSize: 15 }} />
                                                            </Button>
                                                            : null}
                                                    </View>
                                                    <View style={{ width: '100%', marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <Button transparent style={{ justifyContent: 'center' }}>
                                                            <Text style={{ color: '#598c5f', fontSize: 10 }}>{item.postInfo.totalComments} komentar</Text>
                                                        </Button>
                                                        <Button small style={{ backgroundColor: '#598c5f' }} onPress={() => this.props.navigation.navigate('OpenedPostComponent', { postKey: item.key, postUsername: item.nama })}>
                                                            <Text style={{ color: '#fff', fontSize: 10 }}>Lihat post</Text>
                                                        </Button>
                                                    </View>
                                                </CardItem>
                                            </Card>
                                        </Content>
                                    )}
                                />
                            )}

                        {state.openPostOptionKey !== '' ? (
                            <View style={{ paddingHorizontal: 40, backgroundColor: 'rgba(0,0,0,.4)', zIndex: 1000, position: 'absolute', width: screenWidth, height: screenHeight }}>
                                <List style={{ marginTop: 50, backgroundColor: '#fff', borderRadius: 15, overflow: 'hidden' }}>
                                    {state.openPostOptionUid === firebase.auth().currentUser.uid ? (
                                        <ListItem>
                                            <Button transparent block style={{ width: '100%' }}
                                                onPress={() => Alert.alert(
                                                    'HAPUS POST',
                                                    'Anda yakin ?',
                                                    [
                                                        { text: 'Tidak', style: 'cancel' },
                                                        {
                                                            text: 'Ya', style: 'destructive', onPress: () => {
                                                                this.setState({ spinner: true });
                                                                const ref = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
                                                                firebase.firestore().collection('posts').doc(state.openPostOptionKey).delete().then(() => {
                                                                    ref.get().then(snap => ref.set({
                                                                        profile: { totalPost: snap.data().profile.totalPost - 1 }
                                                                    }, { merge: true }))
                                                                })
                                                                    .then(() => {
                                                                        this.fetchingPost();
                                                                        this.setState({ openPostOptionKey: '', openPostOptionUid: '', spinner: false });
                                                                        Alert.alert('Post Dihapus');
                                                                    })
                                                            }
                                                        }
                                                    ]
                                                )}>
                                                <Text style={{ color: '#333', }}>Hapus</Text>
                                            </Button>
                                        </ListItem>
                                    ) : (
                                            <ListItem style={{ justifyContent: 'center' }}>
                                                <Button transparent block style={{ width: '100%' }}
                                                    onPress={() => Alert.alert(
                                                        'LAPOR POST',
                                                        'Apakah post ini mengandung salah satu konten pornografi,ujaran kebencian atau hoaks ?',
                                                        [
                                                            { text: 'Tidak', style: 'cancel' },
                                                            {
                                                                text: 'Ya', onPress: () => {
                                                                    this.setState({ spinner: true });
                                                                    const uid = firebase.auth().currentUser.uid;
                                                                    const ref = firebase.firestore().collection('posts').doc(state.openPostOptionKey);
                                                                    ref.get().then(snap => {
                                                                        if (snap.data().userWhoReported[uid] === undefined) {
                                                                            ref.set({
                                                                                totalReported: state.openPostOptionReport + 1,
                                                                                userWhoReported: {
                                                                                    [uid]: true
                                                                                }
                                                                            }, { merge: true }).then(() => {
                                                                                this.fetchingPost();
                                                                                this.setState({ openPostOptionKey: '', openPostOptionUid: '', openPostOptionReport: 0, spinner: false });
                                                                                alert('Post Telah Dilaporkan');
                                                                            })
                                                                        } else {
                                                                            Alert.alert(
                                                                                'Lapor',
                                                                                'Anda sudah pernah melaporkan post ini',
                                                                                [
                                                                                    { text: 'OK' }
                                                                                ]);
                                                                            this.setState({ spinner: false });
                                                                        }
                                                                    }).then(() => {
                                                                        item.totalUpVote + 1
                                                                    })
                                                                }
                                                            }
                                                        ]
                                                    )}>
                                                    <Text style={{ color: '#333', }}>Lapor</Text>
                                                </Button>
                                            </ListItem>
                                        )}
                                    <ListItem>
                                        <Button transparent block
                                            style={{ width: '100%' }}
                                            onPress={() => this.setState({ openPostOptionKey: '', openPostOptionUid: '', openPostOptionReport: 0 })}>
                                            <Text style={{ color: '#333' }}>Kembali</Text>
                                        </Button>
                                    </ListItem>
                                </List>
                            </View>
                        ) : null}


                        {/* CREATE POST BUTTON */}
                        <Button onPress={() => this.props.navigation.navigate('CreatePostComponent')}
                            style={{ position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 56 / 2, backgroundColor: '#598c5f' }}>
                            <Icon type='Feather' name='plus-circle' />
                        </Button>
                    </Container>
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
    OpenedPostComponent: {
        screen: OpenedPost,
        navigationOptions: {
            header: null
        }
    },
    OpenedProfileComponent: {
        screen: OpenedProfile,
        navigationOptions: {
            header: null
        }
    },
    OpenedPostPictComponent: {
        screen: OpenedPostPict,
        navigationOptions: {
            header: null
        }
    }
})

export default createAppContainer(stackFeed);