import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  createClient,
  SupabaseClient,
  AuthChangeEvent,
  Session,
  User,
} from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

/**
 * Core Supabase client provider.
 * This service only holds the Supabase client instance and auth state signals.
 * All domain-specific logic is in dedicated services.
 */
@Injectable({ providedIn: 'root' })
export class SupabaseClientService {
  private supabase!: SupabaseClient;
  private platformId = inject(PLATFORM_ID);

  // Auth state signals
  session = signal<Session | null>(null);
  user = signal<User | null>(null);
  loading = signal<boolean>(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
      this.initializeAuth();
    } else {
      this.loading.set(false);
    }
  }

  private async initializeAuth(): Promise<void> {
    try {
      const {
        data: { session },
      } = await this.supabase.auth.getSession();
      this.session.set(session);
      this.user.set(session?.user ?? null);

      this.supabase.auth.onAuthStateChange((_event, session) => {
        this.session.set(session);
        this.user.set(session?.user ?? null);
      });
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Access the underlying Supabase client.
   * Use this in other services to perform queries.
   */
  get client(): SupabaseClient {
    return this.supabase;
  }
}
