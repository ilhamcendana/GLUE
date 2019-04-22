import React, { Component } from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import { Thumbnail, Text, Button, Tab, Tabs, TabHeading, Icon, Content, Header, Container, Left, Body, Right } from 'native-base';
import * as firebase from 'firebase';

import TabProfilPost from '../TabProfilPost/TabProfilPost';
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
        }
    }

    static navigationOptions = {
        header: null
    }

    componentWillMount() {
        this.fetchProfileData();
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
                    {/* <Content>
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

                        <TabProfilPost />

                    </Content> */}
                    <TabProfilPost />
                    <Content>
                        <Text style={{ textAlign: 'center', fontSize: 45 }}>NOTIFICATION</Text>
                    </Content>
                </Swiper>
            </Container>
        );
    }
}

export default ProfilePage;




