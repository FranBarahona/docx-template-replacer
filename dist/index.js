"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const mammoth = require("mammoth");
const fs = require("fs");
const replace_document_words_1 = require("./replace-document-words");
const multer_1 = require("./middleware/multer");
const app = express();
const port = parseInt(process.env.PORT) || process.argv[3] || 8080;
// app.use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs');
app.use(express.json()); // Luego JSON
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/api', (req, res) => {
    res.json({ "msg": "Hello world" });
});
app.post('/replace-document', multer_1.upload.single('file'), async (req, res) => {
    const fileBuffer = req.file?.buffer;
    if (!fileBuffer) {
        return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }
    const RegExpKeys = /@([\w.]+)@/g; // @key@
    // const inputPath = path.join('docs/key_examples.docx');
    const outputPath = path.join(__dirname, 'key_examples_edit.docx');
    const replacements = {
        name: 'nombre'
    };
    try {
        const extractedText = await mammoth.extractRawText({
            buffer: fileBuffer,
        });
        const keys = [...new Set(extractedText.value.match(RegExpKeys) ?? [])];
        if (!keys.length)
            console.log('key not found');
        if (!replacements || !Object.keys(replacements).length)
            console.log('key not found');
        const modifiedBuffer = await (0, replace_document_words_1.replaceKeysDocumentTemplate)({
            file: fileBuffer,
            keys,
            replacements,
        });
        fs.writeFileSync(outputPath, modifiedBuffer);
    }
    catch (error) {
        console.error('Error:', error);
        throw error;
    }
    res.json({ "msg": "Hello world" });
});
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map