import { TestBed } from '@angular/core/testing';

import { GraphqlDeferrerInterceptor } from './graphql-deferrer.interceptor';

describe('GraphqlDeferrerInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [GraphqlDeferrerInterceptor],
    }),
  );

  it('should be created', () => {
    const interceptor: GraphqlDeferrerInterceptor = TestBed.inject(
      GraphqlDeferrerInterceptor,
    );
    expect(interceptor).toBeTruthy();
  });
});
