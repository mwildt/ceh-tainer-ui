package main

import (
	"github.com/mwildt/go-http/routing"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
)

func main() {

	serviceLocation, err := url.Parse(GetEnvOrDefault("API_SERVICE_HOST", "http://localhost:8080"))
	if err != nil {
		log.Fatal(err)
	}

	err = http.ListenAndServe(
		GetEnvOrDefault("LISTEN_ADDRESS", ":3010"),
		routing.NewRouter(func(router routing.Routing) {

			router.Handle(
				routing.Path("/api/**"),
				httputil.NewSingleHostReverseProxy(serviceLocation))

			router.Handle(
				routing.Path("/**").Method("GET"),
				http.FileServer(http.Dir("frontend/build")))

		}))

	if err != nil {
		log.Fatal(err)
	}
}

func GetEnvOrDefault(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
