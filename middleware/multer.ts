import * as path from "path";
import * as multer from "multer";

// export const upload = multer({ 
//     storage, 
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//             return cb(new Error('Solo se permiten archivos .docx'), false);
//         }
//         cb(null, true);
//     }
// });

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB por ejemplo
    },
  });

