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
  id: Scalars['ID'];
  modifiedAt: Scalars['DateTime'];
  name: Scalars['String'];
  path: Scalars['String'];
  realpath?: Maybe<Scalars['String']>;
  size: Scalars['Float'];
  sizeFormatted: Scalars['String'];
  type: FileType;
};

export type FileInfoList = {
  __typename?: 'FileInfoList';
  items: Array<FileInfo>;
  offset: Scalars['Int'];
  total: Scalars['Int'];
};

export enum FileType {
  Directory = 'Directory',
  File = 'File',
  Other = 'Other',
  Socket = 'Socket',
}

export type Mutation = {
  __typename?: 'Mutation';
  authorize: Scalars['String'];
  copyFile: FileInfo;
  createFile: FileInfo;
  moveFile: FileInfo;
  removeFile: FileInfo;
  renameFile: FileInfo;
};

export type MutationAuthorizeArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type MutationCopyFileArgs = {
  sourcePath: Scalars['String'];
  targetPath: Scalars['String'];
};

export type MutationCreateFileArgs = {
  isDirectory?: InputMaybe<Scalars['Boolean']>;
  path: Scalars['String'];
};

export type MutationMoveFileArgs = {
  sourcePath: Scalars['String'];
  targetPath: Scalars['String'];
};

export type MutationRemoveFileArgs = {
  path: Scalars['String'];
};

export type MutationRenameFileArgs = {
  newName: Scalars['String'];
  path: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  authorized: Scalars['Boolean'];
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

export type AuthorizedQueryVariables = Exact<{ [key: string]: never }>;

export type AuthorizedQuery = { __typename?: 'Query'; authorized: boolean };

export type FileInfoListQueryVariables = Exact<{
  path: Scalars['String'];
  offset?: InputMaybe<Scalars['Int']>;
}>;

export type FileInfoListQuery = {
  __typename?: 'Query';
  fileInfoList: {
    __typename?: 'FileInfoList';
    total: number;
    items: Array<{
      __typename?: 'FileInfo';
      id: string;
      name: string;
      type: FileType;
      size: number;
      sizeFormatted: string;
      modifiedAt: any;
    }>;
  };
};

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
export const AuthorizedDocument = gql`
  query Authorized {
    authorized
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AuthorizedGQL extends Apollo.Query<
  AuthorizedQuery,
  AuthorizedQueryVariables
> {
  document = AuthorizedDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FileInfoListDocument = gql`
  query FileInfoList($path: String!, $offset: Int) {
    fileInfoList(path: $path, offset: $offset) {
      total
      items {
        id
        name
        type
        size
        sizeFormatted
        modifiedAt
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FileInfoListGQL extends Apollo.Query<
  FileInfoListQuery,
  FileInfoListQueryVariables
> {
  document = FileInfoListDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
