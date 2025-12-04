import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Genre } from '../../genres/schemas/genre.schema';
import {
  BaseSchema,
  baseSchemaOptions,
} from '../../../common/schemas/base.schema';

export type MovieDocument = Movie & Document;

@Schema(baseSchemaOptions)
export class Movie extends BaseSchema {
  @Prop({ required: true, unique: true })
  tmdb_id: number;

  @Prop({ required: true })
  title: string;

  @Prop({ type: String })
  overview: string;

  @Prop()
  poster_path: string;

  @Prop()
  backdrop_path: string;

  @Prop({ type: Date })
  release_date: Date;

  @Prop({ type: Number })
  runtime: number;

  @Prop({ type: Number, default: 0 })
  popularity: number;

  @Prop({ type: Number, min: 0, max: 10 })
  vote_average: number;

  @Prop({ type: Number, default: 0 })
  vote_count: number;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Genre' }],
  })
  genres: Genre[];

  @Prop({ type: Number, default: 0, min: 0, max: 10 })
  average_rating: number;

  @Prop({ type: Number, default: 0 })
  ratings_count: number;

  @Prop()
  original_language: string;

  @Prop({ type: Boolean, default: false })
  adult: boolean;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

MovieSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

MovieSchema.index({ title: 'text', overview: 'text' });
MovieSchema.index({ average_rating: -1 });
MovieSchema.index({ genres: 1, popularity: -1 });
MovieSchema.index({ release_date: -1, popularity: -1 });
