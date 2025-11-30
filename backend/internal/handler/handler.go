package handler

import (
	"hive-backend/internal/service"
)

type Handler struct {
	userService    service.UserService
	postService    service.PostService
	commentService service.CommentService
}

func NewHandler(
	userService service.UserService,
	postService service.PostService,
	commentService service.CommentService,
) *Handler {
	return &Handler{
		userService:    userService,
		postService:    postService,
		commentService: commentService,
	}
}
