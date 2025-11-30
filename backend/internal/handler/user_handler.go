package handler

import (
	"encoding/json"
	"fmt"
	"hive-backend/internal/model"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

func (h *Handler) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var creds model.UserCredentials

	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	userID, err := h.userService.Register(r.Context(), creds)
	switch err {
	case nil:
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user_id": userID,
			"exp":     time.Now().Add(time.Hour * 24).Unix(),
		})

		tokenString, err := token.SignedString(model.JWTSecret)
		if err != nil {
			http.Error(w, "Error creating token", http.StatusInternalServerError)
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     "auth_token",
			Value:    tokenString,
			Expires:  time.Now().Add(24 * time.Hour),
			HttpOnly: true,
			Secure:   false,
			Path:     "/",
		})

		w.WriteHeader(http.StatusCreated)

	case model.ErrOccupiedLogin:
		http.Error(w, err.Error(), http.StatusConflict)
	default:
		w.WriteHeader(http.StatusInternalServerError)
	}
}

func (h *Handler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var creds *model.UserCredentials

	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		return
	}

	userID, err := h.userService.Login(r.Context(), *creds)
	fmt.Print(userID)

	switch err {
	case nil:
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user_id": userID,
			"exp":     time.Now().Add(time.Hour * 24).Unix(),
		})

		tokenString, err := token.SignedString(model.JWTSecret)
		if err != nil {
			http.Error(w, "Error creating token", http.StatusInternalServerError)
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     "auth_token",
			Value:    tokenString,
			Expires:  time.Now().Add(24 * time.Hour),
			HttpOnly: true,
			Secure:   false,
			Path:     "/",
		})

		w.WriteHeader(http.StatusOK)
	case model.ErrNoUser:
		http.Error(w, err.Error(), http.StatusUnauthorized)
	case model.ErrIncorrectPass:
		http.Error(w, err.Error(), http.StatusUnauthorized)
	default:
		w.WriteHeader(http.StatusInternalServerError)
	}

}
