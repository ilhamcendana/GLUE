import React, { Component } from 'react';
import { View, Dimensions, ScrollView, FlatList, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { Thumbnail, Text, Button, Icon, Content, Header, CardItem, Container, Left, Body, Right, Card } from 'native-base';
import * as firebase from 'firebase';
import 'firebase/firestore';
import Swiper from 'react-native-swiper';




class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
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

    render() {
        let screenWidth = Dimensions.get('window').width;
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
                                                <Card style={{ borderRadius: 20, borderWidth: 5, }} key={item.key}>
                                                    <CardItem bordered header style={{ borderRadius: 20 }}>
                                                        <Left>
                                                            <Thumbnail source={{ uri: firebase.auth().currentUser.photoURL }} />
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
                                                                        this.setState({ spinner: true });

                                                                    }}>
                                                                    <Icon name="arrow-up-circle" type='Feather'

                                                                    />
                                                                    <Text >
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
                                        )}
                                    />
                                )}

                        </ScrollView>
                    </Container>


                    {/* swipe to notification */}
                    <Content>
                        <Text style={{ textAlign: 'center', fontSize: 45 }}>NOTIFICATION</Text>
                    </Content>
                </Swiper>
            </Container>
        );
    }
}

export default ProfilePage;




