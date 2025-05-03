export interface ResponseHandler<T = any> {
    (response: T): void;
  }
  
  function getRequestObject(): XMLHttpRequest {
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    } else {
      alert("Ajax is not supported!");
      throw new Error("Ajax not supported");
    }
  }
  
  export const ajaxify = {
    sendGetRequest<T = any>(
      requestUrl: string,
      responseHandler: ResponseHandler<T>,
      isJsonResponse: boolean = true
    ): void {
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
  