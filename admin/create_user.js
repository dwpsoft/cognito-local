// eslint-disable-next-line @typescript-eslint/no-var-requires
const localCognito = require('aws-sdk');

const cognito = new localCognito.CognitoIdentityServiceProvider({
    credentials: {
      accessKeyId: "local",
      secretAccessKey: "local",
    },
    region: "local",
    endpoint: `http://localhost:8010`
  });
cognito.adminCreateUser({
    UserPoolId: 'local_host',
    Username: 'user',
    UserAttributes: [{
        Name: 'name',
        Value: 'hdc' 
    },
    {
        Name: 'profile',
        Value: 'admin' 
    }],
    TemporaryPassword: 'password'
}, function(err, data) {
    if (err) {
        console.log('Error');
        console.log(err);
    } else {
        console.log('Success');
        console.log(data);
    }
})