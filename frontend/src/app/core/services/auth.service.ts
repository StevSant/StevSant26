import { Injectable, inject } from '@angular/core';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { SupabaseClientService } from './supabase-client.service';

/**
 * Authentication service — handles sign in, sign out, session management.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private client = inject(SupabaseClientService);

  /** Delegate auth state signals from the client service */
  get session() { return this.client.session; }
  get user() { return this.client.user; }
  get loading() { return this.client.loading; }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    return this.client.client.auth.signInWithPassword({ email, password });
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    const { error } = await this.client.client.auth.signOut();
    if (!error) {
      this.client.session.set(null);
      this.client.user.set(null);
    }
    return { error };
  }

  /**
   * Get current session
   */
  async getSession() {
    return this.client.client.auth.getSession();
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.client.client.auth.onAuthStateChange(callback);
  }
}
