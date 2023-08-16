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

func RemoveNonAlphaNumeric(s string, except []string) string {
	var newString string
	for _, l := range s {
		if (l >= 'a' && l <= 'z') || (l >= 'A' && l <= 'Z') || (l >= '0' && l <= '9') {
			newString += string(l)
		} else {
			for _, e := range except {
				if string(l) == e {
					newString += string(l)
				}
			}
		}
	}
	return newString
}
