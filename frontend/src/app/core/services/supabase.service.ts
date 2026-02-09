import { Injectable, inject } from '@angular/core';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { SourceType } from '../models';
import { SupabaseClientService } from './supabase-client.service';
import { AuthService } from './auth.service';
import { CrudService } from './crud.service';
import { ProfileService } from './profile.service';
import { TranslationDataService } from './translation-data.service';
import { StorageService } from './storage.service';
import { DocumentStorageService } from './document-storage.service';

/**
 * @deprecated Use the specific services instead:
 * - AuthService for authentication
 * - CrudService for generic CRUD
 * - ProfileService for profile operations
 * - TranslationDataService for translations and polymorphic queries
 * - StorageService for image storage
 * - DocumentStorageService for document storage
 *
 * This facade exists only for backward compatibility during migration.
 */
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabaseClient = inject(SupabaseClientService);
  private authService = inject(AuthService);
  private crudService = inject(CrudService);
  private profileService = inject(ProfileService);
  private translationDataService = inject(TranslationDataService);
  private storageService = inject(StorageService);
  private documentStorageService = inject(DocumentStorageService);

  // Auth state signals (delegate)
  get session() { return this.authService.session; }
  get user() { return this.authService.user; }
  get loading() { return this.authService.loading; }

  // ==================== AUTHENTICATION ====================
  async signIn(email: string, password: string) { return this.authService.signIn(email, password); }
  async signOut() { return this.authService.signOut(); }
  async getSession() { return this.authService.getSession(); }
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) { return this.authService.onAuthStateChange(callback); }

  // ==================== GENERIC CRUD ====================
  from(table: string) { return this.crudService.from(table); }
  async getAll<T>(table: string, orderBy?: string, ascending?: boolean) { return this.crudService.getAll<T>(table, orderBy, ascending); }
  async getActive<T>(table: string, orderBy?: string, ascending?: boolean) { return this.crudService.getActive<T>(table, orderBy, ascending); }
  async getById<T>(table: string, id: number | string) { return this.crudService.getById<T>(table, id); }
  async create<T>(table: string, data: Partial<T>) { return this.crudService.create<T>(table, data); }
  async update<T>(table: string, id: number | string, data: Partial<T>) { return this.crudService.update<T>(table, id, data); }
  async delete(table: string, id: number | string) { return this.crudService.delete(table, id); }
  async archive(table: string, id: number | string) { return this.crudService.archive(table, id); }
  async unarchive(table: string, id: number | string) { return this.crudService.unarchive(table, id); }
  async togglePin(table: string, id: number | string, isPinned: boolean) { return this.crudService.togglePin(table, id, isPinned); }
  async updatePositions(table: string, updates: { id: number; position: number }[]) { return this.crudService.updatePositions(table, updates); }

  // ==================== PROFILE ====================
  async getProfile() { return this.profileService.getProfile(); }
  async updateProfile(data: { first_name?: string; last_name?: string; nickname?: string; email?: string; phone?: string; linkedin_url?: string; github_url?: string; instagram_url?: string; whatsapp?: string; }) { return this.profileService.updateProfile(data); }
  async createProfile(data: { first_name?: string; last_name?: string; nickname?: string; email?: string; phone?: string; linkedin_url?: string; github_url?: string; instagram_url?: string; whatsapp?: string; }) { return this.profileService.createProfile(data); }
  async upsertProfileTranslation(data: { language: string; about: string }) { return this.profileService.upsertProfileTranslation(data); }

  // ==================== TRANSLATIONS ====================
  async getLanguageIdByCode(code: string) { return this.translationDataService.getLanguageIdByCode(code); }
  async getWithTranslations<T>(table: string, translationTable: string, foreignKey: string, orderBy?: string, ascending?: boolean) { return this.translationDataService.getWithTranslations<T>(table, translationTable, foreignKey, orderBy, ascending); }
  async getAllWithTranslations<T>(table: string, translationTable: string, orderBy?: string, ascending?: boolean) { return this.translationDataService.getAllWithTranslations<T>(table, translationTable, orderBy, ascending); }
  async getByIdWithTranslations<T>(table: string, translationTable: string, id: number) { return this.translationDataService.getByIdWithTranslations<T>(table, translationTable, id); }
  async upsertTranslation(translationTable: string, foreignKey: string, entityId: number, translation: { language: string; [key: string]: string | null }) { return this.translationDataService.upsertTranslation(translationTable, foreignKey, entityId, translation); }
  async createWithTranslations<T>(table: string, translationTable: string, foreignKey: string, entityData: Record<string, unknown>, translations: { language: string; [key: string]: string | null }[]) { return this.translationDataService.createWithTranslations<T>(table, translationTable, foreignKey, entityData, translations); }
  async updateWithTranslations<T>(table: string, translationTable: string, foreignKey: string, entityId: number, entityData: Record<string, unknown>, translations: { language: string; [key: string]: string | null }[]) { return this.translationDataService.updateWithTranslations<T>(table, translationTable, foreignKey, entityId, entityData, translations); }

  // ==================== POLYMORPHIC QUERIES ====================
  async getImagesFor(sourceType: SourceType, sourceId: number) { return this.translationDataService.getImagesFor(sourceType, sourceId); }
  async getSkillUsagesFor(sourceType: SourceType, sourceId: number) { return this.translationDataService.getSkillUsagesFor(sourceType, sourceId); }
  async getProjectsFor(sourceType: SourceType, sourceId: number) { return this.translationDataService.getProjectsFor(sourceType, sourceId); }
  async getSkillsWithCategories<T>() { return this.translationDataService.getSkillsWithCategories<T>(); }
  async getChildProjects(parentProjectId: number) { return this.translationDataService.getChildProjects(parentProjectId); }
  async getSkillUsagesWithSkills<T>() { return this.translationDataService.getSkillUsagesWithSkills<T>(); }
  async getImagesBySource(sourceType: string, sourceId: number) { return this.translationDataService.getImagesBySource(sourceType, sourceId); }
  async getImagesBySourceType(sourceType: string) { return this.translationDataService.getImagesBySourceType(sourceType); }
  async getDocumentsBySource(sourceType: string, sourceId: number) { return this.translationDataService.getDocumentsBySource(sourceType, sourceId); }

  // ==================== STORAGE ====================
  async uploadFile(file: File, folder?: string) { return this.storageService.uploadFile(file, folder); }
  getPublicUrl(path: string) { return this.storageService.getPublicUrl(path); }
  async deleteFromStorage(path: string) { return this.storageService.deleteFromStorage(path); }
  async downloadImage(path: string) { return this.storageService.downloadImage(path); }
  async listFiles(folder: string) { return this.storageService.listFiles(folder); }

  // ==================== DOCUMENT STORAGE ====================
  async uploadDocument(file: File, folder?: string) { return this.documentStorageService.uploadDocument(file, folder); }
  getDocumentPublicUrl(path: string) { return this.documentStorageService.getDocumentPublicUrl(path); }
  async deleteDocumentFromStorage(path: string) { return this.documentStorageService.deleteDocumentFromStorage(path); }
}
