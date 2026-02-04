/**
 * Form data interface for creating/updating skills
 */
export interface SkillFormData {
  name: string;
  description: string;
  skill_category_id: number | null;
}
