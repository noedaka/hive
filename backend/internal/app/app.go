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
	svc := service.NewService(repo, repo, repo, repo)
	hnd := handler.NewHandler(svc, svc, svc)

	router.Route("/", func(r chi.Router) {
		r.Route("/api", func(r chi.Router) {
			r.Route("/auth", func(r chi.Router) {
				r.Post("/register", hnd.RegisterHandler)
				r.Post("/login", hnd.LoginHandler)
			})
			r.Route("/posts", func(r chi.Router) {
				r.Use(middleware.AuthMiddleware)
				r.Post("/", hnd.CreatePostHandler)
				r.Get("/", hnd.GetPostsHandler)
				r.Get("/{id}", hnd.GetPostHandler)
				r.Post("/{id}/comment", hnd.CreateCommentHandler)
				r.Post("/{id}/like", hnd.LikePostHandler)
				r.Delete("/{id}/like", hnd.UnlikePostHandler)
			})
		})
	})

	srv := http.Server{Addr: ":8080", Handler: router}

	if err := srv.ListenAndServe(); err != nil {
		return err
	}

	return nil
}
