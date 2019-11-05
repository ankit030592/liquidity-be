'use strict';

/*exports.code = {
    'AUTH_401': 'Name - No special characters allowed', // handled
    'AUTH_402': 'Email - Invalid, please enter a valid email address.', // handled
    // 'AUTH_403': 'Trouble creating account:The email address is already in use.', // handled
    // 'AUTH_404': 'Email - A facebook account using this email address is already being used to sign in. Please choose a new email address or continue using facebook.', // handled
    'AUTH_404': 'Trouble creating account:A facebook account using this email is already being used to sign in. Please continue using facebook.', // handled
    'AUTH_405': 'Password should be atleast 8 characters. Password should be alphanumeric.', // handled
    //'AUTH_406': 'Email - This account is currently locked, please contact us if you have any questions.', // handled
    'AUTH_406': 'Could Not Log In:This account is currently locked, please contact us if you have any questions.', // handled
    //'AUTH_407': 'Email / Password - does not match', // handled
    'AUTH_407': 'Could Not Log In:Your email or password is not correct. Please try again.', // handled
    'AUTH_408': 'Field is null', // handled
    'AUTH_409': 'Current passwowrd provided is incorrect', // handled
    'USER_401': 'Could not process the user block request',
    'USER_402': 'Could not process the seller review',
    'USER_403': 'Could not update user profile',
    'USER_404': 'Could not block user',
    'USER_405': 'Could not unblock user',
    'USER_406': 'Could not follow user',
    'USER_407': 'Could not unfollow user',
    'USER_408': 'Could not fetch reviews for user',
    'POST_401': 'Could not process the post block request',
    'POST_402': 'Could not process the review block request',
    'POST_403': 'Could not process the mark as sold request',
    'POST_404': 'Could not remove favorite for post',
    'POST_405': 'Could not remove review',
    'AUTH_411' : 'Password changed.:Your password was changed successfully.',
    'AUTH_412' : 'Trouble Resetting Password:We could not find an account with this email. Please try again.',
    'AUTH_414' : 'Trouble Resetting Password:A facebook account using this email is being used to sign in. Please continue using facebook.',
    'AUTH_415' : 'Trouble Resetting Password:This account is currently locked, please contact us if you have any questions.',
    'AUTH_416' : 'Reset Link Sent:We have emailed you the link to reset your password. Please contact us if you have any questions.',
    'AUTH_418' : 'Could Not Log In:A facebook account using this email is already being used to sign in. Please continue using facebook.',
    'AUTH_403' : 'Your account is blocked. Please contact customer support'
}
*/
const error = {
    emailExists: {
        "code": 451,
        "status": 'fail',
        "error": "Trouble creating account:The email address is already in use."
    },
    createUserFail: {
        "code": 452,
        "status": 'fail',
        "error": "Failed to create user."
    },
    userNotFound: {
        code: 453,
        "status": 'fail',
        "error": "Could not fetch user"
    },
    updateUSerFail: {
        "code": 454,
        "status": 'fail',
        "error": "Could not update user detail"
    },
    deleteUserFail: {
        "code": 455,
        "status": 'fail',
        "error": "Could not delete user"
    },
    userNotLoggedin: {
        "code": 461,
        "status": "no",
        "error": "Please login!"
    },
    failedUserSession: {
        "code": 462,
        "status": "no",
        "error": "Failed getting user session"
    },
    failedLogin: {
        "code": 463,
        "status": "fail",
        "error": "The email and password you entered is incorrect"
    },
    authFail: {
        "code": 463,
        "status": "fail",
        "error": "you are not authenticated to perform this action"
    },
    roleExists: {
        "code": 471,
        "status": "fail",
        "error": "User Role already exists"
    }
};



const success = {
    userCreated: {
        "code": 200,
        "status": 'success',
        "message": "User successfully cretaed."
    },
    deleteUser: {
        "code": 200,
        "status": 'success',
        "message": "User successfully Deleted."
    },
    createRole:{
        "code": 200,
        "status": "success",
        "message": "Role Created successfully"
    }
};


/*exports.fetch = function(codeNum) {
    return {
        code: codeNum,
        error: exports.code[codeNum]
    }
}
*/

module.exports = {
    error: error,
    success: success
};