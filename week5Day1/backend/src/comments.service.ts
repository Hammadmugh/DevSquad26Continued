import { Injectable } from '@nestjs/common';

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
}

@Injectable()
export class CommentsService {
  private comments: Comment[] = [];
  private commentIdCounter = 1;

  addComment(author: string, text: string): Comment {
    const comment: Comment = {
      id: String(this.commentIdCounter++),
      author,
      text,
      timestamp: new Date(),
    };
    this.comments.push(comment);
    return comment;
  }

  getComments(): Comment[] {
    return [...this.comments];
  }

  clearComments(): void {
    this.comments = [];
    this.commentIdCounter = 1;
  }
}
