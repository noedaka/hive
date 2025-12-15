package handler

import (
	"encoding/json"
	"hive-backend/internal/model"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// RegisterHandler обрабатывает запрос на регистрацию нового пользователя.
//
// Метод: POST
// Путь: /api/auth/register
//
// Принимает в теле запроса JSON с учетными данными:
//
//	{
//	  "login": "string (3-50 символов)",
//	  "password": "string (5-50 символов)"
//	}
//
// Ответы:
//   - 201 Created: пользователь успешно зарегистрирован, токен возвращается в заголовке Authorization
//   - 400 Bad Request: неверный формат запроса
//   - 409 Conflict: логин уже занят
//   - 500 Internal Server Error: внутренняя ошибка сервера
//
// При успешной регистрации возвращает JWT токен в заголовке Authorization в формате "Bearer <token>".
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

		w.Header().Set("Authorization", "Bearer "+tokenString)
		w.WriteHeader(http.StatusCreated)

	case model.ErrOccupiedLogin:
		http.Error(w, err.Error(), http.StatusConflict)
	default:
		w.WriteHeader(http.StatusInternalServerError)
	}
}

// LoginHandler обрабатывает запрос на аутентификацию пользователя.
//
// Метод: POST
// Путь: /api/auth/login
//
// Принимает в теле запроса JSON с учетными данными:
//
//	{
//	  "login": "string",
//	  "password": "string"
//	}
//
// Ответы:
//   - 200 OK: успешный вход, токен возвращается в заголовке Authorization
//   - 400 Bad Request: неверный формат запроса
//   - 401 Unauthorized: пользователь не найден или неверный пароль
//   - 500 Internal Server Error: внутренняя ошибка сервера
//
// При успешном входе возвращает JWT токен в заголовке Authorization в формате "Bearer <token>".
func (h *Handler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var creds model.UserCredentials

	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	userID, err := h.userService.Login(r.Context(), creds)

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

		w.Header().Set("Authorization", "Bearer "+tokenString)
		w.WriteHeader(http.StatusOK)

	case model.ErrNoUser:
		http.Error(w, err.Error(), http.StatusUnauthorized)
	case model.ErrIncorrectPass:
		http.Error(w, err.Error(), http.StatusUnauthorized)
	default:
		w.WriteHeader(http.StatusInternalServerError)
	}
}
