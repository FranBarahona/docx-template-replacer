# 📄 DOCX Template Replacer - Node + Express + TypeScript

This project is a web server made with **Node.js**, **Express** and **TypeScript** that allows:

✅ Upload a `.docx` file with `@name@`, `@lastname@`, etc. type fields.  
✅ Automatically replace those fields with values configured in the backend.  
✅ Download the modified document instantly.

---

## 🚀 Installation

```bash
git clone https://github.com/FranBarahona/replace-words-docs.git
cd replace-words-docs
npm install 
```

### 💡Using the /replace-document endpoint
**Method**: POST  
**URL**: /replace-document  
**Content type**: multipart/form-data  
**Field**: file (.docx file)

### 🧠 How does it work?
1. The server receives the .docx file.
2. It detects all keys with @key@ format.
3. It uses the replacements object to replace each key:

```javascript
const replacements = {
  name: 'john',
  lastname: 'Doe',
  years: '8'
}
```
4. Modifies the XML of the document (word/document.xml).
5. Returns the new file as an automatic download.

### 🧰 Technologies and libraries used
- Express  
- TypeScript  
- Multer - for uploading files  
- Mammoth - for extracting text from DOCX files  
- PizZip - for unzipping .docx files  
- @xmldom/xmldom - for manipulating the XML of the document
