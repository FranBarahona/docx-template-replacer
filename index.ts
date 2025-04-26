import * as express from "express";
import * as mammoth from "mammoth";
import type {  Response } from "express";
import { replaceKeysDocumentTemplate } from "./replace-document-words";
import { upload } from "./middleware/multer";
import { MulterRequest } from "./types";

const app = express();
const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

app.post('/replace-document', upload.single('file'), async (req: MulterRequest, res: Response) => {
  const file = req.file;
  
  if (!file) {
    return res.status(400).json({ error: 'No file was received. Be sure to upload a .docx file.' });
  }

  if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return res.status(400).json({ error: 'The file must be a valid .docx file.' });
  }
  const fileBuffer = file.buffer;
   
  const RegExpKeys = /@([\w.]+)@/g; // @key@

  // define the keys and replacements -> @name@, @lastname@, @years@
  const replacements = {
    name: 'john',
    lastname: 'Doe',
    years: '8',
  }

  try {
    const extractedText = await mammoth.extractRawText({ buffer: fileBuffer });
    const keys = [...new Set(extractedText.value.match(RegExpKeys) ?? [])];
  
    if (!keys.length) console.log('keys not found');
    if (!replacements || !Object.keys(replacements).length) console.log('replacements not found');
  
    const modifiedBuffer = await replaceKeysDocumentTemplate({
      file: fileBuffer,
      keys,
      replacements,
    });
  
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="document-edited.docx"');
    res.send(modifiedBuffer); 
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
  
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
