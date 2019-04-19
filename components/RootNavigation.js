import React, { Component } from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
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
    H1
} from 'native-base';
import { createStackNavigator, createAppContainer } from 'react-navigation';

// COMPONENTS
import SignInPage from './Auth/SignInPage';
import SignUpPage from './Auth/SignUpPage';


const RootStackNavigator = createStackNavigator({
    Login: SignInPage,
    Signup: SignUpPage
});

const AppStackContainer = createAppContainer(RootStackNavigator);

export default class RootNavigation extends Component {
    state = {
        spinner: false,
        signEmailValue: '',
        signPassValue: '',
        signupEmailValue: '',
        signupPassValue: '',
        inputNamaProfile: '',
        inputNPMProfile: '',
        inputKelasProfile: '',
        inputJurusanProfile: ''
    }
    render() {
        return (
            <AppStackContainer />
        );
    }
}


