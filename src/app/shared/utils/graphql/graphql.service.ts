import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GraphQLService {
  private readonly apollo = inject(Apollo);

  runQuery<T>(query: any, variables: any, key: keyof T) {
    return this.apollo
      .query<T>({
        query,
        variables,
      })
      .pipe(map((result) => result.data?.[key]));
  }

  runMutation<T>(mutation: any, variables: any, key: keyof T) {
    return this.apollo
      .mutate<T>({
        mutation,
        variables,
      })
      .pipe(map((result) => result.data?.[key]));
  }
}
