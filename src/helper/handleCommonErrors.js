const constant = require("./constant");
const errorHandler = require('./errorHandler')

class handleCommonErr{
    _isErrorConnection(error){
        let message= error.message.split(' ')
        let finalMessage =message[0]+' '+message[1]
        if (finalMessage === 'getaddrinfo EAI_AGAIN' ) {
            return true
        }
        if (error.message === 'SequelizeConnectionError') {
            return true
        }
        return false
    }
    async handleErr(promise,ErrorOrmInstance) {
        try {
          return await promise;
        } catch (error) {
          console.log(error.message)
          if (error instanceof ErrorOrmInstance) {
            const { message, statusCode } = constant.reqValidationError;
            throw new errorHandler.ValidateError(message, statusCode);
          }

          if (this._isErrorConnection(error)) {
            console.log(error.message)
              throw new errorHandler.HttpError(constant.serverError.message, constant.serverError.statusCode);
          }

          throw new errorHandler.InternalServerError(constant.serverError.message,constant.serverError.statusCode)

        }
    }
}

module.exports  = new handleCommonErr