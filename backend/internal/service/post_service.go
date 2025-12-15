package service

import (
	"context"
	"fmt"
	"hive-backend/internal/model"
)

func (s *service) CreatePost(ctx context.Context, post model.Post) error {
	if err := s.validator.Struct(post); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	return s.postRepo.CreatePost(ctx, post)
}

func (s *service) GetPosts(ctx context.Context) ([]model.PostWithLikesAndName, error) {
	posts, err := s.postRepo.GetPosts(ctx)
	if err != nil {
		return nil, err
	}

	var res []model.PostWithLikesAndName
	for _, post := range posts {
		likeCount, err := s.likeRepo.CountPostLikes(ctx, post.ID)
		if err != nil {
			return nil, err
		}

		authorName, err := s.userRepo.GetLoginByID(ctx, post.AuthorID)
		if err != nil {
			return nil, err
		}

		res = append(res, model.PostWithLikesAndName{
			Post:        post,
			AuthorLogin: authorName,
			LikeCount:   likeCount,
		})
	}

	return res, nil
}

func (s *service) GetPost(ctx context.Context, postID int) (*model.PostDetailed, error) {
	post, err := s.postRepo.GetPost(ctx, postID)
	if err != nil {
		return nil, err
	}

	likeCount, err := s.likeRepo.CountPostLikes(ctx, postID)
	if err != nil {
		return nil, err
	}

	authorName, err := s.userRepo.GetLoginByID(ctx, post.AuthorID)
	if err != nil {
		return nil, err
	}

	comments, err := s.getComments(ctx, postID)
	if err != nil {
		return nil, err
	}

	return &model.PostDetailed{
		Post:        *post,
		AuthorLogin: authorName,
		LikeCount:   likeCount,
		Comments:    comments,
	}, nil
}

func (s *service) LikePost(ctx context.Context, userID, postID int) error {
	return s.likeRepo.LikePost(ctx, userID, postID)
}

func (s *service) UnlikePost(ctx context.Context, userID, postID int) error {
	return s.likeRepo.UnlikePost(ctx, userID, postID)
}
