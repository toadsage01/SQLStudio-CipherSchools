const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
    question: { type: String, required: true },
    
    // to render the schema/table info in the UI
    sampleTables: [{
        tableName: String,
        columns: [{
            columnName: String,
            dataType: String 
        }],
        
        rows: Array 
    }],

    // Unique schema name per assignment 
    postgresSchemaName: { type: String, required: true },

    expectedOutput: {
        type: { type: String, enum: ['table', 'single_value', 'count'] },
        value: mongoose.Schema.Types.Mixed // flexible fields
    }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);