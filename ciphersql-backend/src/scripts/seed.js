const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { connectMongo, pgPool } = require('../config/db');
const Assignment = require('../models/Assignment');

// Pull in the sample assignments that ship with the repo
const assignments = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../assignments.json'), 'utf-8')
);

const seedDatabase = async () => {
    console.log('--- Script Started ---'); 

    await connectMongo();
    console.log('--- Mongo Step Passed ---'); 

    // Grab a Postgres client for this run
    console.log('...Connecting to Postgres...');
    const client = await pgPool.connect();
    console.log('--- Postgres Connection Acquired ---'); 

    try {
        console.log('🚀 Starting Seeding Process...');

        // Start fresh in Mongo so repeated runs don't pile up
        await Assignment.deleteMany({});
        console.log('cleaned old MongoDB data');

        for (let i = 0; i < assignments.length; i++) {
            const data = assignments[i];
            // Give each run its own schema (keeps things isolated)
            const schemaName = `assignment_${i}`; 
            
            console.log(`\nProcessing: ${data.title} -> Schema: ${schemaName}`);

            // Drop if it exists, then make a clean schema (CASCADE cleans leftovers)
            await client.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
            await client.query(`CREATE SCHEMA ${schemaName}`);

            // Create tables and insert their sample rows
            for (const table of data.sampleTables) {
                const tableName = table.tableName;
                
                // Build the CREATE TABLE from the columns list
                const columnDefs = table.columns
                    .map(col => `${col.columnName} ${col.dataType}`)
                    .join(', ');

                const createTableSQL = `
                    CREATE TABLE ${schemaName}.${tableName} (
                        ${columnDefs}
                    );
                `;
                await client.query(createTableSQL);
                console.log(`  - Created table: ${schemaName}.${tableName}`);

                // Insert rows using parameter placeholders
                for (const row of table.rows) {
                    const keys = Object.keys(row);
                    const values = Object.values(row);
                    
                    // Use $1..$n placeholders to avoid SQL injection
                    const placeholders = values.map((_, idx) => `$${idx + 1}`).join(', ');
                    
                    const insertSQL = `
                        INSERT INTO ${schemaName}.${tableName} (${keys.join(', ')})
                        VALUES (${placeholders})
                    `;
                    
                    await client.query(insertSQL, values);
                }
                console.log(`  - Inserted ${table.rows.length} rows into ${tableName}`);
            }

            // Also save the assignment metadata to MongoDB
            await Assignment.create({
                ...data,
                postgresSchemaName: schemaName 
            });
        }

        console.log('\n✅ Database Seeding Completed Successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding Error:', error);
        process.exit(1);
    } finally {
        client.release();
    }
};

seedDatabase();
