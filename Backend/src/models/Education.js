import { Schema, model } from 'mongoose';

const EducationSchema = new Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
});

// ép Mongoose dùng đúng tên collection "Education"
export default model('Education', EducationSchema, 'Education');
