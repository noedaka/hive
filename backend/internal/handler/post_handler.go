package handler

import (
	"encoding/json"
	"errors"
	"hive-backend/internal/model"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

// CreatePostHandler обрабатывает запрос на создание нового поста.
//
// Метод: POST
// Путь: /api/posts
// Требует аутентификации: да
//
// Принимает в теле запроса JSON с данными поста:
//
//	{
//	  "title": "string (1-200 символов)",
//	  "content": "string (20-10000 символов)",
//	  "image_url": "string (опционально)"
//	}
//
// Поля "id", "created_at", "author_id" в запросе игнорируются.
// AuthorID автоматически устанавливается из JWT токена пользователя.
//
// Ответы:
//   - 201 Created: пост успешно создан (тело ответа пустое)
//   - 400 Bad Request: неверный формат запроса или ID
//   - 401 Unauthorized: пользователь не аутентифицирован
//   - 500 Internal Server Error: внутренняя ошибка сервера
func (h *Handler) CreatePostHandler(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(model.UserIDKey).(int)
	if !ok {
		log.Fatal(userID)
		http.Error(w, "Authentication error", http.StatusUnauthorized)
		return
	}

	var post *model.Post
	if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	post.AuthorID = userID

	err := h.postService.CreatePost(r.Context(), *post)
	if err != nil {
		http.Error(w, "Failed to create post", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

// GetPostsHandler обрабатывает запрос на получение списка всех постов.
//
// Метод: GET
// Путь: /api/posts
//
// Ответы:
//   - 200 OK: успешный запрос, возвращает массив постов в формате JSON
//   - 204 No Content: посты не найдены
//   - 500 Internal Server Error: внутренняя ошибка сервера
//
// Формат ответа (200 OK):
//
//	  [
//	    post: {
//	      "id": 1,
//	      "title": "string",
//	      "content": "string",
//	      "image_url": "string",
//	      "created_at": "string",
//	      "author_id": 1
//
//	    },
//		"author_name": "string",
//		"likes_count": 0,
//
//	  ]
func (h *Handler) GetPostsHandler(w http.ResponseWriter, r *http.Request) {
	posts, err := h.postService.GetPosts(r.Context())
	if err != nil {
		if errors.Is(err, model.ErrNoPosts) {
			w.WriteHeader(http.StatusNoContent)
			return
		} else {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(posts); err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}
}

	// GetPostHandler обрабатывает запрос на получение конкретного поста по ID.
	//
	// Метод: GET
	// Путь: /api/posts/{id}
	//
	// Параметры пути:
	//   - id: int - идентификатор поста
	//
	// Ответы:
	//   - 200 OK: пост найден, возвращает объект поста в формате JSON
	//   - 204 No Content: пост с указанным ID не найден
	//   - 400 Bad Request: неверный формат ID
	//   - 500 Internal Server Error: внутренняя ошибка сервера
	//
	// Формат ответа (200 OK):
	//
	//	{
	//	    "post": {
	//	        "ID": 1,
	//	        "title": "title",
	//	        "content": "THis is test content",
	//	        "image_url": "",
	//	        "created_at": "2025-11-30T15:22:31.654766Z",
	//	        "author_id": 1
	//	    },
	//		"author_name": "string",
	//	    "like_count": 0,
	//	    "comments": [
	//	        {
	//	            "comment": {
	//	                "ID": 1,
	//	                "content": "THis is test comment",
	//	                "created_at": "2025-11-30T15:23:31Z",
	//	                "author_id": 1,
	//	                "post_id": 1
	//	            },
	//	            "author_name": "user"
	//	        }
	//	        }
	//	    ]
	//	}
	func (h *Handler) GetPostHandler(w http.ResponseWriter, r *http.Request) {
		postID, err := strconv.Atoi(chi.URLParam(r, "id"))
		if err != nil {
			http.Error(w, "Invalid ID format", http.StatusBadRequest)
			return
		}

		post, err := h.postService.GetPost(r.Context(), postID)
		switch err {
		case nil:
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)

			if err := json.NewEncoder(w).Encode(post); err != nil {
				http.Error(w, "error encoding response", http.StatusInternalServerError)
				return
			}
		case model.ErrNoPosts:
			http.Error(w, "No post on this ID", http.StatusNotFound)
			return
		default:
			http.Error(w, "Internal server Error", http.StatusInternalServerError)
			return
		}
	}

// LikePostHandler обрабатывает запрос на добавление лайка к посту.
//
// Метод: POST
// Путь: /api/posts/{id}/like
// Требует аутентификации: да
//
// Параметры пути:
//   - id: int - идентификатор поста
//
// Ответы:
//   - 200 OK: лайк успешно добавлен (тело ответа пустое)
//   - 400 Bad Request: неверный формат ID
//   - 401 Unauthorized: пользователь не аутентифицирован
//   - 500 Internal Server Error: внутренняя ошибка сервера
//
// Примечание: пользователь может лайкнуть пост только один раз.
// Повторные запросы от того же пользователя к тому же посту игнорируются.
func (h *Handler) LikePostHandler(w http.ResponseWriter, r *http.Request) {
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

	err = h.postService.LikePost(r.Context(), userID, postID)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// UnlikePostHandler обрабатывает запрос на удаление лайка с поста.
//
// Метод: DELETE
// Путь: /api/posts/{id}/like
// Требует аутентификации: да
//
// Параметры пути:
//   - id: int - идентификатор поста
//
// Ответы:
//   - 200 OK: лайк успешно удален (тело ответа пустое)
//   - 400 Bad Request: неверный формат ID
//   - 401 Unauthorized: пользователь не аутентифицирован
//   - 500 Internal Server Error: внутренняя ошибка сервера
//
// Примечание: если лайк от данного пользователя не найден,
// запрос все равно возвращает 200 OK.
func (h *Handler) UnlikePostHandler(w http.ResponseWriter, r *http.Request) {
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

	err = h.postService.UnlikePost(r.Context(), userID, postID)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
