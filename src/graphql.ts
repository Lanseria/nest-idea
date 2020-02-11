
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class Comment {
    id: string;
    created: string;
    comment: string;
}

export class Idea {
    id: string;
    updated: string;
    created: string;
    idea: string;
    description: string;
    author?: User;
    upvotes?: number;
    downvotes?: number;
}

export abstract class IQuery {
    abstract users(): User[] | Promise<User[]>;
}

export class User {
    id: string;
    username: string;
    created: string;
    bookmarks?: Idea[];
}
