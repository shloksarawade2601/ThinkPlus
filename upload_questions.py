import os
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv
import json

# === Load environment variables ===
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ Missing Supabase credentials! Please check your .env file.")

# === Initialize Supabase client ===
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# === Configuration ===
CSV_PATH = "Final DATABASE.csv"  # Path to your new CSV file
TABLE_NAME = "questions_bank"    # Supabase table name
BATCH_SIZE = 500                 # Upload in batches

# === Load CSV ===
print("📂 Loading CSV file...")
try:
    df = pd.read_csv(CSV_PATH, encoding="latin1")
except FileNotFoundError:
    raise FileNotFoundError(f"❌ CSV file not found at {CSV_PATH}. Please check the path.")

# === Replace NaN with None for Supabase ===
df = df.where(pd.notnull(df), None)


# === Combine Option A-E into JSON options column ===
option_cols = ["Option A", "Option B", "Option C", "Option D", "Option E"]

def combine_options(row):
    opts = {col[-1]: row[col] for col in option_cols if row[col] is not None}  # skip None
    return json.dumps(opts)

df["options"] = df.apply(combine_options, axis=1)

# === Map CSV columns to Supabase columns ===
df.rename(columns={
    "ID": "question_id",
    "Block": "block",
    "Chapter / Subtopic": "chapter",
    "Question Type": "question_type",
    "Question Text": "question_text",
    "Data / Paragraph": "data_paragraph",
    "Correct Answer": "correct_answer",
    "Difficulty Level": "difficulty_level"
}, inplace=True)

# Keep only required columns
df = df[[
    "question_id",
    "block",
    "chapter",
    "question_type",
    "question_text",
    "data_paragraph",
    "options",
    "correct_answer",
    "difficulty_level"
]]

print(f"✅ Prepared {len(df)} questions for upload.")

# === Delete all existing rows in the table ===
print("🗑️ Deleting old questions...")
delete_response = supabase.table(TABLE_NAME).delete().neq('question_id', '').execute()
print("🗑️ Old questions deleted.")

# === Upload new questions in batches ===
print("🚀 Starting upload of new questions...")
for i in range(0, len(df), BATCH_SIZE):
    batch = df.iloc[i:i + BATCH_SIZE].to_dict(orient="records")
    response = supabase.table(TABLE_NAME).insert(batch).execute()
    if response.data:
        print(f"✅ Uploaded batch {i // BATCH_SIZE + 1} ({len(batch)} records)")
    else:
        print(f"⚠️ Error uploading batch {i // BATCH_SIZE + 1}: {response}")

print("🎉 Upload complete! All new questions added to Supabase successfully.")
