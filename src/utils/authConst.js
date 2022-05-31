
export const IDENTITY_CONFIG = {
  authority: process.env.REACT_APP_AUTH_URL, //(string): The URL of the OIDC provider.
  client_id: process.env.REACT_APP_IDENTITY_CLIENT_ID, //(string): Your client application's identifier as registered with the OIDC provider.
  redirect_uri: process.env.REACT_APP_REDIRECT_URL, //The URI of your client application to receive a response from the OIDC provider.
  silent_redirect_uri: process.env.REACT_APP_SILENT_REDIRECT_URL, //(string): The URL for the page containing the code handling the silent renew.
  post_logout_redirect_uri: process.env.REACT_APP_LOGOFF_REDIRECT_URL, // (string): The OIDC post-logout redirect URI.
  response_type: "id_token token", //(string, default: 'id_token'): The type of response desired from the OIDC provider.
  automaticSilentRenew: false, //(boolean, default: false): Flag to indicate if there should be an automatic attempt to renew the access token prior to its expiration.
  loadUserInfo: false, //(boolean, default: true): Flag to control if additional identity data is loaded from the user info endpoint in order to populate the user's profile.
  scope: process.env.REACT_APP_SCOPE //(string, default: 'openid'): The scope being requested from the OIDC provider.
};

export const METADATA_OIDC = {
  issuer: process.env.REACT_APP_ISSUER,
  jwks_uri: process.env.REACT_APP_AUTH_URL + "/.well-known/jwks.json",
  authorization_endpoint: process.env.REACT_APP_AUTH_URL + "/authorize",
  token_endpoint: process.env.REACT_APP_AUTH_URL + "/oauth/token",
  userinfo_endpoint: process.env.REACT_APP_AUTH_URL + "/userinfo"
};

