import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Movie } from '../../movies/schemas/movie.schema';
import {
  BaseSchema,
  baseSchemaOptions,
} from '../../../common/schemas/base.schema';

export type RatingDocument = Rating & Document;

@Schema(baseSchemaOptions)
export class Rating extends BaseSchema {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  user_id: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Movie',
    required: true,
    index: true,
  })
  movie_id: Movie;

  @Prop({ required: true, min: 1, max: 10, type: Number })
  rating: number;

  @Prop({ type: String, maxlength: 500 })
  review: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);

RatingSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

RatingSchema.index({ user_id: 1 });
RatingSchema.index({ movie_id: 1 });
RatingSchema.index({ user_id: 1, movie_id: 1 }, { unique: true });
RatingSchema.index({ rating: -1 });
RatingSchema.index({ created_at: -1 });
