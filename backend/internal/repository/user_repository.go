package repository

import (
	"context"
	"database/sql"
	"errors"
	"hive-backend/internal/auth"
	"hive-backend/internal/model"
	"log"
)

func (repo *Repo) CreateUser(ctx context.Context, creds model.UserCredentials) (int, error) {
	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return 0, err
	}

	defer func() {
		if err := tx.Rollback(); err != nil {
			if !errors.Is(err, sql.ErrTxDone) {
				log.Printf("failed to rollback the transaction: %v", err)
			}
		}
	}()

	isFree, err := repo.isLoginFree(ctx, creds.Login)
	if err != nil {
		return 0, err
	}

	if !isFree {
		return 0, model.ErrOccupiedLogin
	}

	hashedPassword, err := auth.HashPassword(creds.Password)
	if err != nil {
		return 0, err
	}

	_, err = tx.ExecContext(ctx,
		"INSERT INTO users (id, login, password) VALUES ($1, $2, $3)",
		creds.ID, creds.Login, hashedPassword)
	if err != nil {
		return 0, err
	}

	if err = tx.Commit(); err != nil {
		return 0, err
	}

	return creds.ID, nil
}

func (repo *Repo) GetUserIDByCreds(ctx context.Context, creds model.UserCredentials) (int, error) {
	var userCredsFromDB model.UserCredentials
	err := repo.db.QueryRowContext(ctx,
		"SELECT id, oassword FROM user WHERE login = $1", creds.Login,
	).Scan(&userCredsFromDB.ID, userCredsFromDB.Password)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, model.ErrNoUser
		}

		return 0, err
	}

	isPasswordCorrect := auth.CheckPasswordHash(creds.Password, userCredsFromDB.Password)
	if isPasswordCorrect {
		return userCredsFromDB.ID, nil
	}

	return 0, nil
}

func (repo *Repo) isLoginFree(ctx context.Context, login string) (bool, error) {
	var count int
	err := repo.db.QueryRowContext(ctx,
		"SELECT COUNT(*) FROM users WHERE login = $1", login,
	).Scan(&count)
	if err != nil {
		return false, err
	}

	if count == 1 {
		return false, nil
	} else {
		return true, nil
	}
}

func (repo *Repo) GetLoginByID(ctx context.Context, authorID int) (string, error) {
	var login string
	err := repo.db.QueryRowContext(ctx,
		"SELECT login FROM users WHERE id = &1", authorID,
	).Scan(&login)

	if err != nil {
		return "", nil
	}

	return login, nil
}
