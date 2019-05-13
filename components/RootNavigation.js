import React, { Component } from 'react';
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
    render() {
        return (
            <AppStackContainer />
        );
    }
}


