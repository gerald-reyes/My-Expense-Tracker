import { TestBed } from '@angular/core/testing';

import { ExpensesCategoriesService } from './expenses.categories.service';

describe('ExpensesCategoriesService', () => {
  let service: ExpensesCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpensesCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
