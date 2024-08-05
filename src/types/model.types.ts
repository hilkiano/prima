type User = {
  id: string;
  username: string;
  password?: string;
  email: string;
  avatar_url: string;
  display_name: string;
  phone_number: string;
  address: string;
  last_login: Date;
  socialite_user: SocialiteUser;
  company_id: string;
  outlet_id: string;
  group_id: string;
  configs: any;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  created_by: string;
  updated_by: string;
  deleted_by: string;
};

type SocialiteUser = {
  id: string;
  name: string;
  user: {
    id: string;
    sub: string;
    link: string | null;
    name: string;
    email: string;
    picture: string;
    given_name: string;
    family_name: string | null;
    email_verified: boolean;
    verified_email: boolean;
  };
  email: string;
  token: string;
  avatar: string;
  nickname: string | null;
  expiresIn: number;
  attributes: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    nickname: null;
    avatar_original: string;
  };
  refreshToken: string | null;
  approvedScopes: Array<string>;
};

type Subscription = {
  id: string;
  owner_id: string;
  company_id: string;
  active_at: Date;
  active_until: Date;
  type: string;
  is_suspended: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  created_by: string;
  updated_by: string;
  deleted_by: string;
};
