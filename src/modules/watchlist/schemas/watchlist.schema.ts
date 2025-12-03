import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Movie } from '../../movies/schemas/movie.schema';
import {
  BaseSchema,
  baseSchemaOptions,
} from '../../../common/schemas/base.schema';

export type WatchlistDocument = Watchlist & Document;

@Schema(baseSchemaOptions)
export class Watchlist extends BaseSchema {
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

  @Prop({ type: Boolean, default: false, index: true })
  is_favorite: boolean;

  @Prop({ type: Date, default: Date.now })
  added_at: Date;
}

export const WatchlistSchema = SchemaFactory.createForClass(Watchlist);

WatchlistSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

WatchlistSchema.index({ user_id: 1 });
WatchlistSchema.index({ movie_id: 1 });
WatchlistSchema.index({ user_id: 1, movie_id: 1 }, { unique: true });
WatchlistSchema.index({ user_id: 1, is_favorite: 1 });
WatchlistSchema.index({ added_at: -1 });
