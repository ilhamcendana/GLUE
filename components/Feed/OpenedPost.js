import React from 'react';
import { View, Image, Animated, Easing, Dimensions, ScrollView, RefreshControl, Alert } from 'react-native';
import { Container, Header, Left, Button, Icon, Body, Text, Right, Content, Card, CardItem, Thumbnail, Spinner, List, ListItem } from 'native-base';
import * as firebase from 'firebase';
import 'firebase/firestore';


class OpenedPost extends React.Component {
    state = {
        postKey: this.props.navigation.state.params.postKey,
        postUsername: this.props.navigation.state.params.postUsername,
        openedPost: {},
        trendsInfo: false,
        trendAnimated: new Animated.Value(250),
        refreshing: false,
        openPostOptionKey: '',
        openPostOptionUid: '',
        openPostOptionReport: ''

    }

    componentDidMount() {
        this.fetchPost();
    }

    fetchPost = () => {
        firebase.firestore().collection('posts').doc(this.state.postKey)
            .get().then(snap => this.setState({ openedPost: snap.data(), refreshing: false }));
    };


    render() {
        const { navigate } = this.props.navigation;
        const st = this.state;
        const item = st.openedPost;
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        return (
            <Container>
                <Header style={{ justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#598c5f' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => navigate('FeedComponent')} style={{ zIndex: 100 }}>
                            <Icon name='arrow-left' type='Feather' />
                        </Button>
                    </Left>
                    <Body style={{ alignItems: 'center', flex: 1 }}><Text style={{ color: '#fff' }}>{st.postUsername} post</Text></Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>

                {
                    Object.entries(item).length !== 0 ? (
                        <ScrollView refreshControl={<RefreshControl onRefresh={() => this.setState({ refreshing: true }, () => this.fetchPost())} refreshing={st.refreshing} />}>
                            <Content padder>
                                <Card style={{ borderRadius: 20, borderWidth: 5 }} key={item.key}>
                                    <CardItem bordered header style={{ borderRadius: 20 }}>
                                        <Left>
                                            <Thumbnail source={{ uri: item.profilePict }} />
                                            <Body>
                                                <Text>{item.nama}</Text>
                                                <Text note>{item.todayDate}</Text>
                                            </Body>
                                            <Right>
                                                <View style={{ justifyContent: 'space-between' }}>
                                                    <Button transparent onPress={() => this.setState({ openPostOptionKey: item.key, openPostOptionUid: item.uid, openPostOptionReport: item.totalReported })}>
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
                                            <Text style={{ color: '#333', fontWeight: '100' }}>{item.caption}</Text>
                                        </Body>
                                    </CardItem>
                                    <CardItem bordered style={{ borderRadius: 20, flexDirection: 'column' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Button transparent style={{ justifyContent: 'center', width: 150 }}
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
                                                                }, { merge: true }).then(() => this.fetchPost())
                                                            } else {
                                                                ref.set({
                                                                    postInfo: {
                                                                        totalUpVote: item.postInfo.totalUpVote - 1
                                                                    },
                                                                    userWhoLiked: {
                                                                        [uid]: false
                                                                    }
                                                                }, { merge: true }).then(() => this.fetchPost())
                                                            }
                                                        } else {
                                                            ref.set({
                                                                postInfo: {
                                                                    totalUpVote: item.postInfo.totalUpVote + 1
                                                                },
                                                                userWhoLiked: {
                                                                    [uid]: true
                                                                }
                                                            }, { merge: true }).then(() => this.fetchPost())
                                                        }
                                                        if (item.postInfo.totalUpVote >= 20) {
                                                            ref.set({
                                                                postInfo: {
                                                                    isTrend: true
                                                                }
                                                            }, { merge: true });
                                                        } else {
                                                            ref.set({
                                                                postInfo: {
                                                                    isTrend: false
                                                                }
                                                            }, { merge: true });
                                                        }
                                                    })
                                                }}>
                                                <Icon name="arrow-up-circle" type='Feather'
                                                    style={item.userWhoLiked ? item.userWhoLiked[firebase.auth().currentUser.uid] === true ? { color: '#598c5f' } : { color: '#333' } : { color: '#333' }}
                                                />
                                                <Text style={item.userWhoLiked ? item.userWhoLiked[firebase.auth().currentUser.uid] === true ? { color: '#598c5f' } : { color: '#333' } : { color: '#333' }}>
                                                    {item.postInfo.totalUpVote} {item.postInfo.totalUpVote > 0 ? 'VOTES' : 'VOTE'}</Text>
                                            </Button>
                                        </View>
                                        <View style={{ width: '100%', marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Button transparent style={{ justifyContent: 'center' }}>
                                                <Text style={{ color: '#598c5f', fontSize: 10 }}>{item.postInfo.totalComments} {item.postInfo.totalComments > 1 ? 'Comments' : 'Comment'}</Text>
                                            </Button>
                                            {item.postInfo.totalUpVote >= 20 ?
                                                <Button rounded onPress={() => {
                                                    this.setState({ trendsInfo: true });
                                                    Animated.timing(st.trendAnimated, {
                                                        toValue: 0,
                                                        duration: 500,
                                                        easing: Easing.circle
                                                    }).start(() => {
                                                        Animated.timing(st.trendAnimated, {
                                                            toValue: 250,
                                                            duration: 500,
                                                            delay: 1000
                                                        }).start(() => this.setState({ trendsInfo: false }));
                                                    });
                                                }} style={{ backgroundColor: '#598c5f' }}>
                                                    <Icon type='Ionicons' name='star'
                                                        style={{ color: '#fff' }} />
                                                </Button>
                                                : null}
                                        </View>
                                    </CardItem>
                                </Card>
                            </Content>
                        </ScrollView>
                    ) : <Spinner />}

