import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesListPage } from './categories-list.page';

describe('CategoriesListComponent', () => {
  let component: CategoriesListPage;
  let fixture: ComponentFixture<CategoriesListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
