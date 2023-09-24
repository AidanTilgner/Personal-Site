package stuff

import (
	"encoding/json"
	"os"
	u "personal-site-cli/utils"
)

type IScience struct {
	Papers []IPaper `json:"papers"`
}

type IPaper struct {
	Name string `json:"name"`
	Link string `json:"link"`
}

func getScienceLocation() (string, error) {
	root, err := u.GetRoot()
	if err != nil {
		return "", err
	}
	return root + "/src/pages/stuff/science/science.json", nil
}

func AddPaper(paper *IPaper) (*IPaper, error) {
	location, err := getScienceLocation()
	if err != nil {
		return paper, err
	}

	scienceFile, err := os.Open(location)
	if err != nil {
		return paper, err
	}
	defer scienceFile.Close()

	var science IScience
	decoder := json.NewDecoder(scienceFile)
	err = decoder.Decode(&science)
	if err != nil {
		return paper, err
	}

	science.Papers = append(science.Papers, *paper)

	file, err := os.Create(location)
	if err != nil {
		return paper, err
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	err = encoder.Encode(science)
	if err != nil {
		return paper, err
	}

	return paper, nil
}
