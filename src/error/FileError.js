 class FileError extends Error{
    constructor(error){
        super(error)
        this.name="ExceptionFileJson"
        this.status=400
    }
    getErrorJson(){
        return{
            name:this.name,
            status:this.status,
            message:this.message,
        }
    }
}
 module.exports=FileError