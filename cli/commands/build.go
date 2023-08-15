package commands

import (
	"os"
	"os/exec"

	"github.com/urfave/cli/v2"
)

func BuildCommand() *cli.Command {
	cmd := cli.Command{
		Name:  "build",
		Usage: "Handle site builds.",
		Subcommands: []*cli.Command{
			buildAstro(),
		},
	}

	return &cmd
}

func buildAstro() *cli.Command {
	cmd := cli.Command{
		Name:  "site",
		Usage: "build the site",
		Action: func(cCtx *cli.Context) error {
			cmd := exec.Command("npm", "run", "build:astro")

			cmd.Stdout = os.Stdout

			err := cmd.Run()

			return err
		},
	}

	return &cmd
}
