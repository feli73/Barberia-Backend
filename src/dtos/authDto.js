

class AuthDto{
constructor(authData){


    this.id = authData._id;
    this.first_name = authData.first_name;
    this.last_name = authData.last_name;
    this.email = authData.email;
    this.role = authData.role;
    this.token = authData.token;
}




}

export default AuthDto;