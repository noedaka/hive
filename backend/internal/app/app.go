package app

import (
	"hive-backend/internal/handler"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
)

func Run() error {
	router := chi.NewRouter()
	userHandler := handler.NewHandler()

	router.Route("/", func(r chi.Router) {
		r.Post("/register", userHandler.RegisterHandler)
		r.Get("/api/users/{id}", userHandler.GetUserCredsByIDHandler)
	})

	port := os.Getenv("PORT")
	if err := http.ListenAndServe(":"+port, router); err != nil {
		return err
	}

	return nil
}
