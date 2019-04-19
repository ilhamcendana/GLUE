import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import ProfilePage from './ProfilePage/ProfilePage';
import FillProfilePage from './FillProfilePage/FillProfilePage';

const ProfilePageStack = (props) => {
    return (
        <AppStack />
    );
}

export default ProfilePageStack;

const profileStack = createStackNavigator({
    Profile: ProfilePage,
    editProfile: FillProfilePage
});

const AppStack = createAppContainer(profileStack);