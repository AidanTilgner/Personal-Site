package main

import (
	"fmt"
	"log"
	"os"

	cmds "personal-site-cli/commands"

	"github.com/urfave/cli/v2"
)

func main() {
	_, psrootExists := os.LookupEnv("PERSONAL_SITE_ROOT")

	// Check if the environment variable is set
	if !psrootExists {
		fmt.Println("PERSONAL_SITE_ROOT is not set, it must be set to the root of the personal site repository.")
		os.Exit(1)
	} else {
		fmt.Printf("PERSONAL_SITE_ROOT is set to %s\n", os.Getenv("PERSONAL_SITE_ROOT"))
	}

	app := &cli.App{
		EnableBashCompletion: true,
		Name:                 "Personal Site CLI",
		Usage:                "pscli [global options] command [command options] [arguments...]",
		Commands: []*cli.Command{
			cmds.BlockCommand(),
			cmds.BuildCommand(),
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}

}
