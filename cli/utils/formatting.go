package utils

import (
	"os/exec"
)

func ByteToLower(b byte) byte {
	if 'A' <= b && b <= 'Z' {
		return b + ('a' - 'A')
	}
	return b
}

func RemoveRune(s string, c rune) string {
	var newString string
	for _, l := range s {
		if l != c {
			newString += string(l)
		}
	}
	return newString
}

func FormatAll() {
	cmd := exec.Command("npm", "run", "format")

	err := cmd.Run()
	if err != nil {
		panic(err)
	}
}
