import { Schema, model } from 'mongoose';

const CertificationSchema = new Schema({
  name: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: String, required: true },
  link: { type: String, required: true },
});

// ép Mongoose dùng đúng tên collection "Certification"
export default model('Certification', CertificationSchema, 'Certification');
