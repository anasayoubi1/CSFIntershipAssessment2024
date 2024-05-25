package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

type DogReview struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Comment string `json:"comment"`
	Rating  int    `json:"rating"`
	Image   string `json:"image"`
}

// post_review
func postReview(w http.ResponseWriter, r *http.Request) {
	var review DogReview

	err := json.NewDecoder(r.Body).Decode(&review)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request"})
		return
	}

	err = db.Create(&review).Error
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Internal server error"})
		return
	}

	json.NewEncoder(w).Encode(review)

}

// get_reviews
func getReviews(w http.ResponseWriter, r *http.Request) {
	var reviews []DogReview
	err := db.Find(&reviews).Error
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Internal server error"})
		return
	}

	json.NewEncoder(w).Encode(reviews)

}

// get_review
func getReview(w http.ResponseWriter, r *http.Request) {
	var review DogReview
	id := r.URL.Query().Get("id")
	err := db.First(&review, id).Error
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Internal server error"})
		return
	}

	json.NewEncoder(w).Encode(review)

}

func main() {
	var err error
	db, err = gorm.Open(sqlite.Open("data.db"), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	db.AutoMigrate(&DogReview{})

	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	// serve static files
	r.Get("/*", http.FileServer(http.Dir("./static/dist")).ServeHTTP)

	// post review
	r.Post("/api/reviews", postReview)
	// get reviews
	r.Get("/api/reviews", getReviews)
	// get review
	r.Get("/api/review/{id}", getReview)

	fmt.Println("Server is running on http://localhost:3000")
	http.ListenAndServe(":3000", r)
}
