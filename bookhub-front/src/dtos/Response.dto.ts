export default interface ResponseDto<T = any> {
  code: string;
  message: string;
  data?: T;
}
