package repository

import (
	"context"
	"database/sql"
	"errors"
	"hive-backend/internal/model"
	"log"
	"time"
)

func (repo *Repo) CreatePost(ctx context.Context, post model.Post) error {
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
		"INSERT INTO posts (title, content, image_url, author_id) VALUES ($1, $2, $3, $4)",
		post.Title, post.Content, post.ImageURL, post.AuthorID,
	)
	if err != nil {
		return err
	}

	if err = tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (repo *Repo) GetPosts(ctx context.Context) ([]model.Post, error) {
	rows, err := repo.db.QueryContext(ctx,
		`SELECT id, title, content, image_url, created_at, author_id 
        FROM posts 
        ORDER BY created_at DESC`,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, model.ErrNoPosts
		}

		return nil, err
	}
	defer rows.Close()

	var posts []model.Post
	for rows.Next() {
		var post model.Post
		var uploadedAt time.Time

		err = rows.Scan(
			&post.ID,
			&post.Title,
			&post.Content,
			&post.ImageURL,
			&uploadedAt,
			&post.AuthorID,
		)

		if err != nil {
			return nil, err
		}

		post.CreatedAt = uploadedAt.Format(time.RFC3339)
		posts = append(posts, post)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

func (repo *Repo) GetPost(ctx context.Context, postID int) (*model.Post, error) {
	var post model.Post
	err := repo.db.QueryRowContext(ctx,
		"SELECT id, title, content, image_url, created_at, author_id FROM posts WHERE id = $1 ", postID,
	).Scan(&post.ID, &post.Title, &post.Content, &post.ImageURL, &post.CreatedAt, &post.AuthorID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, model.ErrNoPosts
		}

		return nil, err
	}

	return &post, nil
}
