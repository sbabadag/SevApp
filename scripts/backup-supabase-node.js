// Supabase Backup Script using Node.js (No pg_dump required)
// Usage: node scripts/backup-supabase-node.js

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const PROJECT_REF = 'isoydimyquabqfrezuuc';
const DB_PASSWORD = 'Seloken343542.';
const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;

// Get Supabase anon key from app.json or environment
let SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                        process.env.VITE_SUPABASE_ANON_KEY || 
                        '';

// Try to read from app.json if not in environment
if (!SUPABASE_ANON_KEY) {
  try {
    const appJson = require('../app.json');
    SUPABASE_ANON_KEY = appJson.expo?.extra?.supabaseAnonKey || '';
  } catch (e) {
    // app.json not found or invalid, continue
  }
}

if (!SUPABASE_ANON_KEY) {
  console.error('❌ Error: SUPABASE_ANON_KEY not found!');
  console.log('Please set EXPO_PUBLIC_SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY environment variable');
  process.exit(1);
}

// Create backup directory
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get all tables from public schema
async function getAllTables() {
  const { data, error } = await supabase.rpc('get_all_tables');
  
  if (error) {
    // Fallback: try to query information_schema directly
    const { data: tables, error: schemaError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (schemaError) {
      // Manual list of known tables
      return [
        'categories', 'products', 'product_images', 'product_variants',
        'cart_items', 'wishlist_items', 'orders', 'order_items',
        'addresses', 'reviews', 'notifications', 'campaigns'
      ];
    }
    
    return tables.map(t => t.table_name);
  }
  
  return data;
}

// Export table data to SQL format
async function exportTable(tableName) {
  console.log(`  Exporting ${tableName}...`);
  
  const { data, error } = await supabase
    .from(tableName)
    .select('*');
  
  if (error) {
    console.error(`    ❌ Error exporting ${tableName}:`, error.message);
    return `-- Error exporting ${tableName}: ${error.message}\n`;
  }
  
  if (!data || data.length === 0) {
    return `-- Table ${tableName} is empty\n`;
  }
  
  // Generate INSERT statements
  let sql = `-- Data for table: ${tableName}\n`;
  sql += `-- Exported ${data.length} rows\n\n`;
  
  // Simple INSERT generation (not production-ready, but works for backup)
  data.forEach((row, index) => {
    const columns = Object.keys(row).join(', ');
    const values = Object.values(row).map(val => {
      if (val === null) return 'NULL';
      if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
      if (val instanceof Date) return `'${val.toISOString()}'`;
      return val;
    }).join(', ');
    
    sql += `INSERT INTO ${tableName} (${columns}) VALUES (${values});\n`;
  });
  
  sql += '\n';
  return sql;
}

// Main backup function
async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupFile = path.join(BACKUP_DIR, `supabase_backup_${timestamp}.sql`);
  
  console.log('🔄 Starting Supabase backup...');
  console.log(`   Project: ${PROJECT_REF}`);
  console.log(`   Output: ${backupFile}\n`);
  
  let sql = `-- Supabase Database Backup\n`;
  sql += `-- Generated: ${new Date().toISOString()}\n`;
  sql += `-- Project: ${PROJECT_REF}\n`;
  sql += `-- Note: This is a data-only backup. Schema should be restored from supabase-schema.sql\n\n`;
  
  try {
    // Get all tables
    console.log('📋 Getting table list...');
    const tables = await getAllTables();
    console.log(`   Found ${tables.length} tables\n`);
    
    // Export each table
    for (const table of tables) {
      const tableSQL = await exportTable(table);
      sql += tableSQL;
    }
    
    // Write backup file
    fs.writeFileSync(backupFile, sql, 'utf8');
    
    const fileSize = (fs.statSync(backupFile).size / 1024 / 1024).toFixed(2);
    console.log(`\n✅ Backup completed successfully!`);
    console.log(`   File: ${backupFile}`);
    console.log(`   Size: ${fileSize} MB`);
    console.log(`   Tables: ${tables.length}`);
    
  } catch (error) {
    console.error('\n❌ Backup failed:', error.message);
    process.exit(1);
  }
}

// Run backup
createBackup();

