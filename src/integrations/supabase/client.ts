import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://knxuvubwldyifgehckud.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueHV2dWJ3bGR5aWZnZWhja3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NzI4MDAsImV4cCI6MjA2NDI0ODgwMH0.placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
