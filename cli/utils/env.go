package utils

import (
	"errors"
	"os"
)

func GetRoot() (string, error) {
	root, psrootExists := os.LookupEnv("PERSONAL_SITE_ROOT")

	// Check if the environment variable is set
	if !psrootExists {
		return "", errors.New("PERSONAL_SITE_ROOT is not set, it must be set to the root of the personal site repository.")
	}

	return root, nil
}

func FileExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}
