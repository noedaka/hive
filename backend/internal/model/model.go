package model

type UserCredentials struct {
	ID       int    `json:"id"`
	Login    string `json:"login" validate:"required,min=3,max=50"`
	Password string `json:"password" validate:"required,min=5,max=50"`
}

type PostID struct {
	PostID int `json:"post_id"`
}

type Post struct {
	ID        int    `json:"id"`
	Title     string `json:"title" validate:"required,min=1,max=200"`
	Content   string `json:"content" validate:"required,min=20,max=10000"`
	ImageURL  string `json:"image_url" validate:"omitempty"`
	CreatedAt string `json:"created_at"`
	AuthorID  int    `json:"author_id" validate:"required,gt=0"`
}

type Comment struct {
	ID        int    `json:"id"`
	Content   string `json:"content" validate:"required,min=1,max=1000"`
	CreatedAt string `json:"created_at"`
	AuthorID  int    `json:"author_id" validate:"required,gt=0"`
	PostID    int    `json:"post_id" validate:"required,gt=0"`
}

type CommentWithAuthor struct {
	Comment     `json:"comment"`
	AuthorLogin string `json:"author_name"`
}

type PostWithLikes struct {
	Post      Post `json:"post"`
	LikeCount int  `json:"like_count"`
}

type PostDetailed struct {
	Post      Post                `json:"post"`
	LikeCount int                 `json:"like_count"`
	Comments  []CommentWithAuthor `json:"comments"`
}
