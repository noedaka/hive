package handler

import (
	"encoding/json"
	"hive-backend/internal/model"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type Handler struct {
}

func NewHandler() *Handler {
	return nil
}

func (h *Handler) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var creds *model.UserCredentials

	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	if creds.Login == "" || creds.Password == "" {
		http.Error(w, "Write the correct data", http.StatusBadRequest)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
}

func (h *Handler) GetUserCredsByIDHandler(w http.ResponseWriter, r *http.Request) {
	ID := chi.URLParam(r, "id")

	credsMap := map[string]model.UserCredentials{
		"123": {
			ID:       "123",
			Login:    "Thats123",
			Password: "SomePass123",
		},
		"456": {
			ID:       "456",
			Login:    "Thats456",
			Password: "SomePass456",
		},
	}

	foundCred, exists := credsMap[ID]
	if !exists {
		http.Error(w, "Credentials not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(foundCred); err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}
}
