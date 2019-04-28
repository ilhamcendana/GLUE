import React, { Component } from 'react';
import { View, Dimensions, ScrollView, FlatList, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { Thumbnail, Text, Button, Icon, Content, Header, CardItem, Container, Left, Body, Right, Card } from 'native-base';
import * as firebase from 'firebase';
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
            page: 2
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
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/profile').on('value', (snapshot) => {
            this.setState({
                namaUser: snapshot.val().nama,
                kelasUser: snapshot.val().kelas,
                npmUser: snapshot.val().npm,
                jurusanUser: snapshot.val().jurusan,
                profilPictUrl: snapshot.val().profilPictUrl,
                totalPost: snapshot.val().totalPost,
                totalTrends: snapshot.val().totalTrends,
                totalVote: snapshot.val().totalVote
            });
        });
    };

    fetchingProfilePosts = () => {
        this.setState({ loading: true, posts: [] });
        const ref = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/posts');
        ref.once('value', (snap) => {
            if (snap.val() === null) {
                this.setState({ posts: null, refreshing: false, loading: false });
            } else {
                const newData = Object.values(snap.val()).reverse();
                const newPost = newData;
                this.setState({ posts: newPost, loading: false, refreshing: false });
            }
        })
    }


    onRefreshEvent = () => {
        this.setState({ refreshing: true }, () => this.fetchingProfilePosts())
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
                        <Button transparent>
                            <Icon type='Feather' name='more-horizontal' />
                        </Button>
                    </Right>
                </Header>
                <Swiper loop={false} showsPagination={false} index={0} bounces={true}
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

                            {this.state.posts !== null ? this.state.posts.map(item => (
                                <Content padder key={item.key}>
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
                                                        <Button transparent>
                                                            <Icon type='Feather' name='more-horizontal'
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
                                                    <Button transparent style={{ justifyContent: 'center' }} onPress={this.voteUp}>
                                                        <Icon name="arrow-up-circle" type='Feather'
                                                        /><Text >{item.postInfo.totalUpVote} Vote</Text>
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
                            )) : <View style={{ width: screenWidth, paddingVertical: 15, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold' }}>Anda belum mempunyai post</Text>
                                    <Text style={{ textAlign: 'center' }}>Buat post dengan cara ke halaman beranda lalu ketuk tombol dengan icon tambah di bawah kanan layar anda</Text>
                                </View>}
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




