package service

import (
	"context"
	"fmt"
	"hive-backend/internal/model"
)

func (s *service) CreateComment(ctx context.Context, comment model.Comment) error {
	if err := s.validator.Struct(comment); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	_, err := s.userRepo.GetLoginByID(ctx, comment.AuthorID)
	if err != nil {
		return fmt.Errorf("user not found: %w", err)
	}

	_, err = s.postRepo.GetPost(ctx, comment.PostID)
	if err != nil {
		return fmt.Errorf("post not found: %w", err)
	}

	return s.commentRepo.CreateComment(ctx, comment)
}

func (s *service) getComments(ctx context.Context, postID int) ([]model.CommentWithAuthor, error) {
	comments, err := s.commentRepo.GetComments(ctx, postID)
	if err != nil {
		return nil, err
	}

	var result []model.CommentWithAuthor
	for _, comment := range comments {
		authorLogin, err := s.userRepo.GetLoginByID(ctx, comment.AuthorID)
		if err != nil {
			return nil, fmt.Errorf("error getting username")
		}

		result = append(result, model.CommentWithAuthor{
			Comment:     comment,
			AuthorLogin: authorLogin,
		})
	}

	return result, nil
}
