import React from 'react';

import { Card, CardItem, Left, Body, Right, List, ListItem, Text, Button, Icon, Thumbnail, Content, SwipeRow, View } from 'native-base';

export default TabNotification = (props) => {
    return (
        <>
            <List>
                <ListItem avatar>
                    <Left>
                        <Thumbnail source={require('../../assets/ProfileIcon.png')} />
                    </Left>
                    <Body>
                        <Text>Kumar Pratik</Text>
                        <Text note>Just commented on your post</Text>
                    </Body>
                    <Right style={{ justifyContent: 'space-between' }}>
                        <Text note>3:43 pm</Text>
                        <Button transparent>
                            <Icon type='Feather' name='x-circle' style={{ color: 'black', fontSize: 14 }} />
                        </Button>
                    </Right>
                </ListItem>


            </List>

            {/* <Card>
                <CardItem>
                    <Body style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Thumbnail source={require('../../assets/ProfileIcon.png')} />
                        <Text>Panji Titan just <Icon name='chatbubbles' style={{ color: '#606', marginHorizontal: 20 }} /> on your post</Text>
                    </Body>
                </CardItem>
            </Card>

            <Card>
                <CardItem>
                    <Body style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Thumbnail source={require('../../assets/ProfileIcon.png')} />
                        <Text>Panji Titan just <Icon name="arrow-up-circle" type='Feather' style={{ color: '#606', marginHorizontal: 20 }} /> on your post</Text>
                    </Body>
                </CardItem>
            </Card>

            <Card>
                <CardItem>
                    <Body style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Thumbnail source={require('../../assets/ProfileIcon.png')} />
                        <Text>Izzat MEMEK just <Icon name="arrow-down-circle" type='Feather' style={{ color: '#606', marginHorizontal: 20 }} /> on your post</Text>
                    </Body>
                </CardItem>
            </Card> */}
        </>
    );
}

