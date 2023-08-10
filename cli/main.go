package main

import (
	"log"
	"os"

	cmds "personal-site-cli/commands"

	"github.com/urfave/cli/v2"
)

func main() {
	app := &cli.App{
		EnableBashCompletion: true,
		Name:                 "Personal Site CLI",
		Usage:                "pscli [global options] command [command options] [arguments...]",
		Commands: []*cli.Command{
			cmds.BlockCommand(),
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}

}
