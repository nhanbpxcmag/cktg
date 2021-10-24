export interface IErrorMessage {
  value: string;
  property: string;
  constraints: {
    [name: string]: string;
  };
}

export interface IError {
  statusCode: number;
  message: IErrorMessage[];
  error: string;
}
