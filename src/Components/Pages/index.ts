import { SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ClassIcon from "@material-ui/icons/Class";
import { NotificationMessage } from "../Misc/Notifications";
import ClassesPage from "./ClassesPage";
import ErrorPage from "./ErrorPage";
import LoginPage from "./LoginPage";
import LogoutPage from "./LogoutPage";
import ProfilePage from "./ProfilePage";

export declare interface PageProps {
  setPageKey: (pageKey: string) => void;
  setLoadingMessage: (loadingMessage: string) => void;
  setNotification: (notification: NotificationMessage) => void;
  handleLoadUserData: (userId: string) => void;
  setUserMode: (userMode: UserMode) => void;
  userMode: UserMode;
  currentUser: firebase.User | null;
  currentUserProfile: UserProfile | null;
  classes: any;
}

export declare interface PageListForMenuItem {
  key: string;
  menuLabel: string;
  menuIcon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  displaySignedIn: boolean;
  displaySignedOut: boolean;
}

declare interface PageListItem extends PageListForMenuItem {
  title: string;
  component: React.FunctionComponent<PageProps>;
}

const pageList: PageListItem[] = [
  {
    key: "login",
    title: "",
    menuLabel: "Login",
    menuIcon: ExitToAppIcon,
    displaySignedIn: false,
    displaySignedOut: true,
    component: LoginPage,
  },
  {
    key: "classes",
    title: "Classes",
    menuLabel: "Classes",
    menuIcon: ClassIcon,
    displaySignedIn: true,
    displaySignedOut: false,
    component: ClassesPage,
  },
  {
    key: "profile",
    title: "Profile",
    menuLabel: "Profile",
    menuIcon: AccountCircleIcon,
    displaySignedIn: true,
    displaySignedOut: false,
    component: ProfilePage,
  },
  {
    key: "logout",
    title: "",
    menuLabel: "Logout",
    menuIcon: ExitToAppIcon,
    displaySignedIn: true,
    displaySignedOut: false,
    component: LogoutPage,
  },
];

const pageObject = pageList.reduce((pageObject, pageListItem) => {
  pageObject[pageListItem.key] = pageListItem;
  return pageObject;
}, {} as { [key: string]: PageListItem });

export const getPageComponent = (
  key: string
): React.FunctionComponent<PageProps> => {
  if (pageObject[key]) {
    return pageObject[key].component;
  }
  return ErrorPage;
};

export const getPageTitle = (key: string): string => {
  if (pageObject[key]) {
    return pageObject[key].title;
  }
  return "";
};

export const pageListForMenu: PageListForMenuItem[] = pageList.map(
  ({ key, menuLabel, menuIcon, displaySignedIn, displaySignedOut }) => {
    return { key, menuLabel, menuIcon, displaySignedIn, displaySignedOut };
  }
);
