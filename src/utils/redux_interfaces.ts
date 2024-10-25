export interface KeyPairInterface {
  [key: string]: any;
}

export interface SuccessMessageInterface {
  success: boolean;
  message: string;
}

export interface AuthUserInterface {
  user_id: string;
  email: string;
  password: boolean;
}
