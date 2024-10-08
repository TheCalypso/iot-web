const SBIOT_PREFIX: string = '_smiot.';
const ERROR_TYPE_STRING = '[value] parameter MUST be of type :string';
const ERROR_TYPE_OBJECT = '[object] parameter MUST be of type :object';

export default class IOTLocalStorage {
  private prefix: string;

  constructor(prefix: string = SBIOT_PREFIX) {
    this.prefix = prefix;
  }

  saveObject(key: string, object: object) {
    if (typeof object !== 'object') {
      throw new Error(ERROR_TYPE_OBJECT);
    }
    localStorage.setItem(this.prefix + key, JSON.stringify(object));
  }

  updateObject(key: string, object: object) {
    if (typeof object !== 'object') {
      throw new Error(ERROR_TYPE_OBJECT);
    }
    let previousObjectState = JSON.parse(localStorage.getItem(this.prefix + key) || '{}');
    previousObjectState = { ...previousObjectState, ...object };
    localStorage.setItem(this.prefix + key, JSON.stringify(previousObjectState));
  }

  getObject(key: string): string {
    return JSON.parse(localStorage.getItem(this.prefix + key) || '{}');
  }

  saveItem(key: string, value: string) {
    if (typeof value !== 'string') {
      throw new Error(ERROR_TYPE_STRING);
    }
    localStorage.setItem(this.prefix + key, value);
  }

  updateItem(key: string, value: string) {
    if (typeof value !== 'string') {
      throw new Error(ERROR_TYPE_STRING);
    }
    localStorage.setItem(this.prefix + key, value);
  }

  getItem(key: string): string | null {
    return localStorage.getItem(this.prefix + key);
  }

  delete(key: string) {
    localStorage.removeItem(this.prefix + key);
  }
}
