import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    supportEmail: {
      type: String,
      required: true,
      trim: true,
    },

    supportPhone: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: String, // Cloudinary URL
    },

    currency: {
      type: String,
      default: 'EGP',
    },

    paymentMethods: {
      instaPay: {
        enabled: {
          type: Boolean,
          default: false,
        },

        number: {
          type: String,
        },

        qrCode: {
          type: String, // Cloudinary URL
        },
      },

      vodafoneCash: {
        enabled: {
          type: Boolean,
          default: false,
        },

        number: {
          type: String,
        },

        qrCode: {
          type: String, // Cloudinary URL
        },
      },

      bankTransfer: {
        enabled: {
          type: Boolean,
          default: false,
        },

        bankName: {
          type: String,
        },

        accountName: {
          type: String,
        },

        accountNumber: {
          type: String,
        },

        iban: {
          type: String,
        },

        swiftCode: {
          type: String,
        },
      },

      cash: {
        enabled: {
          type: Boolean,
          default: false,
        },
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Settings', SettingsSchema);
