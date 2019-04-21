import React, { Component } from 'react';
import { Image, FlatList, ActivityIndicator, View } from 'react-native';
import { Card, CardItem, Left, Body, Right, Text, Button, Icon, Thumbnail, Content } from 'native-base';
import * as firebase from 'firebase';

class TabProfilPost extends Component {
    state = {
        posts: [],
        loading: false
    }

    componentWillMount() {
        this.fetchProfilePosts();
    }

    fetchProfilePosts = () => {
        this.setState({ loading: true });
        const ref = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/posts');
        ref.on('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                let posts = [...this.state.posts];
                let dataFromDB = childSnapshot.val();
                posts.push(dataFromDB);
                this.setState({ posts, loading: false });
                // console.log(this.state.posts, 'slicing');
                // const childKey = childSnapshot.key;
                // const childData = childSnapshot.val().caption;

            });
        });
    };

    renderFooter = () => {
        if (!this.state.loading) return null;
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator animating size="large" />
            </View>
        )
    }

    render() {
        const post = this.state.posts.map(post => {
            return (
                <Content padder>
                    <Card style={{ borderRadius: 20, borderWidth: 5 }}>
                        <CardItem bordered header style={{ borderRadius: 20 }}>
                            <Left>
                                <Thumbnail source={require('../../assets/ProfileIcon.png')} />
                                <Body>
                                    <Text>{post.username}</Text>
                                    <Text note>April 15, 2019</Text>
                                </Body>
                                <Right>
                                    {post.isTrend ?
                                        <Button transparent >
                                            <Icon type='Ionicons' name='star-outline' style={{ color: '#660066' }} />
                                        </Button>
                                        : null}
                                </Right>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Image source={{ uri: 'https://placeimg.com/740/580/tech' }} style={{ height: 200, width: '100%', marginBottom: 10, flex: 1 }} />
                                <Text>
                                    {post.caption}
                                </Text>
                            </Body>
                        </CardItem>
                        <CardItem bordered style={{ borderRadius: 20 }}>
                            <Left>
                                <Button transparent style={{ justifyContent: 'center' }}>
                                    <Icon name="arrow-up-circle" type='Feather'
                                    /><Text>{post.totalUpVote}</Text>

                                </Button>

                                <Button transparent style={{ justifyContent: 'center' }} >
                                    <Icon name="arrow-down-circle" type='Feather'
                                    /><Text>{post.totalDownVote}</Text>
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
            )
        })
        return (
            <>
                <Content padder>
                    <FlatList
                        data={this.state.posts}
                        ListFooterComponent={this.renderFooter}
                        renderItem={({ item }) => (
                            <Card style={{ borderRadius: 20, borderWidth: 5 }}>
                                <CardItem bordered header style={{ borderRadius: 20 }}>
                                    <Left>
                                        <Thumbnail source={require('../../assets/ProfileIcon.png')} />
                                        <Body>
                                            <Text>{item.username}</Text>
                                            <Text note>April 15, 2019</Text>
                                        </Body>
                                        <Right>
                                            {item.isTrend ?
                                                <Button transparent >
                                                    <Icon type='Ionicons' name='star-outline' style={{ color: '#660066' }} />
                                                </Button>
                                                : null}
                                        </Right>
                                    </Left>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Image source={{ uri: 'https://placeimg.com/740/580/tech' }} style={{ height: 200, width: '100%', marginBottom: 10, flex: 1 }} />
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
                </Content>
            </>

        );
    }
}

export default TabProfilPost;
