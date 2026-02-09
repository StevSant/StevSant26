import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';

/**
 * Generic CRUD service for database operations.
 * Provides table-agnostic create, read, update, delete, archive, and reorder operations.
 */
@Injectable({ providedIn: 'root' })
export class CrudService {
  private client = inject(SupabaseClientService);

  /**
   * Access to Supabase client's from() method for custom queries.
   * Use this for complex queries not covered by generic CRUD methods.
   */
  from(table: string) {
    return this.client.client.from(table);
  }

  /**
   * Get all records from a table
   */
  async getAll<T>(table: string, orderBy: string = 'position', ascending: boolean = true) {
    return this.client.client.from(table).select('*').order(orderBy, { ascending });
  }

  /**
   * Get all non-archived records from a table
   */
  async getActive<T>(table: string, orderBy: string = 'position', ascending: boolean = true) {
    return this.client.client
      .from(table)
      .select('*')
      .eq('is_archived', false)
      .order(orderBy, { ascending });
  }

  /**
   * Get a single record by ID
   */
  async getById<T>(table: string, id: number | string) {
    return this.client.client.from(table).select('*').eq('id', id).single();
  }

  /**
   * Create a new record
   */
  async create<T>(table: string, data: Partial<T>) {
    return this.client.client.from(table).insert(data).select().single();
  }

  /**
   * Update a record by ID
   */
  async update<T>(table: string, id: number | string, data: Partial<T>) {
    return this.client.client.from(table).update(data).eq('id', id).select().single();
  }

  /**
   * Delete a record by ID (hard delete)
   */
  async delete(table: string, id: number | string) {
    return this.client.client.from(table).delete().eq('id', id);
  }

  /**
   * Archive a record (soft delete)
   */
  async archive(table: string, id: number | string) {
    return this.update(table, id, { is_archived: true });
  }

  /**
   * Unarchive a record
   */
  async unarchive(table: string, id: number | string) {
    return this.update(table, id, { is_archived: false });
  }

  /**
   * Toggle pin status
   */
  async togglePin(table: string, id: number | string, isPinned: boolean) {
    return this.update(table, id, { is_pinned: isPinned });
  }

  /**
   * Update positions for multiple records (batch update for reordering)
   */
  async updatePositions(table: string, updates: { id: number; position: number }[]) {
    const promises = updates.map(({ id, position }) =>
      this.client.client.from(table).update({ position }).eq('id', id)
    );
    return Promise.all(promises);
  }
}
