import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Dimensions } from 'react-native';
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
    Icon,
    Thumbnail
} from 'native-base';

export default SignUpPage = (props) => {
    const jurusan = ['Manajemen Informatika', 'Teknik Komputer', 'Manajemen Keuangan', 'Manajemen Pemasaran', 'Akuntansi', 'Teknik Informatika', 'Teknik Industri', 'Teknik Mesin', 'Teknik Elektro', 'Teknik Sipil', 'Arsitektur', 'Sistem Informasi', 'Sistem Komputer', 'Manajemen', 'Akuntansi D3', 'Psikologi', 'Sastra Inggris', 'Manajemen Sistem Informasi', 'Magister Manajemen', 'Teknik Elektro', 'Teknologi Informasi'];
    const screenWidth = Dimensions.get('window').width;
    return (
        <Container style={{
            flex: 1,
            width: '100%'
        }}>
            {props.spinner ? (
                <View style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    justifyContent: 'center',
                    top: 40
                }}>
                    <Spinner color='#660066' />
                </View>
            ) : null}
            <Content style={{
                flex: 1,
            }}>

                <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                    <Text style={{
                        textAlign: 'center',
                        fontWeight: '500',
                        fontSize: 50
                    }}>Sign up</Text>

                    <KeyboardAvoidingView behavior="padding" enabled>
                        <View style={{ width: '100%', alignItems: 'center', marginVertical: 40 }}>
                            <Thumbnail source={props.image ? { uri: props.image } : require('../../assets/ProfileIcon.png')} large />
                        </View>
                        <View style={{ width: screenWidth, flexDirection: 'row', justifyContent: 'space-around', }}>
                            <Button style={{ backgroundColor: '#660066' }} rounded onPress={props._takeImage}>
                                <Text style={{ color: '#fff' }}>Camera</Text>
                            </Button>
                            <Button style={{ backgroundColor: '#660066' }} rounded onPress={props._pickImage}>
                                <Text style={{ color: '#fff' }}>gallery</Text>
                            </Button>
                        </View>

                        <Form style={{
                            padding: 20,
                            flex: 1,
                            justifyContent: 'center'
                        }}>


                            <Item floatingLabel style={{ borderColor: '#660066', paddingBottom: 10 }}>
                                <Label>Email</Label>
                                <Input
                                    autoCapitalize='none'
                                    keyboardType='email-address'
                                    returnKeyType='done'
                                    onChangeText={props.signupEmailValChange}
                                    value={props.signupEmailValue} />
                            </Item>
                            <Item floatingLabel style={{ borderColor: '#660066', paddingBottom: 10 }}>
                                <Label>Password atleast 6 characters</Label>
                                <Input
                                    returnKeyType='done'
                                    secureTextEntry={true}
                                    onChangeText={props.signupPassValChange}
                                    value={props.signupPassValue}
                                    autoCapitalize='none'
                                />
                            </Item>

                            <Item floatingLabel style={{ borderColor: '#660066', paddingBottom: 10 }}>
                                <Label>Nama</Label>
                                <Input
                                    onChangeText={props.inputNamaProfileEvent}
                                    value={props.inputNamaProfile} />
                            </Item>
                            <Item floatingLabel style={{ borderColor: '#660066', paddingBottom: 10 }}>
                                <Label>NPM</Label>
                                <Input
                                    onChangeText={props.inputNPMProfileEvent}
                                    value={props.inputNPMProfile}
                                    autoCapitalize='none'
                                    keyboardType='number-pad' />
                            </Item>
                            <Item floatingLabel style={{ borderColor: '#660066', paddingBottom: 10 }}>
                                <Label>Kelas</Label>
                                <Input
                                    onChangeText={props.inputKelasProfileEvent}
                                    value={props.inputKelasProfile}
                                    autoCapitalize='none'

                                />
                            </Item>
                            <Item style={{ marginTop: 10 }}>
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

                            <Button block rounded onPress={props.signupEvent}
                                style={{
                                    marginTop: 40,
                                    backgroundColor: '#640164',
                                    alignSelf: 'center',
                                    width: 150,
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                <Text>Sign up</Text>
                            </Button>
                            <Text style={{ textAlign: 'center', marginVertical: 15 }}>Already have an account?</Text>
                            <Button
                                rounded
                                style={{ borderColor: '#660066', width: 150, borderWidth: 1, display: 'flex', justifyContent: 'center', backgroundColor: 'none', alignSelf: 'center' }}
                                bordered onPress={props.gotoSignup} block><Text style={{ color: '#640164' }}>Sign in</Text></Button>
                        </Form>
                    </KeyboardAvoidingView>
                </View>
            </Content>
        </Container>
    );
}

