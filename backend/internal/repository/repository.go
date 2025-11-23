package repository

import (
	"context"
	"database/sql"
	"hive-backend/internal/model"
)

type Repository interface {
	CreateUser(ctx context.Context, userCreds model.UserCredentials) (int, error)
	GetUserIDByCreds(ctx context.Context, creds model.UserCredentials) (int, error)
	GetLoginByID(ctx context.Context, authorID int) (string, error)
	CreatePost(ctx context.Context, post model.Post) error
	GetPosts(ctx context.Context) ([]model.Post, error)
	GetPost(ctx context.Context, postID int) (*model.Post, error)
	CreateComment(ctx context.Context, comment model.Comment) error
	GetComments(ctx context.Context, authorID int, postID int) ([]model.Comment, error)
	LikePost(ctx context.Context, userID, postID int) error
	UnlikePost(ctx context.Context, userID, postID int) error
	CountPostLikes(ctx context.Context, postID int) (int, error)
}

type Repo struct {
	db *sql.DB
}

func NewRepo(db *sql.DB) *Repo {
	return &Repo{db: db}
}
