import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// --- CONFIGURATION ---
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const userEmail = process.env.SEED_USER_EMAIL;
const userPassword = process.env.SEED_USER_PASSWORD;

if (!supabaseUrl || !supabaseAnonKey || !userEmail || !userPassword) {
  throw new Error(
    'Supabase credentials or seed user credentials are not defined in .env file.'
  );
}

if (userEmail === 'your-email@example.com') {
    console.error('\x1b[31m%s\x1b[0m', 'ERROR: Please update the placeholder credentials in your .env file before running the seed script.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- SAMPLE DATA ---
// Realistic sample data based on public information for Chilean aquaculture.
const concessionsData = [
  {
    name: 'Punta Chocoy',
    rut: '76.123.456-7',
    manager: 'Juan Pérez González',
    phone: '+56 9 8765 4321',
    email: 'jperez@example.com',
    established: '2010',
    address: 'Ruta 5 Sur, Km 1014',
    location: 'Calbuco, Los Lagos',
    water_body: 'Seno de Reloncaví',
    total_area: '10.5 ha',
    max_depth: '35m',
    latitude: -41.773,
    longitude: -73.13,
    license: 'AC-2010-045',
    operational_status: 'Activa',
    certifications: ['ASC', 'BAP'],
    environmental_permits: ['RCA N° 123/2009'],
  },
  {
    name: 'Isla Huar Sur',
    rut: '77.555.888-K',
    manager: 'Maria Rodriguez Soto',
    phone: '+56 9 1234 5678',
    email: 'mrodriguez@example.com',
    established: '2012',
    address: 'Sector Insular',
    location: 'Huar, Los Lagos',
    water_body: 'Canal de Chacao',
    total_area: '8.2 ha',
    max_depth: '28m',
    latitude: -41.695,
    longitude: -73.251,
    license: 'AC-2012-112',
    operational_status: 'Activa',
    certifications: ['BAP'],
    environmental_permits: ['RCA N° 88/2011'],
  },
  {
    name: 'Estero Cupquelan',
    rut: '76.987.654-3',
    manager: 'Carlos Andrade Vera',
    phone: '+56 9 5555 4444',
    email: 'candrade@example.com',
    established: '2008',
    address: 'Fiordo Cupquelan',
    location: 'Cisnes, Aysén',
    water_body: 'Canal Puyuhuapi',
    total_area: '15.0 ha',
    max_depth: '50m',
    latitude: -44.75,
    longitude: -72.7,
    license: 'AC-2008-021',
    operational_status: 'Activa',
    certifications: ['ASC', 'GlobalG.A.P.'],
    environmental_permits: ['RCA N° 210/2007'],
  },
  {
    name: 'Bahía Ilque',
    rut: '76.333.111-2',
    manager: 'Ana Silva Castro',
    phone: '+56 9 8888 7777',
    email: 'asilva@example.com',
    established: '2015',
    address: 'Sector Ilque',
    location: 'Puerto Montt, Los Lagos',
    water_body: 'Seno de Reloncaví',
    total_area: '5.7 ha',
    max_depth: '25m',
    latitude: -41.58,
    longitude: -73.05,
    license: 'AC-2015-089',
    operational_status: 'En Revisión',
    certifications: [],
    environmental_permits: ['RCA N° 55/2014'],
  },
  {
    name: 'Canal Costa',
    rut: '78.111.222-3',
    manager: 'Luis Torres Muñoz',
    phone: '+56 9 2222 3333',
    email: 'ltorres@example.com',
    established: '2005',
    address: 'Península de Taitao',
    location: 'Tortel, Aysén',
    water_body: 'Océano Pacífico',
    total_area: '20.1 ha',
    max_depth: '60m',
    latitude: -46.8,
    longitude: -74.5,
    license: 'AC-2005-007',
    operational_status: 'Activa',
    certifications: ['ASC'],
    environmental_permits: ['RCA N° 12/2004'],
  },
  {
    name: 'Seno Otway',
    rut: '79.444.555-6',
    manager: 'Patricia Flores Diaz',
    phone: '+56 9 6666 1111',
    email: 'pflores@example.com',
    established: '2018',
    address: 'Ruta Y-50',
    location: 'Punta Arenas, Magallanes',
    water_body: 'Seno Otway',
    total_area: '12.3 ha',
    max_depth: '40m',
    latitude: -52.8,
    longitude: -71.2,
    license: 'AC-2018-033',
    operational_status: 'Activa',
    certifications: ['BAP'],
    environmental_permits: ['RCA N° 40/2017'],
  },
  {
    name: 'Punta Larga',
    rut: '76.222.999-1',
    manager: 'Roberto Vega Lagos',
    phone: '+56 9 7777 9999',
    email: 'rvega@example.com',
    established: '2011',
    address: 'Sector Punta Larga',
    location: 'Frutillar, Los Lagos',
    water_body: 'Lago Llanquihue',
    total_area: '4.0 ha',
    max_depth: '15m',
    latitude: -41.15,
    longitude: -72.98,
    license: 'AC-2011-078',
    operational_status: 'Suspendida',
    certifications: [],
    environmental_permits: ['RCA N° 91/2010'],
  },
  {
    name: 'Isla Traiguén',
    rut: '77.888.444-5',
    manager: 'Claudia Núñez Ríos',
    phone: '+56 9 3333 8888',
    email: 'cnunez@example.com',
    established: '2013',
    address: 'Archipiélago de las Guaitecas',
    location: 'Guaitecas, Aysén',
    water_body: 'Canal Moraleda',
    total_area: '18.5 ha',
    max_depth: '55m',
    latitude: -45.2,
    longitude: -73.75,
    license: 'AC-2013-054',
    operational_status: 'Activa',
    certifications: ['ASC', 'BAP'],
    environmental_permits: ['RCA N° 150/2012'],
  },
  {
    name: 'Bahía Cumberland',
    rut: '76.543.210-9',
    manager: 'Andrés Soto Paredes',
    phone: '+56 9 1111 2222',
    email: 'asoto@example.com',
    established: '2019',
    address: 'Isla Robinson Crusoe',
    location: 'Juan Fernández, Valparaíso',
    water_body: 'Océano Pacífico',
    total_area: '6.8 ha',
    max_depth: '30m',
    latitude: -33.63,
    longitude: -78.83,
    license: 'AC-2019-019',
    operational_status: 'Activa',
    certifications: [],
    environmental_permits: ['RCA N° 22/2018'],
  },
  {
    name: 'Fiordo Aysén',
    rut: '78.001.002-K',
    manager: 'Valeria Contreras Mora',
    phone: '+56 9 4444 6666',
    email: 'vcontreras@example.com',
    established: '2009',
    address: 'Sector Río Simpson',
    location: 'Aysén, Aysén',
    water_body: 'Fiordo Aysén',
    total_area: '11.2 ha',
    max_depth: '45m',
    latitude: -45.4,
    longitude: -72.8,
    license: 'AC-2009-063',
    operational_status: 'Activa',
    certifications: ['GlobalG.A.P.'],
    environmental_permits: ['RCA N° 180/2008'],
  },
  {
    name: 'Paso Vattuone',
    rut: '77.321.654-8',
    manager: 'Jorge Castillo Bravo',
    phone: '+56 9 9876 5432',
    email: 'jcastillo@example.com',
    established: '2016',
    address: 'Canal Jacaf',
    location: 'Cisnes, Aysén',
    water_body: 'Canal Jacaf',
    total_area: '9.9 ha',
    max_depth: '38m',
    latitude: -44.2,
    longitude: -72.7,
    license: 'AC-2016-101',
    operational_status: 'Inactiva',
    certifications: ['ASC'],
    environmental_permits: ['RCA N° 77/2015'],
  },
  {
    name: 'Estero Elefantes',
    rut: '76.876.543-2',
    manager: 'Mónica Herrera Fuentes',
    phone: '+56 9 5432 1987',
    email: 'mherrera@example.com',
    established: '2014',
    address: 'Parque Nacional Laguna San Rafael',
    location: 'Río Ibáñez, Aysén',
    water_body: 'Estero Elefantes',
    total_area: '13.4 ha',
    max_depth: '48m',
    latitude: -46.6,
    longitude: -73.8,
    license: 'AC-2014-092',
    operational_status: 'Activa',
    certifications: ['BAP'],
    environmental_permits: ['RCA N° 110/2013'],
  },
];

// --- MAIN SEEDING FUNCTION ---
async function seedDatabase() {
  console.log('--- Starting database seed process ---');

  // 1. Authenticate the user to get a session and user ID
  console.log(`\n[1/4] Authenticating user: ${userEmail}...`);
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: userEmail,
    password: userPassword,
  });

  if (authError || !authData.user) {
    console.error('\x1b[31m%s\x1b[0m', 'Authentication failed:', authError?.message);
    console.error('\x1b[33m%s\x1b[0m', 'Please ensure the credentials in .env are correct and the user exists.');
    return;
  }
  const userId = authData.user.id;
  console.log('\x1b[32m%s\x1b[0m', `Authentication successful. User ID: ${userId}`);

  // 2. Delete existing concessions for this user to avoid duplicates
  console.log('\n[2/4] Deleting existing concessions for this user...');
  const { error: deleteError } = await supabase
    .from('concessions')
    .delete()
    .eq('user_id', userId);

  if (deleteError) {
    console.error('\x1b[31m%s\x1b[0m', 'Failed to delete existing data:', deleteError.message);
    return;
  }
  console.log('\x1b[32m%s\x1b[0m', 'Existing data cleared successfully.');

  // 3. Prepare new data with the authenticated user's ID
  console.log('\n[3/4] Preparing new data for insertion...');
  const concessionsWithUserId = concessionsData.map((concession) => ({
    ...concession,
    user_id: userId,
  }));
  console.log(`\x1b[32m%s\x1b[0m', '${concessionsWithUserId.length} records prepared.`);

  // 4. Insert the new data into the 'concessions' table
  console.log('\n[4/4] Inserting new concession data...');
  const { data: insertData, error: insertError } = await supabase
    .from('concessions')
    .insert(concessionsWithUserId)
    .select();

  if (insertError) {
    console.error('\x1b[31m%s\x1b[0m', 'Failed to insert new data:', insertError.message);
  } else {
    console.log('\x1b[32m%s\x1b[0m', `Successfully inserted ${insertData.length} concessions.`);
  }
  
  await supabase.auth.signOut();
  console.log('\n--- Seed process finished ---');
}

// Run the script
seedDatabase().catch(console.error);
