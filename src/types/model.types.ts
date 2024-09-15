type User = {
  id: string;
  username: string;
  password?: string;
  email: string;
  avatar_url: string;
  display_name: string;
  phone_code: string;
  phone_number: string;
  address: string;
  last_login: Date;
  socialite_user: SocialiteUser;
  company_id: string;
  outlet_id: string;
  group_id: string;
  group: Group;
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

type IPGeolocation = {
  ip: string;
  isp: string;
  city: string;
  is_eu: boolean;
  zipcode: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  district: string;
  latitude: string;
  languages: string;
  longitude: string;
  time_zone: {
    name: string;
    is_dst: boolean;
    offset: number;
    dst_end: string;
    dst_start: string;
    dst_exists: boolean;
    dst_savings: number;
    current_time: Date;
    offset_with_dst: string;
    current_time_unix: number;
  };
  geoname_id: string;
  state_code: string;
  state_prov: string;
  country_tld: string;
  calling_code: string;
  country_flag: string;
  country_name: string;
  organization: string;
  country_code2: string;
  country_code3: string;
  country_emoji: string;
  continent_code: string;
  continent_name: string;
  connection_type: string;
  country_capital: string;
  country_name_official: string;
};

type Owner = {
  id: string;
  user_id: string;
  given_name: string;
  family_name: string;
  email: string;
  phone_code: string;
  phone_number: string;
  gender: string;
  address: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  created_by: string;
  updated_by: string;
  deleted_by: string;
};

type Subscription = {
  id: string;
  owner_id: string;
  company_id: string;
  active_at: Date;
  active_until: Date;
  type: string;
  is_suspended: boolean;
  owner?: Owner;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  created_by: string;
  updated_by: string;
  deleted_by: string;
};

type Company = {
  id: string;
  owner_id: string;
  name: string;
  email: string;
  phone_code: string;
  phone_number: string;
  address: string;
  configs: Partial<{
    currency: {
      id: number;
      is_alternate: boolean;
    };
  }> | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  created_by: string;
  updated_by: string;
  deleted_by: string;
};

type Outlet = {
  id: string;
  company_id: string;
  name: string;
  email: string;
  phone_code: string;
  phone_number: string;
  address: string;
  configs: Partial<{
    currency: {
      id: number;
      is_alternate: boolean;
    };
  }> | null;
  is_main_outlet: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  created_by: string;
  updated_by: string;
  deleted_by: string;
};

type Group = {
  id: string;
  name: string;
  description: string;
  privileges: string[];
  company_id: string;
  outlet_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  users?: User[];
  users_count?: number;
};

type Privilege = {
  id: string;
  desc_i18n: string;
  type: string;
  created_at: Date;
  updated_at: Date;
};

type PhoneCode = {
  id: number;
  country: string;
  dial_code: string;
  emoji: string;
  code: string;
  created_at: Date;
  updated_at: Date;
};

type Currency = {
  id: number;
  currency: string;
  alternate_symbol: string;
  created_at: Date;
  updated_at: Date;
};
