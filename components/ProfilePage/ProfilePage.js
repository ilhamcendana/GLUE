import React from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import { Thumbnail, Text, Button, Tab, Tabs, TabHeading, Icon } from 'native-base';
import TabProfilPost from '../TabProfilPost/TabProfilPost';
import TabNotification from '../TabNotification/TabNotification';
import fire from '../../config.js';

export default ProfilePage = (props) => {
    let screenWidth = Dimensions.get('window').width;
    return (
        <ScrollView>
            <View style={{
                flex: 1,
                width: screenWidth,
                alignItems: 'center'
            }}>
                <View style={{
                    width: screenWidth,
                    height: 220,
                    backgroundColor: '#606',
                    paddingTop: 15
                }}>
                    <View style={{
                        width: screenWidth,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}>
                        <View style={{ width: '25%' }}>
                            <Text style={{ fontSize: 15, fontWeight: '100', textAlign: 'center', color: '#fff' }}>{props.jurusanUser}</Text>
                        </View>
                        <View style={{ width: '50%', alignItems: 'center' }}>
                            <Thumbnail source={require('../../assets/ProfileIcon.png')} large />
                        </View>
                        <View style={{ width: '25%', alignItems: 'center' }}>
                            <Button rounded transparent style={{ alignSelf: 'center' }} onPress={props.openEdit}>
                                <Icon style={{ color: '#fff', fontWeight: 'bold' }} type='Feather' name='edit' />
                            </Button>
                        </View>
                    </View>

                    <View style={{
                        width: screenWidth,
                        alignItems: 'center',
                    }}>
                        <Text style={{ color: '#fff', fontWeight: '500', fontSize: 18, marginVertical: 10, textTransform: 'uppercase' }}>{props.namaUser}</Text>
                        <View style={{
                            width: '50%',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <Text style={{ fontSize: 13, color: '#fff' }}>{props.kelasUser}</Text>
                            <Text style={{ fontSize: 13, color: '#fff' }}>{props.npmUser}</Text>
                        </View>
                    </View>

                    <View style={{
                        width: screenWidth,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginTop: 30
                    }}>
                        <Text style={{ fontWeight: '500', color: '#fff', fontSize: 13 }}>Post's : 4</Text>
                        <Text style={{ fontWeight: '500', color: '#fff', fontSize: 13 }}>Trends : 10</Text>
                        <Text style={{ fontWeight: '500', color: '#fff', fontSize: 13 }}>UP : 50</Text>
                    </View>
                </View>

                <Tabs tabBarUnderlineStyle={{ borderWidth: 2, borderColor: '#660066' }}>
                    <Tab
                        heading={<TabHeading style={{ backgroundColor: '#fff' }}><Icon style={{ color: '#660066' }} type='Feather' name="file-text" /><Text></Text></TabHeading>}>
                        <TabProfilPost />

                    </Tab>
                    <Tab
                        heading={<TabHeading style={{ backgroundColor: '#fff' }}><Icon style={{ color: '#660066' }} type='Feather' name="bell" /><Text></Text></TabHeading>}>
                        <TabNotification />

                    </Tab>
                </Tabs>
            </View>
        </ScrollView>
    );
}

