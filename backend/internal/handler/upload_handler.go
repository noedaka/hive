package handler

import (
	"encoding/json"
	"fmt"
	"hive-backend/internal/model"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

// UploadImageHandler обрабатывает загрузку изображения
//
// Метод: POST
// Путь: /api/upload
// Требует аутентификации: да
//
// Принимает multipart/form-data с полем "image"
// Сохраняет файл в папку "uploads" и возвращает URL
//
// Ответы:
//   - 200 OK: файл загружен, возвращает JSON с URL
//   - 400 Bad Request: неверный формат запроса
//   - 401 Unauthorized: пользователь не аутентифицирован
//   - 500 Internal Server Error: внутренняя ошибка сервера
func (h *Handler) UploadImageHandler(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(model.UserIDKey).(int)
	if !ok {
		http.Error(w, "Authentication error", http.StatusUnauthorized)
		return
	}

	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "File too large or invalid form", http.StatusBadRequest)
		return
	}

	file, handler, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Error retrieving the file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	buff := make([]byte, 512)
	_, err = file.Read(buff)
	if err != nil {
		http.Error(w, "Error reading file", http.StatusInternalServerError)
		return
	}
	file.Seek(0, 0)

	filetype := http.DetectContentType(buff)
	if filetype != "image/jpeg" && filetype != "image/jpg" &&
		filetype != "image/png" && filetype != "image/gif" &&
		filetype != "image/webp" {
		http.Error(w, "Invalid image format. Only JPEG, PNG, GIF and WebP are allowed", http.StatusBadRequest)
		return
	}

	ext := filepath.Ext(handler.Filename)
	uniqueFilename := fmt.Sprintf("%d_%d%s", userID, time.Now().UnixNano(), ext)

	uploadDir := "./uploads"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, 0755)
	}

	filePath := filepath.Join(uploadDir, uniqueFilename)
	dst, err := os.Create(filePath)
	if err != nil {
		http.Error(w, "Failed to create file on server", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	_, err = io.Copy(dst, file)
	if err != nil {
		http.Error(w, "Failed to save file", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"url": "/uploads/" + uniqueFilename,
	})
}
