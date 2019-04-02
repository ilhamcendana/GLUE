import React from 'react';
import { View } from 'react-native';
import {
    Container,
    Content,
    Form,
    Item,
    Input,
    Button,
    Text,
    Label,
    Spinner,
    H1,
    Picker,
    Icon
} from 'native-base';

export default FillProfilePage = (props) => {
    const jurusan = ['Manajemen Informatika', 'Teknik Komputer', 'Manajemen Keuangan', 'Manajemen Pemasaran', 'Akuntansi', 'Teknik Informatika', 'Teknik Industri', 'Teknik Mesin', 'Teknik Elektro', 'Teknik Sipil', 'Arsitektur', 'Sistem Informasi', 'Sistem Komputer', 'Manajemen', 'Akuntansi D3', 'Psikologi', 'Sastra Inggris', 'Manajemen Sistem Informasi', 'Magister Manajemen', 'Teknik Elektro', 'Teknologi Informasi'];
    return (
        <Container style={{
            flex: 1,
            width: '100%'
        }}>
            <Content style={{
                flex: 1,
            }}>
                <H1 style={{
                    textAlign: 'center',
                    marginTop: 40
                }}>Lengkapi Profile Anda</H1>

                <Form style={{
                    padding: 20,
                    flex: 1,
                    justifyContent: 'center'
                }}>
                    <Item floatingLabel>
                        <Label>Nama</Label>
                        <Input
                            onChangeText={props.inputNamaProfileEvent}
                            value={props.inputNamaProfile} />
                    </Item>
                    <Item floatingLabel>
                        <Label>NPM</Label>
                        <Input
                            onChangeText={props.inputNPMProfileEvent}
                            value={props.inputNPMProfile}
                            autoCapitalize='none'
                            keyboardType='number-pad' />
                    </Item>
                    <Item floatingLabel>
                        <Label>Kelas</Label>
                        <Input
                            onChangeText={props.inputKelasProfileEvent}
                            value={props.inputKelasProfile}
                            autoCapitalize='none'
                        />
                    </Item>
                    <Item>
                        <Picker
                            note={props.inputJurusanProfile === '' ? true : false}
                            placeholder='Pilih Jurusan'
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            headerBackButtonText="Back"
                            selectedValue={props.inputJurusanProfile}
                            onValueChange={props.inputJurusanProfileEvent}
                        >
                            {jurusan.sort().map(j => <Picker.Item label={j} key={j} value={j} />
                            )}
                        </Picker>
                    </Item>

                    <Button block onPress={props.saveProfileEvent} style={{
                        marginTop: 40,
                        backgroundColor: '#640164'
                    }}>
                        <Text>Simpan</Text>
                    </Button>
                </Form>
            </Content>
        </Container>
    );
}

