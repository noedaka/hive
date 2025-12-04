package app

import (
	"database/sql"
	"hive-backend/internal/handler"
	"hive-backend/internal/middleware"
	"hive-backend/internal/repository"
	"hive-backend/internal/service"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	_ "github.com/lib/pq"
)

func Run() error {
	router := chi.NewRouter()
	db, err := sql.Open("postgres", "postgres://noedaka:admin@localhost:5432/hive?sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	repo := repository.NewRepo(db)
	service := service.NewService(repo, repo, repo, repo)
	handler := handler.NewHandler(service, service, service)

	router.Route("/", func(r chi.Router) {
		r.Route("/api", func(r chi.Router) {
			r.Route("/auth", func(r chi.Router) {
				r.Post("/register", handler.RegisterHandler)
				r.Post("/login", handler.LoginHandler)
			})
			r.Route("/posts", func(r chi.Router) {
				r.Use(middleware.AuthMiddleware)
				r.Post("/", handler.CreatePostHandler)
				r.Get("/", handler.GetPostsHandler)
				r.Get("/{id}", handler.GetPostHandler)
				r.Post("/{id}/comment", handler.CreateCommentHandler)
				r.Post("/{id}/like", handler.LikePostHandler)
				r.Delete("/{id}/like", handler.UnlikePostHandler)
			})
		})
	})

	srv := http.Server{Addr: ":8080", Handler: router}

	if err := srv.ListenAndServe(); err != nil {
		return err
	}

	return nil
}
