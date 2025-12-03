import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  BaseSchema,
  baseSchemaOptions,
} from '../../../common/schemas/base.schema';

export type GenreDocument = Genre & Document;

@Schema(baseSchemaOptions)
export class Genre extends BaseSchema {
  @Prop({ required: true, unique: true })
  tmdb_id: number;

  @Prop({ required: true, unique: true, trim: true })
  name: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);

// Virtual property for id
GenreSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Indexes
GenreSchema.index({ tmdb_id: 1 });
GenreSchema.index({ name: 1 });
