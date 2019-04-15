import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Form, Textarea, Input, Item, Content, Icon, Button, Text, Toast } from 'native-base';
import { Camera, Permissions } from 'expo';

export default class InputPengaduan extends Component {
    state = {
        nama: 'ilhamcendana',
        input: '',
        showSuccess: false
    }

    ngadu = () => {
        const d = new Date();
        const time = d.getHours() + ':' + d.getMinutes();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const date = d.getDate() + '-' + monthNames[d.getMonth()] + '-' + d.getFullYear();
        const aduan = {
            nama: this.state.nama,
            aduan: this.state.input,
            date,
            time
        };
        axios.post('https://forumpengaduan.firebaseio.com/data.json', aduan);
        this.setState({ input: '', showSuccess: true });
        setTimeout(() => this.setState({ showSuccess: false }), 1000);
    }
    render() {
        const success = this.state.showSuccess ? (
            <View style={styles.success}>
                <Text style={{ textAlign: "center", fontSize: 30, color: '#fff' }}>Terkirim!</Text>
            </View>
        ) : null;
        return (
            <Content padder>
                {success}
                <Form>
                    <Textarea bordered rowSpan={5} placeholder='isi pengaduan' returnKeyType='default' onChangeText={(e) => this.setState({ input: e })} value={this.state.input} />
                    <Button info block style={{ marginTop: 20 }} onPress={this.ngadu}><Text>Kirim</Text></Button>

                </Form>
            </Content>
        );
    }
}

const styles = StyleSheet.create({
    success: {
        backgroundColor: 'lightgreen',
        paddingVertical: 20,

    }
});



