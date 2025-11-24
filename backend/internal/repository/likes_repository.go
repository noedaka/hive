package repository

import (
	"context"
	"database/sql"
	"errors"
	"log"
)

func (repo *Repo) LikePost(ctx context.Context, userID, postID int) error {
	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer func() {
		if err := tx.Rollback(); err != nil {
			if !errors.Is(err, sql.ErrTxDone) {
				log.Printf("failed to rollback the transaction: %v", err)
			}
		}
	}()

	_, err = tx.ExecContext(ctx,
		"INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2)",
		userID, postID)
	if err != nil {
		return err
	}

	if err = tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (repo *Repo) UnlikePost(ctx context.Context, userID, postID int) error {
	tx, err := repo.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer func() {
		if err := tx.Rollback(); err != nil {
			if !errors.Is(err, sql.ErrTxDone) {
				log.Printf("failed to rollback the transaction: %v", err)
			}
		}
	}()

	_, err = tx.ExecContext(ctx,
		"DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2",
		userID, postID)
	if err != nil {
		return err
	}

	if err = tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (repo *Repo) CountPostLikes(ctx context.Context, postID int) (int, error) {
	var likes int
	err := repo.db.QueryRowContext(ctx,
		"SELECT COUNT(*) FROM post_likes WHERE post_id = $1",
	).Scan(&likes)

	if err != nil {
		return 0, err
	}

	return likes, nil
}