                {st.openPostOptionKey !== '' ? (
                    <View style={{ paddingHorizontal: 40, backgroundColor: 'rgba(0,0,0,.4)', zIndex: 1000, position: 'absolute', width: screenWidth, height: screenHeight }}>
                        <List style={{ marginTop: 50, backgroundColor: '#fff', borderRadius: 15, overflow: 'hidden' }}>
                            {st.openPostOptionUid === firebase.auth().currentUser.uid ? (
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
                                                        firebase.firestore().collection('posts').doc(st.openPostOptionKey).delete().then(() => {
                                                            this.setState({ openPostOptionKey: '', openPostOptionUid: '', spinner: false }, () => {
                                                                alert('Post Dihapus');
                                                                navigate('FeedComponent');
                                                            });
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
                                                            const ref = firebase.firestore().collection('posts').doc(st.openPostOptionKey);
                                                            ref.get().then(snap => {
                                                                if (snap.data().userWhoReported[uid] === undefined) {
                                                                    ref.set({
                                                                        postInfo: {
                                                                            totalReported: st.openPostOptionReport + 1
                                                                        },
                                                                        userWhoReported: {
                                                                            [uid]: true
                                                                        }
                                                                    }, { merge: true }).then(() => {
                                                                        this.fetchPost();
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
                                                                if (item.postInfo.totalUpVote >= 20) {
                                                                    ref.set({
                                                                        postInfo: {
                                                                            isTrend: true
                                                                        }
                                                                    }, { merge: true });
                                                                } else {
                                                                    ref.set({
                                                                        postInfo: {
                                                                            isTrend: false
                                                                        }
                                                                    }, { merge: true });
                                                                }
                                                            }).then(() => {
                                                                item.postInfo.totalUpVote + 1
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


                <Animated.View style={{ position: 'absolute', zIndex: 150, bottom: 0, translateY: this.state.trendAnimated, backgroundColor: '#598c5f', paddingVertical: 15, width: screenWidth }}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>This post is trend</Text>
                </Animated.View>
            </Container>

        );
    }
}

export default OpenedPost;