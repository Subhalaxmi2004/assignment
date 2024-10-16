class apiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
    static errorResponse(statusCode, message) {
        return new apiResponse(statusCode, null, message);
    }
}

export default apiResponse