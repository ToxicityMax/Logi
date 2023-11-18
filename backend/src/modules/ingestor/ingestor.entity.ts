import { Document, model, Schema } from 'mongoose';

export interface ResourceIDDocument extends Document {
  _id: string;
}
const ResourceIDSchema = new Schema(
  {
    _id: { type: String, required: true },
  },
  { timestamps: true },
);

export interface TraceIDDocument extends Document {
  _id: string;
}
const TraceIDSchema = new Schema(
  {
    _id: { type: String, required: true },
  },
  { timestamps: true },
);

export interface LogDocument extends Document {
  level: string;
  message: string;
  resourceID: string;
  timestamp: Date;
  traceID: string;
  spanID: string;
  commit: string;
  metadata: {
    parentResourceId: string;
  };
}
export const LogSchema = new Schema<LogDocument>(
  {
    level: { type: String, required: true },
    message: { type: String, required: true },
    resourceID: { type: String, required: true },
    timestamp: { type: Date, required: true },
    traceID: { type: String, required: true },
    spanID: { type: String, required: true },
    commit: { type: String, required: true },
    metadata: {
      type: {
        parentResourceId: { type: String },
      },
    },
  },
  { timestamps: true },
);
LogSchema.index({ level: 1 });
LogSchema.index({ resourceID: 1 });
LogSchema.index({ timestamp: 1 });
LogSchema.index({ traceID: 1 });
LogSchema.index({ spanID: 1 });
LogSchema.index({ commit: 1 });
LogSchema.index({ 'metadata.parentResourceId': 1 }, { sparse: true });
LogSchema.index(
  {
    // Full Text Search
    message: 'text',
    level: 'text',
    resourceID: 'text',
    traceID: 'text',
    spanID: 'text',
    commit: 'text',
    'metadata.parentResourceId': 'text',
  },
  // {
  //   weights: {
  //     message: 3,
  //     level: 1,
  //     resourceID: 1,
  //     traceID: 1,
  //     spanID: 1,
  //     commit: 1,
  //     'metadata.parentResourceId': 1,
  //   },
  // },
);

// Create and export the model
const LogModel = model<LogDocument>('Log', LogSchema);
const ResourceIDModel = model<ResourceIDDocument>(
  'ResourceID',
  ResourceIDSchema,
);
const TraceIDModel = model<TraceIDDocument>('TraceID', TraceIDSchema);

export default { LogModel, ResourceIDModel, TraceIDModel };
