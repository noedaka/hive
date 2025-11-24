package service

import (
	"hive-backend/internal/repository"

	"github.com/go-playground/validator/v10"
)

type service struct {
	commentRepo repository.CommentRepository
	likeRepo    repository.LikeRepository
	userRepo    repository.UserRepository
	postRepo    repository.PostRepository
	validator   *validator.Validate
}

func NewService(
	commentRepo repository.CommentRepository,
	likeRepo repository.LikeRepository,
	userRepo repository.UserRepository,
	postRepo repository.PostRepository,
) *service {
	return &service{
		commentRepo: commentRepo,
		postRepo:    postRepo,
		likeRepo:    likeRepo,
		userRepo:    userRepo,
		validator:   validator.New(),
	}
}
