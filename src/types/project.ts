export interface Project {
  id: string;
  name: string;
  description?: string;
  client_name: string;
  client_contact: string;
  client_email: string;
  estimated_cost: number;
  status: string;
  created_at?: string;
  updated_at?: string;
  user_id: string;
}

export type ProjectFormValues = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>;