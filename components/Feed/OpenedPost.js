import React from 'react';
import { View, Image, Animated, Easing, Dimensions, ScrollView, RefreshControl, Alert, FlatList, KeyboardAvoidingView } from 'react-native';
import { Container, Header, Left, Button, Icon, Body, Text, Right, Content, Card, CardItem, Thumbnail, Spinner, List, ListItem, Textarea } from 'native-base';
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
        openPostOptionReport: '',
        comments: [],
        commentInput: '',
    }

    componentDidMount() {
        this.fetchPost();
        this.fetchComment();
    }

    fetchPost = () => {
        firebase.firestore().collection('posts').doc(this.state.postKey)
            .get().then(snap => this.setState({ openedPost: snap.data(), refreshing: false }));
    };

    fetchComment = () => {
        const data = [];
        firebase.firestore().collection('comments').where('postKey', '==', this.state.postKey).orderBy('mergeDate').get()
            .then(snap => {
                snap.forEach(doc => {
                    data.push(doc.data())
                });
                this.setState({ comments: data });
            });
    }


    render() {
        const { navigate } = this.props.navigation;
        const st = this.state;
        const item = st.openedPost;
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        return (
            <Container>
                <Header style={{ justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#598c5f' }}>
                    <Left style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Button transparent onPress={() => navigate('FeedComponent')} style={{ zIndex: 100 }}>
                            <Icon name='arrow-left' type='Feather' />
                        </Button>
                        <Text style={{ color: '#fff' }}>{st.postUsername} post</Text>
                    </Left>
                    <Body style={{ alignItems: 'center', flex: 1 }}></Body>
                </Header>

                <ScrollView refreshControl={<RefreshControl onRefresh={() => this.setState({ refreshing: true }, () => this.fetchPost())} refreshing={st.refreshing} />}>
                    {
                        Object.entries(item).length !== 0 ? (
                            <Card style={{ borderRadius: 20, borderWidth: 5, marginBottom: 80, overflow: 'hidden' }} key={item.key}>
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
                                        <Text style={{ marginTop: 40, color: '#598c5f', paddingVertical: 3, paddingHorizontal: 20, borderRadius: 10, borderWidth: 2, borderColor: '#598c5f' }}>{item.category}</Text>
                                    </Body>
                                </CardItem>
                                <CardItem bordered style={{ borderRadius: 20, flexDirection: 'column', borderRadius: 20 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Button transparent style={{ justifyContent: 'center', width: 150 }}
                                            onPress={() => {
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
                                                            }, { merge: true }).then(() => this.fetchPost())
                                                        } else {
                                                            ref.set({
                                                                totalUpVote: item.totalUpVote - 1,
                                                                userWhoLiked: {
                                                                    [uid]: false
                                                                }
                                                            }, { merge: true }).then(() => this.fetchPost())
                                                        }
                                                    } else {
                                                        ref.set({
                                                            totalUpVote: item.totalUpVote + 1,
                                                            userWhoLiked: {
                                                                [uid]: true
                                                            }
                                                        }, { merge: true }).then(() => this.fetchPost())
                                                    }
                                                    if (item.totalUpVote >= 20) {
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
                                                {item.totalUpVote} {item.totalUpVote > 0 ? 'VOTES' : 'VOTE'}</Text>
                                        </Button>
                                    </View>
                                    <View style={{ width: '100%', marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Button transparent style={{ justifyContent: 'center' }}>
                                            <Text style={{ color: '#598c5f', fontSize: 10 }}>{item.postInfo.totalComments} Komentar</Text>
                                        </Button>
                                        {item.totalUpVote >= 20 ?
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
                                <List>
                                    {this.state.comments.map((item, index) => {
                                        return (
                                            <ListItem avatar
                                                style={{ paddingVertical: 10 }}
                                                key={item.commentKey} onLongPress={() => {
                                                    if (item.uid === firebase.auth().currentUser.uid) {
                                                        Alert.alert(
                                                            'Hapus komentar',
                                                            'Anda yakin?',
                                                            [
                                                                { text: 'Tidak' },
                                                                {
                                                                    text: 'Ya', onPress: () => {
                                                                        firebase.firestore().collection('comments').doc(item.commentKey).delete()
                                                                            .then(() => {
                                                                                const ref = firebase.firestore().collection('posts').doc(item.postKey);
                                                                                ref.get().then(snap => {
                                                                                    ref.set({
                                                                                        postInfo: { totalComments: snap.data().postInfo.totalComments - 1 }
                                                                                    }, { merge: true })
                                                                                })
                                                                                    .then(() => {
                                                                                        const oldComments = [...this.state.comments];
                                                                                        oldComments.splice(index, 1);
                                                                                        this.setState({ comments: oldComments });
                                                                                    })
                                                                            })
                                                                    }
                                                                }
                                                            ]
                                                        );
                                                    }
                                                }}>
                                                <Left>
                                                    <Thumbnail source={{ uri: item.profilePict }} />
                                                </Left>
                                                <Body style={{ flex: 1 }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <Text>{item.nama}</Text>
                                                        <Text note>{item.time}</Text>
                                                    </View>
                                                    <Text note>{item.commentText}</Text>
                                                </Body>
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </Card>
                        ) : <Spinner />}

                </ScrollView>

                {Object.entries(item).length !== 0 ? <KeyboardAvoidingView
                    behavior='position' enabled keyboardVerticalOffset={20}
                    style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                    <View style={{ backgroundColor: '#fff', paddingHorizontal: 5, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Textarea placeholder='Tambahkan Komentar' rowSpan={2}
                            style={{ width: '75%', paddingVertical: 10, borderRadius: 10 }}
                            onChangeText={(e) => {
                                this.setState({ commentInput: e });
                            }}
                            value={st.commentInput}
                        />
                        <Button rounded style={st.commentInput === '' ? { backgroundColor: '#47684a' } : { backgroundColor: '#598c5f' }} disabled={st.commentInput === '' ? true : false}
                            onPress={() => {
                                this.setState({ spinner: true });
                                const ref = firebase.firestore().collection('comments');
                                const date = new Date();
                                const monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                                const month = date.getMonth();
                                const todayDate = date.getDate() + '-' + monthName[month] + '-' + date.getFullYear();
                                const todayTime = date.getHours() + ':' + date.getMinutes();
                                const mergeDate = `${date.getFullYear()}${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`;
                                const { uid, displayName, photoURL } = firebase.auth().currentUser;
                                ref.add({
                                    nama: displayName,
                                    profilePict: photoURL,
                                    commentText: st.commentInput,
                                    date: todayDate,
                                    time: todayTime,
                                    mergeDate: mergeDate,
                                    uid: uid,
                                    postKey: item.key,
                                    commentKey: ''
                                }).then((docRef) => {
                                    firebase.firestore().collection('comments').doc(docRef.id).set({ commentKey: docRef.id }, { merge: true })
                                }).then(() => {
                                    firebase.firestore().collection('posts').doc(item.key).set({
                                        postInfo: { totalComments: item.postInfo.totalComments + 1 }
                                    }, { merge: true })
                                }).then(() => {
                                    const comments = [...this.state.comments];
                                    let data = {
                                        nama: displayName,
                                        profilePict: photoURL,
                                        commentText: this.state.commentInput,
                                        time: todayTime
                                    };
                                    comments.push(data);
                                    this.setState({ comments });
                                    this.setState({ spinner: false, commentInput: '' }, () => {
                                        alert('Komentar terkirim');
                                    })
                                })
                            }}>
                            <Text style={st.commentInput === '' ? { color: '#598c5f' } : { color: '#fff' }}>Kirim</Text>
                        </Button>
                    </View>
                </KeyboardAvoidingView> : null}



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
                                                        const ref = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
                                                        firebase.firestore().collection('posts').doc(st.openPostOptionKey).delete().then(() => {
                                                            ref.get().then(snap => ref.set({
                                                                profile: { totalPost: snap.data().profile.totalPost - 1 }
                                                            }, { merge: true }))
                                                        })
                                                            .then(() => {
                                                                this.fetchPost();
                                                                this.setState({ openPostOptionKey: '', openPostOptionUid: '', spinner: false });
                                                                Alert.alert('Post Dihapus');
                                                                navigate('FeedComponent');
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


                <Animated.View style={{ position: 'absolute', zIndex: 150, bottom: 0, translateY: this.state.trendAnimated, backgroundColor: '#598c5f', paddingVertical: 15, width: screenWidth }}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>This post is trend</Text>
                </Animated.View>
            </Container>

        );
    }
}

export default OpenedPost;