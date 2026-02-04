/**
 * Profile entity - represents the portfolio owner's personal information
 */
export interface Profile {
  id: string; // UUID from Supabase Auth
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
  about: string | null;
}

export interface ProfileFormData {
  first_name: string;
  last_name: string;
  nickname: string;
  about: string;
}
