import mongoose from 'mongoose';
const ClinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name of clinic is required'],
      minlength: 3,
      maxlength: 30,
    },

    address: {
      type: String,
      required: [true, 'Address of clinic is required'],
    },

    city: String,
    required: [true, 'City of clinic is required'],
  },
  { timestamps: true },
);

export default mongoose.model('Clinic', ClinicSchema);
