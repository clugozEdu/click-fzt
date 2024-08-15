// src/supabaseClient
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iemhpugvjgaazoifqjpj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbWhwdWd2amdhYXpvaWZxanBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI3NDE4ODQsImV4cCI6MjAzODMxNzg4NH0.swftVouXudAsC5_S01v8S_YBI67oaHjz7G8ao21bOLc";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
