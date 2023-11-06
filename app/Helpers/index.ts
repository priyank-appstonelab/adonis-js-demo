export default class Helper {
  constructor() {}

  static sendSuccess(message: string, data: any, status: number) {
    return {
      is_success: true,
      status,
      message,
      data,
      errors: null,
    };
  }

  static sendError(message: string, errors: any, status: number) {
    return {
      is_success: false,
      status,
      message,
      data: null,
      errors,
    };
  }
}
