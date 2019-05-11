import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Container, Thumbnail, Button, Icon, Content, Header, CardItem, Left, Body, Right, Card } from 'native-base';


class OpenedProfile extends React.Component {
    state = {
        uid: this.props.navigation.state.params.uid,
        userProfile: {}
    }

    componentDidMount() {
        firebase.firestore().collection('users').doc(this.state.uid).get().then(snap => {
            this.setState({
                userProfile: snap.data().profile
            });
        });
    }
    render() {
        let screenWidth = Dimensions.get('window').width;
        const { state } = this;
        return (
            <Container>
                <Header style={{ justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#598c5f' }}>
                    <Left style={{ flex: 1 }}>
                        <Button transparent onPress={() => this.props.navigation.navigate('FeedComponent')} style={{ zIndex: 100 }}>
                            <Icon name='arrow-left' type='Feather' />
                        </Button>
                    </Left>
                    <Body style={{ alignItems: 'center', flex: 1 }}><Text style={{ color: '#fff', textAlign: 'center' }}>{state.userProfile.nama}'s profile</Text></Body>
                    <Right style={{ flex: 1 }}>
                    </Right>
                </Header>

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
                                <Text style={{ fontSize: 15, fontWeight: '100', textAlign: 'center', color: '#fff' }}>{state.userProfile.jurusan}</Text>
                            </View>
                            <View style={{ width: '50%', alignItems: 'center' }}>
                                <Thumbnail source={{ uri: state.userProfile.profilePictUrl }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                            </View>
                            <View style={{ width: '25%', alignItems: 'center' }}>
                            </View>
                        </View>

                        <View style={{
                            width: screenWidth,
                            alignItems: 'center',
                        }}>
                            <Text style={{ color: '#fff', fontWeight: '500', fontSize: 18, marginVertical: 10, textTransform: 'uppercase' }}>{state.userProfile.nama}</Text>
                            <View style={{
                                width: '50%',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <Text style={{ fontSize: 13, color: '#fff' }}>{state.userProfile.kelas}</Text>
                                <Text style={{ fontSize: 13, color: '#fff' }}>{state.userProfile.npm}</Text>
                            </View>
                        </View>

                        <View style={{
                            width: screenWidth,
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            marginTop: 30
                        }}>
                            <Text style={{ fontWeight: '500', color: '#fff', fontSize: 13 }}>Post's : {state.userProfile.totalPost}</Text>
                            <Text style={{ fontWeight: '500', color: '#fff', fontSize: 13 }}>Trends : {state.userProfile.totalTrends}</Text>
                            <Text style={{ fontWeight: '500', color: '#fff', fontSize: 13 }}>UP : {state.userProfile.totalVote}</Text>
                        </View>
                    </View>
                </View>
            </Container>
        );
    }
}

export default OpenedProfile;