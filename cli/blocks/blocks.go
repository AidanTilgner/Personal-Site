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

	newBlocksJSON, err := json.Marshal(blocks)
	if err != nil {
		return IBlock{}, err
	}

	fmt.Println(
		"New blocks JSON:",
		string(newBlocksJSON),
	)

	err = writeBlocks(blocks)

	if err != nil {
		return IBlock{}, err
	}

	return IBlock{}, nil
}

func getBlocks() ([]IBlock, error) {
	root, err := u.GetRoot()
	if err != nil {
		return []IBlock{}, err
	}
	blocksFile, err := os.Open(root + "/app/blocks/blocks-test.json")
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
	root, err := u.GetRoot()
	if err != nil {
		return err
	}
	blocksFile, err := os.Create(root + "/app/blocks/blocks-test.json") // Use os.Create to create or truncate the file
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
