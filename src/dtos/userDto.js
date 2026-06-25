

class UserDto {
constructor(userDoc){
    this.id = userDoc._id;
    this.first_name = userDoc.first_name;
    this.last_name = userDoc.last_name;
    this.email = userDoc.email;
    this.role = userDoc.role;

}

}

export default UserDto;