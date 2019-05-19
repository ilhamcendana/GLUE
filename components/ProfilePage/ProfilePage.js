import React, { Component } from 'react';
import { View, Dimensions, ScrollView, FlatList, ActivityIndicator, Image, RefreshControl,TouchableOpacity,Alert } from 'react-native';
import { Thumbnail, Text, Button, Icon, Content, Header, CardItem, Container, Left, Body, Right, Card,List,ListItem,Spinner } from 'native-base';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Swiper from 'react-native-swiper';




class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinner:false,
            swiperHeaderTitle: 'Profile',
            namaUser: '',
            kelasUser: '',
            npmUser: '',
            jurusanUser: '',
            profilPictUrl: '',
            totalPost: 0,
            totalTrends: 0,
            totalVote: 0,
            //below is post state
            posts: [],
            loading: false,
            refreshing: false,
            openPostOptionKey:'',
            openPostOptionUid:'',
            openPostOptionReport:''
        }
    }

    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        this.fetchProfileData();
        this.fetchingProfilePosts();

    }

    fetchProfileData = () => {
        const db = firebase.firestore();
        const { displayName, photoURL } = firebase.auth().currentUser;
        db.collection('posts').orderBy('totalUpVote').where('totalUpVote', '>=', 20)
            .get().then(snap => db.collection('users').doc(firebase.auth().currentUser.uid).set({ profile: { totalTrends: snap.size } }, { merge: true }))
            .then(() => {
                db.collection('users').doc(firebase.auth().currentUser.uid).get().then((snap => {
                    this.setState({
                        kelasUser: snap.data().profile.kelas,
                        npmUser: snap.data().profile.npm,
                        jurusanUser: snap.data().profile.jurusan,
                        totalPost: snap.data().profile.totalPost,
                        totalTrends: snap.data().profile.totalTrends,
                        totalVote: snap.data().profile.totalVote,
                        namaUser: displayName,
                        profilPictUrl: photoURL
                    });
                }));
            })
    };

    fetchingProfilePosts = () => {
        const { uid } = firebase.auth().currentUser;
        this.setState({ loading: true, posts: [] });
        const ref = firebase.firestore().collection('posts').where('uid', '==', uid).orderBy('mergeDate').get();
        const data = [];
        ref.then(snap => {
            snap.forEach((doc) => {
                data.push(doc.data());
            });
            data.reverse();
        })
            .then(() => {
                if (data.length == 0) {
                    this.setState({ posts: 'empty', loading: false, refreshing: false });
                } else {
                    this.setState({ posts: data, loading: false, refreshing: false });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({ loading: false, refreshing: false })
            });
    }


    onRefreshEvent = () => {
        this.setState({ refreshing: true }, () => {
            this.fetchProfileData();
            this.fetchingProfilePosts();
        })
    }

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

    render() {
        let screenWidth = Dimensions.get('window').width;
        let screenHeight = Dimensions.get('window').height;
        const {state} = this;
        return (
            <Container style={{ flex: 1, width: screenWidth }}>
                <Header style={{ backgroundColor: '#598c5f' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                            <Icon name='menu' type='Feather' />
                        </Button>
                    </Left>
                    <Body style={{ alignItems: 'center', flex: 1 }}><Text style={{ color: '#fff' }}>{this.state.swiperHeaderTitle}</Text></Body>
                    <Right style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.refs.swiper.scrollBy(1)}>
                            <Icon type='Feather' name='bell' />
                        </Button>
                    </Right>
                </Header>
                {this.state.spinner ? <Spinner size='large' color='#598c5f' style={{ position: 'absolute', zIndex: 100, alignSelf: 'center', top: 55 }} /> : null}
                <Swiper loop={false} showsPagination={false} index={0} bounces={true} ref='swiper'
                    onIndexChanged={(e) => e === 0 ? this.setState({ swiperHeaderTitle: 'Profile' }) : this.setState({ swiperHeaderTitle: 'Notification' })}>
                    <Container>
                        <ScrollView
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefreshEvent}
                                />
                            }
                        >

                            <View style={{
                                flex: 1,
                                width: screenWidth,
                                alignItems: 'center'
                            }}>
                                <View style={{
                                    width: screenWidth,
                                    height: 240,
                                    backgroundColor: '#598c5f',
                                    paddingTop: 15
                                }}>
                                    <View style={{
                                        width: screenWidth,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                    }}>
                                        <View style={{ width: '25%' }}>
                                            <Text style={{ fontSize: 15, fontWeight: '100', textAlign: 'center', color: '#fff' }}>{this.state.jurusanUser}</Text>
                                        </View>
                                        <View style={{ width: '50%', alignItems: 'center' }}>
                                            <Thumbnail source={this.state.profilPictUrl === '' ? require('../../assets/ProfileIcon.png') : { uri: this.state.profilPictUrl }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                                        </View>
                                        <View style={{ width: '25%', alignItems: 'center' }}>
                                            <Button rounded transparent style={{ alignSelf: 'center' }} onPress={() => this.props.navigation.navigate('EditProfile')}>
                                                <Icon style={{ color: '#fff', fontWeight: 'bold' }} type='Feather' name='edit' />
                                            </Button>
                                        </View>
                                    </View>

                                    <View style={{
                                        width: screenWidth,
                                        alignItems: 'center',
                                    }}>
                                        <Text style={{ color: '#fff', fontWeight: '500', fontSize: 18, marginVertical: 10, textTransform: 'uppercase' }}>{this.state.namaUser}</Text>
                                        <View style={{
                                            width: '50%',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Text style={{ fontSize: 13, color: '#fff' }}>{this.state.kelasUser}</Text>
                                            <Text style={{ fontSize: 13, color: '#fff' }}>{this.state.npmUser}</Text>
                                        </View>
                                    </View>

                                    <View style={{
                                        width: screenWidth,
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        marginTop: 30
                                    }}>
                                        <Text style={{ fontWeight: '500', color: '#fff', fontSize: 13 }}>Post's : {this.state.totalPost}</Text>
                                        <Text style={{ fontWeight: '500', color: '#fff', fontSize: 13 }}>Trends : {this.state.totalTrends}</Text>
                                        <Text style={{ fontWeight: '500', color: '#fff', fontSize: 13 }}>UP : {this.state.totalVote}</Text>
                                    </View>
                                </View>
                            </View>

                            {this.state.posts === 'empty' ? (
                                <View style={{ width: screenWidth, paddingVertical: 15, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold' }}>Anda belum mempunyai post</Text>
                                    <Text style={{ textAlign: 'center' }}>Buat post dengan cara ke halaman beranda lalu ketuk tombol dengan icon tambah di bawah kanan layar anda</Text>
                                </View>
                            ) : (

                                    <FlatList
                                        data={this.state.posts}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefreshEvent}
                                        ListFooterComponent={this.footerComponent}
                                        renderItem={({ item }) => (
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
                                        )}
                                    />
                                )}
                        </ScrollView>

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
                                                                        this.fetchingProfilePosts();
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
                                                                                this.fetchingProfilePosts();
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

                    </Container>


                    {/* swipe to notification */}
                    <Content style={{backgroundColor:'#598c5f'}}>
                        <Text style={{textAlign: 'center', fontSize: 45,color:'#fff',fontWeight:'bold',marginTop:20}}>Sorry :(</Text>
                        <Text style={{ textAlign: 'center', fontSize: 30,color:'#fff' }}>Notification is currently under development</Text>
                    </Content>
                </Swiper>
            </Container>
        );
    }
}

export default ProfilePage;




