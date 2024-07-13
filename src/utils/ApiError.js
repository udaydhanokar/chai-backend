class ApiEror extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors =[],
        statck = ''
    ){
            super(message)
            this.statusCode=statusCode
            this.data = null
            this.message= message
            this.succes = false
            this.errors = errors

            if (stack){
                this.stack= stack
            } else {
                Error.captureStackTrace(this,this.construtor)
            }
    }
}

export default ApiEror