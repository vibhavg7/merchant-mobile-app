import { TestBed } from '@angular/core/testing';

import { AddProductResolverService } from './add-product-resolver.service';

describe('AddProductResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddProductResolverService = TestBed.get(AddProductResolverService);
    expect(service).toBeTruthy();
  });
});
