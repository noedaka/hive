package repository

import (
	"context"
	"database/sql"
	"errors"
	"hive-backend/internal/model"
	"log"
	"time"
)

func (repo *Repo) CreateComment(ctx context.Context, comment model.Comment) error {
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
		"INSERT INTO comments (content, author_id, post_id) VALUES ($1, $2, $3)",
		comment.Content, comment.AuthorID, comment.PostID,
	)
	if err != nil {
		return err
	}

	if err = tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (repo *Repo) GetComments(ctx context.Context, postID int) ([]model.Comment, error) {
	rows, err := repo.db.QueryContext(ctx,
		`SELECT id, content, created_at, author_id 
        FROM comments WHERE id = $1
        ORDER BY created_at DESC`, postID,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, model.ErrNoComments
		}

		return nil, err
	}
	defer rows.Close()

	var comments []model.Comment
	for rows.Next() {
		var comment model.Comment
		var uploadedAt time.Time

		err = rows.Scan(
			&comment.ID,
			&comment.Content,
			&uploadedAt,
			&comment.AuthorID,
		)

		if err != nil {
			return nil, err
		}

		comment.CreatedAt = uploadedAt.Format(time.RFC3339)
		comments = append(comments, comment)
	}

	return comments, nil
}
