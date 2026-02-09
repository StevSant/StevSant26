import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';
import { environment } from '../../../environments/environment';

/**
 * Storage service — handles file upload/download/delete for images.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private client = inject(SupabaseClientService);

  /**
   * Upload a file to Supabase Storage (images bucket)
   */
  async uploadFile(file: File, folder: string = ''): Promise<{ path: string | null; error: Error | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { data, error } = await this.client.client.storage
        .from(environment.storageImagesBucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;
      return { path: data.path, error: null };
    } catch (error) {
      return { path: null, error: error as Error };
    }
  }

  /**
   * Get the public URL for a file in storage
   */
  getPublicUrl(path: string): string {
    const { data } = this.client.client.storage.from(environment.storageImagesBucket).getPublicUrl(path);
    return data.publicUrl;
  }

  /**
   * Delete a file from storage
   */
  async deleteFromStorage(path: string) {
    return this.client.client.storage.from(environment.storageImagesBucket).remove([path]);
  }

  /**
   * Download a file from storage
   */
  async downloadImage(path: string): Promise<string | null> {
    const { data, error } = await this.client.client.storage.from(environment.storageImagesBucket).download(path);
    if (error || !data) return null;
    return URL.createObjectURL(data);
  }

  /**
   * List files in a folder
   */
  async listFiles(folder: string) {
    return this.client.client.storage.from(environment.storageImagesBucket).list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });
  }
}
