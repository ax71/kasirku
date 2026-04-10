export type Profile = {
  id?: string;
  name?: string;
  role?: string;
  avatar_url?: string;
};

export type AuthFormState = {
  status?: string;
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
    role?: string[];
    avatar_url?: string[];
    _form?: string[];
  };
};
