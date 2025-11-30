package handler

import (
	"encoding/json"
	"hive-backend/internal/model"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

// CreateCommentHandler обрабатывает запрос на создание комментария к посту.
//
// Метод: POST
// Путь: /api/posts/{id}/comment
// Требует аутентификации: да
//
// Параметры пути:
//   - id: int - идентификатор поста, к которому добавляется комментарий
//
// Принимает в теле запроса JSON с данными комментария:
//
//	{
//	  "content": "string (1-1000 символов)"
//	}
//
// Поля "id", "created_at", "author_id", "post_id" в запросе игнорируются.
// AuthorID автоматически устанавливается из JWT токена пользователя.
// PostID автоматически устанавливается из параметра пути {id}.
//
// Ответы:
//   - 201 Created: комментарий успешно создан (тело ответа пустое)
//   - 400 Bad Request: неверный формат ID или JSON тела запроса
//   - 401 Unauthorized: пользователь не аутентифицирован
//   - 500 Internal Server Error: внутренняя ошибка сервера при создании комментария
//
// Примечание: комментарий привязывается к конкретному посту и пользователю.
// Пользователь может комментировать любой пост, независимо от авторства.
func (h *Handler) CreateCommentHandler(w http.ResponseWriter, r *http.Request) {
	postID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}
	userID, ok := r.Context().Value(model.UserIDKey).(int)
	if !ok {
		http.Error(w, "Authentication error", http.StatusUnauthorized)
		return
	}

	var comment *model.Comment
	if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
		http.Error(w, "Cannot decode request JSON body", http.StatusBadRequest)
		return
	}

	comment.AuthorID = userID
	comment.PostID = postID

	err = h.commentService.CreateComment(r.Context(), *comment)
	if err != nil {
		http.Error(w, "Cannot create comment", http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusCreated)
}
