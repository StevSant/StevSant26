import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';
import { ContentSection, ContentSectionTranslation } from '@core/models';
import { ContentSectionFormData } from '@core/models';
import { SourceType } from '@core/models';

/**
 * Service for CRUD operations on content sections.
 * Uses SupabaseService generic helpers following existing patterns.
 */
@Injectable({ providedIn: 'root' })
export class ContentSectionService {
  private supabase = inject(SupabaseService);

  /**
   * Get all content sections for an entity, ordered by position
   */
  async getByEntity(entityType: SourceType, entityId: number): Promise<ContentSection[]> {
    const { data, error } = await this.supabase
      .from('content_section')
      .select('*, translations:content_section_translation(*, language:language(*))')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .eq('is_archived', false)
      .order('position', { ascending: true });

    if (error) throw error;
    return (data as ContentSection[]) || [];
  }

  /**
   * Get a single content section by ID with translations
   */
  async getById(id: number): Promise<ContentSection | null> {
    const { data, error } = await this.supabase
      .from('content_section')
      .select('*, translations:content_section_translation(*, language:language(*))')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as ContentSection;
  }

  /**
   * Create a new content section with translations
   */
  async create(formData: ContentSectionFormData): Promise<ContentSection | null> {
    const entityData: Record<string, unknown> = {
      entity_type: formData.entity_type,
      entity_id: formData.entity_id,
      section_key: formData.section_key,
      icon: formData.icon || null,
      position: formData.position ?? 0,
      is_archived: formData.is_archived,
      is_pinned: formData.is_pinned,
    };

    const translations = formData.translations.map(t => ({
      language: t.language,
      title: t.title,
      body: t.body,
    }));

    const { data, error } = await this.supabase.createWithTranslations<ContentSection>(
      'content_section',
      'content_section_translation',
      'content_section_id',
      entityData,
      translations,
    );

    if (error) throw error;
    return data as ContentSection | null;
  }

  /**
   * Update an existing content section with translations
   */
  async update(id: number, formData: ContentSectionFormData): Promise<ContentSection | null> {
    const entityData: Record<string, unknown> = {
      section_key: formData.section_key,
      icon: formData.icon || null,
      position: formData.position ?? 0,
      is_archived: formData.is_archived,
      is_pinned: formData.is_pinned,
    };

    const translations = formData.translations.map(t => ({
      language: t.language,
      title: t.title,
      body: t.body,
    }));

    const { data, error } = await this.supabase.updateWithTranslations<ContentSection>(
      'content_section',
      'content_section_translation',
      'content_section_id',
      id,
      entityData,
      translations,
    );

    if (error) throw error;
    return data as ContentSection | null;
  }

  /**
   * Archive a content section (soft delete)
   */
  async archive(id: number): Promise<void> {
    const { error } = await this.supabase.archive('content_section', id);
    if (error) throw error;
  }

  /**
   * Reorder content sections by updating positions
   */
  async reorder(orderedIds: number[]): Promise<void> {
    const updates = orderedIds.map((id, index) => ({ id, position: index }));
    const { error } = await this.supabase.updatePositions('content_section', updates);
    if (error) throw error;
  }
}
