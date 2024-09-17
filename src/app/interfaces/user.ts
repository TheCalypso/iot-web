export interface User {
  readonly id?: number;
  email?: string;
  password?: string;
  last_name?: string;
  first_name?: string;
}

export function isUser(object: any): object is User {
  return object && typeof object.id === 'number' && typeof object.email === 'string';
}
