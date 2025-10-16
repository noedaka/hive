export interface User {
    userName: string
}

export interface Post {
    id: string
    author: User
    text: string
    postImg: string
    likes: number
}

export interface Comment {
    id: string
    author: User
    text: string
    date: string
}