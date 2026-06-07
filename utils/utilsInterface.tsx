export interface callbackInterface {
  (
    success: boolean,
    response: { [key: string]: any } | string | any,
    setLoading?: Function
  ): any;
}

export interface utilsFunctionInterface {
  (
    callback: callbackInterface,
    setLoading: Function,
    data?: { [key: string]: any } | FormData,
    page?: number,
    dispatch?: Function
  ): void;
}
