import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GraphQLService {
  private readonly apollo = inject(Apollo);

  async runQuery<T>(query: any, variables: any, key: keyof T): Promise<any> {
    const result = await firstValueFrom(
      this.apollo.query<T>({
        query,
        variables,
        fetchPolicy: 'network-only',
      }),
    );
    return result.data?.[key];
  }

  async runMutation<T>(mutation: any, variables: any, key: keyof T): Promise<any> {
    const result = await firstValueFrom(
      this.apollo.mutate<T>({
        mutation,
        variables,
      }),
    );
    return result.data?.[key];
  }
}
