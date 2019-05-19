import React, { Component } from "react";
import { createDrawerNavigator, createAppContainer } from "react-navigation";

import Feed from "../Feed/Feed";
import CustomDrawer from "./CustomDrawer";
import ProfilePage from "../ProfilePage/ProfilePage";
import FillProfilePage from "../FillProfilePage/FillProfilePage";
import inputPengaduan from "../InputPengaduan/InputPengaduan";
import Info from "./Info";
import Help from './Help';

class LandingLayout extends Component {
  state = {};

  render() {
    return <LandingNavigator />;
  }
}

export default LandingLayout;

const DrawerNav = createDrawerNavigator(
  {
    Home: { screen: Feed },
    Profile: { screen: ProfilePage },
    EditProfile: { screen: FillProfilePage },
    createPost: { screen: inputPengaduan },
    Info: { screen: Info },
    Help: { screen: Help }
  },
  {
    drawerPosition: "left",
    contentComponent: ({ navigation }) => {
      return (
        <CustomDrawer
          gotoProfile={() => navigation.navigate("Profile")}
          gotoHome={() => navigation.navigate("Home")}
          gotoInformation={() => navigation.navigate("Info")}
          gotoHelp={() => navigation.navigate("Help")}
        />
      );
    }
  }
);

const LandingNavigator = createAppContainer(DrawerNav);
