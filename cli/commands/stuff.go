package commands

import (
	"github.com/urfave/cli/v2"
	s "personal-site-cli/stuff"
)

func StuffCommand() *cli.Command {
	cmd := cli.Command{
		Name:  "stuff",
		Usage: "Manage stuff on the site.",
		Subcommands: []*cli.Command{
			addPaper(),
		},
	}

	return &cmd
}

func addPaper() *cli.Command {
	var name string
	var link string

	cmd := cli.Command{
		Name:  "paper",
		Usage: "Add a paper to the science page.",
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:        "name",
				Usage:       "The name of the paper.",
				Required:    true,
				Aliases:     []string{"n"},
				Destination: &name,
			},
			&cli.StringFlag{
				Name:        "link",
				Usage:       "The link to the paper.",
				Required:    true,
				Aliases:     []string{"l"},
				Destination: &link,
			},
		},
		Action: func(c *cli.Context) error {
			s.AddPaper(&s.IPaper{
				Name: name,
				Link: link,
			})
			return nil
		},
	}

	return &cmd
}
