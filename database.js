import postgres from 'postgres';
const sql = postgres('postgres://postgres:user@localhost:5432/saep_db');
export default sql;