import { gql } from "@apollo/client";


const  SIGN_UP=gql`
mutation signUp($input:SignUpInput!){
    signUp(input:$input){
        _id
        name
        username,
        gender,
        profilePicture
    }
}
`;

const LOGIN=gql`
    mutation Login($input:LoginInput!){
        login(input:$input){
            _id
            name
            username,
            gender,
            profilePicture
        }
    }
`;

const LOGOUT=gql`
    mutation Logout{
        logout{
            message
        }
    }
`;

export {SIGN_UP,LOGIN,LOGOUT}
