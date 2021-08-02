import { Services } from "../services";
import { CognitoError, NotAuthorizedError, UserNotFoundError } from "../errors";

interface Input {
  UserPoolId: string;
  Username: string;
}

interface Output {
  UserStatus: string;
  UserAttributes: any;
}

export type AdminGetUserTarget = (body: Input) => Promise<Output | null>;

export const AdminGetUser = ({
  cognitoClient,
}: Services): AdminGetUserTarget => async (body) => {
  const { UserPoolId, Username } = body || {};
  const userPool = await cognitoClient.getUserPool(UserPoolId);
  const user = await userPool.getUserByUsername(Username);
  if (!user) {
    throw new UserNotFoundError();
  }
  return {
    Username: user.Username,
    Enabled: true,
    UserStatus: user.UserStatus,
    UserAttributes: user.Attributes,
  };
};
