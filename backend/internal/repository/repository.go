package repository

import (
	"context"
	"database/sql"
	"hive-backend/internal/model"
)

type Repository interface {
	CreateUser(ctx context.Context, userCreds model.UserCredentials) (int, error)
	GetUserIDByCreds(ctx context.Context, creds model.UserCredentials) (int, error)
}

type Repo struct {
	db *sql.DB
}

func NewRepo(db *sql.DB) *Repo {
	return &Repo{db: db}
}
