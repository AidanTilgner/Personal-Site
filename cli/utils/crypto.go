package utils

import (
	"crypto/rand"
	"encoding/hex"
)

func GenerateRandomBytes(length int) (string, error) {
	bytes := make([]byte, length)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}

	hexString := hex.EncodeToString(bytes)
	return hexString[:length], nil
}
