package commands

import (
	"os"
	u "personal-site-cli/utils"
	"strings"
	"time"

	"github.com/urfave/cli/v2"
)

type Post struct {
	Title       string
	Author      string
	Date        string
	Description string
	Tags        []string
}

var postDirectory = "src/pages/blog/posts"
var defaultLayout = "../../../layouts/BlogLayout.astro"

func BlogCommand() *cli.Command {
	cmd := cli.Command{
		Name:        "blog",
		Usage:       "Manage the blog on the site.",
		Subcommands: []*cli.Command{},
	}

	return &cmd
}

func PostCommand() *cli.Command {
	cmd := cli.Command{
		Name:  "post",
		Usage: "Manage the blog posts on the site.",
		Subcommands: []*cli.Command{
			addPost(),
		},
	}

	return &cmd
}

func titleToFileName(title string) string {
	return strings.ReplaceAll(strings.ToLower(title), " ", "-")
}

func currentDate() string {
	t := time.Now()
	return t.Format("2006-01-02")
}

func getQuotedStringSlice(slice []string) []string {
	for i, s := range slice {
		slice[i] = "\"" + s + "\""
	}

	return slice
}

func getStarterText(post Post) string {
	return `---
layout: ` + defaultLayout + `
title: ` + "\"" + post.Title + "\"" + `
description: ` + "\"" + post.Description + "\"" + `
author: ` + "\"" + post.Author + "\"" + `
postdate: ` + "\"" + post.Date + "\"" + `
updatedate: ` + "\"" + post.Date + "\"" + `
tags: ` + "[" + strings.Join(getQuotedStringSlice(post.Tags), ", ") + "]" + `
---
` + `
### Coming soon!
`
}

func addPost() *cli.Command {
	var title string
	var author string
	var date string
	var extension string
	var description string
	var tags cli.StringSlice

	cmd := cli.Command{
		Name: "add",
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:        "title",
				Usage:       "The title of the post.",
				Required:    true,
				Aliases:     []string{"t"},
				Destination: &title,
			},
			&cli.StringFlag{
				Name:        "description",
				Usage:       "The description of the post.",
				Required:    true,
				Aliases:     []string{"d"},
				Destination: &description,
			},
			&cli.StringFlag{
				Name:        "author",
				Usage:       "The author of the post.",
				Required:    false,
				Value:       "Aidan Tilgner",
				Destination: &author,
			},
			&cli.StringFlag{
				Name:        "date",
				Usage:       "The date of the post.",
				Required:    false,
				Value:       currentDate(),
				Destination: &date,
			},
			&cli.StringFlag{
				Name:        "extension",
				Usage:       "The extension of the post file.",
				Required:    false,
				Value:       "md",
				Destination: &extension,
			},
			&cli.StringSliceFlag{
				Name:        "tags",
				Usage:       "The tags of the post.",
				Required:    false,
				Aliases:     []string{"g"},
				Destination: &tags,
			},
		},
		Action: func(c *cli.Context) error {
			rootDir, err := u.GetRoot()
			if err != nil {
				return err
			}
			fileName := titleToFileName(title)
			filePath := rootDir + "/" + postDirectory + "/" + fileName + "." + extension

			post := Post{
				Title:       title,
				Description: description,
				Author:      author,
				Date:        date,
				Tags:        tags.Value(),
			}

			file, err := os.Create(filePath)
			if err != nil {
				return err
			}
			defer file.Close()

			_, err = file.WriteString(getStarterText(post))
			if err != nil {
				return err
			}

			return nil
		},
	}

	return &cmd
}
