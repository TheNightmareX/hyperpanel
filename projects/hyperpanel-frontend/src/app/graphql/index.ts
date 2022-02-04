import { Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type FileInfo = {
  __typename?: 'FileInfo';
  dirname: Scalars['String'];
  modifiedAt: Scalars['DateTime'];
  name: Scalars['String'];
  realpath?: Maybe<Scalars['String']>;
  size: Scalars['Float'];
  sizeFormatted: Scalars['String'];
  type: Scalars['Int'];
};

export type FileInfoList = {
  __typename?: 'FileInfoList';
  items: Array<FileInfo>;
  offset: Scalars['Int'];
  total: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  authorize: Scalars['String'];
};

export type MutationAuthorizeArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  fileInfoDetail: FileInfo;
  fileInfoList: FileInfoList;
};

export type QueryFileInfoDetailArgs = {
  accurate?: InputMaybe<Scalars['Boolean']>;
  path: Scalars['String'];
};

export type QueryFileInfoListArgs = {
  offset?: InputMaybe<Scalars['Int']>;
  path: Scalars['String'];
};

export type AuthorizeMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;

export type AuthorizeMutation = { __typename?: 'Mutation'; authorize: string };

export const AuthorizeDocument = gql`
  mutation Authorize($username: String!, $password: String!) {
    authorize(username: $username, password: $password)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AuthorizeGQL extends Apollo.Mutation<
  AuthorizeMutation,
  AuthorizeMutationVariables
> {
  document = AuthorizeDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
