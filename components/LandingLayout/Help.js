import React from 'react';
import { View, Text } from 'react-native';
import { Container, Content, Header, Left, Button, Icon, Body, Right } from 'native-base';

const Help = (props) => {
    const { navigate } = props.navigation;
    const date = new Date();
    return (
        <Container>
            <Header style={{ justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#598c5f' }}>
                <Left style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Button transparent onPress={() => navigate('Home')} style={{ zIndex: 100 }}>
                        <Icon name='arrow-left' type='Feather' />
                    </Button>
                </Left>
                <Body style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ color: '#fff' }}>HELP</Text>
                </Body>
                <Right style={{ flex: 1 }}></Right>
            </Header>

            <Content>
                <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
                    <Text style={{ textAlign: 'justify', marginBottom: 20 }}>Jika terdapat icon silang (X) pada foto profil di sidedrawer anda berarti itu menandakan anda belum verifikasi email, jika email belum diverifikasi, maka anda belum dapat untuk membuat sebuah post sampai email anda diverifikasi.</Text>
                    <Text style={{ textAlign: 'justify', marginBottom: 20 }}>Cara membuat post adalah dengan masuk ke halaman feed lalu ketuk icon tambah pada sisi bawah kanan layar anda, ketik atau masukkan gambar lalu ketuk tombol post.</Text>
                    <Text style={{ textAlign: 'justify', marginBottom: 20 }}>Laporkan post tersebut dengan cara ketuk tanda panah disebelah kanan post lalu ketuk lapor, post tersebut akan dihapus oleh sistem jika memenuhi persyaratan penghapusan post.</Text>
                    <Text style={{ textAlign: 'justify', marginBottom: 20 }}>Halaman trends adalah halaman dimana post-post yang memiliki banyak vote.</Text>
                    <Text style={{ textAlign: 'justify', marginBottom: 20 }}>Anda dapat memberi komentar pada post dengan cara ketuk "LIHAT POST".</Text>
                    <Text style={{ textAlign: 'justify', marginBottom: 20 }}>Anda dapat mengganti data profile anda dengan masuk ke halaman profil lalu ketuk icon pensil di kanan atas.</Text>
                </View>
                <Text style={{ position: 'absolute', bottom: 0, alignSelf: 'center' }}>Copyright {date.getFullYear()} developed by Ilhamcendana</Text>
            </Content>
        </Container>
    );
}

export default Help;