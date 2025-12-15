package service

import (
	"context"
	"hive-backend/internal/model"
)

type PostService interface {
	CreatePost(ctx context.Context, post model.Post) error
	GetPosts(ctx context.Context) ([]model.PostWithLikesAndName, error)
	GetPost(ctx context.Context, postID int) (*model.PostDetailed, error)

	LikePost(ctx context.Context, userID, postID int) error
	UnlikePost(ctx context.Context, userID, postID int) error
}

type UserService interface {
	Register(ctx context.Context, creds model.UserCredentials) (int, error)
	Login(ctx context.Context, creds model.UserCredentials) (int, error)
}

type CommentService interface {
	CreateComment(ctx context.Context, comment model.Comment) error
}
