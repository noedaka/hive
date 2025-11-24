package model

import "errors"

var (
	ErrNoUser        = errors.New("no such user")
	ErrNoPosts       = errors.New("no posts")
	ErrNoComments    = errors.New("no comments")
	ErrOccupiedLogin = errors.New("login is taken by another user")
)
