import mongoose from 'mongoose';
import { ImplantRestorationType } from '../enums/ImplantRestorationType';
import { ImplantType } from '../enums/ImplantType';
import { RestorationDesignType } from '../enums/restorationDesignType';
import { ConnectionType } from '../enums/ConnectionType';

const CaseConfigurationSchema = new mongoose.Schema({
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
  },

  units: Number,

  connectionType: {
    type: String,
    enum: Object.values(ConnectionType),
  },

  restorationDesign: {
    type: String,
    enum: Object.values(RestorationDesignType),
    required: true,
  },

  implantType: {
    type: String,
    enum: Object.values(ImplantType),
  },

  implantRestoration: {
    type: String,
    enum: Object.values(ImplantRestorationType),
  },

  libraryName: String,

  libraryLink: String,

  libraryFile: String,
});
export default mongoose.model('CaseConfiguration', CaseConfigurationSchema);
