import React, { Component } from 'react';
import { Image, FlatList, ActivityIndicator, View } from 'react-native';
import { Card, CardItem, Left, Body, Right, Text, Button, Icon, Thumbnail, Content } from 'native-base';
import * as firebase from 'firebase';


class TabProfilPost extends Component {
    state = {
        posts: [],
        loading: false,
        refreshing: false,
        dummy: [
            {
                nama: 'ilham',
                caption: 'hehehhe'
            },
            {
                nama: 'cendana',
                caption: 'hsaidoas'
            },
            {
                nama: 'putra',
                caption: 'dididi'
            }
        ],
        page: 2
    }

    componentWillMount() {
        this.fetchProfilePosts();

    }

    fetchProfilePosts = () => {
        this.setState({ loading: true });
        const ref = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/posts');
        ref.once('value', (snap) => {
            const newData = Object.values(snap.val());
            this.setState({ posts: newData, loading: false, refreshing: false });
        });
    };

    handleRefresh = () => {
        this.setState({ refreshing: true }, () => this.fetchProfilePosts());
    };


    headerComponent = () => {
        return (
            <View>
                <Text>header pantek</Text>
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

        return (
            <FlatList
                data={this.state.posts}
                ListHeaderComponent={this.headerComponent}
                ListFooterComponent={this.renderFooter}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                renderItem={({ item }) => (
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
                )}
            />

        );
    }
}

export default TabProfilPost;
