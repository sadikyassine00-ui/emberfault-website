import { neon } from '@neondatabase/serverless';
async function setup() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in .env.local');
  }
  
  const sql = neon(process.env.DATABASE_URL);
  
  console.log('Creating tables...');
  
  try {
    // Leads table
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        source VARCHAR(255),
        platform VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created leads table.');

    // Visits table
    await sql`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        path VARCHAR(255) NOT NULL,
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created visits table.');

    // Config table (key-value store for singletons like landing page config)
    await sql`
      CREATE TABLE IF NOT EXISTS config (
        key VARCHAR(255) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Created config table.');

    // Insert default config if it doesn't exist
    const defaultGallery = [
        { id: "proc-1", proceduralId: "swarm_tactics_v1", title: "Procedural Defense", category: "Combat" },
        { id: "proc-2", proceduralId: "core_breach_v2", title: "Core Breach", category: "Destruction" },
        { id: "proc-3", proceduralId: "extraction_point_v1", title: "Extraction Site", category: "Atmosphere" },
        { id: "proc-4", proceduralId: "cavern_collapse_v3", title: "Cavern Collapse", category: "Destruction" }
    ];

    const defaultConfig = {
      heroImageUrl: "",
      heroImageAlt: "",
      trailerUrl: "",
      gallery: defaultGallery
    };

    await sql`
      INSERT INTO config (key, value)
      VALUES ('landing', ${JSON.stringify(defaultConfig)})
      ON CONFLICT (key) DO NOTHING;
    `;
    console.log('Inserted default config.');

    console.log('Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setup();
