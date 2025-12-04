import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Genre, GenreDocument } from './schemas/genre.schema';

@Injectable()
export class GenresRepository {
  constructor(
    @InjectModel(Genre.name) private readonly genreModel: Model<GenreDocument>,
  ) {}

  /**
   * Bulk upsert genres
   */
  async bulkUpsert(
    genres: Array<{ tmdb_id: number; name: string }>,
  ): Promise<{ upsertedCount: number; modifiedCount: number }> {
    if (genres.length === 0) {
      return { upsertedCount: 0, modifiedCount: 0 };
    }

    const bulkOps = genres.map((genre) => ({
      updateOne: {
        filter: { tmdb_id: genre.tmdb_id },
        update: {
          $set: {
            tmdb_id: genre.tmdb_id,
            name: genre.name,
          },
        },
        upsert: true,
      },
    }));

    const result = await this.genreModel.bulkWrite(bulkOps);

    return {
      upsertedCount: result.upsertedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  /**
   * Find all genres
   */
  async findAll(): Promise<GenreDocument[]> {
    return this.genreModel.find().exec();
  }
}
