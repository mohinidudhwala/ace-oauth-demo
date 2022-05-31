import { IDENTITY_CONFIG, METADATA_OIDC } from "../utils/authConst";
import { UserManager, WebStorageStateStore, Log } from "oidc-client";

export default class AuthService {
    UserManager;

    constructor() {
        this.UserManager = new UserManager({
            ...IDENTITY_CONFIG,
            userStore: new WebStorageStateStore({ store: window.sessionStorage }),
            metadata: {
                ...METADATA_OIDC
            }
        });
        // Logger
        Log.logger = console;
        Log.level = Log.DEBUG;
        this.UserManager.events.addUserLoaded((user) => {
            if (window.location.href.indexOf("signin-oidc") !== -1) {
                this.navigateToScreen();
            }
        });
        this.UserManager.events.addSilentRenewError((e) => {
            console.log("silent renew error", e.message);
        });

        this.UserManager.events.addAccessTokenExpired(() => {
            console.log("token expired");
            this.logout();
        });
    }

    //Returns promise to process response from the authorization endpoint. The result of the promise is the authenticated User. 
    signinRedirectCallback = () => {
        this.UserManager.signinRedirectCallback().then(() => {
            "";
        });
    };

    //Returns promise to load the User object for the currently authenticated user.
    getUser = async () => {
        const user = await this.UserManager.getUser();
        if (!user) {
            return await this.UserManager.signinRedirectCallback();
        }
        return user;
    };

    parseJwt = (token) => {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        return JSON.parse(window.atob(base64));
    };

    //Returns promise to trigger a redirect of the current window to the authorization endpoint.
    signinRedirect = () => {
        localStorage.setItem("redirectUri", window.location.pathname);
        this.UserManager.signinRedirect({});
    };


    navigateToScreen = () => {
        window.location.replace("/en/dashboard");
    };


    isAuthenticated = () => {
        const oidcStorage = JSON.parse(sessionStorage.getItem(`oidc.user:${process.env.REACT_APP_AUTH_URL}:${process.env.REACT_APP_IDENTITY_CLIENT_ID}`))

        return (!!oidcStorage && !!oidcStorage.access_token)
    };

    // Returns promise to trigger a silent request (via an iframe) to the authorization endpoint. The result of the promise is the authenticated User.
    signinSilent = () => {
        this.UserManager.signinSilent()
            .then((user) => {
                console.log("signed in", user);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    //Returns promise to notify the parent window of response from the authorization endpoint.
    signinSilentCallback = () => {
        this.UserManager.signinSilentCallback();
    };

    createSigninRequest = () => {
        return this.UserManager.createSigninRequest();
    };

    logout = () => {
        this.UserManager.signoutRedirect({
            id_token_hint: localStorage.getItem("id_token")
        });
        this.UserManager.clearStaleState();
    };

    //Returns promise to process response from the end session endpoint.
    signoutRedirectCallback = () => {
        this.UserManager.signoutRedirectCallback().then(() => {
            localStorage.clear();
            window.location.replace(process.env.REACT_APP_PUBLIC_URL);
        });
        this.UserManager.clearStaleState();
    };
}
