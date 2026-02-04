/**
 * Profile entity - represents the portfolio owner's personal information
 */
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
  about: string | null;
}
