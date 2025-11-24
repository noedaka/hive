package service

import (
	"context"
	"fmt"
	"hive-backend/internal/model"
)

func (s *service) Register(ctx context.Context, creds model.UserCredentials) (int, error) {
	if err := s.validator.Struct(creds); err != nil {
		return 0, fmt.Errorf("validation failed %w", err)
	}

	return s.userRepo.CreateUser(ctx, creds)
}

func (s *service) Login(ctx context.Context, creds model.UserCredentials) (int, error) {
	if err := s.validator.Struct(creds); err != nil {
		return 0, fmt.Errorf("validation failed %w", err)
	}

	return s.userRepo.GetUserIDByCreds(ctx, creds)
}
