import * as express from "express";
import * as path from "path";
import * as mammoth from "mammoth";
import * as fs from 'fs';
import type { Request, Response } from "express";
import { replaceKeysDocumentTemplate } from "./replace-document-words";
import { upload } from "./middleware/multer";
import { MulterRequest } from "./types";

const app = express();
const port = parseInt(process.env.PORT) || process.argv[3] || 8080;


  app.use(express.json()); // Luego JSON
  app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api', (req, res) => {
  res.json({ "msg": "Hello world" });
});

app.post('/replace-document', upload.single('file'), async (req: MulterRequest, res: Response) => {
  const fileBuffer = req.file?.buffer;
    if (!fileBuffer) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }
  const RegExpKeys = /@([\w.]+)@/g; // @key@
  const outputPath = path.join(__dirname, 'key_examples_edit.docx');
  const replacements = {
    name: 'nombre'
  }
  try {
    const extractedText = await mammoth.extractRawText({
      buffer: fileBuffer,
    });

    const keys = [...new Set(extractedText.value.match(RegExpKeys) ?? [])];
    if (!keys.length) console.log('key not found');


    if (!replacements || !Object.keys(replacements).length)
      console.log('key not found');

    const modifiedBuffer =
      await replaceKeysDocumentTemplate({
        file: fileBuffer,
        keys,
        replacements,
      });

    fs.writeFileSync(outputPath, modifiedBuffer);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
  res.json({ "msg": "Hello world" });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
