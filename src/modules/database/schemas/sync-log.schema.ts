import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  BaseSchema,
  baseSchemaOptions,
} from '../../../common/schemas/base.schema';

export type SyncLogDocument = SyncLog & Document;

export enum SyncEntityType {
  MOVIES = 'movies',
  GENRES = 'genres',
}

export enum SyncStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  IN_PROGRESS = 'in-progress',
}

@Schema(baseSchemaOptions)
export class SyncLog extends BaseSchema {
  @Prop({
    type: String,
    enum: SyncEntityType,
    required: true,
  })
  entity_type: SyncEntityType;

  @Prop({ type: Date, required: true })
  last_sync_date: Date;

  @Prop({
    type: String,
    enum: SyncStatus,
    required: true,
    default: SyncStatus.IN_PROGRESS,
  })
  status: SyncStatus;

  @Prop({ type: Number, default: 0 })
  total_synced: number;

  @Prop({ type: Number, default: 0 })
  total_failed: number;

  @Prop({ type: String })
  error_message: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const SyncLogSchema = SchemaFactory.createForClass(SyncLog);

SyncLogSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

SyncLogSchema.index({ entity_type: 1, last_sync_date: -1 });
SyncLogSchema.index({ status: 1 });
SyncLogSchema.index({ created_at: -1 });
