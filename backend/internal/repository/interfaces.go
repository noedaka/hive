package repository

import (
	"context"
	"hive-backend/internal/model"
)

type UserRepository interface {
	CreateUser(ctx context.Context, userCreds model.UserCredentials) (int, error)
	GetUserIDByCreds(ctx context.Context, creds model.UserCredentials) (int, error)
	GetLoginByID(ctx context.Context, authorID int) (string, error)
}

type PostRepository interface {
	CreatePost(ctx context.Context, post model.Post) error
	GetPosts(ctx context.Context) ([]model.Post, error)
	GetPost(ctx context.Context, postID int) (*model.Post, error)
}

type CommentRepository interface {
	CreateComment(ctx context.Context, comment model.Comment) error
	GetComments(ctx context.Context, postID int) ([]model.Comment, error)
}

type LikeRepository interface {
	LikePost(ctx context.Context, userID, postID int) error
	UnlikePost(ctx context.Context, userID, postID int) error
	CountPostLikes(ctx context.Context, postID int) (int, error)
}
