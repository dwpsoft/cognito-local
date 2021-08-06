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

console.log('Creating admin user');

// Create admin user on hdc org
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
    },
    {
        Name: 'nickname',
        Value: 'USR' 
    },
    {
        Name: 'email',
        Value: 'user@local.com' 
    },
    {
        Name: 'given_name',
        Value: 'User' 
    },
    {
        Name: 'family_name',
        Value: 'Local' 
    },
    {
        Name: 'locale',
        Value: 'dentist' 
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

console.log('Creating root user');

// Create root user on admin org
cognito.adminCreateUser({
    UserPoolId: 'local_host',
    Username: 'root',
    UserAttributes: [{
        Name: 'name',
        Value: 'admin' 
    },
    {
        Name: 'profile',
        Value: 'root' 
    },
    {
        Name: 'nickname',
        Value: 'RT' 
    },
    {
        Name: 'email',
        Value: 'root@local.com' 
    },
    {
        Name: 'given_name',
        Value: 'Root' 
    },
    {
        Name: 'family_name',
        Value: 'Local' 
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