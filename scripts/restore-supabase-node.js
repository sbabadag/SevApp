// Supabase Restore Script using Node.js
// Restores data from backup SQL file to Supabase
// Usage: node scripts/restore-supabase-node.js [backup-file.sql]

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'isoydimyquabqfrezuuc';
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;

// Get Supabase anon key from app.json or environment
let SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                        process.env.VITE_SUPABASE_ANON_KEY || 
                        '';

if (!SUPABASE_ANON_KEY) {
  try {
    const appJson = require('../app.json');
    SUPABASE_ANON_KEY = appJson.expo?.extra?.supabaseAnonKey || '';
  } catch (e) {
    // app.json not found
  }
}

if (!SUPABASE_ANON_KEY) {
  console.error('❌ Error: SUPABASE_ANON_KEY not found!');
  console.log('Please set EXPO_PUBLIC_SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get backup file from command line argument or use latest
function getBackupFile() {
  const backupFile = process.argv[2];
  
  if (backupFile) {
    if (!fs.existsSync(backupFile)) {
      console.error(`❌ Error: Backup file not found: ${backupFile}`);
      process.exit(1);
    }
    return backupFile;
  }
  
  // Find latest backup file
  const backupDir = path.join(__dirname, '..', 'backups');
  if (!fs.existsSync(backupDir)) {
    console.error('❌ Error: Backups directory not found!');
    process.exit(1);
  }
  
  const files = fs.readdirSync(backupDir)
    .filter(f => f.endsWith('.sql'))
    .map(f => ({
      name: f,
      path: path.join(backupDir, f),
      time: fs.statSync(path.join(backupDir, f)).mtime
    }))
    .sort((a, b) => b.time - a.time);
  
  if (files.length === 0) {
    console.error('❌ Error: No backup files found!');
    process.exit(1);
  }
  
  return files[0].path;
}

// Parse SQL INSERT statements and execute them
async function restoreFromBackup(backupFile) {
  console.log('🔄 Starting Supabase restore...');
  console.log(`   Project: ${PROJECT_REF}`);
  console.log(`   Backup: ${backupFile}\n`);
  
  const sql = fs.readFileSync(backupFile, 'utf8');
  const lines = sql.split('\n');
  
  let currentTable = null;
  let insertStatements = [];
  let statement = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith('--')) {
      continue;
    }
    
    // Check for INSERT INTO statement
    if (trimmed.toUpperCase().startsWith('INSERT INTO')) {
      // Extract table name
      const match = trimmed.match(/INSERT INTO\s+(\w+)/i);
      if (match) {
        currentTable = match[1];
        console.log(`📦 Restoring ${currentTable}...`);
      }
      
      statement = trimmed;
      
      // Check if statement ends with semicolon
      if (trimmed.endsWith(';')) {
        await executeInsert(statement, currentTable);
        statement = '';
      }
    } else if (statement && trimmed.endsWith(';')) {
      // Multi-line INSERT statement
      statement += ' ' + trimmed;
      await executeInsert(statement, currentTable);
      statement = '';
    } else if (statement) {
      // Continue building statement
      statement += ' ' + trimmed;
    }
  }
  
  // Execute any remaining statement
  if (statement) {
    await executeInsert(statement, currentTable);
  }
  
  console.log('\n✅ Restore completed!');
}

// Execute INSERT statement via Supabase client
async function executeInsert(sql, tableName) {
  if (!tableName) return;
  
  try {
    // Extract values from INSERT statement
    // This is a simplified parser - may not work for all cases
    const valuesMatch = sql.match(/VALUES\s*\((.*?)\)/i);
    if (!valuesMatch) return;
    
    // For now, we'll use a different approach
    // Execute via Supabase REST API or use raw SQL if available
    
    console.log(`   ⚠️  Note: Direct SQL execution via client is limited.`);
    console.log(`   Please use Supabase Dashboard SQL Editor for full restore.`);
    console.log(`   Or use pg_dump/psql for complete restore.\n`);
    
  } catch (error) {
    console.error(`   ❌ Error restoring ${tableName}:`, error.message);
  }
}

// Main function
async function main() {
  const backupFile = getBackupFile();
  console.log(`📄 Using backup file: ${backupFile}\n`);
  
  // For now, just show instructions
  console.log('⚠️  Note: Full restore via Node.js is limited.');
  console.log('For complete restore, use one of these methods:\n');
  console.log('1. Supabase Dashboard SQL Editor:');
  console.log('   - Copy backup SQL file content');
  console.log('   - Paste into SQL Editor');
  console.log('   - Click Run\n');
  console.log('2. pg_dump/psql (if PostgreSQL client is installed):');
  console.log(`   psql "postgresql://postgres:[PASSWORD]@db.${PROJECT_REF}.supabase.co:5432/postgres" < ${backupFile}\n`);
  console.log('3. Supabase CLI:');
  console.log(`   supabase db push --project-ref ${PROJECT_REF} --file ${backupFile}\n`);
}

main();

