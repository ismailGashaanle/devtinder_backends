
const ValidateSignUp=(req)=>{

    const {firstName,lastName,phone,email,password}=req.body

    if(!firstName || !lastName){
        throw new Error("please fill firstNAME OR LastName")
    }

    if(!phone){
        throw new Error("please fill phone number")
    }

    if(!password){
        throw new Error("please fill password")
    }


}


const ValidateLogin=(req)=>{
    const {email,password}=req.body;
    if(!email){
        throw new Error("please fill email")
    }
    if(!password){
        throw new Error("please fill password")
    }


}

//profile edit
const ValidateProfileEdit=(req)=>{
    const {firstName,lastName,phone,Gender,photo}=req.body

    const AllowedFields=["firstName","lastName","phone","photo","Gender"]
    const EditAllowed= Object.keys(req.body).every(k=>AllowedFields.includes(k))
    if(!EditAllowed){
        throw new Error("UnAuthorized update fields")
    }
   
    return EditAllowed;
}

module.exports={
    ValidateSignUp,
    ValidateLogin,
    ValidateProfileEdit
}