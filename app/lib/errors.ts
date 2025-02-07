export class ApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(response: Response, data: unknown) {
    super(`API Error: ${response.status}`);
    this.status = response.status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
