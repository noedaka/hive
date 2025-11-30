package handler

import (
	"encoding/json"
	"hive-backend/internal/model"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func (h *Handler) CreateCommentHandler(w http.ResponseWriter, r *http.Request) {
	postID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}
	userID, ok := r.Context().Value(model.UserIDKey).(int)
	if !ok {
		http.Error(w, "User ID not found in context", http.StatusUnauthorized)
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
