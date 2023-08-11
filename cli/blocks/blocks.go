package blocks

import (
	"encoding/json"
	"fmt"
	"os"
	u "personal-site-cli/utils"
)

type IBlockContentType string

const (
	Raw     IBlockContentType = "raw"
	SelfUrl IBlockContentType = "self"
	Url     IBlockContentType = "url"
)

type IBlockContent struct {
	Datatype IBlockContentType `json:"type"`
	Data     string            `json:"data"`
}

type IBlockConstructor struct {
	Name         string
	Description  string
	Content      IBlockContent
	When_intents []string
}

type IBlock struct {
	Id           string        `json:"id"`
	Name         string        `json:"name"`
	Description  string        `json:"description"`
	Content      IBlockContent `json:"content"`
	When_intents []string      `json:"when_intents"`
}

func getBlockLocation() (string, error) {
	root, err := u.GetRoot()
	if err != nil {
		return "", err
	}
	return root + "/app/blocks/blocks.json", nil
}

func getBlockFilesLocation() (string, error) {
	root, err := u.GetRoot()
	if err != nil {
		return "", err
	}
	return root + "/app/public/blocks", nil
}

func AddBlock(block *IBlockConstructor) (IBlock, error) {
	id, err := u.GenerateRandomBytes(16)
	if err != nil {
		return IBlock{}, err
	}

	newBlock := IBlock{
		Id:           id,
		Name:         block.Name,
		Description:  block.Description,
		Content:      block.Content,
		When_intents: block.When_intents,
	}
	jsonBlock, err := json.Marshal(newBlock)
	if err != nil {
		return IBlock{}, err
	}
	fmt.Println(
		"Adding block with the following data:",
		string(jsonBlock),
	)
	blocks, err := getBlocks()

	if err != nil {
		return IBlock{}, err
	}

	blocks = append(blocks, newBlock)

	err = writeBlocks(blocks)

	if err != nil {
		return IBlock{}, err
	}

	createBlockFile(newBlock.Name)

	return IBlock{}, nil
}

func getBlocks() ([]IBlock, error) {
	location, err := getBlockLocation()
	if err != nil {
		return []IBlock{}, err
	}
	blocksFile, err := os.Open(location)
	if err != nil {
		return []IBlock{}, err
	}
	defer blocksFile.Close()

	var blocks []IBlock
	decoder := json.NewDecoder(blocksFile)
	err = decoder.Decode(&blocks)
	if err != nil {
		return []IBlock{}, err
	}

	return blocks, nil
}

func writeBlocks(blocks []IBlock) error {
	location, err := getBlockLocation()
	if err != nil {
		return err
	}
	blocksFile, err := os.Create(location)
	if err != nil {
		return err
	}
	defer blocksFile.Close()

	encoder := json.NewEncoder(blocksFile)
	err = encoder.Encode(blocks)
	if err != nil {
		return err
	}

	return nil
}

func createBlockFile(name string) error {
	// check the blocks directory for the
	folder, err := getBlockFilesLocation()
	if err != nil {
		return err
	}

	file := folder + "/" + name + ".html"

	exists := u.FileExists(file)

	if exists {
		return nil
	}

	newFile, err := os.Create(file)
	if err != nil {
		return err
	}
	// add some boilerplate to the file, use the contents of
	// the file: /app/config/block-boilerplate.html
	root, err := u.GetRoot()
	if err != nil {
		return err
	}
	boilerplate, err := os.Open(root + "/app/config/block-boilerplate.html")
	if err != nil {
		return err
	}

	_, err = newFile.ReadFrom(boilerplate)

	fmt.Println("Created file at", file)

	u.FormatAll()

	return nil
}
