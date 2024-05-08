import { Interceptor, Invocation, decorate } from '.';
import { ClassType } from './utility-types';

describe('Library » decorate', () => {
  describe(' » with calls to `MoviesNullInterceptor`: ', () => {
    let rawMoviesService: MoviesService;
    let decoratedMoviesService: MoviesService;
    let DecoratedMoviesService: ClassType<MoviesService>;

    const instantiateRaw = () => {
      rawMoviesService = new MoviesService();
    };

    const instantiateDecorated = () => {
      DecoratedMoviesService = decorate(MoviesService);
      decoratedMoviesService = new DecoratedMoviesService(
        new MoviesService(),
        new MoviesNullInterceptor(),
      );
    };

    it('should produce exactly the same result', () => {
      // Given:
      instantiateRaw();
      instantiateDecorated();

      // When:
      const oneFromRaw = rawMoviesService.findOne(1);
      const oneFromDecorated = decoratedMoviesService.findOne(1);
      const manyFromRaw = rawMoviesService.findMany();
      const manyFromDecorated = decoratedMoviesService.findMany();

      // Then:
      expect(oneFromRaw).toStrictEqual(oneFromDecorated);
      expect(manyFromRaw).toStrictEqual(manyFromDecorated);
    });

    // TODO: Expand.
  });
});

interface Movie {
  title: string;
  length: number;
}

class MoviesService {
  private movies: Movie[] = [
    {
      title: 'Taken For A Dork',
      length: 120,
    },
    {
      title: 'And Yet Mr. Pink Escapes',
      length: 150,
    },
  ];

  findMany(): Movie[] {
    return this.movies;
  }

  findOne(id: number) {
    if (!(Math.floor(id) == id && 0 <= id && id < this.movies.length)) {
      throw new Error('Movie not found');
    }
    return this.movies[id];
  }
}

class MoviesNullInterceptor implements Interceptor<MoviesService> {
  intercept({ proceed }: Invocation<MoviesService>) {
    return proceed();
  }
}
