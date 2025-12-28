const express = require('express');
const router = express.Router();
const axios = require('axios'); // HTTP calls (for AI hint)
const Assignment = require('../models/Assignment');
const { pgPool } = require('../config/db');

// Get all assignments
router.get('/', async (req, res) => {
    try {
        const assignments = await Assignment.find({}, '-postgresSchemaName -expectedOutput');
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get one assignment by id
router.get('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
        res.json(assignment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Run the student's SQL in the sandbox (read-only)
router.post('/run', async (req, res) => {
    const { assignmentId, sql } = req.body;
    if (!sql) return res.status(400).json({ error: "Query is empty" });

    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ error: "Assignment not found" });

        const schemaName = assignment.postgresSchemaName;
        const forbidden = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'GRANT', 'REVOKE'];
        if (forbidden.some(word => sql.toUpperCase().includes(word))) {
            return res.status(403).json({ error: "Action forbidden: Read-only sandbox." });
        }

        const client = await pgPool.connect();
        try {
            await client.query('BEGIN');
            await client.query(`SET search_path TO ${schemaName}, public`);
            const result = await client.query(sql);
            await client.query('ROLLBACK');

            // Check answer
            let isCorrect = false;
            if (assignment.expectedOutput && assignment.expectedOutput.value) {
                isCorrect = JSON.stringify(result.rows) === JSON.stringify(assignment.expectedOutput.value);
            }

            res.json({ 
                success: true, 
                rows: result.rows, 
                rowCount: result.rowCount,
                isCorrect: isCorrect 
            });

        } catch (queryErr) {
            await client.query('ROLLBACK');
            res.status(400).json({ success: false, error: queryErr.message });
        } finally {
            client.release();
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// AI hint (Groq / Llama 3)
router.post('/hint', async (req, res) => {
    const { assignmentId, sql, error } = req.body;
    console.log("\n--- Hint Request (Groq) ---");

    try {
        const assignment = await Assignment.findById(assignmentId);
        
        // Quick static fallback
        let hint = "Double-check your SQL syntax and column names.";
        if (error) {
             if (error.includes("syntax")) hint = "Syntax Error: Check for missing commas or keywords.";
             else if (error.includes("does not exist")) hint = "Schema Error: One of the tables or columns doesn't exist.";
        }

        // Try Groq API (Llama 3)
        if (process.env.GROQ_API_KEY) {
            try {
                const schemaContext = assignment.sampleTables.map(t => t.tableName).join(', ');
                
                // Prompt setup
                const payload = {
                    model: "llama-3.3-70b-versatile", // Intelligent & Fast
                    messages: [
                        { 
                            role: "system", 
                            content: `You are a helpful SQL Tutor. 
Context: The database contains tables [${schemaContext}]. 
Rules: 
1. Give a 1-sentence hint. 
2. Do NOT provide the full SQL answer. 
3. If the user has a syntax error, point it out.` 
                        },
                        { 
                            role: "user", 
                            content: `Question: "${assignment.question}"
Student Query: "${sql}"
Error: "${error || 'None'}"` 
                        }
                    ],
                    temperature: 0.6,
                    max_tokens: 150
                };

                const response = await axios.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    payload,
                    { 
                        headers: { 
                            Authorization: `Bearer ${process.env.GROQ_API_KEY.trim()}`,
                            "Content-Type": "application/json"
                        } 
                    }
                );

                if (response.data && response.data.choices && response.data.choices[0]) {
                    const aiText = response.data.choices[0].message.content.trim();
                    if (aiText) {
                        hint = aiText;
                        console.log("Groq Success:", hint);
                    }
                }

            } catch (aiError) {
                console.error("Groq Failed:", aiError.response ? aiError.response.data : aiError.message);
            }
        } else {
            console.log("GROQ_API_KEY missing in .env");
        }

        res.json({ hint });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;