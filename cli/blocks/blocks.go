package blocks

import (
	"encoding/json"
	"fmt"
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
	return IBlock{}, nil
}
