import jwt from "jsonwebtoken";
import * as uuid from "uuid";
import { loadConfig } from "../server/config";
import PrivateKey from "../keys/cognitoLocal.private.json";
import { attributeValue, User } from "./userPoolClient";

export interface TokenConfig {
  IssuerDomain?: string;
}

export interface Token {
  client_id: string;
  iss: string;
  sub: string;
  token_use: string;
  username: string;
  event_id: string;
  scope: string;
  auth_time: Date;
  jti: string;
}

export async function generateTokens(
  user: User,
  clientId: string,
  userPoolId: string
) {
  const eventId = uuid.v4();
  const authTime = Math.floor(new Date().getTime() / 1000);
  const sub = attributeValue("sub", user.Attributes);
  const config = await loadConfig();

  return {
    AccessToken: jwt.sign(
      {
        sub,
        event_id: eventId,
        token_use: "access",
        scope: "aws.cognito.signin.user.admin", // TODO: scopes
        auth_time: authTime,
        jti: uuid.v4(),
        client_id: clientId,
        username: user.Username,
      },
      PrivateKey.pem,
      {
        algorithm: "RS256",
        issuer: `${config.TokenConfig.IssuerDomain}/${userPoolId}`,
        expiresIn: "24h",
        keyid: "CognitoLocal",
      }
    ),
    IdToken: jwt.sign(
      {
        sub,
        email_verified: true,
        event_id: eventId,
        token_use: "id",
        auth_time: authTime,
        "cognito:username": user.Username,
        email: attributeValue("email", user.Attributes),
        name: attributeValue("name", user.Attributes),
        profile: attributeValue("profile", user.Attributes),
      },
      PrivateKey.pem,
      {
        algorithm: "RS256",
        // TODO: this needs to match the actual host/port we started the server on
        issuer: `${config.TokenConfig.IssuerDomain}/${userPoolId}`,
        expiresIn: "24h",
        audience: clientId,
        keyid: "CognitoLocal",
      }
    ),
    RefreshToken: "<< TODO >>",
  };
}
