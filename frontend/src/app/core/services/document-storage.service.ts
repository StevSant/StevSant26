import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';
import { environment } from '../../../environments/environment';

/**
 * Document storage service — handles file upload/download/delete for documents.
 */
@Injectable({ providedIn: 'root' })
export class DocumentStorageService {
  private client = inject(SupabaseClientService);

  /**
   * Upload a document to Supabase Storage (documents bucket)
   */
  async uploadDocument(file: File, folder: string = ''): Promise<{ path: string | null; error: Error | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { data, error } = await this.client.client.storage
        .from(environment.storageDocumentsBucket)
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
   * Get the public URL for a document in storage
   */
  getDocumentPublicUrl(path: string): string {
    const { data } = this.client.client.storage.from(environment.storageDocumentsBucket).getPublicUrl(path);
    return data.publicUrl;
  }

  /**
   * Delete a document from storage
   */
  async deleteDocumentFromStorage(path: string) {
    return this.client.client.storage.from(environment.storageDocumentsBucket).remove([path]);
  }
}
