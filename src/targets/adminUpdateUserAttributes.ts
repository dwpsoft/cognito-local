import { Services } from "../services";
import { NotAuthorizedError } from "../errors";
import { AttributeListType } from "aws-sdk/clients/cognitoidentityserviceprovider";
import { UserAttribute } from "../services/userPoolClient";

interface Input {
  UserPoolId: string;
  Username: string;
  UserAttributes: AttributeListType;
}

interface Output {
  UserAttributes: any;
}

export type AdminUpdateUserAttributesTarget = (
  body: Input
) => Promise<Output | null>;

export const AdminUpdateUserAttributes =
  ({ cognitoClient }: Services): AdminUpdateUserAttributesTarget =>
  async (body) => {
    const { UserPoolId, Username } = body || {};
    const userPool = await cognitoClient.getUserPool(UserPoolId);
    const user = await userPool.getUserByUsername(Username);
    if (!user) {
      throw new NotAuthorizedError();
    }

    for (const attribute of body.UserAttributes) {
      const index = user.Attributes.findIndex(
        (t: UserAttribute) =>
          t.Name.toLowerCase() === attribute.Name.toLowerCase()
      );
      if (index < 0) {
        user.Attributes.push({
          Name: attribute.Name,
          Value: attribute.Value ?? "",
        });
      } else {
        user.Attributes[index].Value = attribute.Value ?? "";
      }
    }

    console.log(
      `Sainvg user: ${user.Username} with new attributes:\n${JSON.stringify(
        user.Attributes
      )}`
    );

    await userPool.saveUser(user);

    return {
      UserAttributes: user.Attributes,
    };
  };
