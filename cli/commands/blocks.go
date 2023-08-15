package commands

import (
	"bufio"
	"fmt"
	"os"
	bl "personal-site-cli/blocks"
	u "personal-site-cli/utils"
	"strings"

	"github.com/urfave/cli/v2"
)

func BlockCommand() *cli.Command {
	cmd := cli.Command{
		Name:  "blocks",
		Usage: "Manage blocks on the site.",
		Subcommands: []*cli.Command{
			addBlock(),
		},
	}

	return &cmd
}

func getBlockType() (bl.IBlockContentType, error) {
	reader := bufio.NewReader(os.Stdin)

	fmt.Print("\nWhat is the content type of the new block? ([r]aw/[s]elf/[u]rl|default=self): ")
	contentType, err := reader.ReadByte()
	if err != nil {
		fmt.Printf("Error reading block content type: %s\n", err)
		os.Exit(1)
	}

	var validContentType bl.IBlockContentType
	switch u.ByteToLower(contentType) {
	case 'r':
		validContentType = bl.Raw
	case 's', '\n': // Allow an empty string for the default value
		validContentType = bl.SelfUrl
	case 'u':
		validContentType = bl.Url
	default:
		fmt.Println("Invalid content type. Please enter raw, self, or url.")
		return getBlockType()
	}

	return validContentType, nil
}

func addBlock() *cli.Command {
	reader := bufio.NewReader(os.Stdin)

	cmd := cli.Command{
		Name:  "add",
		Usage: "add a new block",
		Action: func(cCtx *cli.Context) error {
			fmt.Print("What is the name of the new block? (lowercase): ")
			blockName, err := reader.ReadString('\n')
			if err != nil {
				fmt.Printf("Error reading block name: %s\n", err)
				return err
			}
			fmt.Printf("Block name: %s\n", strings.TrimSuffix(blockName, "\n"))

			fmt.Print("\nWhat is the description of the new block?: ")
			description, err := reader.ReadString('\n')
			if err != nil {
				fmt.Printf("Error reading block description: %s\n", err)
				return err
			}
			fmt.Printf("Block description: %s\n", strings.TrimSuffix(description, "\n"))

			validContentType, err := getBlockType()
			if err != nil {
				fmt.Printf("Error reading block content type: %s\n", err)
				return err
			}
			fmt.Printf("\nBlock content type: %s\n", validContentType)

			var data string = ""
			if validContentType != bl.SelfUrl {
				fmt.Print("What is the content of the new block: ")
				nd, err := reader.ReadString('\n')
				if err != nil {
					fmt.Printf("Error reading block content: %s\n", err)
					return err
				}
				data = nd
			}
			if validContentType == bl.SelfUrl {
				data = "[SELF_BLOCK_FILE]"
			}
			fmt.Printf("\nBlock content: %s\n", strings.TrimSuffix(data, "\n"))

			fmt.Print("\nWhat intents should this block be included in? (comma separated): ")
			intents, err := reader.ReadString('\n')
			if err != nil {
				fmt.Printf("Error reading block intents: %s\n", err)
				return err
			}
			fmt.Printf("\nBlock intents: %s\n", strings.TrimSuffix(intents, "\n"))

			var useDataType bl.IBlockContentType
			if validContentType == bl.SelfUrl {
				useDataType = bl.Url
			} else {
				useDataType = validContentType
			}

			block := bl.IBlockConstructor{
				Name:        u.RemoveRune(strings.ToLower(blockName), '\n'),
				Description: u.RemoveRune(description, '\n'),
				Content: bl.IBlockContent{
					Datatype: useDataType,
					Data:     data,
				},
				When_intents: strings.Split(u.RemoveRune(intents, '\n'), ","),
			}
			bl.AddBlock(&block)
			return nil
		},
	}

	return &cmd
}
