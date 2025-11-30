package main

import (
	"hive-backend/internal/app"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
