import { supabase } from '../supabase';

export class DatabaseService<T> {
  constructor(private table: string) {}

  async query(filters: Record<string, any>) {
    let query = supabase
      .from(this.table)
      .select('*');
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async create(data: Partial<T>) {
    const { data: result, error } = await supabase
      .from(this.table)
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  async update(id: string, data: Partial<T>) {
    const { data: result, error } = await supabase
      .from(this.table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}