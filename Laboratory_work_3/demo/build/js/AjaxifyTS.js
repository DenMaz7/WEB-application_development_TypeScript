function getRequestObject() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    else {
        alert("Ajax is not supported!");
        throw new Error("Ajax not supported");
    }
}
export const ajaxify = {
    sendGetRequest(requestUrl, responseHandler, isJsonResponse = true) {
        const request = getRequestObject();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                const response = isJsonResponse
                    ? JSON.parse(request.responseText)
                    : request.responseText;
                responseHandler(response);
            }
        };
        request.open("GET", requestUrl, true);
        request.send(null);
    },
};
