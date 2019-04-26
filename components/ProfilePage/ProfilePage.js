import React, { Component } from 'react';
import { View, Dimensions, ScrollView, FlatList, ActivityIndicator } from 'react-native';
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
        this.fetchProfilePosts();
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

    fetchProfilePosts = () => {
        this.setState({ loading: true });
        const ref = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/posts');
        ref.once('value', (snap) => {
            const newData = Object.values(snap.val());
            this.setState({ posts: newData, loading: false, refreshing: false })

        })
            .catch((err) => {
                this.setState({ loading: false, refreshing: false });
                alert(err);
            });
    };

    headerComponent = () => {
        let screenWidth = Dimensions.get('window').width;
        return (
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
        )
    }

    renderFooter = () => {
        if (!this.state.loading) return null;
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator animating size="large" />
            </View>
        )
    };

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

                    <FlatList
                        data={this.state.posts}
                        ListHeaderComponent={this.headerComponent}
                        ListFooterComponent={this.renderFooter}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.setState({ refreshing: true }, this.fetchProfilePosts())}
                        keyExtractor={(item) => item.caption}
                        renderItem={({ item }) => (
                            <Content padder>
                                {console.log(this.state.posts)}
                                <Card style={{ borderRadius: 20, borderWidth: 5 }}>
                                    <CardItem bordered header style={{ borderRadius: 20 }}>
                                        <Left>
                                            <Thumbnail source={require('../../assets/ProfileIcon.png')} />
                                            <Body>
                                                <Text>{item.username}</Text>
                                                <Text note>{item.todayDate}</Text>
                                            </Body>
                                            <Right>
                                                <View style={{ justifyContent: 'space-between' }}>
                                                    {!item.isTrend ?
                                                        <Button transparent >
                                                            <Icon type='Ionicons' name='star-outline' style={{ color: '#660066' }} />
                                                        </Button>
                                                        : null}
                                                    <Text note>{item.todayTime}</Text>
                                                </View>
                                            </Right>
                                        </Left>
                                    </CardItem>
                                    <CardItem>
                                        <Body>
                                            {item.postPict !== '' ?
                                                <Image source={{ uri: item.postPict }} style={{ height: 200, width: '100%', marginBottom: 10, flex: 1 }} /> :
                                                null}
                                            <Text>
                                                {item.caption}
                                            </Text>
                                        </Body>
                                    </CardItem>
                                    <CardItem bordered style={{ borderRadius: 20 }}>
                                        <Left>
                                            <Button transparent style={{ justifyContent: 'center' }}>
                                                <Icon name="arrow-up-circle" type='Feather'
                                                /><Text>{item.totalUpVote}</Text>

                                            </Button>

                                            <Button transparent style={{ justifyContent: 'center' }} >
                                                <Icon name="arrow-down-circle" type='Feather'
                                                /><Text>{item.totalDownVote}</Text>
                                            </Button>

                                            <Button transparent style={{ justifyContent: 'center' }}>
                                                <Icon name="chatbubbles" style={{ color: '#660066' }} /><Text style={{ color: '#660066' }}>123</Text>
                                            </Button>
                                        </Left>

                                        <Body></Body>

                                        <Right>
                                            <Button transparent style={{ justifyContent: 'center', width: 40 }} >
                                                <Icon name="alert" type='Ionicons' style={{ color: '#660066' }} />
                                            </Button>
                                        </Right>
                                    </CardItem>
                                </Card>
                            </Content>
                        )}
                    />

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




